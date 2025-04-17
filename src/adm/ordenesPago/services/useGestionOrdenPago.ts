import { useCallback, useState } from "react"
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { UrlServices } from '../enums/UrlServices.enum'
import { useDispatch } from 'react-redux'

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers'
import { IResponseBase } from 'src/interfaces/response-base-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'
import { IApiResponse } from 'src/interfaces/api-response-dto'

interface IGestionOrdenPago {
  codigoOrdenPago: number
}

const useGestionOrdenPago = () => {
  const [error, setError] = useState<string>('')
  const [messageGestion, setMessageGestion] = useState<IAlertMessageDto>({
    text: '',
    timestamp: Date.now(),
    isValid: true,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()

  const aprobarOrdenPago = useCallback(async (filters: IGestionOrdenPago, onSuccess?: () => void): Promise<IApiResponse<IGestionOrdenPago>> => {
    try {
      setLoading(true)
      const responseFetch = await ossmmasofApi.post<IResponseBase<IGestionOrdenPago>>(UrlServices.APROBARORDENPAGO, filters)
      const responseHandleApi = handleApiResponse<IGestionOrdenPago>(responseFetch.data, 'Documento APROBADO con éxito', setMessageGestion, setError)

      if (onSuccess) onSuccess()

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessageGestion, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const anularOrdenPago = useCallback(async (filters: IGestionOrdenPago, onSuccess?: () => void): Promise<IApiResponse<IGestionOrdenPago>> => {
    try {
      setLoading(true)
      const responseFetch = await ossmmasofApi.post<IResponseBase<IGestionOrdenPago>>(UrlServices.ANULARORDENPAGO, filters)
      const responseHandleApi = handleApiResponse<IGestionOrdenPago>(responseFetch.data, 'Documento creado con éxito', setMessageGestion, setError)

      if (onSuccess) onSuccess()

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessageGestion, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  return {
    messageGestion, loading, error,
    anularOrdenPago,
    aprobarOrdenPago
  }
}

export default useGestionOrdenPago