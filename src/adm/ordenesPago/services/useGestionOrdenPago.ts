import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"
import { useDispatch } from 'react-redux'

interface IGestionOrdenPago {
  codigoOrdenPago: number
}

const useGestionOrdenPago = () => {
  const [messageGestion, setMessageGestion] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const dispatch = useDispatch()

  const aprobarOrdenPago = useCallback(async (filters: IGestionOrdenPago): Promise<any | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<any>(UrlServices.APROBARORDENPAGO, filters)
      if (response.data.isValid) {

        return response.data
      }

      setMessageGestion(response.data.message)
    } catch (e: any) {
      console.log(e)
    } finally {
      setLoading(false)
    }

    return null
  }, [dispatch])

  const anularOrdenPago = useCallback(async (filters: IGestionOrdenPago): Promise<any | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<any>(UrlServices.ANULARORDENPAGO, filters)
      if (response.data.isValid) {

        return response.data
      }

      setMessageGestion(response.data.message)
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