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
    setListTipoUnidades
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

const useServices = (initialFilters: Filters = {}) => {
    const dispatch = useDispatch()
    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    const [error, setError] = useState<string>('')
    const [mensaje] = useState<string>('')
    const [loading] = useState(false)

    const fetchTableData = useCallback(async (filters = initialFilters) => {
        try {
            const fetchData = await ossmmasofApi.post<IsolicitudesCompromiso>(UrlServices.GETBYPRESUPUESTO, filters)

            return fetchData.data

        } catch (e: any) {
            setError(e)
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
            console.log('getListProducts', filters)
            const listProducts = await ossmmasofApi.post<any>(UrlServices.GETLISTPRODUCTOS, filters)

            return listProducts.data

        } catch (e: any) {
            setError(e)
            console.error(e)
        }
    }

    const getDetalleSolicitudFetchTable = async (codigoSolicitud: number) => {
        try {
            const filter = { codigoSolicitud }

            return await ossmmasofApi.post<IDetalleSolicitudCompromiso>(UrlServices.DETALLESOLICITUD, filter)

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
            console.log('filter', filter)
            const filterTest = { codigoDetalleSolicitud: 49172 }

            return await ossmmasofApi.post<any>(UrlServices.GETPUCDETALLE, filterTest)

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

    return {error, mensaje, loading,
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
        fetchPucDetalleSolicitud,
        fetchPucCreate,
        fetchPucDelete
    }
}

export default useServices