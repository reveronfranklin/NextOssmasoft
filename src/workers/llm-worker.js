/* eslint-disable */
import { CreateMLCEngine } from '@mlc-ai/web-llm';

let engine = null;
let isInitializing = false;
let isGenerating = false;
let lastGenerateAt = 0;

const ALLOWED_PREFIXES = ['ADM', 'TECNICO'];
const DEFAULT_MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

const MAX_INPUT_CHARS = 2000;
const MIN_GENERATE_INTERVAL_MS = 800;
const GENERATE_TIMEOUT_MS = 45000;

const SYSTEM_PROMPT = `Eres un asistente interno del sistema. Reglas:
- Responde SOLO a tareas con prefijo [ADM] o [TECNICO].
- Si el usuario no incluye prefijo o no está permitido, rechaza y pide reformular.
- Responde en español y de forma concisa.
- Si falta información clave, pregunta antes de concluir.
- No inventes datos ni asumas información que no fue proporcionada.`;

const history = [];
const MAX_TURNS = 8;

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

function stripDiacritics(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
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

function pushHistory(role, content) {
  history.push({ role, content: String(content) });
  const maxMessages = MAX_TURNS * 2;
  if (history.length > maxMessages) {
    history.splice(0, history.length - maxMessages);
  }
}

function buildMessages(category, userContent) {
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
  for (const m of history) messages.push(m);
  messages.push({ role: 'user', content: `Categoria=${category}. Solicitud: ${userContent}` });
  
return messages;
}

self.onmessage = async (event) => {
  const { type, payload } = event.data ?? {};
  if (typeof type !== 'string') return;

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
    if (engine) {
      self.postMessage({ type: 'ready', modelId: payload?.modelId || DEFAULT_MODEL_ID });
      
return;
    }
    if (isInitializing) return;

    isInitializing = true;
    try {
      const modelId = payload?.modelId || DEFAULT_MODEL_ID;

      engine = await CreateMLCEngine(modelId, {
        initProgressCallback: (report) => {
          self.postMessage({ type: 'progress', data: report });
        }
      });

      self.postMessage({ type: 'ready', modelId });
    } catch (error) {
      engine = null;
      self.postMessage({ type: 'error', error: error?.message || String(error) });
    } finally {
      isInitializing = false;
    }
    
return;
  }

  if (type === 'generate') {
    if (!engine) {
      self.postMessage({
        type: 'error',
        error: 'El modelo no está listo. Espera a "ready" o envía "init".'
      });
      
return;
    }
    if (isGenerating) {
      self.postMessage({ type: 'error', error: 'Hay una generación en curso. Espera a que termine.' });
      
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

    const parsed = parseCategoryPrefixed(text);
    if (!parsed.ok) {
      const allowedHint = 'Usa un prefijo permitido: [ADM] o [TECNICO].';
      const base = 'Solo puedo ayudar con tareas específicas de ADM o soporte técnico del sistema.';

      let reason = '';
      if (parsed.reason === 'missing_prefix') reason = 'Falta el prefijo de categoría.';
      if (parsed.reason === 'disallowed_prefix') reason = 'El prefijo no está permitido.';
      if (parsed.reason === 'empty_after_prefix') reason = 'Tu mensaje está vacío después del prefijo.';

      const result = `${base} ${reason} ${allowedHint}`.trim();
      self.postMessage({ type: 'result', result });
      
return;
    }

    if (parsed.content.length > MAX_INPUT_CHARS) {
      self.postMessage({
        type: 'error',
        error: `El contenido excede el límite de ${MAX_INPUT_CHARS} caracteres.`
      });
      
return;
    }

    isGenerating = true;
    try {
      const messages = buildMessages(parsed.category, parsed.content);

      const completion = await Promise.race([
        engine.chat.completions.create({
          messages,
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 256
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Generation timeout')), GENERATE_TIMEOUT_MS)
        )
      ]);

      const assistant = completion?.choices?.[0]?.message?.content?.trim() || 'Sin respuesta';

      pushHistory('user', `(${parsed.category}) ${parsed.content}`);
      pushHistory('assistant', assistant);

      self.postMessage({ type: 'result', result: assistant });
    } catch (error) {
      self.postMessage({ type: 'error', error: error?.message || String(error) });
    } finally {
      isGenerating = false;
    }
    
return;
  }
};
