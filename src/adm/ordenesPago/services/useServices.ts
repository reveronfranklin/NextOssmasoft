import { useCallback, useState } from "react"
import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

import { FiltersGetOrdenes } from '../interfaces/filtersGetOrdenes.interfaces'
import { ResponseGetOrdenes } from '../interfaces/responseGetOrdenes.interfaces'
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { IUpdateFieldDto } from 'src/interfaces/rh/i-update-field-dto'

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers'
import { IApiResponse, IApiFlexibleResponse} from 'src/interfaces/api-response-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'
import { useQueryClient, QueryClient } from '@tanstack/react-query'

interface IFilterDesciptiva {
    tituloId: number
}

interface IfilterByOrdenPago {
    codigoOrdenPago: number,
    codigoPresupuesto?: number
}

import { IUpdateOrdenPago } from '../interfaces/updateOrdenPago.interfaces'
import { ICreateOrdenPago } from '../interfaces/createOrdenPago.interfaces'
import { IDeleteOrdenPago } from '../interfaces/deleteOrdenPago.interfaces'

import { IResponseListPucByOrden } from '../interfaces/responseListPucByOrden'
import { IResponseCompromisoByOrden } from '../interfaces/responseCompromisoByOrden'

const useServices = () => {
    const [error, setError] = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true,
    })
    const [loading, setLoading] = useState<boolean>(false)
    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    const queryClient: QueryClient = useQueryClient()

    const getCompromisoByPresupuesto = useCallback(async (filters: FiltersGetOrdenes): Promise<ResponseGetOrdenes | null> => {
        try {
            setLoading(true)
            const responseGetOrdenes = await ossmmasofApi.post<ResponseGetOrdenes>(UrlServices.GETCOMPROMISOSPENDIENTEBYPRESUPUESTO, filters)

            if (responseGetOrdenes.data.isValid) {
                setMessage(prev => ({
                    ...prev,
                    text: responseGetOrdenes.data.message || '',
                }))

                return responseGetOrdenes.data
            }

            setMessage(prev => ({
                ...prev,
                text: responseGetOrdenes.data.message || '',
                isValid: false,
            }))
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }

        return null
    }, [presupuestoSeleccionado.codigoPresupuesto])

    const getOrdenesPagoByPresupuesto = useCallback(async (filters: FiltersGetOrdenes): Promise<any> => {
        try {
            setLoading(true)
            const responseGetOrdenes = await ossmmasofApi.post<ResponseGetOrdenes>(UrlServices.GETORDENESPAGOBYPRESUPUESTO, filters)

            if (responseGetOrdenes.data.isValid) {
                return responseGetOrdenes.data
            }

            setMessage({
                ...message,
                text: responseGetOrdenes.data.message,
            })
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

            setMessage({
                ...message,
                text: responsePucOrdenPago.data.message,
            })
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const createOrden = useCallback(async (filters: ICreateOrdenPago): Promise<IApiFlexibleResponse<ICreateOrdenPago>> => {
        try {
            setLoading(true)
            const responseCreatetOrden = await ossmmasofApi.post<any>(UrlServices.CREATEORDENPAGO, filters)
            const responseHandleApi = handleApiResponse<ICreateOrdenPago>(responseCreatetOrden.data, 'Documento creado con éxito', setMessage, setError)

            return responseHandleApi
        } catch (e: any) {

            return handleApiError(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const updateOrden = useCallback(async (filters: IUpdateOrdenPago): Promise<IApiFlexibleResponse<IUpdateOrdenPago>> => {
        try {
            setLoading(true)
            const responseUpdateOrden = await ossmmasofApi.post<any>(UrlServices.UPDATEORDENPAGO, filters)
            const responseHandleApi = handleApiResponse<IUpdateOrdenPago>(responseUpdateOrden.data, 'Documento actualizado con éxito', setMessage, setError)

            return responseHandleApi
        } catch (e: any) {

            return handleApiError(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const deleteOrden = useCallback(async (filters: IDeleteOrdenPago): Promise<IApiResponse<IDeleteOrdenPago>> => {
        try {
            setLoading(true)
            const responseDeleteOrden = await ossmmasofApi.post<any>(UrlServices.DELETEORDENPAGO, filters)
            const responseHandleApi = handleApiResponse<IDeleteOrdenPago>(
                responseDeleteOrden.data,
                'ordenPago eliminado con éxito',
                setMessage,
                setError,
                queryClient,
                [['ordenesPagoTable']]
            )

            return responseHandleApi
        } catch (e: any) {

            return handleApiError(e)
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
            const responseGetCompromisoByOrden = await ossmmasofApi.post<IResponseCompromisoByOrden>(UrlServices.GETCOMPROMISOBYORDENPAGO , filters)
            const responseHandleApi = handleApiResponse<any>(responseGetCompromisoByOrden.data, 'Lista de compromisos', setMessage, setError)

            return responseHandleApi
        } catch (e: any) {

            return handleApiError(e)
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

            setMessage({
                ...message,
                text: responseGetOrdenes.data.message,
            })
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

            if (responseGetOrdenes.data.isValid) {
                setMessage(prev => ({
                    ...prev,
                    text: responseGetOrdenes.data.message || 'Acción realizada con éxito',
                    timestamp: Date.now(),
                }))

                return responseGetOrdenes.data
            }

            setMessage(prev => ({
                ...prev,
                text: responseGetOrdenes.data.message || 'Acción no realizada',
                timestamp: Date.now(),
                isValid: false,
            }))

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
        deleteOrden,
        fetchDescriptivaById,
        getCompromisoByOrden,
        getListPucByOrdenPago,
        fetchUpdatePucByOrdenPago
    }
}

export default useServices