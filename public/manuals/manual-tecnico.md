
# Manual Tecnico

Este documento es un stub para pruebas del RAG local.

## 1. Asistente local (Worker)

- El asistente se ejecuta en un Web Worker para no bloquear la UI.
- Si no hay WebGPU, se usa un backend WASM/CPU.

## 2. Indexado de manuales

- Los manuales se declaran en `/manuals/manifest.json`.
- En el primer arranque (o cuando cambia el manifest), el worker descarga los `.md`, los trocea y guarda embeddings en IndexedDB.

## 3. Troubleshooting

### 3.1 Si ves un error 404

Confirma que el archivo exista dentro de `public/manuals/` y que la URL del manifest empiece por `/manuals/...`.

