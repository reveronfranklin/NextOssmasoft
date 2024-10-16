import { useCallback, useState } from "react"
import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

import { FiltersGetOrdenes } from '../interfaces/filtersGetOrdenes.interfaces'
import { ResponseGetOrdenes } from '../interfaces/responseGetOrdenes.interfaces'
import { RootState } from "src/store"
import { useSelector } from "react-redux"

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

    const createOrden = useCallback(async (filters: any): Promise<any> => {
        console.log('createOrden', filters)
        // const responseGetOrden = await ossmmasofApi.post<any>(UrlServices.CREATEORDENPAGO, filters)
    }, [])

    const updateOrden = useCallback(async (filters: any): Promise<any> => {
        console.log('updateOrden', filters)
        //const responseUpdateOrden = await ossmmasofApi.post<any>(UrlServices.UPDATEORDENPAGO, filters)
    }, [])

    return {
        error, message, loading,
        presupuestoSeleccionado,
        getCompromisoByPresupuesto,
        getOrdenesPagoByPresupuesto,
        getPucOrdenPago,
        createOrden,
        updateOrden,
    }
}

export default useServices