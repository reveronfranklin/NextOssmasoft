import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────

export interface AppFeatures {
  /** Dictado de voz con Deepgram (STT + TTS) en campos de texto */
  audioDictation: boolean
}

interface AppFeaturesContextValue {
  features: AppFeatures
  isLoading: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Valores por defecto — optimistas (true mientras carga, evita parpadeo)
// ─────────────────────────────────────────────────────────────────────────────
const defaultFeatures: AppFeatures = {
  audioDictation: true,
}

const AppFeaturesContext = createContext<AppFeaturesContextValue>({
  features: defaultFeatures,
  isLoading: true,
})

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

type Props = { children: ReactNode }

export const AppFeaturesProvider = ({ children }: Props) => {
  const [features, setFeatures] = useState<AppFeatures>(defaultFeatures)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadFeatures = async () => {
      try {
        const response = await fetch('/api/app-config/features')
        if (!response.ok) throw new Error('No se pudieron cargar las features')
        const data: AppFeatures = await response.json()
        if (!cancelled) setFeatures(data)
      } catch (error) {
        // Si falla la carga, mantiene los valores por defecto (conservadores)
        console.warn('[AppFeatures] Error cargando feature flags, usando defaults:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadFeatures()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AppFeaturesContext.Provider value={{ features, isLoading }}>
      {children}
    </AppFeaturesContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook de consumo
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook para acceder a las feature flags desde cualquier componente.
 *
 * @example
 * const { audioDictation } = useAppFeatures()
 * if (!audioDictation) return null
 */
export const useAppFeatures = (): AppFeatures => {
  const { features } = useContext(AppFeaturesContext)
  return features
}

export default AppFeaturesContext
