import { useCallback, useState } from 'react'
import { ossmmasofApiGateway } from 'src/MyApis/ossmmasofApiGateway'
import { UrlParametroVariable } from 'src/formulacion/enums/UrlParametroVariable.enum'

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers'
import { IApiResponse } from 'src/interfaces/api-response-dto'

// import { IResponseBase } from 'src/interfaces/response-base-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'

const UseParametroVariable = () => {
    const [error, setError] = useState<string>('')
  const [message] = useState<IAlertMessageDto>({
    text: '',
    isValid: true,
    timestamp: Date.now(),
  })
  const [loading, setLoading] = useState<boolean>(false)


  const getAllParametrosVariables = useCallback(async () => {
    setLoading(true)
    try {
      const response = await ossmmasofApiGateway.get(UrlParametroVariable.GETALLPARAMETROVARIABLE)
      const responseHandleApi = handleApiResponse<any>(response.data, undefined, undefined, setError)
      return responseHandleApi as IApiResponse<any>

    } catch (e: any) {

      return handleApiError(e, undefined, setError) as IApiResponse<any>
    } finally {
      setLoading(false)
    }
  }, [])

  const findAllByVariableIdParametroVariable = useCallback(async (variableId: string) => {
    setLoading(true)
    try {
      const response = await ossmmasofApiGateway.get(`${UrlParametroVariable.FINDALLBYVARIABLEIDPARAMETROVARIABLE}/${variableId}`)
      const responseHandleApi = handleApiResponse<any>(response.data, undefined, undefined, setError)
      
      return responseHandleApi as IApiResponse<any>

    } catch (e: any) {

      return handleApiError(e, undefined, setError) as IApiResponse<any>
    } finally {
      setLoading(false)
    }
  }, [])

  const findOneParametroVariable = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const response = await ossmmasofApiGateway.get(`${UrlParametroVariable.FINDONEPARAMETROVARIABLE}/${id}`)
      const responseHandleApi = handleApiResponse<any>(response.data, undefined, undefined, setError)
      
      return responseHandleApi as IApiResponse<any>
    } catch (e: any) {

      return handleApiError(e, undefined, setError) as IApiResponse<any>
    } finally {
      setLoading(false)
    }
  }, [])

  const createParametroVariable = useCallback(async (data: any) => {
    setLoading(true)
    try {
      const response = await ossmmasofApiGateway.post(UrlParametroVariable.CREATEPARAMETROVARIABLE, data)
      const responseHandleApi = handleApiResponse<any>(response.data, undefined, undefined, setError)
      
      return responseHandleApi as IApiResponse<any>

    } catch (e: any) {

      return handleApiError(e, undefined, setError) as IApiResponse<any>
    } finally {
      setLoading(false)
    }
  }, [])

  const updateParametroVariable = useCallback(async (id: string, data: any) => {
    setLoading(true)
    try {
      const response = await ossmmasofApiGateway.put(`${UrlParametroVariable.UPDATEPARAMETROVARIABLE}/${id}`, data)
      const responseHandleApi = handleApiResponse<any>(response.data, undefined, undefined, setError)
      
      return responseHandleApi as IApiResponse<any>

    } catch (e: any) {

      return handleApiError(e, undefined, setError) as IApiResponse<any>
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteParametroVariable = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const response = await ossmmasofApiGateway.delete(`${UrlParametroVariable.DELETEPARAMETROVARIABLE}/${id}`)
      const responseHandleApi = handleApiResponse<any>(response.data, undefined, undefined, setError)

      return responseHandleApi as IApiResponse<any>

    } catch (e: any) {

      return handleApiError(e, undefined, setError) as IApiResponse<any>
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    getAllParametrosVariables,
    findAllByVariableIdParametroVariable,
    findOneParametroVariable,
    createParametroVariable,
    updateParametroVariable,
    deleteParametroVariable,
    loading,
    error,
    message
  }
};

export default UseParametroVariable;