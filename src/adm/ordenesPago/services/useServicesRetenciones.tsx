import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"

import { IResponseGetRetenciones } from '../interfaces/responseRetenciones.interfaces'
import { ICreateRetencionOp, IResponseCreateRetencion } from '../interfaces/retenciones/createRetencionOp'
import { IUpdateRetencionOp, IResponseUpdateRetencion } from '../interfaces/retenciones/updateRetencionOp'
import { IDeleteRetencionOp, IResponseDeleteRetencion } from '../interfaces/retenciones/deleteRetencionOp'

interface IfilterByOrdenPago {
  codigoOrdenPago: number
}

const useServicesRetenciones = () => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const getRetencionesByOrdenPago = useCallback(async (filters: IfilterByOrdenPago): Promise<any> => {
    try {
      setLoading(true)
      const responseGetOrdenes = await ossmmasofApi.post<IResponseGetRetenciones>(UrlServices.GETRETENCIONESBYORDENPAGO, filters)

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

  const createRetencion = useCallback(async (filters: ICreateRetencionOp): Promise<any> => {
    try {
      setLoading(true)
      const responseCreateRetencion = await ossmmasofApi.post<IResponseCreateRetencion>(UrlServices.CREATERETENCIONES, filters)

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

  const updateRetencion = useCallback(async (filters: IUpdateRetencionOp): Promise<any> => {
    try {
      setLoading(true)
      const responseUpdateRetencion = await ossmmasofApi.post<IResponseUpdateRetencion>(UrlServices.UPDATERETENCIONES, filters)

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

  const deleteRetencion = useCallback(async (filters: IDeleteRetencionOp): Promise<any> => {
    try {
      setLoading(true)
      const responseDeleteRetencion = await ossmmasofApi.post<IResponseDeleteRetencion>(UrlServices.DELETERETENCIONES, filters)

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
    getRetencionesByOrdenPago,
    createRetencion,
    updateRetencion,
    deleteRetencion
  }
}

export default useServicesRetenciones