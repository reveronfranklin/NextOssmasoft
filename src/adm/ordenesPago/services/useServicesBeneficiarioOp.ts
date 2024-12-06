import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"

import { useSelector } from "react-redux"
import { RootState } from "src/store"

import { IGetListByOrdenPago, IResponseGetBeneficiarioOp } from '../interfaces/admBeneficiarioOp/getListByOrdenPago.interfaces'
import { ICreateBeneficiarioOp, IResponseBenenficiarioOpCreate } from '../interfaces/admBeneficiarioOp/createBeneficiarioOp.interfaces'
import { IUpdateBeneficiarioOp, IResponseBenenficiarioOpUpdate } from '../interfaces/admBeneficiarioOp/updateBeneficiarioOp.interfaces'
import { IDeleteBeneficiarioOp, IResponseDeleteBeneficiario } from '../interfaces/admBeneficiarioOp/deleteBeneficiarioOp.interfaces'
import { IUpdateMontoBeneficiarioOp, IResponseBenenficiarioOpMontoUpdate } from '../interfaces/admBeneficiarioOp/updateMontoBeneficiarioOp.interfaces'

const useServicesBeneficiarioOp = () => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

  const getBeneficiarioOpByOrdenPago = useCallback(async (filters: IGetListByOrdenPago): Promise<any> => {
    try {
      setLoading(true)
      const responseGetOrdenes = await ossmmasofApi.post<IResponseGetBeneficiarioOp>(UrlServices.GETBENEFICIARIO, filters)

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

  const createBeneficiarioOp = useCallback(async (filters: ICreateBeneficiarioOp): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseCreateRetencion = await ossmmasofApi.post<IResponseBenenficiarioOpCreate>(UrlServices.CREATEBENEFICIARIO, filters)

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

  const updateBeneficiarioOp = useCallback(async (filters: IUpdateBeneficiarioOp): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseCreateRetencion = await ossmmasofApi.post<IResponseBenenficiarioOpUpdate>(UrlServices.UPDATEBENEFICIARIO, filters)

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

  const deleteBeneficiarioOp = useCallback(async (filters: IDeleteBeneficiarioOp): Promise<any> => {
    try {
      setLoading(true)
      setMessage('')
      const responseCreateRetencion = await ossmmasofApi.post<IResponseDeleteBeneficiario>(UrlServices.DELETEBENEFICIARIO, filters)

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

  const updateBeneficiarioOpMonto = useCallback(async (filters: IUpdateMontoBeneficiarioOp): Promise<any> => {
    try {
      console.log(filters)
      setLoading(true)
      setMessage('')
      const responseCreateRetencion = await ossmmasofApi.post<IResponseBenenficiarioOpMontoUpdate>(UrlServices.UPDATEBENEFICIARIOMONTO, filters)

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
  } , [])

  return {
    error, message, loading,
    presupuestoSeleccionado,
    getBeneficiarioOpByOrdenPago,
    updateBeneficiarioOpMonto,
    createBeneficiarioOp,
    updateBeneficiarioOp,
    deleteBeneficiarioOp
  }
}

export default useServicesBeneficiarioOp