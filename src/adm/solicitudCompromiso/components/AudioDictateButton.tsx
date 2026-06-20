import { useState, useRef, useEffect, useCallback } from 'react'
import { IconButton, Tooltip, CircularProgress, Box, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import { useAppFeatures } from 'src/context/AppFeaturesContext'

// ─────────────────────────────────────────────────────────────────────────────
// Tipos — idénticos al original
// ─────────────────────────────────────────────────────────────────────────────

interface AudioDictateButtonProps {
  onTranscriptReceived: (text: string, confidence?: number) => void
  textValue?: string
  onStateChange?: (state: 'idle' | 'recording' | 'transcribing') => void
  onClear?: () => void
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
}

// ─────────────────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────────────────

const PREFERRED_MIME_TYPE = 'audio/webm;codecs=opus'
const FALLBACK_MIME_TYPE = 'audio/webm'

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────

const AudioDictateButton = ({
  onTranscriptReceived,
  textValue,
  onStateChange,
  onClear,
  inputRef,
}: AudioDictateButtonProps) => {

  // ── TODOS los hooks primero — nunca condicionales ──────────────────────────
  const { audioDictation } = useAppFeatures()

  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const maxDurationTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isRecordingRef = useRef(false)

  // Mantiene ref sincronizada con estado (evita stale closures en keyboard handler)
  useEffect(() => {
    isRecordingRef.current = isRecording
  }, [isRecording])

  // Keyboard shortcut: Ctrl+D / Cmd+D cuando el inputRef tiene foco
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
        if (inputRef?.current && document.activeElement === inputRef.current) {
          event.preventDefault()
          if (isRecordingRef.current) {
            stopRecording()
          } else {
            startRecording()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef])

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current!)
      clearTimeout(maxDurationTimerRef.current!)
      revokeAudioUrl()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Guard del feature flag — DESPUÉS de todos los hooks
  // ─────────────────────────────────────────────────────────────────────────
  if (!audioDictation) return null

  // ─────────────────────────────────────────────────────────────────────────
  // Utilidades internas
  // ─────────────────────────────────────────────────────────────────────────

  const revokeAudioUrl = () => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
  }

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
    const remainingSeconds = secs % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const getMimeType = (): string =>
    MediaRecorder.isTypeSupported(PREFERRED_MIME_TYPE) ? PREFERRED_MIME_TYPE : FALLBACK_MIME_TYPE

  // ─────────────────────────────────────────────────────────────────────────
  // Transcripción — proxy interno (la API Key nunca sale al cliente)
  // ─────────────────────────────────────────────────────────────────────────

  const sendAudioToDeepgram = async (audioBlob: Blob) => {
    try {
      const response = await fetch('/api/deepgram/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': audioBlob.type || 'audio/webm' },
        body: audioBlob,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(errData.error || 'Error en la transcripción con Deepgram')
      }

      const result = await response.json()
      const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript
      const confidence = result.results?.channels?.[0]?.alternatives?.[0]?.confidence

      if (transcript && transcript.trim()) {
        onTranscriptReceived(transcript, confidence)
        if (confidence !== undefined && confidence < 0.85) {
          toast('Revisa esta parte, no estoy seguro de haber escuchado bien', {
            icon: '⚠️',
            duration: 6000,
          })
        } else {
          toast.success('Dictado transcrito exitosamente')
        }
      } else {
        toast.error('No se detectó voz en el audio')
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Error al comunicarse con Deepgram')
    } finally {
      setIsTranscribing(false)
      onStateChange?.('idle')
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Grabación
  // ─────────────────────────────────────────────────────────────────────────

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1,
        },
        
      })

      const mimeType = getMimeType()
      let mediaRecorder: MediaRecorder

      try {
        mediaRecorder = new MediaRecorder(stream, { mimeType })
      } catch (e) {
        // Fallback para navegadores sin soporte de audio/webm
        mediaRecorder = new MediaRecorder(stream)
      }

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || FALLBACK_MIME_TYPE,
        })

        // Liberar el micrófono
        stream.getTracks().forEach(track => track.stop())

        clearInterval(timerIntervalRef.current!)
        clearTimeout(maxDurationTimerRef.current!)

        setIsTranscribing(true)
        onStateChange?.('transcribing')
        await sendAudioToDeepgram(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      onStateChange?.('recording')

      // Timer visual
      setRecordingSeconds(0)
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1)
      }, 1000)

      // Auto-stop a los 120s para evitar grabaciones accidentales infinitas
      maxDurationTimerRef.current = setTimeout(() => {
        toast('Grabación detenida automáticamente (límite de 2 minutos)', { icon: '⏱️' })
        stopRecording()
      }, 120 * 1000)

      toast.success('Grabando audio... presione detener para transcribir')
    } catch (err) {
      console.error('Error al acceder al micrófono:', err)
      toast.error('No se pudo acceder al micrófono. Verifique los permisos.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecordingRef.current) {
      clearTimeout(maxDurationTimerRef.current!)
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      // El resto ocurre en mediaRecorder.onstop
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Text-to-Speech — proxy interno
  // ─────────────────────────────────────────────────────────────────────────

  const speakText = async () => {
    if (!textValue || !textValue.trim()) {
      toast.error('No hay texto para reproducir')
      return
    }

    if (isSpeaking) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        setIsSpeaking(false)
      }
      return
    }

    setIsSpeaking(true)
    try {
      const response = await fetch('/api/deepgram/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textValue, model: 'aura-2-celeste-es' }),
      })

      if (!response.ok) {
        throw new Error('Error al generar la síntesis de voz con Deepgram Aura-2')
      }

      const audioBlob = await response.blob()

      // Revocar URL anterior (evita memory leak)
      revokeAudioUrl()
      const audioUrl = URL.createObjectURL(audioBlob)
      audioUrlRef.current = audioUrl

      const audio = new Audio(audioUrl)
      audioPlayerRef.current = audio

      audio.onended = () => {
        setIsSpeaking(false)
        revokeAudioUrl()
      }

      audio.onerror = () => {
        setIsSpeaking(false)
        revokeAudioUrl()
      }

      await audio.play()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Error al comunicarse con Deepgram Speak')
      setIsSpeaking(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render — idéntico al original en estructura y comportamiento
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {isTranscribing ? (
        <CircularProgress size={24} color='secondary' />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={isRecording ? 'Detener dictado y transcribir (ctrl + D)' : 'Dictar con voz (ctrl + D)'}>
            <IconButton
              color={isRecording ? 'error' : 'primary'}
              onClick={isRecording ? stopRecording : startRecording}
              sx={{
                animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.15)', opacity: 0.8 },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              <Icon icon={isRecording ? 'mdi:stop' : 'mdi:microphone'} fontSize={22} />
            </IconButton>
          </Tooltip>
          {isRecording && (
            <Typography variant='caption' sx={{ fontWeight: 'bold', color: 'error.main', minWidth: '35px' }}>
              {formatTime(recordingSeconds)}
            </Typography>
          )}
        </Box>
      )}

      {onClear && textValue && textValue.trim().length > 0 && (
        <Tooltip title='Limpiar texto'>
          <IconButton
            size='small'
            onClick={onClear}
            sx={{
              color: 'text.secondary',
              opacity: 0.5,
              transition: 'opacity 0.2s, color 0.2s',
              '&:hover': {
                opacity: 0.9,
                color: 'error.main',
              },
            }}
          >
            <Icon icon='mdi:close-circle-outline' fontSize={20} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

export default AudioDictateButton
