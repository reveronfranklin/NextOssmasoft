import { useCallback, useState } from "react"
import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

import { FiltersGetOrdenes } from '../interfaces/filtersGetOrdenes.interfaces'
import { ResponseGetOrdenes } from '../interfaces/responseGetOrdenes.interfaces'
import { RootState } from "src/store"
import { useSelector } from "react-redux"

import { IUpdateFieldDto } from 'src/interfaces/rh/i-update-field-dto'

interface IFilterDesciptiva {
    tituloId: number
}

interface IfilterByOrdenPago {
    codigoOrdenPago: number
}

import { IUpdateOrdenPago } from '../interfaces/updateOrdenPago.interfaces'
import { ICreateOrdenPago } from '../interfaces/createOrdenPago.interfaces'

import { IResponseListPucByOrden } from '../interfaces/responseListPucByOrden'
import { IResponseCompromisoByOrden } from '../interfaces/responseCompromisoByOrden'

const useServices = () => {
    const [error, setError] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    const getCompromisoByPresupuesto = useCallback(async (filters: FiltersGetOrdenes): Promise<any> => {
        try {
            setLoading(true)
            const responseGetOrdenes = await ossmmasofApi.post<ResponseGetOrdenes>(UrlServices.GETCOMPROMISOSBYPRESUPUESTO, filters)

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
    }, [presupuestoSeleccionado.codigoPresupuesto])

    const getOrdenesPagoByPresupuesto = useCallback(async (filters: FiltersGetOrdenes): Promise<any> => {
        try {
            setLoading(true)
            const responseGetOrdenes = await ossmmasofApi.post<ResponseGetOrdenes>(UrlServices.GETORDENESPAGOBYPRESUPUESTO, filters)

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
    }, [presupuestoSeleccionado.codigoPresupuesto])

    const getPucOrdenPago = useCallback(async (codigoOrdenPago: number): Promise<any> => {
        try {
            setLoading(true)
            const responsePucOrdenPago = await ossmmasofApi.post<any>(UrlServices.GETPUCORDENPAGO, { codigoOrdenPago })

            if (responsePucOrdenPago.data.isValid) {
                return responsePucOrdenPago.data
            }
            setMessage(responsePucOrdenPago.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const createOrden = useCallback(async (filters: ICreateOrdenPago): Promise<any> => {
        try {
            setLoading(true)
            const responseCreatetOrden = await ossmmasofApi.post<any>(UrlServices.CREATEORDENPAGO, filters)

            if (responseCreatetOrden.data.isValid) {
                return responseCreatetOrden.data
            }
            setMessage(responseCreatetOrden.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const updateOrden = useCallback(async (filters: IUpdateOrdenPago): Promise<any> => {
        try {
            setLoading(true)
            const responseUpdateOrden = await ossmmasofApi.post<any>(UrlServices.UPDATEORDENPAGO, filters)

            if (responseUpdateOrden.data.isValid) {
                return responseUpdateOrden.data
            }

            setMessage(responseUpdateOrden.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchDescriptivaById = useCallback(async (filter: IFilterDesciptiva) => {
        try {
            const response = await ossmmasofApi.post<any>(UrlServices.DESCRIPTIVAS , filter)

            return response.data

        } catch (e: any) {
            setError(e)
            console.error(e)
        }
    }, [])

    const getCompromisoByOrden = useCallback(async (filters: IfilterByOrdenPago): Promise<any> => {
        try {
            setLoading(true)
            const responseGetOrdenes = await ossmmasofApi.post<IResponseCompromisoByOrden>(UrlServices.GETCOMPROMISOBYORDENPAGO , filters)

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

    const getListPucByOrdenPago = useCallback(async (filters: IfilterByOrdenPago): Promise<any> => {
        try {
            setLoading(true)
            const responseGetOrdenes = await ossmmasofApi.post<IResponseListPucByOrden>(UrlServices.LISTPUCBYORDENPAGO , filters)

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

    const fetchUpdatePucByOrdenPago = useCallback(async (filters: IUpdateFieldDto): Promise<any> => {
        try {
            setLoading(true)
            const responseGetOrdenes = await ossmmasofApi.post<any>(UrlServices.UPDATEPUCBYORDENPAGO , filters)
            setMessage(responseGetOrdenes.data.message)

            return responseGetOrdenes
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
        getCompromisoByPresupuesto,
        getOrdenesPagoByPresupuesto,
        getPucOrdenPago,
        createOrden,
        updateOrden,
        fetchDescriptivaById,
        getCompromisoByOrden,
        getListPucByOrdenPago,
        fetchUpdatePucByOrdenPago
    }
}

export default useServices