import { useCallback, useState, useEffect } from "react"
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Filters } from '../interfaces/filters.interfaces'
import { useSelector } from "react-redux"
import { RootState } from "src/store"
import { UrlServices } from '../enums/UrlServices.enum'

import { useDispatch } from 'react-redux'
import { setListTipoDeSolicitud, setListProveedores } from "src/store/apps/adm"

import { ITipoSolicitud } from 'src/adm/solicitudCompromiso/interfaces/tipoSolicitud.interfaces'
import { IsolicitudCompromiso } from '../interfaces/ISolicitudCompromiso.interfaces'
import { SolicitudCompromiso } from '../interfaces/SolicitudCompromiso.interfaces'

const useServices = (initialFilters: Filters = {}) => {
    const dispatch = useDispatch()

    const [rows, setRows]         = useState<any[]>([])
    const [total, setTotal]       = useState<number>(0)
    const [error, setError]       = useState(null)
    const [mensaje, setMensaje]   = useState<string>('')
    
    const [loading, setIsLoading] = useState(false)
    const [loadingDataGrid, setLoadingDataGrid] = useState(false)

    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    const fetchTableData = useCallback(async (filters = initialFilters) => {
        setError(null)
        setLoadingDataGrid(true)
        try {
            // filters.CodigoPresupuesto = presupuestoSeleccionado.codigoPresupuesto
            const fetchData = await ossmmasofApi.post<IsolicitudCompromiso>(UrlServices.GETBYPRESUPUESTO, filters)
            const response = fetchData.data

            if (response.isValid ) {
                setRows(response.data)
                setTotal(response.cantidadRegistros )
                setLoadingDataGrid(false)
            }

            setMensaje(response.message)
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
        } catch (e) {
            console.log(e)
        }
    }, [])

    const fetchProveedores = useCallback(async () => {
        try {
            const response = await ossmmasofApi.get<any>(UrlServices.PROVEEDORES)

            if (response.data.isValid) {
                dispatch(setListProveedores(response.data.data))
            }
        } catch (e) {
            console.error(e)
        }
    }, [])

    const updateSolicitudCompromiso = async (data: SolicitudCompromiso) => {
        try {
            setIsLoading(true)
            const response = await ossmmasofApi.post<any>(UrlServices.UPDATE, data)
            if (response.data.isValid) {
                fetchTableData()
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const eliminarSolicitudCompromiso = async (id: number) => {
        try {
            setIsLoading(true)
            const response = await ossmmasofApi.post<any>(UrlServices.DELETE, { CodigoSolicitud : id })
            if (response.data.isValid) {
                fetchTableData()
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const crearSolicitudCompromiso = async (data: SolicitudCompromiso) => {
        try {
            setIsLoading(true)
            const response = await ossmmasofApi.post<any>(UrlServices.CREATE, data)
            if (response.data.isValid) {
                fetchTableData()
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchData = () => {
            fetchTableData(),
            fetchSolicitudCompromiso()
            fetchProveedores()
        }
        fetchData()
    }, [])

    return {
        rows,
        total,
        error,
        mensaje,
        loading,
        loadingDataGrid,
        fetchTableData,
        updateSolicitudCompromiso,
        eliminarSolicitudCompromiso,
        crearSolicitudCompromiso
    }
}

export default useServices