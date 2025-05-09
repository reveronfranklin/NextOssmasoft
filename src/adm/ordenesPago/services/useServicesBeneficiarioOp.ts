import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"

import { useSelector } from "react-redux"
import { RootState } from "src/store"
import { useDispatch } from 'react-redux'

import { IGetListByOrdenPago, IBeneficiarioOp } from '../interfaces/admBeneficiarioOp/getListByOrdenPago.interfaces'
import { ICreateBeneficiarioOp } from '../interfaces/admBeneficiarioOp/createBeneficiarioOp.interfaces'
import { IUpdateBeneficiarioOp } from '../interfaces/admBeneficiarioOp/updateBeneficiarioOp.interfaces'
import { IDeleteBeneficiarioOp } from '../interfaces/admBeneficiarioOp/deleteBeneficiarioOp.interfaces'
import { IUpdateMontoBeneficiarioOp } from '../interfaces/admBeneficiarioOp/updateMontoBeneficiarioOp.interfaces'

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers'
import { IResponseBase } from 'src/interfaces/response-base-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'
import { IApiResponse } from 'src/interfaces/api-response-dto'

const useServicesBeneficiarioOp = () => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<IAlertMessageDto>({
    text: '',
    timestamp: Date.now(),
    isValid: true,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

  const getBeneficiarioOpByOrdenPago = useCallback(async (filters: IGetListByOrdenPago): Promise<IApiResponse<IBeneficiarioOp>> => {
    try {
      setLoading(true)

      const responseGetOrdenes = await ossmmasofApi.post<IResponseBase<IBeneficiarioOp>>(UrlServices.GETBENEFICIARIO, filters)
      const responseHandleApi = handleApiResponse<IBeneficiarioOp>(responseGetOrdenes.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const createBeneficiarioOp = useCallback(async (filters: ICreateBeneficiarioOp): Promise<IApiResponse<ICreateBeneficiarioOp>> => {
    try {
      setLoading(true)
      const responseCreateRetencion = await ossmmasofApi.post<IResponseBase<ICreateBeneficiarioOp>>(UrlServices.CREATEBENEFICIARIO, filters)
      const responseHandleApi = handleApiResponse<ICreateBeneficiarioOp>(responseCreateRetencion.data, 'Beneficiario creado con éxito', setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const updateBeneficiarioOp = useCallback(async (filters: IUpdateBeneficiarioOp): Promise<IApiResponse<IUpdateBeneficiarioOp>> => {
    try {
      setLoading(true)

      const responseCreateRetencion = await ossmmasofApi.post<IResponseBase<IUpdateBeneficiarioOp>>(UrlServices.UPDATEBENEFICIARIO, filters)
      const responseHandleApi = handleApiResponse<IUpdateBeneficiarioOp>(responseCreateRetencion.data, 'Beneficiario actualizado con éxito', setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const deleteBeneficiarioOp = useCallback(async (filters: IDeleteBeneficiarioOp): Promise<IApiResponse<IDeleteBeneficiarioOp>> => {
    try {
      setLoading(true)

      const responseCreateRetencion = await ossmmasofApi.post<IResponseBase<IDeleteBeneficiarioOp>>(UrlServices.DELETEBENEFICIARIO, filters)
      const responseHandleApi = handleApiResponse<IDeleteBeneficiarioOp>(responseCreateRetencion.data, 'Beneficiario eliminado con éxito', setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const updateBeneficiarioOpMonto = useCallback(async (filters: IUpdateMontoBeneficiarioOp): Promise<IApiResponse<IUpdateMontoBeneficiarioOp>> => {
    try {
      setLoading(true)

      const responseCreateRetencion = await ossmmasofApi.post<IResponseBase<IUpdateMontoBeneficiarioOp>>(UrlServices.UPDATEBENEFICIARIOMONTO, filters)
      const responseHandleApi = handleApiResponse<IUpdateMontoBeneficiarioOp>(responseCreateRetencion.data, 'Monto actualizado con éxito', setMessage, setError)

      return responseHandleApi
    } catch (e: any) {

      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  } , [dispatch])

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