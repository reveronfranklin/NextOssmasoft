import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"

import { useSelector } from "react-redux"
import { RootState } from "src/store"

// import { IResponseGetRetenciones } from '../interfaces/responseRetenciones.interfaces'
import { ICreateRetencion, IResponseCreateRetencion } from '../interfaces/retenciones/createRetencion'
import { IUpdateRetencion, IResponseUpdateRetencion } from '../interfaces/retenciones/updateRetencion'
import { IDeleteRetencion, IResponseDeleteRetencion } from '../interfaces/retenciones/deleteRetencion'

// interface IfilterByOrdenPago {
//   codigoOrdenPago: number
// }

const useServicesRetencionesOp = () => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

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
  }, [])

  const createRetencion = useCallback(async (filters: ICreateRetencion): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseCreateRetencion = await ossmmasofApi.post<IResponseCreateRetencion>(UrlServices.CREATEADMRETENCIONES , filters)

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

  const updateRetencion = useCallback(async (filters: IUpdateRetencion): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseUpdateRetencion = await ossmmasofApi.post<IResponseUpdateRetencion>(UrlServices.UPDATEADMRETENCIONES , filters)

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

  const deleteRetencion = useCallback(async (filters: IDeleteRetencion): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseDeleteRetencion = await ossmmasofApi.post<IResponseDeleteRetencion>(UrlServices.DELETEADMRETENCIONES, filters)

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
    getRetenciones,
    createRetencion,
    updateRetencion,
    deleteRetencion
  }
}

export default useServicesRetencionesOp