import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface AppFeatures {
  audioDictation: boolean
}

interface AppFeaturesContextValue {
  features: AppFeatures
  isLoading: boolean
}

const defaultFeatures: AppFeatures = {
  audioDictation: true,
}

const AppFeaturesContext = createContext<AppFeaturesContextValue>({
  features: defaultFeatures,
  isLoading: true,
})

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

export const useAppFeatures = (): AppFeatures => {
  const { features } = useContext(AppFeaturesContext)
  return features
}

export default AppFeaturesContext
