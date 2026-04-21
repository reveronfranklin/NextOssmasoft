import React, { createContext, useEffect, useState } from 'react';

export const LLMWorkerContext = createContext<Worker | null>(null);

export const LLMWorkerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [worker, setWorker] = useState<Worker | null>(null);

  // IMPORTANTE: `new Worker(new URL('...', import.meta.url))` debe usar un literal
  // para que Next/Webpack lo procese y lo sirva desde `/_next/static/...`.
  const createWebGpuWorker = () => new Worker(new URL('../workers/llm-worker.js', import.meta.url), { type: 'module' });
  const createWasmWorker = () =>
    new Worker(new URL('../workers/llm-worker-wasm.js', import.meta.url), { type: 'module' });

  useEffect(() => {
    const isDev = process.env.NODE_ENV !== 'production';
    let isAiEnabled = isDev;
    try {
      if (typeof window !== 'undefined' && !isAiEnabled) {
        const stored = window.localStorage.getItem('userData');
        if (stored) {
          const parsed = JSON.parse(stored);
          isAiEnabled = !!parsed.is_active_ai;
        }
      }
    } catch {
      // isAiEnabled ya tiene el valor por defecto basado en isDev
    }

    if (!isAiEnabled) return;

    // Verificamos que estamos en el navegador para evitar el error "self is not defined"
    if (typeof window !== 'undefined') {
      let currentWorker: Worker | null = null;
      let disposed = false;
      let hasFallenBack = false;
      let initTimer: number | null = null;

      // Listeners del worker actual (para no depender de onmessage, que puede ser pisado por UI)
      let detachListeners: (() => void) | null = null;

      const clearInitTimer = () => {
        if (initTimer != null) {
          window.clearTimeout(initTimer);
          initTimer = null;
        }
      };

      const safeTerminate = (w: Worker | null) => {
        if (!w) {
          return;
        }

        try {
          detachListeners?.();
        } catch {
          // ignore
        }
        detachListeners = null;

        try {
          w.onmessage = null;
          w.onerror = null;
          w.onmessageerror = null;
        } catch {
          // ignore
        }
        try {
          w.terminate();
        } catch {
          // ignore
        }
      };

      const switchTo = (nextWorker: Worker) => {
        if (disposed) {
          safeTerminate(nextWorker);

          return;
        }
        clearInitTimer();
        safeTerminate(currentWorker);
        currentWorker = nextWorker;
        setWorker(nextWorker);
      };

      const attachInitListeners = (
        w: Worker,
        opts: {
          label: string;
          onInitMessage?: (evt: MessageEvent) => void;
          onInitProgress?: () => void;
          onInitError?: () => void;
          onInitMessageError?: () => void;
        }
      ) => {
        const onMessage = (evt: MessageEvent) => {
          const t = (evt as any)?.data?.type;
          // Solo 'ready'/'error' finalizan init. El 'progress' debe extender el timeout,
          // no cancelarlo para siempre (puede colgarse tras un único progreso).
          if (t === 'ready' || t === 'error') clearInitTimer();
          if (t === 'progress') opts.onInitProgress?.();
          opts.onInitMessage?.(evt);
        };

        const onError = () => {
          clearInitTimer();
          opts.onInitError?.();
        };

        const onMessageError = () => {
          clearInitTimer();
          opts.onInitMessageError?.();
        };

        w.addEventListener('message', onMessage);
        w.addEventListener('error', onError);
        w.addEventListener('messageerror', onMessageError);

        detachListeners = () => {
          w.removeEventListener('message', onMessage);
          w.removeEventListener('error', onError);
          w.removeEventListener('messageerror', onMessageError);
        };
      };

      const fallbackToWasm = (reason: string) => {
        if (disposed || hasFallenBack) {
          return;
        }

        hasFallenBack = true;

        console.warn(`WebGPU no disponible. Activando fallback WASM. Motivo: ${reason}`);
        let wasmWorker: Worker;
        try {
          wasmWorker = createWasmWorker();
        } catch (error) {
          clearInitTimer();
          console.error('No se pudo construir el Worker WASM.', error);
          safeTerminate(currentWorker);
          currentWorker = null;
          setWorker(null);

          return;
        }

        switchTo(wasmWorker);

        attachInitListeners(wasmWorker, {
          label: 'WASM',
          onInitMessage: (evt) => {
            if ((evt as any)?.data?.type === 'ready') {
              console.log('IA Worker (WASM) inicializado correctamente');
            }
          },
          onInitError: () => {
            console.error('Worker WASM falló al inicializar.');
          },
          onInitMessageError: () => {
            console.error('Worker WASM recibió un mensaje inválido.');
          }
        });

        initTimer = window.setTimeout(() => {
          console.error('Timeout inicializando el worker WASM.');
        }, 45_000);

        wasmWorker.postMessage({ type: 'init' });
      };

      // Si el navegador no soporta WebGPU, evitamos siquiera intentar el worker WebGPU.
      if (!(('gpu' in navigator) && (navigator as any).gpu)) {
        fallbackToWasm('WebGPU no soportado (navigator.gpu no existe)');

        return () => {
          disposed = true;
          clearInitTimer();
          safeTerminate(currentWorker);
          setWorker(null);
        };
      }

      // 1) Intentar WebLLM (requiere WebGPU)
      let webgpuWorker: Worker;
      try {
        webgpuWorker = createWebGpuWorker();
      } catch (error) {
        // Ej: SecurityError por intentar cargar `file://...` o policy/CORS
        fallbackToWasm('error construyendo worker WebGPU');

        return () => {
          disposed = true;
          clearInitTimer();
          safeTerminate(currentWorker);
          setWorker(null);
        };
      }

      switchTo(webgpuWorker);

      attachInitListeners(webgpuWorker, {
        label: 'WebGPU',
        onInitMessage: (e) => {
          const data = (e as any)?.data;
          if (data?.type === 'ready') {
            console.log('IA Worker inicializado correctamente');
          }

          if (data?.type === 'error') {
            const msg = String(data.error || '');
            const isWebGPUError = /webgpu|compatible gpu|unable to find a compatible gpu/i.test(msg);

            if (isWebGPUError) fallbackToWasm(msg);
          }
        },
        onInitProgress: () => {
          // El worker está vivo, pero si el progreso se queda quieto demasiado tiempo,
          // asumimos problema de compatibilidad/runtime y hacemos fallback.
          clearInitTimer();
          initTimer = window.setTimeout(() => {
            fallbackToWasm('timeout esperando ready (progreso detenido)');
          }, 30_000);
        },
        onInitError: () => {
          fallbackToWasm('worker.onerror');
        },
        onInitMessageError: () => {
          fallbackToWasm('worker.onmessageerror');
        }
      });

      // Si no llega "ready" en un tiempo razonable, asumimos fallo de WebGPU/runtime
      initTimer = window.setTimeout(() => {
        fallbackToWasm('timeout esperando ready');
      }, 25_000);

      // Enviar señal de inicio
      webgpuWorker.postMessage({ type: 'init' });

      return () => {
        disposed = true;
        clearInitTimer();
        safeTerminate(currentWorker);
        setWorker(null);
      };
    }
  }, []);

  return (
    <LLMWorkerContext.Provider value={worker}>
      {children}
    </LLMWorkerContext.Provider>
  );
};