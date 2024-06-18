import { useCallback, useState } from "react"
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Filters } from '../interfaces/filters.interfaces'
import { useSelector } from "react-redux"
import { RootState } from "src/store"
import { UrlServices } from '../enums/UrlServices.enum'

import { useDispatch } from 'react-redux'
import { setListTipoDeSolicitud, setListProveedores } from "src/store/apps/adm"

import { IFilterPrePresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-presupuesto';
import { ITipoSolicitud } from 'src/adm/solicitudCompromiso/interfaces/tipoSolicitud.interfaces'
import { IsolicitudesCompromiso } from '../interfaces/ISolicitudCompromiso.interfaces'

import { Update } from '../interfaces/update.interfaces'
import { Delete } from '../interfaces/delete.interfaces'
import { Create } from '../interfaces/create.interfaces'

import { fetchDataPreMtrUnidadEjecutora } from 'src/store/apps/presupuesto/thunks'

const useServices = (initialFilters: Filters = {}) => {
    const dispatch = useDispatch()
    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    const [error, setError] = useState<string>('')
    const [mensaje] = useState<string>('')
    const [loading] = useState(false)

    //Get la tabla DataGrid
    const fetchTableData = useCallback(async (filters = initialFilters) => {
        try {
            filters.CodigoPresupuesto = presupuestoSeleccionado?.codigoPresupuesto
            const fetchData = await ossmmasofApi.post<IsolicitudesCompromiso>(UrlServices.GETBYPRESUPUESTO, filters)

            return fetchData.data

        } catch (e: any) {
            setError(e)
            console.error(e)
        }
    }, [presupuestoSeleccionado.codigoPresupuesto])

    //Get tipos de Solicitudes Compromiso
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
            console.log(e)
        }
    }, [])

    //Get Proveedores
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

    //Update Solicitud Compromiso
    const updateSolicitudCompromiso = async (data: Update) => {
        try {
            return await ossmmasofApi.post<any>(UrlServices.UPDATE, data)
        } catch (e) {
            console.error(`updateSolicitudCompromiso:> ${e}`)
        }
    }

    //Delete Solicitud Compromiso
    const eliminarSolicitudCompromiso = async (data: Delete) => {
        try {
            return await ossmmasofApi.post<any>(UrlServices.DELETE, data)
        } catch (e) {
            console.error(e)
        }
    }

    //Create Solicitud Compromiso
    const crearSolicitudCompromiso = async (data: Create) => {
        try {
            return await ossmmasofApi.post<any>(UrlServices.CREATE, data)
        } catch (e) {
            console.error(e)
        }
    }

    const unidadEjecutora = async () => {
        try {
            const filter: IFilterPrePresupuestoDto = {
                codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto
            }

            await fetchDataPreMtrUnidadEjecutora(dispatch, filter)

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
        presupuestoSeleccionado,
    }
}

export default useServices