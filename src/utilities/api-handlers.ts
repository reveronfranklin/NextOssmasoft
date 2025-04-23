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
    data: apiResponse.data,
    isValid: apiResponse.isValid,
    linkData: apiResponse.linkData,
    linkDataArlternative: apiResponse.linkDataArlternative,
    message: message,
    page: apiResponse.page,
    totalPage: apiResponse.totalPage,
    cantidadRegistros: apiResponse.cantidadRegistros || 0,
    total1: apiResponse.total1,
    total2: apiResponse.total2,
    total3: apiResponse.total3,
    total4: apiResponse.total4,
    success: apiResponse.isValid,
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