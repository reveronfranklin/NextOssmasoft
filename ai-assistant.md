# Master Plan: Implementación de Asistente GenUI Local (WebLLM + Next.js + MUI)

## 🎯 Objetivo
Crear un asistente de IA que corra 100% en el cliente (GPU del navegador) capaz de:
1. Navegar por la aplicación de Next.js.
2. Ayudar en la completitud de formularios y procesos.
3. Consultar manuales y procedimientos internos (RAG Local).
4. Ejecutar acciones de UI mediante Generative UI con Material UI.

---

## 🏗️ Fase 1: Setup del Motor (WebLLM Worker)
El asistente debe correr en un Web Worker para no bloquear el Main Thread de la UI.

- [ ] **Instalar Dependencias:** `npm install @mlc-ai/web-llm @types/webgpu`
- [ ] **Configurar Web Worker:** Crear `public/workers/llm-worker.ts` para manejar el `MLCEngine`.
- [ ] **Gestión de Modelos:** Implementar lógica para descargar y cachear el modelo (Recomendado: `Llama-3-8B-Instruct-q4f16_1` o `Phi-3-mini-4k-instruct`).
- [ ] **Verificación de WebGPU:** Crear un hook `useWebGPUCheck` para validar si el hardware del cliente es compatible.

---

## 🧠 Fase 2: Ingesta de Conocimiento (RAG Local)
Para que el modelo conozca los manuales y videos sin enviarlos al prompt completo.

- [ ] **Procesamiento de Manuales:** Convertir PDFs/Docs a texto plano.
- [ ] **Procesamiento de Videos:** Extraer transcripciones con timestamps (Formato: `[02:30] Proceso de registro...`).
- [ ] **Base de Datos Vectorial Local:** - Instalar `transformers.js` para embeddings.
  - Instalar `voy-search` o `orama` para búsqueda vectorial en IndexedDB.
- [ ] **Pipeline de Ingesta:** Script para pre-indexar estos datos durante el build o en el primer inicio del usuario.

---

## 🧭 Fase 3: System Prompt y Tool Calling
Definir cómo la IA interactúa con la aplicación.

- [ ] **Diseño del System Prompt:**
  - Definir el rol de "Analista de Procesos".
  - Mapear rutas de Next.js (Dashboard, Settings, etc.).
  - Definir esquema JSON para herramientas: `Maps()`, `fillForm()`, `playVideo()`.
- [ ] **Parser de Respuestas:** Crear una utilidad que identifique si la respuesta de la IA es texto plano o un JSON de acción.

---

## 🎨 Fase 4: Integración con MUI y Next.js
Hacer que la IA "controle" la aplicación.

- [ ] **Contexto de Navegación:** Crear un `AssistantProvider` que envuelva la app y tenga acceso al `useRouter` de Next.js.
- [ ] **Componentes GenUI:**
  - Chat flotante usando `MUI Fab` y `Drawer`.
  - Pantalla de "Cargando Modelo" con `LinearProgress`.
  - Renderizado dinámico: Si la IA devuelve una acción de video, mostrar un componente `VideoPlayer` de MUI automáticamente.
- [ ] **Interacción con Formularios:** Usar `refs` de React para permitir que el asistente inserte datos en campos específicos cuando el usuario lo pida.

---

## 🛠️ Fase 5: Robustez y Edge Cases
- [ ] **Fallback:** Si WebGPU falla, conectar con un endpoint de API (OpenAI/Groq) como respaldo.
- [ ] **Persistencia:** Guardar el historial de chat localmente en `localStorage`.
- [ ] **Seguridad:** Sanitizar cualquier acción de navegación o ejecución de scripts devuelta por el modelo.

---

## 📝 Instrucciones para la IA (Antigravity/Cursor)
"IA, ayúdame a completar los items de este plan uno a uno. Empecemos por la Fase 1: Configura el Web Worker y la estructura de archivos necesaria para WebLLM en mi proyecto actual de Next.js."