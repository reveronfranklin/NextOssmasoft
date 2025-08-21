import { useCallback, useState } from 'react'
import { ossmmasofApiGateway } from 'src/MyApis/ossmmasofApiGateway'
import { UrlVariableServices } from 'src/formulacion/enums/UrlVariableServices.enum'

import { DTOVariableGetAll, IVariableGetAllResponse } from 'src/formulacion/interfaces/variable/GetAll.interfaces'
import { DTOVariableCreate, IVariableCreateResponse } from 'src/formulacion/interfaces/variable/Create.interfaces'
import { DTOVariableUpdate, IVariableUpdateResponse } from 'src/formulacion/interfaces/variable/Update.interfaces'
import { DTOVariableDelete, IVariableDeleteResponse } from 'src/formulacion/interfaces/variable/Delete.intrefaces'

import { IVariableService } from 'src/formulacion/interfaces/variable/VariableService.interfaces'

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers'
import { IApiResponse } from 'src/interfaces/api-response-dto'
import { IResponseBase } from 'src/interfaces/response-base-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'

const useVariableService = (): IVariableService => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<IAlertMessageDto>({
    text: '',
    isValid: true,
    timestamp: Date.now(),
  })
  const [loading, setLoading] = useState<boolean>(false)

  const getListVariables = useCallback(async (filters: DTOVariableGetAll): Promise<IApiResponse<IVariableGetAllResponse[]>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IVariableGetAllResponse[]>>(UrlVariableServices.GETALLVARIABLES, filters)
      const responseHandleApi = handleApiResponse<IVariableGetAllResponse[]>(responseFetch.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  const createVariable = useCallback(async (filters: DTOVariableCreate): Promise<IApiResponse<IVariableCreateResponse>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IVariableCreateResponse>>(UrlVariableServices.CREATEVARIABLE, filters)
      const responseHandleApi = handleApiResponse<IVariableCreateResponse>(responseFetch.data, 'Variable creada con éxito', setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateVariable = useCallback(async (filters: DTOVariableUpdate): Promise<IApiResponse<IVariableUpdateResponse>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IVariableUpdateResponse>>(UrlVariableServices.UPDATEVARIABLE, filters)
      const responseHandleApi = handleApiResponse<IVariableUpdateResponse>(responseFetch.data, 'Variable actualizada con éxito', setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteVariable = useCallback(async (filters: DTOVariableDelete): Promise<IApiResponse<IVariableDeleteResponse>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IVariableDeleteResponse>>(UrlVariableServices.DELETEVARIABLE, filters)
      const responseHandleApi = handleApiResponse<IVariableDeleteResponse>(responseFetch.data, 'Variable eliminada con éxito', setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    error,
    message,
    loading,
    getListVariables,
    createVariable,
    updateVariable,
    deleteVariable,
  }
}

export default useVariableService