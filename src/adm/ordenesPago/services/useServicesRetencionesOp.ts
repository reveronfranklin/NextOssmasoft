import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"

import { useSelector } from "react-redux"
import { RootState } from "src/store"
import { useDispatch } from 'react-redux'

import { ICreateRetencionOp } from '../interfaces/retencionesOp/createRetencionOp'
import { IUpdateRetencionOp } from '../interfaces/retencionesOp/updateRetencionOp'
import { IDeleteRetencionOp } from '../interfaces/retencionesOp/deleteRetencionOp'

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers'
import { IResponseBase } from 'src/interfaces/response-base-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'
import { IApiResponse } from 'src/interfaces/api-response-dto'

interface IfilterByOrdenPago {
  codigoOrdenPago: number
}

const useServicesRetencionesOp = (): {
  error: string,
  message: IAlertMessageDto,
  loading: boolean,
  presupuestoSeleccionado: any,
  getRetencionesOpByOrdenPago: (filters: IfilterByOrdenPago) => Promise<any>,
  createRetencionOp: (filters: ICreateRetencionOp) => Promise<any>,
  updateRetencionOp: (filters: IUpdateRetencionOp) => Promise<any>,
  deleteRetencionOp: (filters: IDeleteRetencionOp) => Promise<any>
} => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<IAlertMessageDto>({
    text: '',
    timestamp: Date.now(),
    isValid: true,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

  const getRetencionesOpByOrdenPago = useCallback(async (filters: IfilterByOrdenPago): Promise<IApiResponse<IfilterByOrdenPago>> => {
    try {
      setLoading(true)
      const responseGetOrdenes = await ossmmasofApi.post<IResponseBase<IfilterByOrdenPago>>(UrlServices.GETRETENCIONESOPBYORDENPAGO, filters)
      const responseHandleApi = handleApiResponse<IfilterByOrdenPago>(responseGetOrdenes.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const createRetencionOp = useCallback(async (filters: ICreateRetencionOp): Promise<IApiResponse<ICreateRetencionOp>> => {
    try {
      setLoading(true)
      const responseCreateRetencion = await ossmmasofApi.post<IResponseBase<ICreateRetencionOp>>(UrlServices.CREATERETENCIONESOP, filters)
      const responseHandleApi = handleApiResponse<ICreateRetencionOp>(responseCreateRetencion.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const updateRetencionOp = useCallback(async (filters: IUpdateRetencionOp): Promise<IApiResponse<IUpdateRetencionOp>> => {
    try {
      setLoading(true)
      const responseUpdateRetencion = await ossmmasofApi.post<IResponseBase<IUpdateRetencionOp>>(UrlServices.UPDATERETENCIONESOP, filters)
      const responseHandleApi = handleApiResponse<IUpdateRetencionOp>(responseUpdateRetencion.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const deleteRetencionOp = useCallback(async (filters: IDeleteRetencionOp): Promise<IApiResponse<IDeleteRetencionOp>> => {
    try {
      setLoading(true)

      const responseDeleteRetencion = await ossmmasofApi.post<IResponseBase<IDeleteRetencionOp>>(UrlServices.DELETERETENCIONESOP, filters)
      const responseHandleApi = handleApiResponse<IDeleteRetencionOp>(responseDeleteRetencion.data, undefined, setMessage, setError)

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
    getRetencionesOpByOrdenPago,
    createRetencionOp,
    updateRetencionOp,
    deleteRetencionOp
  }
}

export default useServicesRetencionesOp