import { IResponseBase } from 'src/interfaces/response-base-dto'
import { IApiResponse } from 'src/interfaces/api-response-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'

export const handleApiResponse = <T>(
  apiResponse: IResponseBase<T>,
  successMessage?: string,
  setMessage?: (message: IAlertMessageDto) => void,
  setError?: (error: string) => void
): IApiResponse<T> => {
  const message = apiResponse?.message || successMessage || ''

  if (setMessage && setError) {
    if (apiResponse.isValid) {
      setMessage({
        text: message,
        timestamp: Date.now(),
        isValid: true,
      })
    } else {
      setError(message)
      setMessage({
        text: message,
        timestamp: Date.now(),
        isValid: false,
      })
    }
  }

  return {
    success: apiResponse.isValid,
    isValid: apiResponse.isValid,
    message: message,
    data: apiResponse.data,
    cantidadRegistros: apiResponse.cantidadRegistros || 0,
  }
}

export const handleApiError = (
  error: any,
  setMessage?: (message: IAlertMessageDto) => void,
  setError?: (error: string) => void
): IApiResponse<any> => {
  const errorMessage = error.message || 'Error al procesar la solicitud'

  if (setMessage && setError) {
    setError(errorMessage)
    setMessage({
      text: errorMessage,
      timestamp: Date.now(),
      isValid: false,
    })
  }

  return {
    success: false,
    isValid: false,
    message: errorMessage,
    data: [],
    cantidadRegistros: 0,
  }
}