import { useCallback, useState, useEffect } from "react"
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { Filters } from '../interfaces/filters.interfaces'
import { IsolicitudCompromiso } from '../interfaces/solicitudCompromiso.interfaces'

const useServices = (initialFilters: Filters = {}) => {
    const [rows, setRows]         = useState<any[]>([])
    const [total, setTotal]       = useState<number>(0)
    const [error, setError]       = useState(null);
    const [mensaje, setMensaje]   = useState<string>('')
    const [loading, setIsLoading] = useState(false);

    const fetchTableData = useCallback(async (route = '', filters = initialFilters) => {
        setError(null)
        setIsLoading(true)

        try {
            const fetchData = await ossmmasofApi.post<IsolicitudCompromiso>(route, filters)
            const response = fetchData.data

            if (response.isValid ) {
                setRows(response.data)
                setTotal(response.cantidadRegistros )
            }

            setMensaje(response.message)
        } catch (e: any) {
            setError(e)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTableData()
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