import { useCallback, useState } from "react"
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Filters } from '../interfaces/filters.interfaces'
import { useSelector } from "react-redux"
import { RootState } from "src/store"
import { UrlServices } from '../enums/UrlServices.enum'
import { useDispatch } from 'react-redux'

import {
    setListTipoDeSolicitud,
    setListProveedores,
    setListTipoImpuesto,
    setListTipoUnidades,
    setTotalListPuc,
    setIsLoadingTableSolicitudGeneral
} from "src/store/apps/adm"

//import { IFilterPrePresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-presupuesto';
import { ITipoSolicitud } from 'src/adm/solicitudCompromiso/interfaces/tipoSolicitud.interfaces'
import { IsolicitudesCompromiso } from '../interfaces/ISolicitudCompromiso.interfaces'

import { Update } from '../interfaces/update.interfaces'
import { Delete } from '../interfaces/delete.interfaces'
import { Create } from '../interfaces/create.interfaces'

import { UpdateDetalle } from '../interfaces/detalle/update.interfaces'
import { CreateDetalle } from '../interfaces/detalle/create.interfaces'
import { DeleteDetalle } from '../interfaces/detalle/delete.interfaces'

import { fetchDataPreMtrUnidadEjecutora } from 'src/store/apps/presupuesto/thunks'
import { IDetalleSolicitudCompromiso } from "../interfaces/detalle/IDetalleSolicitudCompromiso.interfaces"

import { CreatePuc } from 'src/adm/solicitudCompromiso/interfaces/puc/create.interfaces'
import { DeletePuc } from 'src/adm/solicitudCompromiso/interfaces/puc/delete.interfaces'

import authConfig from 'src/configs/auth'

const useServices = (initialFilters: Filters = {}) => {
    const dispatch = useDispatch()
    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    const urlProduction = process.env.NEXT_PUBLIC_BASE_URL_API_NET_PRODUCTION
    const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET

    const [error, setError] = useState<string>('')
    const [mensaje] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [generateReport, setGenerateReport] = useState<boolean>(false)

    const fetchTableData = useCallback(async (filters = initialFilters) => {
        try {
            dispatch(setIsLoadingTableSolicitudGeneral(true))
            const response = await ossmmasofApi.post<IsolicitudesCompromiso>(UrlServices.GETBYPRESUPUESTO, filters)

            return response?.data
        } catch (e: any) {
            setError(e)
        } finally {
            dispatch(setIsLoadingTableSolicitudGeneral(false))
        }
    }, [presupuestoSeleccionado.codigoPresupuesto])

    const fetchSolicitudCompromiso = useCallback(async () => {
        try {
            const filter = { tituloId: 35 }
            const response = await ossmmasofApi.post<any>(UrlServices.DESCRIPTIVAS , filter)

            if (response.data.isValid) {
                dispatch(setListTipoDeSolicitud(response.data.data as ITipoSolicitud[]))
            }

            return response.data

        } catch (e: any) {
            setError(e)
        }
    }, [])

    const fetchTipoImpuesto = useCallback(async () => {
        try {
            const filter = { tituloId: 18 }
            const response = await ossmmasofApi.post<any>(UrlServices.DESCRIPTIVAS , filter)

            if (response.data.isValid) {
                dispatch(setListTipoImpuesto(response.data ))
            }

            return response.data

        } catch (e: any) {
            setError(e)
            console.error(e)
        }
    }, [])

    const fetchTipoUnidades = useCallback(async () => {
        try {
            const filter = { tituloId: 21 }
            const response = await ossmmasofApi.post<any>(UrlServices.DESCRIPTIVAS , filter)

            if (response.data.isValid) {
                dispatch(setListTipoUnidades(response.data ))
            }

            return response.data

        } catch (e: any) {
            setError(e)
            console.error(e)
        }
    }, [])

    const fetchProveedores = useCallback(async () => {
        try {
            const response = await ossmmasofApi.get<any>(UrlServices.PROVEEDORES)

            if (response.data.isValid) {
                dispatch(setListProveedores(response.data.data))
            }

            return response.data

        } catch (e :any) {
            setError(e)
            console.error(e)
        }
    }, [])

    const updateSolicitudCompromiso = async (data: Update) => {
        try {

            return await ossmmasofApi.post<any>(UrlServices.UPDATE, data)

        } catch (e) {
            console.error(`updateSolicitudCompromiso:> ${e}`)
        }
    }

    const eliminarSolicitudCompromiso = async (data: Delete) => {
        try {

            return await ossmmasofApi.post<any>(UrlServices.DELETE, data)

        } catch (e) {
            console.error(e)
        }
    }

    const crearSolicitudCompromiso = async (data: Create) => {
        try {

            return await ossmmasofApi.post<any>(UrlServices.CREATE, data)

        } catch (e) {
            console.error(e)
        }
    }

    const unidadEjecutora = async () => {
        try {
            const filter: any = {
                codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto
            }

            await fetchDataPreMtrUnidadEjecutora(dispatch, filter)

        } catch (e) {
            console.error(e)
        }
    }

    const getListProducts = async (filters: any) => {
        try {
            const listProducts = await ossmmasofApi.post<any>(UrlServices.GETLISTPRODUCTOS, filters)

            return listProducts.data

        } catch (e: any) {
            setError(e)
            console.error(e)
        }
    }

    const fetchUpdateProducts = async (data: any) => {
        try {

            return await ossmmasofApi.post<any>(UrlServices.UPDATEPRODUCTOS, data)

        } catch (e) {
            console.error(e)
        }
    }

    const getDetalleSolicitudFetchTable = async (codigoSolicitud: number) => {
        try {
            const filter = { codigoSolicitud }

            const response = await ossmmasofApi.post<IDetalleSolicitudCompromiso>(UrlServices.DETALLESOLICITUD, filter)

            return response?.data

        } catch (e: any) {
            setError(e)
            console.error(e)
        }
    }

    const fetchUpdateDetalleSolicitudCompromiso = async (data: UpdateDetalle) => {
        try {

            return await ossmmasofApi.post<any>(UrlServices.DETALLEUPDATE, data)
        } catch (e) {
            console.error(e)
        }
    }

    const fetchCreateDetalleSolicitudCompromiso = async (data: CreateDetalle) => {
        try {

            return await ossmmasofApi.post<any>(UrlServices.DETALLECREATE, data)
        } catch (e) {
            console.error(e)
        }
    }

    const fetchDeleteDetalleSolicitudCompromiso = async (data: DeleteDetalle) => {
        try {

            return await ossmmasofApi.post<any>(UrlServices.DETALLEDELETE, data)
        } catch (e) {
            console.error(e)
        }
    }

    const fetchPucDetalleSolicitud = async (codigoDetalleSolicitud: number) => {
        try {
            const filter = { codigoDetalleSolicitud }

            const response = await ossmmasofApi.post<any>(UrlServices.GETPUCDETALLE, filter)

            dispatch(setTotalListPuc(response?.data?.total1))

            return response
        } catch (e: any) {
            setError(e)
            console.error(e)
        }
    }

    const fetchPucCreate = async (data: CreatePuc) => {
        try {
            if (!presupuestoSeleccionado){
                console.error('No se ha seleccionado un presupuesto')

                return
            }

            data.codigoPresupuesto = presupuestoSeleccionado?.codigoPresupuesto

            return await ossmmasofApi.post<any>(UrlServices.PUCDETALLECREATE , data)
        } catch (e) {
            console.error(e)
        }
    }

    const fetchPucDelete = async (data: DeletePuc) => {
        try {

            return await ossmmasofApi.post<any>(UrlServices.PUCDETALLEDELETE , data)
        } catch (e) {
            console.error(e)
        }
    }

    const fetchSolicitudReportData = async (filter: any) => {
        try {
            setGenerateReport(true)
            const response = await ossmmasofApi.post<any>(UrlServices.GENERATEURLREPORT, filter)

            return response.data
        } catch (e: any) {
            setError(e)
            console.error(e)
        } finally {
            setGenerateReport(false)
        }
    }

    const downloadReportByName = async (nameReport: string) => {
        try {
            const urlBase: string | undefined = !authConfig.isProduction ? urlDevelopment : urlProduction
            const url = `${urlBase}${UrlServices.GETREPORTBYURL}/${nameReport}`

            const response = await fetch(url)
            const blob = await response.blob()
            const objectURL = URL.createObjectURL(blob)
            const newTab = window.open(objectURL, '_blank')

            if (!newTab) {
                throw new Error('El bloqueador de ventanas emergentes está activado. Por favor, habilite las ventanas emergentes para abrir el informe.')
            }
        } catch (e: any) {
            setError(e)
            console.error(e)
        }
    }

    const aprobarSolicitud = async (codigoSolicitud: number) => {
        try {
            setLoading(true)
            const filter = { codigoSolicitud }

            return await ossmmasofApi.post<any>(UrlServices.APROBARSOLICITUD, filter)
        } catch (e: any) {
            setError(e)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const anularSolicitud = async (codigoSolicitud: number) => {
        try {
            setLoading(true)
            const filter = { codigoSolicitud }

            return await ossmmasofApi.post<any>(UrlServices.ANULARSOLICITUD, filter)
        } catch (e: any) {
            setError(e)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return { error, mensaje, loading,
        fetchTableData,
        fetchProveedores,
        fetchSolicitudCompromiso,
        updateSolicitudCompromiso,
        eliminarSolicitudCompromiso,
        crearSolicitudCompromiso,
        unidadEjecutora,
        getDetalleSolicitudFetchTable,
        presupuestoSeleccionado,
        fetchTipoImpuesto,
        fetchTipoUnidades,
        fetchUpdateDetalleSolicitudCompromiso,
        fetchCreateDetalleSolicitudCompromiso,
        fetchDeleteDetalleSolicitudCompromiso,
        getListProducts,
        fetchUpdateProducts,
        fetchPucDetalleSolicitud,
        fetchPucCreate,
        fetchPucDelete,
        fetchSolicitudReportData,
        downloadReportByName,
        generateReport,
        aprobarSolicitud,
        anularSolicitud,
    }
}

export default useServices