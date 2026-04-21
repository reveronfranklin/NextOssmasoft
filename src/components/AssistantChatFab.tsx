import React, { useState, useContext, useRef } from 'react';
import { Fab, Drawer, Box, Typography, IconButton, TextField, Button, CircularProgress, LinearProgress, Avatar, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LLMWorkerContext } from '../context/LLMWorkerProvider';
import { useAuth } from 'src/hooks/useAuth';
import { useRouter } from 'next/router';

type AssistantCategory = 'ADM' | 'TECNICO';

const ROLE_TO_CATEGORY: Record<string, AssistantCategory> = {
  adm: 'ADM',
  pre: 'TECNICO',
  rh: 'TECNICO',
  com: 'TECNICO'
};

const MAX_INPUT_CHARS = 2000;
const INITIAL_ASSISTANT_MESSAGE = '¡Hola! ¿En qué puedo ayudarte?';
const ASSISTANT_DRAWER_WIDTH = 'clamp(280px, 82vw, 350px)';

const SUGGESTED_SEARCHES: Record<AssistantCategory, string[]> = {
  ADM: [
    'Como registrar una orden de pago',
    'Que validaciones revisar antes de guardar una orden de pago',
    'Como generar un reporte por rango de fechas',
    'Por que no veo un modulo en el menu'
  ],
  TECNICO: [
    'Como validar permisos de usuario por modulo',
    'Que revisar si un manual da error 404',
    'Como funciona el indexado de manuales en el asistente',
    'Que hacer si el asistente no encuentra informacion'
  ]
};

const ROUTE_BASED_SUGGESTIONS: Record<string, string[]> = {
  '/adm': [
    'Como registrar una orden de pago',
    'Que validaciones revisar antes de guardar una orden de pago',
    'Como corregir una orden de pago rechazada',
    'Como consultar el estatus de una orden de pago'
  ],
  '/presupuesto': [
    'Como generar un reporte por rango de fechas',
    'Que hacer si no hay disponibilidad presupuestaria',
    'Como validar montos antes de comprometer',
    'Como revisar una pre orden de pago'
  ],
  '/rh': [
    'Como validar permisos de usuario por modulo',
    'Que revisar si un usuario no ve su modulo',
    'Como buscar informacion de procesos de RRHH',
    'Que hacer si una accion aparece bloqueada por rol'
  ],
  '/formulacion': [
    'Como consultar formulas y validaciones del modulo',
    'Que revisar si una formula no calcula correctamente',
    'Como identificar datos requeridos antes de guardar',
    'Como corregir errores de validacion en formulacion'
  ],
  '/bm': [
    'Como revisar conteos e historicos en BM',
    'Que hacer si el conteo no coincide',
    'Como consultar detalle de conteo',
    'Como validar placas en cuarentena'
  ]
};

function getSuggestionsByRoute(pathname: string, fallback: string[]) {
  const normalized = String(pathname || '').toLowerCase();
  const matched = Object.entries(ROUTE_BASED_SUGGESTIONS).find(([routePrefix]) =>
    normalized.startsWith(routePrefix)
  );

  return matched ? matched[1] : fallback;
}

const getRolesFromLocalStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem('userData');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const roles = Array.isArray(parsed?.roles) ? parsed.roles : [];
    return roles
      .map((r: any) => String(r?.role || '').trim().toLowerCase())
      .filter(Boolean);
  } catch {
    return [];
  }
};

const AssistantChatFab: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [localStorageRoles, setLocalStorageRoles] = useState<string[]>([]);

  React.useEffect(() => {
    // Leer localStorage solo en cliente para evitar diferencias SSR/hydration.
    setLocalStorageRoles(getRolesFromLocalStorage());
  }, []);

  const userRoles = React.useMemo(() => {
    const fromContext = Array.isArray(user?.roles)
      ? (user?.roles ?? []).map((r: any) => String(r?.role || '').trim().toLowerCase()).filter(Boolean)
      : [];
    return fromContext.length ? fromContext : localStorageRoles;
  }, [user, localStorageRoles]);

  const allowedCategory = React.useMemo<AssistantCategory | null>(() => {
    if (userRoles.includes('adm')) return 'ADM';
    const otherRole = userRoles.find(r => ROLE_TO_CATEGORY[r]);
    return otherRole ? ROLE_TO_CATEGORY[otherRole] : null;
  }, [userRoles]);

  const suggestedSearches = React.useMemo(() => {
    if (!allowedCategory) return [];

    const fallbackByRole = SUGGESTED_SEARCHES[allowedCategory];
    return getSuggestionsByRoute(router.pathname, fallbackByRole);
  }, [allowedCategory, router.pathname]);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: INITIAL_ASSISTANT_MESSAGE }
  ]);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelProgressText, setModelProgressText] = useState<string>('');
  const [assistantReady, setAssistantReady] = useState(false);
  const worker = useContext(LLMWorkerContext);
  const drawerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prepareWatchdogShownRef = useRef(false);
  const appRootRef = useRef<HTMLElement | null>(null);
  const baseAppRootStylesRef = useRef<{ marginRight: string; transition: string } | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isAiActive = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production') return true;
    if (typeof window === 'undefined') return false;
    try {
      const stored = window.localStorage.getItem('userData');
      if (!stored) return false;
      const parsed = JSON.parse(stored);
      return !!parsed.is_active_ai;
    } catch {
      return false;
    }
  }, []);

  // --- POC: El Chat ahora solo depende del estado 'loading' general,
  // omitiendo modelLoading y assistantReady que pertenecen al LLM local del navegador.
  const chatDisabled = loading; /* || modelLoading || !assistantReady */

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const appRoot = document.getElementById('__next');
    if (!appRoot) {
      return;
    }

    appRootRef.current = appRoot;
    baseAppRootStylesRef.current = {
      marginRight: appRoot.style.marginRight,
      transition: appRoot.style.transition
    };

    if (!appRoot.style.transition.includes('margin-right')) {
      appRoot.style.transition = appRoot.style.transition
        ? `${appRoot.style.transition}, margin-right 220ms ease`
        : 'margin-right 220ms ease';
    }

    return () => {
      const baseStyles = baseAppRootStylesRef.current;
      if (!appRootRef.current || !baseStyles) {
        return;
      }

      appRootRef.current.style.marginRight = baseStyles.marginRight;
      appRootRef.current.style.transition = baseStyles.transition;
    };
  }, []);

  React.useEffect(() => {
    if (!appRootRef.current) {
      return;
    }

    appRootRef.current.style.marginRight = open ? ASSISTANT_DRAWER_WIDTH : '0px';
  }, [open]);

  React.useEffect(() => {
    if (!worker) {
      setAssistantReady(false);
      return;
    }

    if (open) {
      // Al abrir, mantenemos el historial de conversación actual.
      setModelLoading(true);
      setModelProgressText('Preparando asistente...');

      worker.postMessage({ type: 'init' });
      worker.postMessage({ type: 'prepare' });

      prepareWatchdogShownRef.current = false;
      const watchdog = setTimeout(() => {
        prepareWatchdogShownRef.current = true;
        worker.postMessage({ type: 'prepare' });
      }, 25_000);

      return () => clearTimeout(watchdog);
    }
  }, [worker, open]);

  React.useEffect(() => {
    if (!worker) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'result') {
        const raw = event.data.result ?? event.data.data;
        const text =
          typeof raw === 'string'
            ? raw
            : raw == null
              ? ''
              : (() => {
                try {
                  return JSON.stringify(raw);
                } catch {
                  return String(raw);
                }
              })();

        setMessages(prev => [...prev, { role: 'assistant', text: text || 'Sin respuesta' }]);
        setLoading(false);
        setModelLoading(false);
      } else if (event.data.type === 'ready') {
        const backend = event.data.backend;
        const prepared = event.data.prepared;

        if (backend !== 'wasm') {
          setAssistantReady(true);
          setModelLoading(false);
          setModelProgressText('');
          return;
        }

        if (prepared) {
          setAssistantReady(true);
          setModelLoading(false);
          setModelProgressText('');
        } else {
          setAssistantReady(false);
          setModelLoading(true);
          setModelProgressText('Preparando asistente...');
        }
      } else if (event.data.type === 'error') {
        setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${event.data.error || 'desconocido'}` }]);
        setLoading(false);
        setModelLoading(false);
      } else if (event.data.type === 'progress') {
        const text = event.data.data?.text || event.data.data?.message || 'Cargando modelo...';
        setModelLoading(true);
        setModelProgressText(String(text));
      }
    };
    worker.addEventListener('message', handleMessage);

    return () => {
      worker.removeEventListener('message', handleMessage);
    };
  }, [worker]);

  // Auto-scroll al final cuando hay nuevos mensajes
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || !worker) return;

    /* --- POC: Se remueve la atadura al Worker para probar el Core Server ---
    if (!assistantReady) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'El asistente aun se esta preparando. Espera a que termine la descarga/indexado.' }]);
      return;
    }
    */

    if (input.length > MAX_INPUT_CHARS) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: `Tu mensaje supera el limite de ${MAX_INPUT_CHARS} caracteres.` }
      ]);
      return;
    }

    /* Comentamos validación estricta de rol para el modo Debug
    if (!allowedCategory) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Tu usuario no tiene un rol habilitado para usar el asistente.' }
      ]);
      return;
    }
    */

    const activeCategory = allowedCategory || 'DEBUG';
    const question = input.trim();
    const payloadText = `[${activeCategory}] ${question}`;

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setLoading(true);
    setInput(''); // Limpiamos el input para que no lo envíe doble

    // --- NUEVO CÓDIGO POC: Llama al API Core de OSMASoft Backend con Cola de Trabajos (SSE) ---
    const fetchPrueba = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/query/enqueue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: payloadText,
            filters: {
              tenantId: "tenant-123" // Filtro de prueba
            }
          }),
        });

        if (!response.ok) throw new Error("Error al encolar la pregunta");

        const enqueueData = await response.json();
        const jobId = enqueueData.jobId;

        if (!jobId) throw new Error("No se obtuvo un jobId del servidor");

        // Inserta un mensaje "cargando" para el asistente
        setMessages(prev => [...prev, { role: 'assistant', text: '' }]);
        let finalResponseText = '';

        const eventSource = new EventSource(`http://localhost:3000/api/v1/query/job/${jobId}/stream`);

        eventSource.onmessage = (event) => {
          let isJson = false;
          let parsedData: any = null;
          try {
             parsedData = JSON.parse(event.data);
             isJson = typeof parsedData === 'object' && parsedData !== null;
          } catch (e) {}

          if (isJson) {
             if (parsedData.status === 'completed') {
                setLoading(false);
                eventSource.close();
                return;
             }
             if (parsedData.error) {
                finalResponseText += `\n[Error de Servidor: ${parsedData.error}]`;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].text = finalResponseText;
                  return newMsgs;
                });
                setLoading(false);
                eventSource.close();
                return;
             }
          }
          
          // Si no es un json especial de completado, es un token de texto
          const token = (isJson && parsedData.token) ? parsedData.token : (typeof parsedData === 'string' ? parsedData : event.data);
          
          finalResponseText += token;
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1].text = finalResponseText;
            return newMsgs;
          });
        };

        eventSource.onerror = (error) => {
          console.error("Error en SSE", error);
          eventSource.close();
          setLoading(false);
        };
      } catch (error) {
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text += `\n[Fallo de red al conectar al AI Core: ${String(error)}]`;
          return newMsgs;
        });
        setLoading(false);
      }
    };

    fetchPrueba();

    // --- ANTIGUA LÓGICA LOCAL DEL NAVEGADOR (Comentada para tu PoC) ---
    /*
    worker.postMessage({ type: 'generate', payload: { text: payloadText } });
    */
  };

  const handleReset = () => {
    if (!worker) {
      return;
    }

    setLoading(false);
    worker.postMessage({ type: 'reset' });
  };

  const handleClearConversation = () => {
    if (!worker) {
      return;
    }

    setMessages([{ role: 'assistant', text: INITIAL_ASSISTANT_MESSAGE }]);
    setInput('');
    setLoading(false);
    worker.postMessage({ type: 'reset' });
  };

  const handleSuggestedSearch = (suggestion: string) => {
    setInput(suggestion);
  };

  // Por temas de debug: saltar la limitación de roles y ocultar únicamente en la pantalla de login.
  if (router.pathname.includes('/login') || router.pathname === '/') {
    return null;
  }

  const isAdmin = userRoles.includes('admin') || userRoles.includes('adm');

  const handlePanicToggle = () => {
    if (!isAdmin) return;
    if (confirm(`¿Estás seguro de que deseas DESACTIVAR el asistente? Esto modificará la propiedad is_active_ai en userData.`)) {
      try {
        const stored = window.localStorage.getItem('userData');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.is_active_ai = false;
          window.localStorage.setItem('userData', JSON.stringify(parsed));
          window.location.reload();
        }
      } catch (e) {
        console.error("No se pudo desactivar el asistente", e);
      }
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(true)}
        sx={{ position: 'fixed' as const, bottom: 24, right: 24, zIndex: 1000 }}
      >
        <ChatIcon />
      </Fab>
      <Drawer
        anchor="right"
        variant="persistent"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            borderLeft: '1px solid',
            borderColor: isDark ? '#334155' : 'divider',
            backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
            boxShadow: isDark ? '-10px 0 26px rgba(0, 0, 0, 0.5)' : '-10px 0 26px rgba(15, 23, 42, 0.08)'
          }
        }}
      >
        <Box
          ref={drawerRef}
          sx={{
            width: { xs: '82vw', sm: 350 },
            maxWidth: 350,
            minWidth: 280,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: isDark ? '#0F172A' : '#F8FAFC'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              pb: 1,
              borderBottom: '1px solid',
              borderColor: isDark ? '#334155' : 'divider'
            }}
          >
            <Typography variant="h6" sx={{ flexGrow: 1, color: isDark ? '#F8FAFC' : 'text.primary' }}>Ossmito</Typography>
            <IconButton onClick={handleReset} disabled={!worker} size="small" sx={{ mr: 1, color: isDark ? '#94A3B8' : 'text.secondary' }} title="Reiniciar modelo backend">
              <RefreshIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleClearConversation} disabled={!worker} size="small" sx={{ mr: 1, color: isDark ? '#94A3B8' : 'text.secondary' }} title="Limpiar historial de chat">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>

            {/* BOTON DE PANICO (SOLO ADMINS) */}
            {isAdmin && (
              <IconButton
                onClick={handlePanicToggle}
                size="small"
                sx={{ mr: 1, color: isDark ? '#94A3B8' : 'text.secondary', '&:hover': { color: '#ef4444' } }}
                title="DESACTIVAR ASISTENTE (Panic Switch)"
              >
                <ErrorOutlineIcon fontSize="small" />
              </IconButton>
            )}

            <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: isDark ? '#94A3B8' : 'text.secondary' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          {modelLoading && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">{modelProgressText || 'Cargando modelo...'}</Typography>
              <LinearProgress />
            </Box>
          )}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, display: 'flex', flexDirection: 'column', gap: 2.5, px: 1, py: 1.5 }}>
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '92%',
                  }}
                >
                  {!isUser && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'transparent',
                        color: isDark ? '#94A3B8' : 'text.secondary',
                        border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                        flexShrink: 0
                      }}
                    >
                      <SmartToyIcon sx={{ fontSize: 20, color: isDark ? '#94A3B8' : '#334155' }} />
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      backgroundColor: isUser ? (isDark ? '#334155' : '#F1F5F9') : (isDark ? '#1E293B' : '#FFFFFF'),
                      color: isUser ? (isDark ? '#F8FAFC' : '#1E293B') : (isDark ? '#F8FAFC' : '#1E293B'),
                      borderRadius: 3,
                      borderTopRightRadius: isUser ? 4 : 12,
                      borderTopLeftRadius: !isUser ? 4 : 12,
                      p: 1.5,
                      boxShadow: isUser ? 'none' : (isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(15, 23, 42, 0.04)'),
                      border: isUser ? 'none' : `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 400
                      }}
                    >
                      {msg.text}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
            {loading && (
              <Box sx={{ alignSelf: 'flex-start', p: 1 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            <Box ref={messagesEndRef} sx={{ height: 4, flexShrink: 0 }} />
          </Box>
          <Box sx={{ display: 'flex' }}>
            <TextField
              value={input}
              onChange={e => setInput(e.target.value)}
              fullWidth
              size="small"
              placeholder="Escribe tu pregunta..."
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              disabled={chatDisabled}
              inputProps={{ maxLength: MAX_INPUT_CHARS, style: { color: isDark ? '#F8FAFC' : undefined } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#F8FAFC' : undefined,
                  backgroundColor: isDark ? '#1E293B' : undefined,
                  '& fieldset': { borderColor: isDark ? '#334155' : undefined },
                  '&:hover fieldset': { borderColor: isDark ? '#475569' : undefined },
                }
              }}
            />
            <Button onClick={handleSend} disabled={chatDisabled || !input.trim()} variant="contained" sx={{ ml: 1, backgroundColor: isDark ? '#3B82F6' : undefined }}>Enviar</Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AssistantChatFab;
