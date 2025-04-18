import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"
import { useDispatch } from 'react-redux'

import { IListImpuestoByOrdenPago } from '../interfaces/impuestoDocumentosOp/listImpuestoDocumentosOp'
import { ICreateImpuestoDocumentosOp } from '../interfaces/impuestoDocumentosOp/createImpuestoDocumentosOp'
import { IUpdateImpuestoDocumentosOp } from '../interfaces/impuestoDocumentosOp/updateImpuestoDocumentosOp'
import { IDeleteImpuestoDocumentosOp } from '../interfaces/impuestoDocumentosOp/deleteImpuestoDocumentosOp'

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers'
import { IResponseBase } from 'src/interfaces/response-base-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'
import { IApiResponse } from 'src/interfaces/api-response-dto'

const useServicesImpuestosDocumentosOp = () => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<IAlertMessageDto>({
    text: '',
    timestamp: Date.now(),
    isValid: true,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()

  const getListImpuestoDocumentosOp = useCallback(async (filters: IListImpuestoByOrdenPago): Promise<IApiResponse<IListImpuestoByOrdenPago>> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseBase<IListImpuestoByOrdenPago>>(UrlServices.GETIMPUESTOSDOCBYORDENPAGO , filters)
      const responseHandleApi = handleApiResponse<IListImpuestoByOrdenPago>(response.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const createImpuestoDocumentosOp = useCallback(async (filters: ICreateImpuestoDocumentosOp): Promise<IApiResponse<ICreateImpuestoDocumentosOp>> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseBase<ICreateImpuestoDocumentosOp>>(UrlServices.CREATEIMPUESTODOCUMENTO, filters)
      const responseHandleApi = handleApiResponse<ICreateImpuestoDocumentosOp>(response.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const updateImpuestoDocumentosOp = useCallback(async (filters: IUpdateImpuestoDocumentosOp): Promise<IApiResponse<IUpdateImpuestoDocumentosOp>> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseBase<IUpdateImpuestoDocumentosOp>>(UrlServices.UPDATEIMPUESTODOCUMENTO , filters)
      const responseHandleApi = handleApiResponse<IUpdateImpuestoDocumentosOp>(response.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const deleteImpuestoDocumentosOp = useCallback(async (filters: IDeleteImpuestoDocumentosOp): Promise<IApiResponse<IDeleteImpuestoDocumentosOp>> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseBase<IDeleteImpuestoDocumentosOp>>(UrlServices.DELETEIMPUESTODOCUMENTO , filters)
      const responseHandleApi = handleApiResponse<IDeleteImpuestoDocumentosOp>(response.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }

  }, [dispatch])

  return {
    message, loading, error,
    getListImpuestoDocumentosOp,
    createImpuestoDocumentosOp,
    updateImpuestoDocumentosOp,
    deleteImpuestoDocumentosOp
  }
}

export default useServicesImpuestosDocumentosOp