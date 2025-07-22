import { useCallback, useState } from "react"
import { ossmmasofApiGateway } from 'src/MyApis/ossmmasofApiGateway'
import { UrlFormulacionServices } from 'src/formulacion/enums/UrlFormulacionServices.enum'

import { DTOGetAllFormula, IFormulaResponse} from 'src/formulacion/interfaces/formula/GetAll.interfaces'
import { DTOFormulaCreate, IFormulaCreateResponse} from 'src/formulacion/interfaces/formula/Create.interfaces'
import { DTOFormulaUpdate, IFormulaUpdateResponse } from 'src/formulacion/interfaces/formula/Update.intrefaces'
import { DTOFormulaDelete, IFormulaDeleteResponse } from 'src/formulacion/interfaces/formula/Delete.interfaces'

import { IFormulaService } from 'src/formulacion/interfaces/formula/FormulaService.interfaces'

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers'
import { IApiResponse } from 'src/interfaces/api-response-dto'
import { IResponseBase } from 'src/interfaces/response-base-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'

const useFormulaService = (): IFormulaService => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<IAlertMessageDto>({
    text: '',
    isValid: true,
    timestamp: Date.now(),
  })
  const [loading, setLoading] = useState<boolean>(false)

  const getListFormulas = useCallback(async (filters: DTOGetAllFormula): Promise<IApiResponse<IFormulaResponse[]>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IFormulaResponse[]>>(
        UrlFormulacionServices.GETALLFORMULA, filters
      )

      const responseHandleApi = handleApiResponse<IFormulaResponse[]>(
        responseFetch.data,
        undefined,
        setMessage,
        setError
      )

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  const createFormula = useCallback(async (filters: DTOFormulaCreate): Promise<IApiResponse<IFormulaCreateResponse>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IFormulaCreateResponse>>(
        UrlFormulacionServices.CREATEFORMULA, filters
      )

      const responseHandleApi = handleApiResponse<IFormulaCreateResponse>(
        responseFetch.data,
        'Formula creada con éxito',
        setMessage,
        setError
      )

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateFormula = useCallback(async (filters: DTOFormulaUpdate): Promise<IApiResponse<IFormulaUpdateResponse>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IFormulaUpdateResponse>>(
        UrlFormulacionServices.UPDATEFORMULA, filters
      )

      const responseHandleApi = handleApiResponse<IFormulaUpdateResponse>(
        responseFetch.data,
        'Formula actualizada con éxito',
        setMessage,
        setError,
        undefined,
        [['formulasTable']]
      )

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteFormula = useCallback(async (filters: DTOFormulaDelete): Promise<IApiResponse<IFormulaDeleteResponse>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApiGateway.delete<IResponseBase<IFormulaDeleteResponse>>(
        UrlFormulacionServices.DELETEFORMULA + '/' + filters.id
      )

      const responseHandleApi = handleApiResponse<IFormulaDeleteResponse>(
        responseFetch.data,
        'Formula eliminada con éxito',
        setMessage,
        setError
      )

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    error, message, loading,
    getListFormulas,
    createFormula,
    updateFormula,
    deleteFormula,
  }
}

export default useFormulaService