import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"

import { useSelector } from "react-redux"
import { RootState } from "src/store"
import { useDispatch } from 'react-redux'

import { ICreateRetencion } from '../interfaces/retenciones/createRetencion'
import { IUpdateRetencion } from '../interfaces/retenciones/updateRetencion'
import { IDeleteRetencion } from '../interfaces/retenciones/deleteRetencion'

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers'
import { IResponseBase } from 'src/interfaces/response-base-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'
import { IApiResponse } from 'src/interfaces/api-response-dto'

const useServicesRetencionesOp = () => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<IAlertMessageDto>({
    text: '',
    timestamp: Date.now(),
    isValid: true,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

  const getRetenciones = useCallback(async (): Promise<any> => {
    try {
      setLoading(true)
      const responseGetOrdenes = await ossmmasofApi.get<any>(UrlServices.GETADMRETENCIONES)
      if (responseGetOrdenes.data.isValid) {

        return responseGetOrdenes.data
      }
      setMessage(responseGetOrdenes.data.message)
    } catch (e: any) {
      setError(e.message)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const createRetencion = useCallback(async (filters: ICreateRetencion): Promise<IApiResponse<ICreateRetencion>> => {
    try {
      setLoading(true)
      const responseCreateRetencion = await ossmmasofApi.post<IResponseBase<ICreateRetencion>>(UrlServices.CREATEADMRETENCIONES , filters)
      const responseHandleApi = handleApiResponse<ICreateRetencion>(responseCreateRetencion.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const updateRetencion = useCallback(async (filters: IUpdateRetencion): Promise<IApiResponse<IUpdateRetencion>> => {
    try {
      setLoading(true)
      const responseUpdateRetencion = await ossmmasofApi.post<IResponseBase<IUpdateRetencion>>(UrlServices.UPDATEADMRETENCIONES , filters)
      const responseHandleApi = handleApiResponse<IUpdateRetencion>(responseUpdateRetencion.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const deleteRetencion = useCallback(async (filters: IDeleteRetencion): Promise<IApiResponse<IDeleteRetencion>> => {
    try {
      setLoading(true)
      const responseDeleteRetencion = await ossmmasofApi.post<IResponseBase<IDeleteRetencion>>(UrlServices.DELETEADMRETENCIONES, filters)
      const responseHandleApi = handleApiResponse<IDeleteRetencion>(responseDeleteRetencion.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  return {
    error, message, loading,
    presupuestoSeleccionado,
    getRetenciones,
    createRetencion,
    updateRetencion,
    deleteRetencion
  }
}

export default useServicesRetencionesOp