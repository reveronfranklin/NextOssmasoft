import { useCallback, useState, useEffect } from "react"
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Filters } from '../interfaces/filters.interfaces'
import { IsolicitudCompromiso } from '../interfaces/solicitudCompromiso.interfaces'
import { useSelector } from "react-redux"
import { RootState } from "src/store"

import { useDispatch } from 'react-redux'
import { setListTipoDeSolicitud } from "src/store/apps/adm"

interface ITipoSolicitud {
    id: number
    descripcion: string
}

const useServices = (initialFilters: Filters = {}) => {
    const dispatch = useDispatch() 

    const [rows, setRows]         = useState<any[]>([])
    const [total, setTotal]       = useState<number>(0)
    const [error, setError]       = useState(null)
    const [mensaje, setMensaje]   = useState<string>('')
    const [loading, setIsLoading] = useState(false)

    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    const fetchTableData = useCallback(async (route: string | null = null, filters = initialFilters) => {
        setError(null)
        setIsLoading(true)
        try {
            // filters.CodigoPresupuesto = presupuestoSeleccionado.codigoPresupuesto
            filters.CodigoPresupuesto = 17
            if (route) {
                console.log('filters', filters)
                const fetchData = await ossmmasofApi.post<IsolicitudCompromiso>(route, filters)
                const response = fetchData.data

                if (response.isValid ) {
                    setRows(response.data)
                    setTotal(response.cantidadRegistros )
                }

                setMensaje(response.message)
            }
        } catch (e: any) {
            setError(e)
        } finally {
            setIsLoading(false)
        }
    }, [presupuestoSeleccionado.codigoPresupuesto])

    const fetchSolicitudCompromiso = useCallback(async () => {
        const filter = { tituloId: 35 }
        const route = '/AdmDescriptivas/GetSelectDescriptiva'

        const response = await ossmmasofApi.post<any>(route, filter)
        if (response.data.isValid) {
            dispatch(setListTipoDeSolicitud(response.data.data))
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await fetchTableData(),
            await fetchSolicitudCompromiso()
        }
        fetchData().then()
    }, [])

    return {
        rows,
        total,
        error,
        mensaje,
        loading,
        fetchTableData
    }
}

export default useServices