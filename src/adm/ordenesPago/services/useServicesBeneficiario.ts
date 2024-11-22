import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"

import { useSelector } from "react-redux"
import { RootState } from "src/store"

// import { IResponseGetRetenciones } from '../interfaces/responseRetenciones.interfaces'
import { ICreateBenenficiarioOp, IResponseCreateBenenficiario } from '../interfaces/admBeneficiario/createBenenficiarioOp.interfaces'
import { IUpdateBenenficiarioOp, IResponseUpdateBenenficiario } from '../interfaces/admBeneficiario/updateBenenficiarioOp.interfaces'
import { IDeleteBenenficiarioOp, IResponseDeleteBeneficiario } from '../interfaces/admBeneficiario/deleteBenenficiarioOp.interfaces'

const useServicesBeneficiario = () => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

  const getBeneficiarioByOrdenPago = useCallback(async (filters: any): Promise<any> => {
    try {
      setLoading(true)
      const responseGetOrdenes = await ossmmasofApi.post(UrlServices.GETBENEFICIARIO, filters)

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

  const createBeneficiario = useCallback(async (filters: any): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseCreateRetencion = await ossmmasofApi.post(UrlServices.CREATEBENEFICIARIO, filters)

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

  const updateBeneficiario = useCallback(async (filters: any): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseCreateRetencion = await ossmmasofApi.post(UrlServices.UPDATEBENEFICIARIO, filters)

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

  const deleteBeneficiario = useCallback(async (filters: any): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseCreateRetencion = await ossmmasofApi.post(UrlServices.DELETEBENEFICIARIO, filters)

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

  return {
    error, message, loading,
    presupuestoSeleccionado,
    getBeneficiarioByOrdenPago,
    createBeneficiario,
    updateBeneficiario,
    deleteBeneficiario
  }
}

export default useServicesBeneficiario