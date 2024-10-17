import { useCallback, useState } from "react"
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { FetchGetAll } from "../interfaces/fetchGetAll.interfaces"
import { FiltersGetReportName } from '../interfaces/filtersGetReportName.interfaces'
import { ResponseGetAll } from "../interfaces/responseGetAll.interfaces"
import { UrlServices } from '../enums/UrlsServices.enums'
import { useSelector } from "react-redux"
import { RootState } from "src/store"
import { UpdateCompromiso } from "../interfaces/updateCompromiso.interfaces"

const useServices = () => {
    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    const actualizarCompromiso = useCallback(async (filterUpdateCompromiso: UpdateCompromiso) => {
        try {
            setLoading(true)

            const response = await ossmmasofApi.post<ResponseGetAll>(UrlServices.ACTUALIZARCOMPROMISO, filterUpdateCompromiso)

            if (response && response?.data.isValid) {

                return response?.data
            }

            setMessage(response?.data.message)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchGetAll = useCallback(async (fetchGetAll: FetchGetAll) => {
        try {
            setLoading(true)

            const response = await ossmmasofApi.post<ResponseGetAll>(UrlServices.GETCOMPROMISOSBYPRESUPUESTO, fetchGetAll)

            if (response && response?.data.isValid) {

                return response?.data
            }

            setMessage(response?.data.message)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [presupuestoSeleccionado.codigoPresupuesto])

    const anularCompromiso = useCallback(async (codigoCompromiso: string) => {
        try {
            setLoading(true)

            const response = await ossmmasofApi.post<ResponseGetAll>(UrlServices.ANULARCOMPROMISO, { codigoCompromiso })

            if (response && response?.data?.isValid) {

                return response?.data
            }

            setMessage(response?.data.message)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [])

    const aprobarCompromiso = useCallback(async (codigoCompromiso: string) => {
        try {
            setLoading(true)

            const response = await ossmmasofApi.post<ResponseGetAll>(UrlServices.APROBARCOMPROMISO, { codigoCompromiso })

            if (response && response?.data.isValid) {

                return response?.data
            }

            setMessage(response?.data.message)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [])

    const getReportName = async (filters: FiltersGetReportName) => {
        try {

            return await ossmmasofApi.post<any>(UrlServices.GETREPORTNAME, filters)
        } catch (error) {
            console.error(error)
        }
    }

    return {
        loading, message,
        presupuestoSeleccionado,
        fetchGetAll,
        anularCompromiso,
        aprobarCompromiso,
        getReportName,
        actualizarCompromiso,
    }
}

export default useServices