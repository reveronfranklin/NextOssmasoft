import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"
import { useDispatch } from 'react-redux'

interface IGestionOrdenPago {
  codigoOrdenPago: number
}

const useGestionOrdenPago = () => {
  const [messageGestion, setMessageGestion] = useState({
    text: '',
    timestamp: Date.now(),
    isValid: true,
  })
  const [loading, setLoading] = useState<boolean>(false)

  const dispatch = useDispatch()

  const aprobarOrdenPago = useCallback(async (filters: IGestionOrdenPago, onSuccess?: () => void): Promise<any | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<any>(UrlServices.APROBARORDENPAGO, filters)

      if (response.data.isValid) {
        setMessageGestion({
          text: 'Orden de pago APROBADA exitosamente',
          timestamp: Date.now(),
          isValid: true
        })

        if (onSuccess) {
          onSuccess()
        }

        return response.data
      }

      setMessageGestion({
        text: response.data.message || 'Error al aprobar la orden de pago',
        timestamp: Date.now(),
        isValid: false
      })
    } catch (e: any) {
      console.log(e)
    } finally {
      setLoading(false)
    }

    return null
  }, [dispatch])

  const anularOrdenPago = useCallback(async (filters: IGestionOrdenPago, onSuccess?: () => void): Promise<any | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<any>(UrlServices.ANULARORDENPAGO, filters)

      if (response.data.isValid) {
        setMessageGestion({
          text: 'Orden de pago ANULADA exitosamente',
          timestamp: Date.now(),
          isValid: true
        })

        if (onSuccess) {
          onSuccess()
        }

        return response.data
      }

      setMessageGestion({
        text: response.data.message,
        timestamp: Date.now(),
        isValid: false
      })
    } catch (e: any) {
      console.log(e)
    } finally {
      setLoading(false)
    }

    return null
  }, [dispatch])

  return {
    messageGestion, loading,
    anularOrdenPago,
    aprobarOrdenPago
  }
}

export default useGestionOrdenPago