#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();
const TARGET_ROOT = path.join(PROJECT_ROOT, 'public', 'models');

const DEFAULT_MODELS = ['Xenova/all-MiniLM-L6-v2', 'Xenova/distilgpt2'];

function usage() {
  // eslint-disable-next-line no-console
  console.log(`\nUso:\n  node scripts/download-models.mjs [modelo1 modelo2 ...]\n\nEjemplos:\n  node scripts/download-models.mjs\n  node scripts/download-models.mjs Xenova/Phi-3-mini-4k-instruct\n`);
}

function isTruthy(value) {
  return value === '1' || value === 'true' || value === 'yes';
}

function normalizeModelId(modelId) {
  const trimmed = String(modelId || '').trim();
  if (!trimmed) throw new Error('ModelId vacío');
  if (!trimmed.includes('/')) throw new Error(`ModelId inválido: ${trimmed} (usa "org/repo")`);
  return trimmed;
}

function shouldDownloadFile(filePathname) {
  const p = String(filePathname);

  // Evitar pesos PyTorch / safetensors; transformers.js (web) usa ONNX.
  if (p.endsWith('.bin') || p.endsWith('.safetensors')) return false;

  // Mantener solo lo necesario para tokenización/config y ONNX.
  const keepExact = new Set([
    'config.json',
    'tokenizer.json',
    'tokenizer_config.json',
    'special_tokens_map.json',
    'generation_config.json',
    'preprocessor_config.json',
    'added_tokens.json',
    'vocab.json',
    'vocab.txt',
    'merges.txt'
  ]);

  const base = path.posix.basename(p);
  if (keepExact.has(base)) return true;

  if (p.endsWith('.onnx')) return true;
  if (p.endsWith('.onnx_data')) return true;

  // SentencePiece (algunos tokenizers)
  if (p.endsWith('.model')) return true;

  // Algunos repos traen assets en carpetas.
  if (p.startsWith('onnx/')) return true;

  return false;
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadToFile(url, outFile) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar ${url}`);

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await ensureDir(path.dirname(outFile));
  await fs.writeFile(outFile, buffer);

  return buffer.byteLength;
}

async function listModelFilesFromHf(modelId) {
  const apiUrl = `https://huggingface.co/api/models/${modelId}`;
  const res = await fetch(apiUrl, {
    headers: {
      'user-agent': 'NextOssmasoft-model-downloader'
    }
  });

  if (!res.ok) {
    throw new Error(`No se pudo consultar ${apiUrl}. HTTP ${res.status}`);
  }

  const data = await res.json();
  const siblings = Array.isArray(data?.siblings) ? data.siblings : [];

  return siblings
    .map((s) => s?.rfilename)
    .filter(Boolean)
    .filter(shouldDownloadFile);
}

async function downloadModel(modelId) {
  const files = await listModelFilesFromHf(modelId);
  if (!files.length) throw new Error(`No se encontraron archivos ONNX/config para ${modelId}.`);

  const modelOutDir = path.join(TARGET_ROOT, ...modelId.split('/'));
  await ensureDir(modelOutDir);

  // eslint-disable-next-line no-console
  console.log(`\n==> ${modelId}`);
  // eslint-disable-next-line no-console
  console.log(`Archivos: ${files.length}`);

  let downloaded = 0;
  let skipped = 0;
  let totalBytes = 0;

  for (const rel of files) {
    const outFile = path.join(modelOutDir, ...rel.split('/'));
    const url = `https://huggingface.co/${modelId}/resolve/main/${rel}`;

    if (await fileExists(outFile)) {
      skipped++;
      continue;
    }

    // eslint-disable-next-line no-console
    console.log(`- descargando ${rel}`);
    const bytes = await downloadToFile(url, outFile);
    totalBytes += bytes;
    downloaded++;
  }

  // eslint-disable-next-line no-console
  console.log(`Listo: descargados=${downloaded}, omitidos=${skipped}, bytes=${totalBytes}`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('-h') || args.includes('--help')) {
    usage();
    process.exit(0);
  }

  const models = (args.length ? args : DEFAULT_MODELS).map(normalizeModelId);

  await ensureDir(TARGET_ROOT);

  // eslint-disable-next-line no-console
  console.log(`Destino: ${TARGET_ROOT}`);
  // eslint-disable-next-line no-console
  console.log(`Modelos: ${models.join(', ')}`);

  const continueOnError = isTruthy(process.env.MODELS_CONTINUE_ON_ERROR);

  for (const modelId of models) {
    try {
      await downloadModel(modelId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error con ${modelId}:`, error?.message || error);
      if (!continueOnError) process.exit(1);
    }
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
