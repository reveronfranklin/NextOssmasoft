import React, { useState, useContext, useRef } from 'react';
import { Fab, Drawer, Box, Typography, IconButton, TextField, Button, CircularProgress, LinearProgress, Avatar, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { LLMWorkerContext } from '../context/LLMWorkerProvider';
import { useAuth } from 'src/hooks/useAuth';
import { useRouter } from 'next/router';
import { performPageAction, resolveCommandPath, executeAutocompleteAction } from 'src/utilities/actionProcessor';
import { detectFormFields, fillFormFields, processLocalFormVoiceCommand } from 'src/utilities/domHelper';

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

// const SUGGESTED_SEARCHES: Record<AssistantCategory, string[]> = {
//   ADM: [
//     'Como registrar una orden de pago',
//     'Que validaciones revisar antes de guardar una orden de pago',
//     'Como generar un reporte por rango de fechas',
//     'Por que no veo un modulo en el menu'
//   ],
//   TECNICO: [
//     'Como validar permisos de usuario por modulo',
//     'Que revisar si un manual da error 404',
//     'Como funciona el indexado de manuales en el asistente',
//     'Que hacer si el asistente no encuentra informacion'
//   ]
// };

// const ROUTE_BASED_SUGGESTIONS: Record<string, string[]> = {
//   '/adm': [
//     'Como registrar una orden de pago',
//     'Que validaciones revisar antes de guardar una orden de pago',
//     'Como corregir una orden de pago rechazada',
//     'Como consultar el estatus de una orden de pago'
//   ],
//   '/presupuesto': [
//     'Como generar un reporte por rango de fechas',
//     'Que hacer si no hay disponibilidad presupuestaria',
//     'Como validar montos antes de comprometer',
//     'Como revisar una pre orden de pago'
//   ],
//   '/rh': [
//     'Como validar permisos de usuario por modulo',
//     'Que revisar si un usuario no ve su modulo',
//     'Como buscar informacion de procesos de RRHH',
//     'Que hacer si una accion aparece bloqueada por rol'
//   ],
//   '/formulacion': [
//     'Como consultar formulas y validaciones del modulo',
//     'Que revisar si una formula no calcula correctamente',
//     'Como identificar datos requeridos antes de guardar',
//     'Como corregir errores de validacion en formulacion'
//   ],
//   '/bm': [
//     'Como revisar conteos e historicos en BM',
//     'Que hacer si el conteo no coincide',
//     'Como consultar detalle de conteo',
//     'Como validar placas en cuarentena'
//   ]
// };

// function getSuggestionsByRoute(pathname: string, fallback: string[]) {
//   const normalized = String(pathname || '').toLowerCase();
//   const matched = Object.entries(ROUTE_BASED_SUGGESTIONS).find(([routePrefix]) =>
//     normalized.startsWith(routePrefix)
//   );

//   return matched ? matched[1] : fallback;
// }

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

/**
 * Analizador robusto de flujos de texto que pueden contener múltiples JSON continuos/pegados.
 * Detecta y separa estructuras JSON (como los de function calling) usando balanceo de llaves.
 */
function parseStreamData(dataStr) {
  const results = [];
  const trimmed = dataStr.trim();
  if (!trimmed) return results;

  try {
    const parsed = JSON.parse(trimmed);
    
return [parsed];
  } catch (e) {
    let braceCount = 0;
    let startIndex = 0;
    for (let i = 0; i < trimmed.length; i++) {
      if (trimmed[i] === '{') {
        if (braceCount === 0) {
          startIndex = i;
        }
        braceCount++;
      } else if (trimmed[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          const jsonSubstring = trimmed.substring(startIndex, i + 1);
          try {
            results.push(JSON.parse(jsonSubstring));
          } catch (err) {
            console.error('Error al parsear sub-JSON en flujo:', jsonSubstring, err);
          }
        }
      }
    }
  }

  if (results.length === 0) {
    results.push({ text: dataStr });
  }

  return results;
}

const SLASH_COMMANDS = [
  { key: '/solicitud', label: 'Ir a Solicitud de Compromiso', description: 'Navegar a Solicitud de Compromiso', path: '/apps/adm/solicitudCompromiso' },
  { key: '/tesoreria', label: 'Ir a Orden de Pago / Tesorería', description: 'Navegar a Orden de Pago', path: '/apps/adm/ordenPago' },
  { key: '/configuracion', label: 'Ir a Configuración del Sistema', description: 'Navegar a Configuración', path: '/apps/adm/configuracion' },
  { key: '/presupuestos', label: 'Ir a Presupuesto / Disponibilidad', description: 'Navegar a Disponibilidad presupuestaria', path: '/apps/presupuesto/prevsaldo' },
  { key: '/favoritos', label: 'Ver/Ocultar Favoritos', description: 'Alternar panel de favoritos', action: 'toggle_favorites' },
  { key: '/limpiar', label: 'Limpiar chat', description: 'Reiniciar la conversación del asistente', action: 'clear_chat' },
];

const PAGE_LABELS: Record<string, string> = {
  'solicitud_compromiso': 'Solicitud de Compromiso',
  'tesoreria': 'Orden de Pago / Tesorería',
  'configuracion': 'Configuración del Sistema',
  'presupuestos': 'Presupuesto / Disponibilidad',
  '/apps/adm/solicitudCompromiso': 'Solicitud de Compromiso',
  '/apps/adm/ordenPago': 'Orden de Pago / Tesorería',
  '/apps/adm/configuracion': 'Configuración del Sistema',
  '/apps/presupuesto/prevsaldo': 'Presupuesto / Disponibilidad',
  '/apps/presupuesto/maestro/list': 'Maestro de Presupuesto',
  '/apps/rh/historico': 'Nómina / Histórico de Nómina',
  '/apps/Bm/BmConteoHistorico': 'Bienes Nacionales / Conteo Histórico',
  '/apps/Bm/BmPlacasCuarentena': 'Bienes Nacionales / Placas en Cuarentena',
};

function hasExplicitNavigationIntent(text: string): boolean {
  const normalized = String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Quitar acentos
  
  // Expresión regular que busca sinónimos claros de movimiento/navegación
  const navigationKeywords = [
    '\\bir\\b', '\\bvoy\\b', '\\bvamos\\b', '\\bire\\b',
    '\\bviajar\\b', '\\bviaja\\b', '\\bviajare\\b',
    '\\bnavegar\\b', '\\bnavega\\b', '\\bnavegare\\b',
    '\\bmover\\b', '\\bmoverme\\b', '\\bmovernos\\b', '\\bmuevete\\b', '\\bmoveria\\b', '\\bmueveme\\b',
    '\\bcambiar\\b', '\\bcambiarme\\b', '\\bcambiar\\s+de\\b', '\\bcambia\\b',
    '\\bllevame\\b', '\\bllevanos\\b', '\\bllevarme\\b', '\\bllevar\\b',
    '\\bentrar\\b', '\\bentra\\b', '\\bentrare\\b',
    '\\bacceder\\b', '\\bacceda\\b',
    '\\bdirigirme\\b', '\\bdirigeme\\b', '\\bdirijame\\b', '\\bdirigir\\b',
    '\\bpasar\\b', '\\bpasame\\b', '\\bpaseme\\b',
    '\\babrir\\b', '\\babra\\b'
  ];
  
  const regex = new RegExp(navigationKeywords.join('|'), 'i');
  return regex.test(normalized);
}

interface PendingNavigation {
  path: string;
  actionType: 'NAVIGATE' | 'NAVIGATE_AND_FILL' | 'PERFORM_PAGE_ACTION';
  formData?: any;
  targetPageLabel: string;
  extraData?: any;
}

const AssistantChatFab: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [localStorageRoles, setLocalStorageRoles] = useState<string[]>([]);
  const [pendingNavigation, setPendingNavigation] = useState<PendingNavigation | null>(null);

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

  // const suggestedSearches = React.useMemo(() => {
  //   if (!allowedCategory) return [];

  //   const fallbackByRole = SUGGESTED_SEARCHES[allowedCategory];
  //   return getSuggestionsByRoute(router.pathname, fallbackByRole);
  // }, [allowedCategory, router.pathname]);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: INITIAL_ASSISTANT_MESSAGE }
  ]);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelProgressText, setModelProgressText] = useState<string>('');
  const [, setAssistantReady] = useState(false);
  const worker = useContext(LLMWorkerContext);
  const drawerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prepareWatchdogShownRef = useRef(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  const filteredCommands = React.useMemo(() => {
    if (!input.startsWith('/')) return [];
    return SLASH_COMMANDS.filter(cmd =>
      cmd.key.toLowerCase().startsWith(input.toLowerCase())
    );
  }, [input]);

  React.useEffect(() => {
    const handleF1 = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setOpen(true);
        setShowFavorites(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleF1);
    return () => window.removeEventListener('keydown', handleF1);
  }, []);

  const handleSelectCommand = (cmd: typeof SLASH_COMMANDS[0]) => {
    setInput('');
    setShowCommandMenu(false);
    setSelectedCommandIndex(0);

    if (cmd.path) {
      setMessages(prev => [
        ...prev,
        { role: 'user', text: cmd.key },
        { role: 'assistant', text: `Navegando a **${cmd.label}**...` }
      ]);
      speakText(`Navegando a ${cmd.label}`);
      router.push(cmd.path);
    } else if (cmd.action === 'toggle_favorites') {
      setShowFavorites(prev => !prev);
    } else if (cmd.action === 'clear_chat') {
      handleClearConversation();
    }
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ossmito_favorites');
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const saveFavorites = (newFavs: string[]) => {
    setFavorites(newFavs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ossmito_favorites', JSON.stringify(newFavs));
    }
  };

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const autoSendTimeoutRef = useRef<any>(null);
  const isListeningRef = useRef(false); // Para el onend
  const isSpeakingRef = useRef(false); // Para ignorar feedback de eco
  const [isMuted, setIsMuted] = useState(true);
  const ttsBuffer = useRef<string>('');

  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Limpiar caracteres especiales de markdown
    const cleanText = text.replace(/[*#`_\-]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    
    utterance.onstart = () => { isSpeakingRef.current = true; };
    utterance.onend = () => { isSpeakingRef.current = false; };
    utterance.onerror = () => { isSpeakingRef.current = false; };
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    ttsBuffer.current = '';
    isSpeakingRef.current = false;
  };

  const processStreamTts = (newToken: string, isFinal: boolean = false) => {
    if (isMuted) return;
    
    ttsBuffer.current += newToken;
    
    // Buscar límites de oraciones: punto, signo de interrogación, signo de exclamación o salto de línea
    // seguido de un espacio o fin de texto.
    const sentenceBoundaryRegex = /([^.?!]+[.?!]+)\s|([^.?!]+\n)/g;
    let match;
    let lastIndex = 0;
    
    while ((match = sentenceBoundaryRegex.exec(ttsBuffer.current)) !== null) {
      const sentence = match[1] || match[2];
      if (sentence && sentence.trim().length > 0) {
        speakText(sentence.trim());
      }
      lastIndex = sentenceBoundaryRegex.lastIndex;
    }
    
    // Remover las oraciones procesadas del buffer
    if (lastIndex > 0) {
      ttsBuffer.current = ttsBuffer.current.slice(lastIndex);
    }
    
    if (isFinal && ttsBuffer.current.trim().length > 0) {
      speakText(ttsBuffer.current.trim());
      ttsBuffer.current = '';
    }
  };

  const toggleListening = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta el reconocimiento de voz.');
      
      return;
    }

    if (isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current?.stop();
      if (autoSendTimeoutRef.current) {
        clearTimeout(autoSendTimeoutRef.current);
      }
    } else {
      // Detener cualquier reproducción de voz antes de escuchar
      stopSpeaking();

      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
      };

      recognition.onresult = (event: any) => {
        if (isSpeakingRef.current) return; // Ignorar si el asistente está hablando (eco)
        
        let completeTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          completeTranscript += event.results[i][0].transcript;
        }
        
        // Normalizar para que el RAG no interprete "ir" como consulta SQL
        completeTranscript = completeTranscript.replace(/ir al\s+presupuesto/gi, 'seleccionar presupuesto');
        completeTranscript = completeTranscript.replace(/ir a\s+presupuesto/gi, 'seleccionar presupuesto');

        // Intentar procesamiento local de formulario primero
        const isFormCommand = processLocalFormVoiceCommand(completeTranscript);
        if (isFormCommand) {
          if (autoSendTimeoutRef.current) {
            clearTimeout(autoSendTimeoutRef.current);
          }
          
          setMessages(prev => [
            ...prev,
            { role: 'user', text: completeTranscript },
            { role: 'assistant', text: '¡He completado los campos del formulario con los datos indicados!' }
          ]);
          speakText('He completado los campos del formulario con los datos indicados.');
          setInput('');
          
          // No detenemos el micrófono para permitir escucha continua
          return;
        }

        setInput(completeTranscript);

        if (autoSendTimeoutRef.current) {
          clearTimeout(autoSendTimeoutRef.current);
        }
        autoSendTimeoutRef.current = setTimeout(() => {
          if (completeTranscript.trim()) {
            handleSend(completeTranscript);
            // Ya no detenemos el micrófono para mantener la escucha continua
          }
        }, 2000); // Esperar 2 segundos tras una pausa para enviar automáticamente
      };

      recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        if (event.error === 'not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        // Mecanismo de reenganche (continuous listening)
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            console.error('Error reiniciando reconocimiento:', e);
            setIsListening(false);
            isListeningRef.current = false;
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Efecto para detección proactiva de formularios en nueva vista
  React.useEffect(() => {
    const handleRouteChange = () => {
      // Si el chat no está abierto, podríamos no querer ser tan intrusivos, 
      // pero como se pide "cuando entre a una vista", lo haremos si está abierto.
      if (!open) return; 

      setTimeout(() => {
        const fields = detectFormFields();
        if (fields.length > 0) {
          const msg = `He detectado ${fields.length} campos en esta pantalla. ¿Quieres que te ayude a completarlos? Puedes dictarme los datos.`;
          setMessages(prev => [...prev, { role: 'assistant', text: msg }]);
          speakText(msg);
        }
      }, 1500); // 1.5s para asegurar renderizado de la UI
    };

    handleRouteChange();
  }, [router.asPath, open]);

  // const isAiActive = React.useMemo(() => {
  //   if (process.env.NODE_ENV !== 'production') return true;
  //   if (typeof window === 'undefined') return false;
  //   try {
  //     const stored = window.localStorage.getItem('userData');
  //     if (!stored) return false;
  //     const parsed = JSON.parse(stored);
  //     return !!parsed.is_active_ai;
  //   } catch {
  //     return false;
  //   }
  // }, []);

  // --- POC: El Chat ahora solo depende del estado 'loading' general,
  // omitiendo modelLoading y assistantReady que pertenecen al LLM local del navegador.
  const chatDisabled = loading; /* || modelLoading || !assistantReady */

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('textarea')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    currentPos.current = { ...position };
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('textarea')) return;
    setIsDragging(true);
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    currentPos.current = { ...position };
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition({
        x: currentPos.current.x + dx,
        y: currentPos.current.y + dy
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setPosition({
        x: currentPos.current.x + dx,
        y: currentPos.current.y + dy
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  React.useEffect(() => {
    const pendingFill = sessionStorage.getItem('assistant_prefill');
    if (pendingFill) {
      try {
        const data = JSON.parse(pendingFill);
        let retries = 0;
        const maxRetries = 6; // Intentar durante 3 segundos en total (6 * 500ms)

        const tryFilling = () => {
          const res = fillFormFields(data);
          
          // Si logramos llenar todos los campos (o la mayoría), o alcanzamos el límite de reintentos
          if (res.successCount >= res.totalCount || retries >= maxRetries) {
            sessionStorage.removeItem('assistant_prefill');
            console.log(`[Form Filling Finished] Rellenados ${res.successCount} de ${res.totalCount} campos.`);
          } else {
            retries++;
            setTimeout(tryFilling, 500);
          }
        };
        
        // Primera ejecución a los 800ms
        const timer = setTimeout(tryFilling, 800);
        
        return () => clearTimeout(timer);
      } catch (e) {
        console.error('Error parseando prefill pendiente:', e);
      }
    }
  }, [router.asPath]);

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

  // Auto-scroll al final cuando hay nuevos mensajes, se abre el drawer, o se vuelve de favoritos
  React.useEffect(() => {
    if (messagesEndRef.current && open && !showFavorites) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, loading, open, showFavorites]);

  const handleConfirmNavigation = () => {
    if (!pendingNavigation) return;
    
    const { path, actionType, formData, extraData } = pendingNavigation;
    
    setMessages(prev => [
      ...prev,
      { role: 'user', text: 'Sí, navegar' },
      { role: 'assistant', text: `Navegando a **${pendingNavigation.targetPageLabel}**...` }
    ]);
    speakText(`Navegando a ${pendingNavigation.targetPageLabel}`);
    
    if (actionType === 'NAVIGATE_AND_FILL' && formData) {
      sessionStorage.setItem('assistant_prefill', JSON.stringify(formData));
    }
    
    router.push(path);
    
    if (actionType === 'NAVIGATE_AND_FILL' && router.pathname === path && formData) {
      setTimeout(() => {
        fillFormFields(formData);
        sessionStorage.removeItem('assistant_prefill');
      }, 400);
    }
    
    if (actionType === 'PERFORM_PAGE_ACTION' && extraData) {
      if (extraData.type === 'autocomplete') {
        setTimeout(() => {
          executeAutocompleteAction(extraData.label, extraData.value);
        }, 1200);
      }
    }
    
    setPendingNavigation(null);
  };

  const handleCancelNavigation = () => {
    if (!pendingNavigation) return;
    
    setMessages(prev => [
      ...prev,
      { role: 'user', text: 'No, cancelar' },
      { role: 'assistant', text: 'Entendido. Nos quedamos en esta pantalla.' }
    ]);
    speakText('Entendido. Nos quedamos en esta pantalla.');
    setPendingNavigation(null);
  };

  const handleSend = (textToSend?: string) => {
    let textVal = typeof textToSend === 'string' ? textToSend : input;
    if (!textVal.trim() || !worker) return;

    // Detener síntesis activa al enviar nuevo mensaje
    stopSpeaking();

    if (pendingNavigation) {
      const cleanInput = textVal.trim().toLowerCase();
      const normalizedInput = cleanInput.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      if (['si', 'confirmar', 'aceptar', 'ok', 'vale', 'ir', 'navegar', 'dale', 'afirmativo', 'yes'].includes(normalizedInput)) {
        handleConfirmNavigation();
        return;
      } else if (['no', 'cancelar', 'rechazar', 'quedarme', 'quedar', 'negativo'].includes(normalizedInput)) {
        handleCancelNavigation();
        return;
      } else {
        setPendingNavigation(null);
      }
    }

    // Normalizar para que el RAG no interprete "ir" como consulta SQL
    textVal = textVal.replace(/ir al\s+presupuesto/gi, 'seleccionar presupuesto');
    textVal = textVal.replace(/ir a\s+presupuesto/gi, 'seleccionar presupuesto');

    // Intentar procesamiento local de formulario primero
    const isFormCommand = processLocalFormVoiceCommand(textVal);
    if (isFormCommand) {
      setMessages(prev => [
        ...prev,
        { role: 'user', text: textVal },
        { role: 'assistant', text: '¡He completado los campos del formulario con los datos indicados!' }
      ]);
      speakText('He completado los campos del formulario con los datos indicados.');
      setInput('');
      
return;
    }

    /* --- POC: Se remueve la atadura al Worker para probar el Core Server ---
    if (!assistantReady) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'El asistente aun se esta preparando. Espera a que termine la descarga/indexado.' }]);
      return;
    }
    */

    if (textVal.length > MAX_INPUT_CHARS) {
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
    const question = textVal.trim();
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
          const parsedItems = parseStreamData(event.data);

          parsedItems.forEach((item) => {
            if (typeof item === 'object' && item !== null) {
              if (item.status === 'completed') {
                processStreamTts('', true); // Reproducir cualquier texto restante
                setLoading(false);
                eventSource.close();
                
                return;
              }
              if (item.error) {
                finalResponseText += `\n[Error de Servidor: ${item.error}]`;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].text = finalResponseText;
                  
                  return newMsgs;
                });
                processStreamTts(`Error de Servidor: ${item.error}`, true);
                setLoading(false);
                eventSource.close();
                
                return;
              }

              if (item.toolName === 'execute_ui_action') {
                const { actionType: originalActionType, targetPage, formData, command } = item.args || {};
                
                // Guardrail de navegación: no cambiar de pantalla a menos que haya intención explícita de navegación
                let actionType = originalActionType;
                if ((actionType === 'NAVIGATE' || actionType === 'NAVIGATE_AND_FILL') && !hasExplicitNavigationIntent(command || '')) {
                  console.log("[Navigation Guardrail] Ignorando navegación y forzando FILL_FORM porque el comando no solicita cambiar de pantalla:", command);
                  actionType = 'FILL_FORM';
                }
                
                if (actionType === 'NAVIGATE' || actionType === 'NAVIGATE_AND_FILL') {
                  let path = '';
                  if (targetPage === 'solicitud_compromiso') path = '/apps/adm/solicitudCompromiso';
                  else if (targetPage === 'tesoreria') path = '/apps/adm/ordenPago';
                  else if (targetPage === 'configuracion') path = '/apps/adm/configuracion';
                  else if (targetPage === 'presupuestos') path = '/apps/presupuesto/prevsaldo';
                  
                  if (!path && command) {
                    path = resolveCommandPath(command) || '';
                  }

                  if (path) {
                    const label = PAGE_LABELS[targetPage || ''] || PAGE_LABELS[path] || 'otra pantalla';
                    const confirmQuestion = `\n\n¿Deseas ir a la pantalla de **${label}**?`;
                    
                    setPendingNavigation({
                      path,
                      actionType,
                      formData,
                      targetPageLabel: label
                    });
                    
                    finalResponseText += confirmQuestion;
                    setMessages(prev => {
                      const newMsgs = [...prev];
                      newMsgs[newMsgs.length - 1].text = finalResponseText;
                      return newMsgs;
                    });
                    
                    speakText(`¿Deseas ir a la pantalla de ${label}?`);
                  }
                } else if (actionType === 'FILL_FORM' && formData) {
                  fillFormFields(formData);
                  setMessages(prev => {
                    const newMsgs = [...prev];
                    if (newMsgs[newMsgs.length - 1].text === '') {
                      newMsgs[newMsgs.length - 1].text = '¡He completado los campos del formulario con los datos indicados!';
                    } else {
                      newMsgs.push({ role: 'assistant', text: '¡He completado los campos del formulario con los datos indicados!' });
                    }
                    return newMsgs;
                  });
                  speakText('He completado los campos del formulario con los datos indicados.');
                }
                
                return;
              }

              if (item.toolName === 'perform_page_action') {
                const command = item.args?.command;
                if (command) {
                  const res = performPageAction(command, router, { preventNavigation: true });
                  if (res.success && res.type === 'route' && res.path) {
                    const label = PAGE_LABELS[res.path] || 'otra pantalla';
                    const confirmQuestion = `\n\n¿Deseas ir a la pantalla de **${label}**?`;
                    
                    setPendingNavigation({
                      path: res.path,
                      actionType: 'PERFORM_PAGE_ACTION',
                      targetPageLabel: label,
                      extraData: res.extraData
                    });
                    
                    finalResponseText += confirmQuestion;
                    setMessages(prev => {
                      const newMsgs = [...prev];
                      newMsgs[newMsgs.length - 1].text = finalResponseText;
                      return newMsgs;
                    });
                    
                    speakText(`¿Deseas ir a la pantalla de ${label}?`);
                  }
                }
                
                return;
              }

              if (item.toolName === 'fill_form' || item.toolName === 'fillForm') {
                const fields = item.args?.fields;
                if (fields) {
                  fillFormFields(fields);
                  setMessages(prev => {
                    const newMsgs = [...prev];

                    // Si el último mensaje es el del asistente y está vacío, ponerle un texto
                    if (newMsgs[newMsgs.length - 1].text === '') {
                      newMsgs[newMsgs.length - 1].text = '¡He completado los campos del formulario con los datos indicados!';
                    } else {
                      newMsgs.push({ role: 'assistant', text: '¡He completado los campos del formulario con los datos indicados!' });
                    }
                    
                    return newMsgs;
                  });
                  speakText('He completado los campos del formulario con los datos indicados.');
                }
                setLoading(false);
                eventSource.close();
                
                return;
              }

              const token = item.text || item.token;
              if (token) {
                finalResponseText += token;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].text = finalResponseText;
                  
                  return newMsgs;
                });
                processStreamTts(token);
              }
            } else if (typeof item === 'string') {
              finalResponseText += item;
              setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1].text = finalResponseText;
                
                return newMsgs;
              });
              processStreamTts(item);
            }
          });
        };

        eventSource.onerror = (error) => {
          if (eventSource.readyState === EventSource.CLOSED) {
            console.log("Conexión SSE finalizada exitosamente.");
          } else {
            console.error("Error en SSE", error);
          }
          eventSource.close();
          setLoading(false);
          processStreamTts('', true);
        };
      } catch (error) {
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text += `\n[Fallo de red al conectar al AI Core: ${String(error)}]`;
          
          return newMsgs;
        });
        processStreamTts('Fallo de red al conectar al asistente', true);
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

  // const handleSuggestedSearch = (suggestion: string) => {
  //   setInput(suggestion);
  // };

  const handleScanForm = () => {
    const fields = detectFormFields();
    if (fields.length === 0) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'No he detectado ningún formulario activo en la página actual. Asegúrate de estar en una pantalla con campos de entrada de datos.' }
      ]);
      speakText('No he detectado ningún formulario activo en la página actual.');
      
      return;
    }

    const fieldsSummary = fields.map(f => `• **${f.label}** (${f.type})`).join('\n');
    const messageText = `He detectado un formulario con los siguientes campos:\n${fieldsSummary}\n\nEscribe qué datos deseas ingresar en ellos (por ejemplo: *"completa la fecha con hoy y el monto con 500"*) y yo me encargaré de autocompletarlos.`;

    setMessages(prev => [
      ...prev,
      { role: 'assistant', text: messageText }
    ]);
    
    setInput(`Autocompletar formulario detectado con: `);
    speakText('He detectado un formulario en la pantalla actual. ¿De qué datos deseas rellenarlo?');
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
      {!open && (
        <Fab
          color="primary"
          aria-label="chat"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed' as const,
            bottom: 24,
            right: 24,
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              transform: 'scale(1.08)',
            }
          }}
        >
          <ChatIcon />
        </Fab>
      )}

      {open && (
        <Box
          sx={{
            position: 'fixed' as const,
            bottom: 90,
            right: 24,
            width: 360,
            height: 550,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            overflow: 'hidden',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            boxShadow: isDark 
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)' 
              : '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
            zIndex: 9999,
            transform: `translate(${position.x}px, ${position.y}px)`,
            animation: 'fadeInScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            '@keyframes fadeInScale': {
              '0%': { opacity: 0, transform: `translate(${position.x}px, ${position.y + 20}px) scale(0.95)` },
              '100%': { opacity: 1, transform: `translate(${position.x}px, ${position.y}px) scale(1)` }
            }
          }}
        >
          {/* Header Arrastrable */}
          <Box
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1.5,
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              background: isDark ? 'linear-gradient(90deg, #1e293b, #0f172a)' : 'linear-gradient(90deg, #f8fafc, #f1f5f9)',
              borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            }}
          >
            <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 600, color: isDark ? '#F8FAFC' : 'text.primary' }}>
              Ossmito
            </Typography>
            <IconButton 
              onClick={() => setShowFavorites(!showFavorites)} 
              size="small" 
              sx={{ mr: 1, color: showFavorites ? '#eab308' : (isDark ? '#94A3B8' : 'text.secondary') }} 
              title={showFavorites ? "Volver al chat" : "Ver favoritos"}
            >
              {showFavorites ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
            </IconButton>
            <IconButton 
              onClick={() => {
                const newMute = !isMuted;
                setIsMuted(newMute);
                if (newMute) {
                  stopSpeaking();
                } else {
                  const assistantMsgs = messages.filter(m => m.role === 'assistant');
                  if (assistantMsgs.length > 0) {
                    const lastMsg = assistantMsgs[assistantMsgs.length - 1];
                    setTimeout(() => {
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        const cleanText = lastMsg.text.replace(/[*#`_\-]/g, '').trim();
                        if (cleanText) {
                          const utterance = new SpeechSynthesisUtterance(cleanText);
                          utterance.lang = 'es-ES';
                          window.speechSynthesis.speak(utterance);
                        }
                      }
                    }, 50);
                  }
                }
              }} 
              size="small" 
              sx={{ mr: 1, color: isMuted ? '#ef4444' : (isDark ? '#22c55e' : '#16a34a') }} 
              title={isMuted ? "Activar lectura en voz alta" : "Silenciar lectura en voz alta"}
            >
              {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
            </IconButton>
            <IconButton 
              onClick={handleScanForm} 
              size="small" 
              sx={{ mr: 1, color: isDark ? '#38bdf8' : '#0284c7' }} 
              title="Escanear campos de formulario"
            >
              <AssignmentIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleReset} disabled={!worker} size="small" sx={{ mr: 1, color: isDark ? '#94A3B8' : 'text.secondary' }} title="Reiniciar modelo">
              <RefreshIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleClearConversation} disabled={!worker} size="small" sx={{ mr: 1, color: isDark ? '#94A3B8' : 'text.secondary' }} title="Limpiar chat">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>

            {/* BOTÓN DE PÁNICO (ADMINS) */}
            {isAdmin && (
              <IconButton
                onClick={handlePanicToggle}
                size="small"
                sx={{ mr: 1, color: isDark ? '#94A3B8' : 'text.secondary', '&:hover': { color: '#ef4444' } }}
                title="Desactivar Asistente (Panic)"
              >
                <ErrorOutlineIcon fontSize="small" />
              </IconButton>
            )}

            <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: isDark ? '#94A3B8' : 'text.secondary' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {modelLoading && (
            <Box sx={{ p: 1.5, borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {modelProgressText || 'Cargando modelo...'}
              </Typography>
              <LinearProgress />
            </Box>
          )}

          {/* Área de mensajes / favoritos con scrollbar premium */}
          {showFavorites ? (
            <Box 
              sx={{ 
                flexGrow: 1, 
                overflowY: 'auto', 
                mb: 1.5, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2, 
                px: 2, 
                py: 1.5,
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': {
                  background: isDark ? '#334155' : '#cbd5e1',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: isDark ? '#475569' : '#94a3b8',
                }
              }}
            >
              <Typography variant="subtitle2" sx={{ color: isDark ? '#94A3B8' : 'text.secondary', fontWeight: 600, mb: 0.5 }}>
                Datos guardados (Favoritos)
              </Typography>
              {favorites.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5, gap: 1, py: 4 }}>
                  <StarBorderIcon sx={{ fontSize: 40, color: isDark ? '#94A3B8' : '#64748B' }} />
                  <Typography variant="body2" align="center" sx={{ color: isDark ? '#94A3B8' : '#64748B' }}>
                    No tienes ningún dato guardado en favoritos.
                  </Typography>
                  <Typography variant="caption" align="center" sx={{ color: isDark ? '#64748B' : '#94a3b8', px: 2 }}>
                    Haz clic en la estrella de un mensaje para guardarlo aquí y copiarlo rápidamente.
                  </Typography>
                </Box>
              ) : (
                favorites.map((fav, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.02)',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                      position: 'relative',
                      transition: 'border-color 0.2s',
                      '&:hover': {
                        borderColor: isDark ? '#3b82f6' : '#2563eb'
                      }
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        pr: 8, 
                        whiteSpace: 'pre-wrap', 
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        color: isDark ? '#F8FAFC' : '#0f172a'
                      }}
                    >
                      {fav}
                    </Typography>
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            navigator.clipboard.writeText(fav);
                          }
                        }}
                        title="Copiar texto"
                        sx={{ color: isDark ? '#94A3B8' : '#64748B' }}
                      >
                        <AssignmentIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => saveFavorites(favorites.filter(f => f !== fav))}
                        title="Quitar"
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          ) : (
            <Box 
              sx={{ 
                flexGrow: 1, 
                overflowY: 'auto', 
                mb: 1.5, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2, 
                px: 2, 
                py: 1.5,
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': {
                  background: isDark ? '#334155' : '#cbd5e1',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: isDark ? '#475569' : '#94a3b8',
                }
              }}
            >
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const isFav = favorites.includes(msg.text);

                return (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.25,
                      flexDirection: isUser ? 'row-reverse' : 'row',
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                    }}
                  >
                    {!isUser && (
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: 'transparent',
                          color: isDark ? '#94A3B8' : 'text.secondary',
                          border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                          flexShrink: 0
                        }}
                      >
                        <SmartToyIcon sx={{ fontSize: 16, color: isDark ? '#94A3B8' : '#334155' }} />
                      </Avatar>
                    )}
                    <Box
                      sx={{
                        backgroundColor: isUser ? (isDark ? '#3b82f6' : '#2563eb') : (isDark ? '#1e293b' : '#f8fafc'),
                        color: isUser ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a'),
                        borderRadius: '12px',
                        borderTopRightRadius: isUser ? '2px' : '12px',
                        borderTopLeftRadius: !isUser ? '2px' : '12px',
                        p: 1.25,
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        border: isUser ? 'none' : `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                        position: 'relative',
                        '&:hover .fav-btn': { opacity: 0.8 }
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.5,
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          pr: isUser ? 0 : 3.5
                        }}
                      >
                        {msg.text}
                      </Typography>
                      
                      {!isUser && msg.text && msg.text !== INITIAL_ASSISTANT_MESSAGE && (
                        <IconButton
                          className="fav-btn"
                          size="small"
                          onClick={() => {
                            if (isFav) {
                              saveFavorites(favorites.filter(f => f !== msg.text));
                            } else {
                              saveFavorites([...favorites, msg.text]);
                            }
                          }}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            opacity: isFav ? 1 : 0,
                            transition: 'opacity 0.2s',
                            color: isFav ? '#eab308' : (isDark ? '#94A3B8' : '#64748B'),
                            p: 0.5
                          }}
                          title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                        >
                          {isFav ? <StarIcon sx={{ fontSize: 16 }} /> : <StarBorderIcon sx={{ fontSize: 16 }} />}
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                );
              })}
              {loading && (
                <Box sx={{ alignSelf: 'flex-start', pl: 1, display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Pensando...</Typography>
                </Box>
              )}
              <Box ref={messagesEndRef} sx={{ height: 4, flexShrink: 0 }} />
            </Box>
          )}

          {/* Interactive confirmation panel if there is a pending navigation */}
          {pendingNavigation && !loading && (
            <Box 
              sx={{ 
                px: 2, 
                pb: 1.5, 
                display: 'flex', 
                gap: 1,
                animation: 'slideUp 0.2s ease-out forwards',
                '@keyframes slideUp': {
                  '0%': { opacity: 0, transform: 'translateY(10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={handleConfirmNavigation}
                sx={{ 
                  borderRadius: '12px', 
                  textTransform: 'none', 
                  fontWeight: 600,
                  bgcolor: isDark ? '#3b82f6' : '#2563eb',
                  '&:hover': {
                    bgcolor: isDark ? '#2563eb' : '#1d4ed8',
                  }
                }}
              >
                Sí, navegar
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                fullWidth 
                onClick={handleCancelNavigation}
                sx={{ 
                  borderRadius: '12px', 
                  textTransform: 'none', 
                  fontWeight: 600,
                  color: isDark ? '#94A3B8' : '#64748B',
                  borderColor: isDark ? '#334155' : '#cbd5e1',
                  '&:hover': {
                    borderColor: isDark ? '#475569' : '#94a3b8',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              >
                No, cancelar
              </Button>
            </Box>
          )}

          {/* Área de Input */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              p: 2, 
              borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              gap: 1,
              position: 'relative'
            }}
          >
            {showCommandMenu && filteredCommands.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 'calc(100% - 8px)',
                  left: 12,
                  right: 12,
                  maxHeight: 220,
                  overflowY: 'auto',
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                  boxShadow: isDark 
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)' 
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  zIndex: 10000,
                  py: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': {
                    background: isDark ? '#334155' : '#cbd5e1',
                    borderRadius: '2px',
                  }
                }}
              >
                {filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedCommandIndex;
                  return (
                    <Box
                      key={cmd.key}
                      onClick={() => handleSelectCommand(cmd)}
                      onMouseEnter={() => setSelectedCommandIndex(idx)}
                      sx={{
                        px: 2,
                        py: 1,
                        cursor: 'pointer',
                        backgroundColor: isSelected 
                          ? (isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.08)') 
                          : 'transparent',
                        color: isSelected 
                          ? (isDark ? '#60a5fa' : '#2563eb') 
                          : (isDark ? '#F8FAFC' : '#0f172a'),
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'background-color 0.15s, color 0.15s',
                        borderLeft: isSelected 
                          ? `3px solid ${isDark ? '#3b82f6' : '#2563eb'}` 
                          : '3px solid transparent'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            fontSize: '0.85rem',
                          }}
                        >
                          {cmd.key}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            opacity: 0.8,
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        >
                          {cmd.label}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: isDark ? '#94A3B8' : '#64748B', 
                          fontSize: '0.7rem',
                          mt: 0.25
                        }}
                      >
                        {cmd.description}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
            <TextField
              value={input}
              onChange={e => {
                const val = e.target.value;
                setInput(val);
                if (val.startsWith('/')) {
                  setShowCommandMenu(true);
                  setSelectedCommandIndex(0);
                } else {
                  setShowCommandMenu(false);
                }
              }}
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              placeholder="Escribe tu pregunta..."
              onKeyDown={e => { 
                if (showCommandMenu && filteredCommands.length > 0) {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedCommandIndex(prev => (prev + 1) % filteredCommands.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedCommandIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSelectCommand(filteredCommands[selectedCommandIndex]);
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setShowCommandMenu(false);
                  }
                } else {
                  if (e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    handleSend(); 
                  } 
                }
              }}
              disabled={chatDisabled}
              inputProps={{ maxLength: MAX_INPUT_CHARS, style: { color: isDark ? '#F8FAFC' : undefined } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#F8FAFC' : undefined,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.04)',
                  borderRadius: '20px',
                  px: 2,
                  py: 1,
                  fontSize: '0.875rem',
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: isDark ? '#3b82f6' : '#2563eb', borderWidth: '1px' },
                }
              }}
            />
            
            {/* Botón de Micrófono Minimalista */}
            <IconButton
              onClick={toggleListening}
              disabled={chatDisabled}
              sx={{
                borderRadius: '50%',
                width: 38,
                height: 38,
                backgroundColor: isListening 
                  ? 'rgba(34, 197, 94, 0.12)' 
                  : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.04)'),
                '&:hover': {
                  backgroundColor: isListening 
                    ? 'rgba(34, 197, 94, 0.2)' 
                    : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'),
                },
                border: `1px solid ${isListening ? '#22c55e' : 'transparent'}`,
                animation: isListening ? 'pulse-green 1.5s infinite' : 'none',
                '@keyframes pulse-green': {
                  '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
                  '70%': { boxShadow: '0 0 0 8px rgba(34, 197, 94, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' }
                },
                flexShrink: 0
              }}
            >
              {isListening ? (
                <MicIcon sx={{ color: '#22c55e', fontSize: 20 }} />
              ) : (
                <MicOffIcon sx={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: 20 }} />
              )}
            </IconButton>

            {/* Botón de Envío Premium (Estilo Circular Chat) */}
            <IconButton
              onClick={() => handleSend()}
              disabled={chatDisabled || !input.trim()}
              sx={{
                borderRadius: '50%',
                width: 38,
                height: 38,
                backgroundColor: isDark ? '#3b82f6' : '#2563eb',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: isDark ? '#2563eb' : '#1d4ed8',
                },
                '&.Mui-disabled': {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(15, 23, 42, 0.02)',
                  color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(15, 23, 42, 0.2)',
                },
                flexShrink: 0
              }}
            >
              <SendIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AssistantChatFab;
