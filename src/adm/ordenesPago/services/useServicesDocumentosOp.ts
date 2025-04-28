import { useCallback, useState } from "react"
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { UrlServices } from '../enums/UrlServices.enum'

import { useSelector } from "react-redux"
import { RootState } from "src/store"
import { useDispatch } from 'react-redux'

import { IGetListByOrdenPago } from '../interfaces/documentosOp/listDocumentoByOrdenPago'
import { ICreateDocumentosOp } from '../interfaces/documentosOp/createDocumentosOp'
import { IUpdateDocumentosOp } from '../interfaces/documentosOp/updateDocumentosOp'
import { IDeleteDocumentoOp } from '../interfaces/documentosOp/deleteDocumentosOp'

import { setDocumentCount } from 'src/store/apps/ordenPago'

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers'
import { IApiResponse } from 'src/interfaces/api-response-dto'
import { IResponseBase } from 'src/interfaces/response-base-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'

const useServicesDocumentosOp = () => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<IAlertMessageDto>({
    text: '',
    timestamp: Date.now(),
    isValid: true,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

  const getListDocumentos = useCallback(async (filters: IGetListByOrdenPago): Promise<IApiResponse<IGetListByOrdenPago>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApi.post<IResponseBase<IGetListByOrdenPago>>(UrlServices.GETDOCUMENTOSOPBYORDENPAGO, filters)
      const responseHandleApi = handleApiResponse<IGetListByOrdenPago>(responseFetch.data, undefined, setMessage, setError)

      dispatch(setDocumentCount(responseHandleApi?.cantidadRegistros))

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const createDocumentos = useCallback(async (filters: ICreateDocumentosOp): Promise<IApiResponse<ICreateDocumentosOp>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApi.post<IResponseBase<ICreateDocumentosOp>>(UrlServices.CREATEDOCUMENTOSOP, filters)
      const responseHandleApi = handleApiResponse<ICreateDocumentosOp>(responseFetch.data, 'Documento creado con éxito', setMessage, setError)

      dispatch(setDocumentCount(responseHandleApi?.cantidadRegistros))

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const updateDocumentos = useCallback(async (filters: IUpdateDocumentosOp): Promise<IApiResponse<IUpdateDocumentosOp>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApi.post<IResponseBase<IUpdateDocumentosOp>>(UrlServices.UPDATEDOCUMENTOSOP, filters)
      const responseHandleApi = handleApiResponse<IUpdateDocumentosOp>(responseFetch.data, 'Documento actualizado con éxito', setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const deleteDocumentos = useCallback(async (filters: IDeleteDocumentoOp): Promise<IApiResponse<IDeleteDocumentoOp>> => {
    try {
      setLoading(true)

      const responseFetch = await ossmmasofApi.post<IResponseBase<IDeleteDocumentoOp>>(UrlServices.DELETEDOCUMENTOSOP, filters)
      const responseHandleApi = handleApiResponse<IDeleteDocumentoOp>(responseFetch.data, 'Documento eliminado con éxito', setMessage, setError)

      dispatch(setDocumentCount(responseHandleApi?.cantidadRegistros))

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  return {
    error, message, loading,
    presupuestoSeleccionado,
    getListDocumentos,
    createDocumentos,
    updateDocumentos,
    deleteDocumentos,
  }
}

export default useServicesDocumentosOp