import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"

import { useSelector } from "react-redux"
import { RootState } from "src/store"

import { IResponseGetRetenciones } from '../interfaces/responseRetenciones.interfaces'
import { ICreateRetencionOp, IResponseCreateRetencion } from '../interfaces/retencionesOp/createRetencionOp'
import { IUpdateRetencionOp, IResponseUpdateRetencion } from '../interfaces/retencionesOp/updateRetencionOp'
import { IDeleteRetencionOp, IResponseDeleteRetencion } from '../interfaces/retencionesOp/deleteRetencionOp'

interface IfilterByOrdenPago {
  codigoOrdenPago: number
}

const useServicesRetencionesOp = (): {
  error: string,
  message: string,
  loading: boolean,
  presupuestoSeleccionado: any,
  getRetencionesOpByOrdenPago: (filters: IfilterByOrdenPago) => Promise<any>,
  createRetencionOp: (filters: ICreateRetencionOp) => Promise<any>,
  updateRetencionOp: (filters: IUpdateRetencionOp) => Promise<any>,
  deleteRetencionOp: (filters: IDeleteRetencionOp) => Promise<any>
} => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

  const getRetencionesOpByOrdenPago = useCallback(async (filters: IfilterByOrdenPago): Promise<any> => {
    try {
      setLoading(true)
      const responseGetOrdenes = await ossmmasofApi.post<IResponseGetRetenciones>(UrlServices.GETRETENCIONESOPBYORDENPAGO, filters)

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
  }, [])

  const createRetencionOp = useCallback(async (filters: ICreateRetencionOp): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseCreateRetencion = await ossmmasofApi.post<IResponseCreateRetencion>(UrlServices.CREATERETENCIONESOP, filters)

      if (responseCreateRetencion.data.isValid) {
        return responseCreateRetencion.data
      }
      setMessage(responseCreateRetencion.data.message)
    } catch (e: any) {
      setError(e.message)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRetencionOp = useCallback(async (filters: IUpdateRetencionOp): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseUpdateRetencion = await ossmmasofApi.post<IResponseUpdateRetencion>(UrlServices.UPDATERETENCIONESOP, filters)

      if (responseUpdateRetencion.data.isValid) {
        return responseUpdateRetencion.data
      }
      setMessage(responseUpdateRetencion.data.message)
    } catch (e: any) {
      setError(e.message)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRetencionOp = useCallback(async (filters: IDeleteRetencionOp): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseDeleteRetencion = await ossmmasofApi.post<IResponseDeleteRetencion>(UrlServices.DELETERETENCIONESOP, filters)

      if (responseDeleteRetencion.data.isValid) {
        return responseDeleteRetencion.data
      }

      setMessage(responseDeleteRetencion.data.message)
    } catch (e: any) {
      setError(e.message)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

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