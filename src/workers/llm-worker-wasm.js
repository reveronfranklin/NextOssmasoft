/* eslint-disable */
import { pipeline, env } from '@xenova/transformers';

// Cache/Offline: transformers.js puede usar Cache API/IndexedDB interno.
env.allowLocalModels = true;
// Importante: si un archivo no existe en /models, permitir fallback a remoto
// para evitar fallas tipo 404 durante el POC.
try {
  env.allowRemoteModels = true;
} catch {
  // ignore
}
env.useBrowserCache = true;

// Si vas a pre-hospedar modelos en Next.js, colócalos en `public/models/`.
// (esto ayuda a evitar 404 y hace que todo sea same-origin)
// Nota: algunas versiones usan `env.localModelPath`, otras `env.localModelPath`/`env.localModelPath`.
// Usamos asignación defensiva.
try {
  env.localModelPath = '/models/';
} catch {
  // ignore
}

// ------------------------------
// Configuración general
// ------------------------------
const ALLOWED_PREFIXES = ['ADM', 'TECNICO'];

const MAX_INPUT_CHARS = 2000;
const MIN_GENERATE_INTERVAL_MS = 800;
const GENERATE_TIMEOUT_MS = 45_000;

const RAG_TOP_K = 8;
const MIN_RAG_RELEVANCE_SCORE = 3;

const HYBRID_SEMANTIC_WEIGHT = 0.7;
const HYBRID_LEXICAL_WEIGHT = 0.3;

const PREPARE_TIMEOUT_MS = 180_000;

const MANIFEST_URL = '/manuals/manifest.json';
const META_MANIFEST_DOC_ID = '__manifest__';

// Nota: en WASM/CPU, modelos generativos pequeños como distilgpt2 no son instruct
// y pueden alucinar. Para este POC, usamos un modo extractivo: la respuesta sale
// directamente del contexto recuperado (RAG) y se adjuntan fuentes.
const GEN_MODEL_PRIMARY = 'Xenova/distilgpt2';
const GEN_MODEL_FALLBACK = 'Xenova/distilgpt2';
const USE_GENERATIVE_MODEL_IN_WASM = false;
const EMBED_MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

const SYSTEM_PROMPT = `Eres un asistente interno de OSMASoft. Reglas críticas:
- Solo respondes si inicia con [ADM] o [TECNICO].
- USA EXCLUSIVAMENTE el contexto entre <manual>. No completes con info externa ni de otros módulos.
- REGLA DE ORO: Si el fragmento incluye "[Contexto: ...]", úsalo para validar que el procedimiento sea del módulo correcto.
- Si el manual indica "No autorizado" o "Solo Presupuesto", DEBES mencionarlo primero.
- Respuesta breve (máx 6 líneas), en español y pasos numerados.
- Si no está en el contexto: "No está en el manual disponible. ¿Falta el módulo de [Nombre del Módulo]?".`;

// History (acotado) para mantener coherencia sin crecer memoria.
const history = [];
const MAX_TURNS = 6;

const QUERY_SYNONYMS = {
  'orden de pago': ['op', 'orden pago', 'pago proveedor', 'ordenes de pago'],
  proveedor: ['beneficiario', 'acreedor'],
  reporte: ['informe', 'listado'],
  generar: ['emitir', 'crear'],
  modulo: ['menu', 'seccion'],
  permiso: ['rol', 'acceso', 'autorizacion'],
  validar: ['verificar', 'revisar', 'comprobar']
};

// ------------------------------
// Estado runtime
// ------------------------------
let generator = null;
let generatorModelId = null;
let embedder = null;
let fallbackGenerator = null;

let isInitializing = false;
let isGenerating = false;
let isIndexing = false;
let lastGenerateAt = 0;

let isPrepared = false;
let isPreparing = false;

let autoIngestStarted = false;
let autoIngestPending = false;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function withTimeout(promise, ms, label) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} (timeout ${ms}ms)`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function prepareAssistantIfNeeded() {
  if (isPrepared) {
    try {
      await openRagDb();
      const ragStats = await getRagStats();
      self.postMessage({
        type: 'ready',
        backend: 'wasm',
        rag: true,
        prepared: true,
        model: USE_GENERATIVE_MODEL_IN_WASM ? generatorModelId : null,
        ragStats
      });
    } catch {
      self.postMessage({
        type: 'ready',
        backend: 'wasm',
        rag: true,
        prepared: true,
        model: USE_GENERATIVE_MODEL_IN_WASM ? generatorModelId : null
      });
    }

    return;
  }

  if (isPreparing) {
    postProgress('Preparación ya en curso...');
    return;
  }

  isPreparing = true;
  try {
    // 1) DB lista
    await withTimeout(openRagDb(), 30_000, 'Apertura de IndexedDB tardó demasiado');

    // Fast-path: si ya hay índice válido, evitamos una preparación pesada.
    const currentStats = await getRagStats();
    const manifestOk = await isManifestUpToDate();
    if (currentStats.embeddings > 0 && currentStats.chunks > 0 && manifestOk) {
      isPrepared = true;
      self.postMessage({
        type: 'ready',
        backend: 'wasm',
        rag: true,
        prepared: true,
        model: USE_GENERATIVE_MODEL_IN_WASM ? generatorModelId : null,
        ragStats: currentStats
      });

      return;
    }

    // 2) Embeddings (descarga/carga)
    postProgress('Preparación: cargando modelo de embeddings...');
    await withTimeout(
      ensureEmbedder(),
      PREPARE_TIMEOUT_MS,
      'Carga/descarga del modelo de embeddings tardó demasiado'
    );

    // 3) Indexado RAG (manifest)
    postProgress('Preparación: indexando manuales...');
    if (!autoIngestStarted) autoIngestStarted = true;
    await withTimeout(
      autoIngestFromManifestIfNeeded(),
      PREPARE_TIMEOUT_MS,
      'Indexado de manuales tardó demasiado'
    );
    while (isIndexing) {
      await sleep(250);
    }

    const ragStats = await getRagStats();
    if (!ragStats.embeddings) {
      throw new Error('Preparación incompleta: no se generaron embeddings (rag_embeddings=0).');
    }

    isPrepared = true;
    self.postMessage({
      type: 'ready',
      backend: 'wasm',
      rag: true,
      prepared: true,
      model: USE_GENERATIVE_MODEL_IN_WASM ? generatorModelId : null,
      ragStats
    });
  } catch (error) {
    const raw = error?.message || String(error);
    const hint =
      raw.includes('timeout')
        ? ' (Sugerencia: si estás offline o sin acceso a HuggingFace, descarga el modelo localmente en /public/models y recarga.)'
        : '';

    self.postMessage({ type: 'error', error: `${raw}${hint}` });
  } finally {
    isPreparing = false;
  }
}

// ------------------------------
// IndexedDB (RAG store)
// ------------------------------
const RAG_DB_NAME = 'ossmasoft_rag';
const RAG_DB_VERSION = 1;
const STORE_DOCS = 'rag_docs';
const STORE_CHUNKS = 'rag_chunks';
const STORE_EMB = 'rag_embeddings';

let dbPromise = null;

function normalizeText(payload) {
  if (typeof payload === 'string') return payload;
  if (payload?.text) return String(payload.text);
  if (payload?.prompt) return String(payload.prompt);
  try {
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
}

function fnv1a32(input) {
  const str = String(input);
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function toHex32(n) {
  return (n >>> 0).toString(16).padStart(8, '0');
}

function stripDiacritics(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function tokenizeWithSynonyms(text) {
  const normalized = stripDiacritics(String(text || '')).toLowerCase();
  const tokens = new Set(
    normalized
      .split(/[^a-z0-9]+/i)
      .map((t) => t.trim())
      .filter((t) => t.length >= 3)
  );

  for (const [term, synonyms] of Object.entries(QUERY_SYNONYMS)) {
    const termNorm = stripDiacritics(term).toLowerCase();
    if (normalized.includes(termNorm)) {
      for (const s of synonyms) {
        tokens.add(stripDiacritics(String(s)).toLowerCase());
      }
    }
  }

  return Array.from(tokens);
}

function mergeHybridTopK(semanticTop, lexicalTop) {
  const semantic = Array.isArray(semanticTop) ? semanticTop : [];
  const lexical = Array.isArray(lexicalTop) ? lexicalTop : [];

  const semMax = semantic.length ? Math.max(...semantic.map((x) => Number(x.score) || 0)) || 1 : 1;
  const lexMax = lexical.length ? Math.max(...lexical.map((x) => Number(x.score) || 0)) || 1 : 1;

  const merged = new Map();
  for (const item of semantic) {
    const id = item?.chunkId;
    if (!id) continue;
    const v = merged.get(id) || { chunkId: id, semantic: 0, lexical: 0 };
    v.semantic = Math.max(v.semantic, (Number(item.score) || 0) / semMax);
    merged.set(id, v);
  }
  for (const item of lexical) {
    const id = item?.chunkId;
    if (!id) continue;
    const v = merged.get(id) || { chunkId: id, semantic: 0, lexical: 0 };
    v.lexical = Math.max(v.lexical, (Number(item.score) || 0) / lexMax);
    merged.set(id, v);
  }

  return Array.from(merged.values())
    .map((v) => ({
      chunkId: v.chunkId,
      score: HYBRID_SEMANTIC_WEIGHT * v.semantic + HYBRID_LEXICAL_WEIGHT * v.lexical
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, RAG_TOP_K);
}

function parseCategoryPrefixed(text) {
  const match = /^\s*\[([^\]]+)\]\s*([\s\S]*)$/.exec(text);
  if (!match) return { ok: false, reason: 'missing_prefix' };

  const rawCategory = stripDiacritics(match[1]).trim().toUpperCase();
  const rest = (match[2] ?? '').trim();

  if (!ALLOWED_PREFIXES.includes(rawCategory)) return { ok: false, reason: 'disallowed_prefix' };
  if (!rest) return { ok: false, reason: 'empty_after_prefix' };

  return { ok: true, category: rawCategory, content: rest };
}

function pushHistory(role, text) {
  history.push({ role, text: String(text) });
  const maxMessages = MAX_TURNS * 2;
  if (history.length > maxMessages) {
    history.splice(0, history.length - maxMessages);
  }
}

function buildPrompt(category, userContent) {
  const turns = history
    .map((t) => (t.role === 'user' ? `Usuario: ${t.text}` : `Asistente: ${t.text}`))
    .join('\n');

  return `${SYSTEM_PROMPT}\n\n${turns ? `${turns}\n` : ''}Usuario: (Categoria=${category}) ${userContent}\nAsistente:`;
}

function extractAssistantText(generatedText, prompt) {
  const raw = String(generatedText ?? '');
  if (raw.startsWith(prompt)) return raw.slice(prompt.length).trim();

  return raw.trim();
}

function isBlank(value) {
  return !String(value ?? '').trim();
}

async function ensureFallbackGenerator() {
  if (fallbackGenerator) return fallbackGenerator;

  postProgress(`Cargando modelo de generación fallback (${GEN_MODEL_FALLBACK})...`);
  fallbackGenerator = await pipeline('text-generation', GEN_MODEL_FALLBACK, {
    progress_callback: (progress) => self.postMessage({ type: 'progress', data: progress })
  });
  return fallbackGenerator;
}

function buildDeterministicAnswerFromContext(items, userQuestion) {
  const q = stripDiacritics(String(userQuestion || '')).toLowerCase();

  const tokens = tokenizeWithSynonyms(userQuestion).filter((t) => t.length >= 3);

  const wantsReport = /\breport(e|es|o|os)\b/i.test(stripDiacritics(String(userQuestion || '')));

  const best = (items || [])
    .map(({ chunk, doc }) => {
      const text = String(chunk?.text || '');
      const hay = stripDiacritics(text).toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (hay.includes(stripDiacritics(t).toLowerCase())) score += 1;
      }

      const heading = String(chunk?.heading || '');
      const headingNorm = stripDiacritics(heading).toLowerCase();
      const titleNorm = stripDiacritics(String(doc?.title || '')).toLowerCase();

      // Boost por heading relevante
      if (wantsReport && /\breport(e|es)\b/.test(headingNorm)) score += 6;
      if (/\borden\s+de\s+pago\b/.test(q) && /\borden\s+de\s+pago\b/.test(hay)) score += 8;
      if (/\borden\s+de\s+pago\b/.test(q) && /\borden\s+de\s+pago\b/.test(headingNorm)) score += 8;
      if (/\borden\s+de\s+pago\b/.test(q) && /\borden\s+de\s+pago\b/.test(titleNorm)) score += 4;

      // Preferir chunks con pasos (más accionables)
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      const numberedSteps = lines.filter((l) => /^\d+\./.test(l));
      const bulletSteps = lines.filter((l) => /^-\s+/.test(l));
      score += Math.min(6, numberedSteps.length * 2);
      score += Math.min(2, bulletSteps.length);

      // Penalizar secciones típicas de ejemplos/preguntas (tienden a contener la pregunta literal)
      if (/ejemplos?/.test(headingNorm)) score -= 6;
      if (hay.includes('ejemplos de preguntas')) score -= 6;
      if (/(\[adm\]|\[tecnico\])/.test(hay)) score -= 5;
      if (lines.filter((l) => l.includes('?')).length >= 2) score -= 2;
      if (/\b(poc|clave-poc|codigo-poc|nota-poc)\b/i.test(text)) score -= 20;
      if (/\b(poc|clave-poc|codigo-poc|nota-poc)\b/i.test(heading)) score -= 20;

      if (!tokens.length) score -= 3;

      // preferir chunks más cortos (más directos)
      score += Math.max(0, 2 - Math.floor(text.length / 800));
      return { chunk, doc, score, text };
    })
    .sort((a, b) => b.score - a.score);

  const pick = best[0];
  if (!pick || isBlank(pick.text) || pick.score < MIN_RAG_RELEVANCE_SCORE) {
    return 'Claro, te ayudo con eso. No esta en el manual disponible. Indica modulo y proceso exacto para ayudarte mejor.';
  }

  // Extraer líneas relevantes (pasos) evitando ejemplos con prefijo
  const lines = pick.text.split('\n').map((l) => l.trim()).filter(Boolean);
  const isQuestionExample = (l) => /^-\s*\[(ADM|TECNICO)\]/i.test(l);
  
  const cleanLines = lines
    .filter((l) => !isQuestionExample(l))
    .map((l) => l.replace(/^\[Contexto:.*?\]\s*/i, '')); // Ocultamos el tag interno

  // Ya no filtramos "solo" los pasos numerados, para no perder notas/advertencias
  const excerpt = cleanLines.slice(0, 8).join('\n');

  // Frases de asistencia profesional para mejorar la empatía y legibilidad del bot
  const professionalPrefixes = [
    'Con gusto. Aquí tienes los pasos sugeridos según el manual:',
    'De acuerdo. Con base en la documentación del sistema, este es el procedimiento:',
    '¡Entendido! Te detallo los pasos para completar esta acción:',
    'Estos son los lineamientos oficiales para resolver tu solicitud:',
    'Para realizar este proceso en OSMASoft, debes seguir estos pasos:'
  ];
  const friendlyPrefix = professionalPrefixes[Math.floor(Math.random() * professionalPrefixes.length)];

  // Respuesta limpia y accionable (sin citar fuentes en el texto)
  if (/\bgener\w+\b/i.test(stripDiacritics(String(userQuestion || '')))) {
    return `${friendlyPrefix}\n${excerpt}`.trim();
  }

  const hasSteps = cleanLines.some(l => /^\d+\./.test(l) || /^-\s+/.test(l));
  if (hasSteps) {
    return `${friendlyPrefix}\n${excerpt}`.trim();
  }

  return `${friendlyPrefix}\n${excerpt}`.trim();
}

function looksLikeDatabaseQuestion(text) {
  const value = stripDiacritics(String(text)).toUpperCase();

  return /\b(BD|BBDD|BASE DE DATOS|DATABASE|SQL|MYSQL|POSTGRES|POSTGRESQL|SQLSERVER|MSSQL|ORACLE)\b/.test(value);
}

function databaseHelpResponse() {
  return [
    'No tengo acceso directo a tu base de datos desde el navegador.',
    'Dime estos datos y te indico exactamente qué consultar:',
    '- Motor (SQL Server/MySQL/PostgreSQL/Oracle).',
    '- Nombre de la BD y el esquema (si aplica).',
    '- Tabla(s) o entidad(es) que quieres revisar.',
    '- Qué necesitas: conteo, últimos registros, totales, duplicados, etc.',
    '- Un ejemplo de registro/columna clave (si lo tienes).'
  ].join('\n');
}

function postProgress(text, extra) {
  self.postMessage({ type: 'progress', data: { text, ...(extra || {}) } });
}

function openRagDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(RAG_DB_NAME, RAG_DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(STORE_DOCS)) {
        db.createObjectStore(STORE_DOCS, { keyPath: 'docId' });
      }
      if (!db.objectStoreNames.contains(STORE_CHUNKS)) {
        db.createObjectStore(STORE_CHUNKS, { keyPath: 'chunkId' });
      }
      if (!db.objectStoreNames.contains(STORE_EMB)) {
        db.createObjectStore(STORE_EMB, { keyPath: 'chunkId' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
  });

  return dbPromise;
}

function idbRequestToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB request failed'));
  });
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`No se pudo leer ${url}. HTTP ${res.status}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`No se pudo leer ${url}. HTTP ${res.status}`);
  return res.text();
}

function normalizeNewlines(input) {
  return String(input).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

// function chunkMarkdown(md, maxChunkChars = 1000, overlapChars = 120) {
//   const text = normalizeNewlines(md);
//   const lines = text.split('\n');
//   const chunks = [];

//   let currentHeading = null;
//   let buffer = [];

//   const flush = () => {
//     const raw = buffer.join('\n').trim();
//     buffer = [];
//     if (!raw) return;

//     let start = 0;
//     while (start < raw.length) {
//       const end = Math.min(raw.length, start + maxChunkChars);
//       const slice = raw.slice(start, end);
//       chunks.push({ heading: currentHeading, text: slice.trim() });
//       if (end >= raw.length) break;
//       start = Math.max(0, end - overlapChars);
//     }
//   };

//   for (const line of lines) {
//     const headingMatch = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
//     if (headingMatch) {
//       flush();
//       currentHeading = headingMatch[2];
//       continue;
//     }
//     buffer.push(line);
//   }
//   flush();
//   return chunks.filter((c) => c.text && c.text.trim().length > 0);
// }

function chunkMarkdown(md, maxChunkChars = 1200, overlapChars = 150) {
  const text = normalizeNewlines(md);
  const lines = text.split('\n');
  const chunks = [];

  let currentHeading = "General";
  let currentBuffer = "";

  const createChunk = (forceClear = false) => {
    if (!currentBuffer.trim()) return;
    
    // Inyectamos el heading para indexarlo con contexto rico
    const contextualText = `[Contexto: ${currentHeading}]\n${currentBuffer.trim()}`;
    chunks.push({ heading: currentHeading, text: contextualText });

    if (forceClear) {
      currentBuffer = "";
    } else {
      // Algoritmo de OVERLAP (Solapamiento)
      // Tomamos los últimos N caracteres para unirlos al inicio del siguiente bloque
      const tail = currentBuffer.slice(-overlapChars);
      
      // Buscamos un salto o espacio para no crear un overlap con la palabra "mochada"
      const safeBreak = tail.match(/[\s\n]/);
      let safeOverlap = tail;
      if (safeBreak && safeBreak.index !== undefined) {
         safeOverlap = tail.slice(safeBreak.index).trim();
      }
      
      currentBuffer = "... " + safeOverlap + "\n"; 
    }
  };

  for (const line of lines) {
    const headingMatch = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    const isNumberedStep = /^\d+\.\s/.test(line.trim());

    // 1. Corte por Título/Header (se corta definitivo SIN overlap con la sección vieja)
    if (headingMatch) {
      createChunk(true);
      currentHeading = headingMatch[2];
      currentBuffer = line + "\n";
      continue;
    }

    // 2. Corte Semántico por Paso: 
    // Si vemos que empieza un paso (ej: 4. Guarda la orden) y el bloque ya es grande (>600), 
    // o si excede el tamaño máximo por seguridad, partimos el texto AQUÍ.
    if ((isNumberedStep && currentBuffer.length > 600) || currentBuffer.length > maxChunkChars) {
      createChunk(false); // Falso = conserva solapamiento
    }

    currentBuffer += line + "\n";
  }

  // Descargar la cola
  createChunk(true);
  
  return chunks.filter((c) => c.text && c.text.length > 20);
}

async function idbGet(storeName, key) {
  const db = await openRagDb();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  return idbRequestToPromise(store.get(key));
}

async function idbCount(storeName) {
  const db = await openRagDb();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  return idbRequestToPromise(store.count());
}

async function getRagStats() {
  const [docs, chunks, embeddings] = await Promise.all([
    idbCount(STORE_DOCS),
    idbCount(STORE_CHUNKS),
    idbCount(STORE_EMB)
  ]);
  return { docs, chunks, embeddings };
}

async function isManifestUpToDate() {
  try {
    const manifest = await fetchJson(MANIFEST_URL);
    const manuals = Array.isArray(manifest?.manuals) ? manifest.manuals : [];
    if (!manuals.length) return false;

    const manifestHash = toHex32(fnv1a32(JSON.stringify(manifest)));
    const meta = await idbGet(STORE_DOCS, META_MANIFEST_DOC_ID);
    return meta?.hash === manifestHash;
  } catch {
    return false;
  }
}

async function idbPutMany(records) {
  if (!records || !records.length) return;

  const db = await openRagDb();
  const tx = db.transaction([STORE_DOCS, STORE_CHUNKS, STORE_EMB], 'readwrite');
  const docs = tx.objectStore(STORE_DOCS);
  const chunks = tx.objectStore(STORE_CHUNKS);
  const emb = tx.objectStore(STORE_EMB);

  for (const r of records) {
    if (r.type === 'doc') docs.put(r.value);
    if (r.type === 'chunk') chunks.put(r.value);
    if (r.type === 'emb') emb.put(r.value);
  }

  await new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(null);
    tx.onerror = () => reject(tx.error || new Error('IndexedDB tx failed'));
    tx.onabort = () => reject(tx.error || new Error('IndexedDB tx aborted'));
  });
}

async function deleteRecordsByDocId(storeName, docId) {
  const db = await openRagDb();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  await new Promise((resolve, reject) => {
    const req = store.openCursor();
    req.onerror = () => reject(req.error || new Error('Cursor error al limpiar registros')); 
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) {
        resolve(null);
        return;
      }

      const value = cursor.value;
      if (value?.docId === docId) {
        cursor.delete();
      }
      cursor.continue();
    };
  });

  await new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(null);
    tx.onerror = () => reject(tx.error || new Error('IndexedDB tx failed'));
    tx.onabort = () => reject(tx.error || new Error('IndexedDB tx aborted'));
  });
}

function extractEmbeddingVector(output) {
  // feature-extraction pipeline suele devolver un Tensor
  // con propiedad `.data` (TypedArray) o un array anidado.
  if (!output) return null;

  if (output.data && output.data.buffer) {
    return new Float32Array(output.data);
  }

  // Array anidado -> flatten
  if (Array.isArray(output)) {
    const flat = output.flat(Infinity);
    const arr = new Float32Array(flat.length);
    for (let i = 0; i < flat.length; i++) arr[i] = Number(flat[i]) || 0;
    return arr;
  }

  // output?.tolist() (algunas versiones)
  if (typeof output.tolist === 'function') {
    const flat = output.tolist().flat(Infinity);
    const arr = new Float32Array(flat.length);
    for (let i = 0; i < flat.length; i++) arr[i] = Number(flat[i]) || 0;
    return arr;
  }

  return null;
}

function l2Normalize(vec) {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) sum += vec[i] * vec[i];
  const norm = Math.sqrt(sum) || 1;
  const out = new Float32Array(vec.length);
  for (let i = 0; i < vec.length; i++) out[i] = vec[i] / norm;
  return out;
}

function dot(a, b) {
  const n = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
}

async function ensureEmbedder() {
  if (embedder) return embedder;

  postProgress('Cargando modelo de embeddings...');
  embedder = await pipeline('feature-extraction', EMBED_MODEL_ID, {
    progress_callback: (progress) => self.postMessage({ type: 'progress', data: progress })
  });
  return embedder;
}

async function embedText(text) {
  const emb = await ensureEmbedder();

  // pooling mean + normalize si está soportado.
  let output;
  try {
    output = await emb(text, { pooling: 'mean', normalize: true });
  } catch {
    output = await emb(text);
  }
  const vec = extractEmbeddingVector(output);
  if (!vec) throw new Error('No se pudo obtener el embedding');
  // Por seguridad normalizamos (si ya venía normalizado, no pasa nada).
  return l2Normalize(vec);
}

async function ensureGenerator(preferModelId) {
  if (generator) return generator;

  const modelId = preferModelId || GEN_MODEL_PRIMARY;
  postProgress(`Cargando modelo de generación (${modelId})...`);
  try {
    generator = await pipeline('text-generation', modelId, {
      progress_callback: (progress) => self.postMessage({ type: 'progress', data: progress })
    });
    generatorModelId = modelId;
    return generator;
  } catch (error) {
    // fallback
    if (modelId !== GEN_MODEL_FALLBACK) {
      postProgress(`Fallo cargando ${modelId}. Usando fallback (${GEN_MODEL_FALLBACK})...`);
      generator = await pipeline('text-generation', GEN_MODEL_FALLBACK, {
        progress_callback: (progress) => self.postMessage({ type: 'progress', data: progress })
      });
      generatorModelId = GEN_MODEL_FALLBACK;
      return generator;
    }
    throw error;
  }
}

async function retrieveTopK(queryVec) {
  const db = await openRagDb();
  const tx = db.transaction(STORE_EMB, 'readonly');
  const store = tx.objectStore(STORE_EMB);

  const top = [];
  await new Promise((resolve, reject) => {
    const cursorReq = store.openCursor();
    cursorReq.onerror = () => reject(cursorReq.error || new Error('Cursor error'));
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (!cursor) {
        resolve(null);
        return;
      }

      const value = cursor.value;
      try {
        const buf = value?.vector;
        const dim = value?.dim;
        if (buf && dim && buf.byteLength) {
          const vec = new Float32Array(buf);
          if (vec.length === queryVec.length) {
            const score = dot(queryVec, vec);
            if (top.length < RAG_TOP_K) {
              top.push({ chunkId: value.chunkId, score });
              top.sort((a, b) => b.score - a.score);
            } else if (score > top[top.length - 1].score) {
              top[top.length - 1] = { chunkId: value.chunkId, score };
              top.sort((a, b) => b.score - a.score);
            }
          }
        }
      } catch {
        // ignore corrupt record
      }

      cursor.continue();
    };
  });

  return top;
}

async function retrieveTopKByKeywords(queryText) {
  const db = await openRagDb();
  const tx = db.transaction(STORE_CHUNKS, 'readonly');
  const store = tx.objectStore(STORE_CHUNKS);

  const tokens = tokenizeWithSynonyms(queryText).filter((t) => t.length >= 3);

  const top = [];
  await new Promise((resolve, reject) => {
    const req = store.openCursor();
    req.onerror = () => reject(req.error || new Error('Cursor error'));
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) {
        resolve(null);
        return;
      }

      const value = cursor.value || {};
      const hay = stripDiacritics(String(value.text || '')).toLowerCase();
      const heading = stripDiacritics(String(value.heading || '')).toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (hay.includes(t)) score += 1;
        if (heading.includes(t)) score += 1;
      }

      if (score > 0) {
        if (top.length < RAG_TOP_K) {
          top.push({ chunkId: value.chunkId, score });
          top.sort((a, b) => b.score - a.score);
        } else if (score > top[top.length - 1].score) {
          top[top.length - 1] = { chunkId: value.chunkId, score };
          top.sort((a, b) => b.score - a.score);
        }
      }

      cursor.continue();
    };
  });

  return top;
}

async function getChunksByIds(chunkIds) {
  const db = await openRagDb();
  const tx = db.transaction([STORE_CHUNKS, STORE_DOCS], 'readonly');
  const chunksStore = tx.objectStore(STORE_CHUNKS);
  const docsStore = tx.objectStore(STORE_DOCS);

  const out = [];
  for (const id of chunkIds) {
    const chunk = await idbRequestToPromise(chunksStore.get(id));
    if (!chunk) continue;
    const doc = chunk?.docId ? await idbRequestToPromise(docsStore.get(chunk.docId)) : null;
    out.push({ chunk, doc });
  }
  return out;
}

function formatRagContext(items) {
  if (!items?.length) return '';

  const lines = [];
  lines.push('Contexto del manual (fuentes):');
  for (let i = 0; i < items.length; i++) {
    const { chunk, doc } = items[i];
    const title = doc?.title || doc?.docId || 'Manual';
    const url = doc?.url || '';
    const heading = chunk?.heading ? ` - ${chunk.heading}` : '';
    const source = url ? `${title}${heading} (${url})` : `${title}${heading}`;
    lines.push(`\n[Fuente ${i + 1}] ${source}`);
    lines.push(String(chunk?.text || '').trim());
  }
  return lines.join('\n');
}

async function ingestDocument({ url, title, text, chunks }) {
  // `chunks` opcional: si viene del frontend, evita chunking en worker.
  const docId = toHex32(fnv1a32(url || title || text.slice(0, 64)));
  const docHash = toHex32(fnv1a32(text));

  const existing = await idbGet(STORE_DOCS, docId);
  if (existing?.hash === docHash) {
    return { docId, skipped: true };
  }

  if (existing?.docId) {
    await deleteRecordsByDocId(STORE_CHUNKS, docId);
    await deleteRecordsByDocId(STORE_EMB, docId);
  }

  const now = Date.now();
  const docRecord = {
    docId,
    title: title || url || docId,
    url: url || null,
    hash: docHash,
    updatedAt: now
  };

  const chunkList = Array.isArray(chunks) && chunks.length ? chunks : [{ heading: null, text }];

  // Para minimizar memoria: procesar chunk por chunk.
  const putOps = [{ type: 'doc', value: docRecord }];

  for (let i = 0; i < chunkList.length; i++) {
    const c = chunkList[i];
    const chunkText = String(c?.text || '').trim();
    if (!chunkText) continue;

    const chunkId = `${docId}:${i}`;

    const vec = await embedText(chunkText);
    // guardamos el ArrayBuffer del Float32Array (normalizado)
    putOps.push({
      type: 'chunk',
      value: {
        chunkId,
        docId,
        chunkIndex: i,
        heading: c?.heading || null,
        text: chunkText
      }
    });
    putOps.push({
      type: 'emb',
      value: {
        chunkId,
        docId,
        dim: vec.length,
        vector: vec.buffer
      }
    });

    // Commits por lotes pequeños para no crecer transacción/memoria.
    if (putOps.length >= 12) {
      await idbPutMany(putOps.splice(0, putOps.length));
    }
  }

  if (putOps.length) {
    await idbPutMany(putOps);
  }

  return { docId, skipped: false };
}

async function autoIngestFromManifestIfNeeded() {
  if (isIndexing) {
    autoIngestPending = true;
    return;
  }

  const manifest = await fetchJson(MANIFEST_URL);
  const manuals = Array.isArray(manifest?.manuals) ? manifest.manuals : [];
  if (!manuals.length) return;

  const manifestHash = toHex32(fnv1a32(JSON.stringify(manifest)));
  const existing = await idbGet(STORE_DOCS, META_MANIFEST_DOC_ID);
  if (existing?.hash === manifestHash) {
    const stats = await getRagStats();
    if (stats.embeddings > 0 && stats.chunks > 0) {
      return;
    }
  }

  isIndexing = true;
  try {
    await openRagDb();
    await ensureEmbedder();

    postProgress('Auto-indexado: iniciando...');
    for (let i = 0; i < manuals.length; i++) {
      const m = manuals[i] || {};
      const url = String(m.url || '').trim();
      if (!url) continue;

      postProgress(`Auto-indexado: descargando ${i + 1}/${manuals.length}...`);
      const md = await fetchText(url);
      const chunks = chunkMarkdown(md);

      postProgress(`Auto-indexado: indexando ${i + 1}/${manuals.length}...`);
      await ingestDocument({
        url,
        title: m.title ? String(m.title) : null,
        text: md,
        chunks
      });
    }

    // Guardar meta del manifest para no re-indexar en cada reload.
    await idbPutMany([
      {
        type: 'doc',
        value: {
          docId: META_MANIFEST_DOC_ID,
          title: META_MANIFEST_DOC_ID,
          url: MANIFEST_URL,
          hash: manifestHash,
          updatedAt: Date.now()
        }
      }
    ]);

    self.postMessage({ type: 'result', result: `Auto-indexado completado. Manuales: ${manuals.length}.` });
  } finally {
    isIndexing = false;
    embedder = null;
    if (autoIngestPending) {
      autoIngestPending = false;
      // Reintento si se solicitó mientras había otra ingesta.
      try {
        await autoIngestFromManifestIfNeeded();
      } catch {
        // ignore
      }
    }
  }
}

self.onmessage = async (event) => {
  const { type, payload } = event.data ?? {};

  if (type === 'ping') {
    self.postMessage({
      type: 'pong',
      result: payload?.message ? `Recibido: ${payload.message}` : 'Recibido'
    });
    
return;
  }

  if (type === 'reset') {
    history.length = 0;
    self.postMessage({ type: 'result', result: 'Contexto reiniciado.' });
    
return;
  }

  if (type === 'init') {
    if (isInitializing) return;

    isInitializing = true;
    try {
      await openRagDb();
      // Arranque ligero: el FAB iniciará `prepare` cuando el usuario abra el asistente.
      const ragStats = await getRagStats();
      self.postMessage({ type: 'ready', backend: 'wasm', rag: true, prepared: isPrepared, ragStats });
    } catch (error) {
      self.postMessage({ type: 'error', error: error?.message || String(error) });
    } finally {
      isInitializing = false;
    }
    
return;
  }

  // Ingesta: el frontend puede enviar markdown ya chunked.
  // payload esperado:
  // { docs: [{ url, title, text, chunks?: [{ heading, text }] }] }
  // o bien { url, title, text, chunks }
  if (type === 'ingest') {
    if (isIndexing) {
      self.postMessage({ type: 'error', error: 'Hay una ingesta en curso. Espera a que termine.' });
      return;
    }

    isIndexing = true;
    try {
      await openRagDb();
      await ensureEmbedder();

      const docs = Array.isArray(payload?.docs) ? payload.docs : [payload].filter(Boolean);
      let processed = 0;
      let skipped = 0;

      for (let i = 0; i < docs.length; i++) {
        const d = docs[i] || {};
        const text = String(d.text || d.markdown || '').trim();
        if (!text) continue;

        postProgress(`Indexando manual ${i + 1}/${docs.length}...`);
        const res = await ingestDocument({
          url: d.url || d.path || null,
          title: d.title || null,
          text,
          chunks: d.chunks || null
        });
        processed += 1;
        if (res.skipped) skipped += 1;
      }

      self.postMessage({
        type: 'result',
        result: `Indexación completada. Procesados: ${processed}. Omitidos (sin cambios): ${skipped}.`
      });
    } catch (error) {
      self.postMessage({ type: 'error', error: error?.message || String(error) });
    } finally {
      isIndexing = false;
      // Liberar embedder si quieres priorizar memoria estricta.
      // Se recargará cuando haga falta.
      embedder = null;
    }

    return;
  }

  // Preparación completa (bloqueante): descarga/carga modelos + indexado RAG.
  if (type === 'prepare') {
    await prepareAssistantIfNeeded();
    return;
  }

  if (type === 'stats') {
    try {
      await openRagDb();
      const ragStats = await getRagStats();
      self.postMessage({ type: 'result', result: ragStats, meta: { ragStats } });
    } catch (error) {
      self.postMessage({ type: 'error', error: error?.message || String(error) });
    }
    return;
  }

  if (type === 'generate') {
    if (isGenerating) {
      self.postMessage({ type: 'error', error: 'Hay una generación en curso. Espera a que termine.' });
      
return;
    }

    if (!isPrepared) {
      self.postMessage({
        type: 'error',
        error: 'El asistente aún se está preparando (descargando modelos e indexando manuales).'
      });

      return;
    }

    const now = Date.now();
    if (now - lastGenerateAt < MIN_GENERATE_INTERVAL_MS) {
      self.postMessage({
        type: 'error',
        error: 'Estás enviando solicitudes muy rápido. Espera un momento e intenta de nuevo.'
      });
      
return;
    }
    lastGenerateAt = now;

    const text = normalizeText(payload);
    if (text.length > MAX_INPUT_CHARS) {
      self.postMessage({
        type: 'error',
        error: `El mensaje excede el límite de ${MAX_INPUT_CHARS} caracteres.`
      });
      
      return;
    }

    // Adaptación: Hacemos opcional el prefijo. Si el usuario no lo provee, 
    // parseCategoryPrefixed va a fallar, pero nosotros lo forzaremos 
    // a capturar todo el texto bajo una categoria por defecto.
    let parsed = parseCategoryPrefixed(text);
    if (!parsed.ok) {
        // En vez de rechazar y retornar error, asumimos todo el input como consulta general.
        // ADM por defecto para permitir cruzar manuales en el RAG.
        parsed = {
            ok: true,
            category: 'ADM',
            content: text.trim()
        };
    }

    if (parsed.content.length > MAX_INPUT_CHARS) {
      self.postMessage({
        type: 'error',
        error: `El contenido excede el límite de ${MAX_INPUT_CHARS} caracteres.`
      });
      
return;
    }

    // Este fallback WASM no puede conectarse a la BD; guiamos la solicitud para evitar respuestas basura.
    if (looksLikeDatabaseQuestion(parsed.content)) {
      self.postMessage({ type: 'result', result: databaseHelpResponse() });
      
return;
    }

    isGenerating = true;
    try {
      await openRagDb();

      // 1) Retrieval híbrido (semántico + léxico)
      let semanticTop = [];
      let lexicalTop = [];

      lexicalTop = await retrieveTopKByKeywords(parsed.content);
      try {
        const qVec = await embedText(parsed.content);
        semanticTop = await retrieveTopK(qVec);
      } catch {
        semanticTop = [];
      }

      const top = mergeHybridTopK(semanticTop, lexicalTop);

      const contextItems = await getChunksByIds(top.map((t) => t.chunkId));
      const ragContext = formatRagContext(contextItems);

      // Modo extractivo: responde usando únicamente el contenido recuperado.
      if (!USE_GENERATIVE_MODEL_IN_WASM) {
        const answer = buildDeterministicAnswerFromContext(contextItems, parsed.content);
        pushHistory('user', `(${parsed.category}) ${parsed.content}`);
        pushHistory('assistant', answer);

        self.postMessage({
          type: 'result',
          result: answer,
          meta: {
            backend: 'wasm',
            modelId: null,
            rag: {
              topK: top,
              sources: contextItems.map(({ chunk, doc }) => ({
                docTitle: doc?.title || null,
                docUrl: doc?.url || null,
                heading: chunk?.heading || null,
                chunkId: chunk?.chunkId || null
              }))
            }
          }
        });

        return;
      }

      // 2) Prompt final
      const basePrompt = buildPrompt(parsed.category, parsed.content);
      const prompt = ragContext ? `${basePrompt}\n\n${ragContext}\n\nInstrucción: Responde usando SOLO el contexto de manuales. Si no hay suficiente información, dilo.` : basePrompt;

      // 3) Generación
      const gen = await ensureGenerator(GEN_MODEL_PRIMARY);

      const out = await Promise.race([
        gen(prompt, {
          max_new_tokens: 160,
          temperature: 0.0,
          top_p: 1.0,
          do_sample: false,
          repetition_penalty: 1.05,
          return_full_text: false
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Generation timeout')), GENERATE_TIMEOUT_MS))
      ]);

      const generatedText = Array.isArray(out)
        ? (out?.[0]?.generated_text ?? out?.[0]?.text ?? out?.[0]?.output_text)
        : (out?.generated_text ?? out?.text ?? out?.output_text);
      let assistant = extractAssistantText(generatedText, prompt);

      // Algunos modelos/pipelines devuelven texto vacío (EOS inmediato). Reintentamos con fallback.
      if (isBlank(assistant)) {
        postProgress('La generación devolvió vacío. Reintentando con fallback...');
        const gen2 = await ensureFallbackGenerator();
        const out2 = await Promise.race([
          gen2(prompt, {
            max_new_tokens: 220,
            temperature: 0.0,
            top_p: 1.0,
            do_sample: false,
            repetition_penalty: 1.05,
            return_full_text: false
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Generation timeout')), GENERATE_TIMEOUT_MS))
        ]);

        const generatedText2 = Array.isArray(out2)
          ? (out2?.[0]?.generated_text ?? out2?.[0]?.text ?? out2?.[0]?.output_text)
          : (out2?.generated_text ?? out2?.text ?? out2?.output_text);
        assistant = extractAssistantText(generatedText2, prompt);
      }

      // Fallback final: respuesta determinística usando el contexto RAG recuperado.
      if (isBlank(assistant)) {
        assistant = buildDeterministicAnswerFromContext(contextItems, parsed.content);
      }

      pushHistory('user', `(${parsed.category}) ${parsed.content}`);
      pushHistory('assistant', assistant);

      self.postMessage({
        type: 'result',
        result: assistant,
        meta: {
          backend: 'wasm',
          modelId: generatorModelId,
          rag: {
            topK: top,
            sources: contextItems.map(({ chunk, doc }) => ({
              docTitle: doc?.title || null,
              docUrl: doc?.url || null,
              heading: chunk?.heading || null,
              chunkId: chunk?.chunkId || null
            }))
          }
        }
      });
    } catch (error) {
      self.postMessage({ type: 'error', error: error?.message || String(error) });
    } finally {
      isGenerating = false;
    }
    
return;
  }
};
