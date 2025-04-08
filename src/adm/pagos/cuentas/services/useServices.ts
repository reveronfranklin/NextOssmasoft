import { useCallback, useState } from "react"
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { UrlServices } from '../enums/urlServices.enum'
import {
    ResponseDto,
    CuentaFilterDto,
    CuentaResponseDto,
    CuentaDto,
    CuentaDeleteDto
} from '../interfaces'

const useServices = () => {
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const getList = useCallback(async (payload: CuentaFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<CuentaResponseDto>>(UrlServices.GET_MAESTRO_CUENTAS, payload)

            if (response.data.isValid) {
                return response.data
            }

            setMessage(response.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const store = useCallback(async (payload: CuentaDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<CuentaResponseDto>>(UrlServices.CREATE_MAESTRO_CUENTA, payload)

            if (response.data.isValid) {
                return response.data
            }

            setMessage(response.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const update = useCallback(async (payload: CuentaDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<CuentaResponseDto>>(UrlServices.UPDATE_MAESTRO_CUENTA, payload)

            if (response.data.isValid) {
                return response.data
            }

            setMessage(response.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const destroy = useCallback(async (payload: CuentaDeleteDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<CuentaResponseDto>>(UrlServices.DELETE_MAESTRO_CUENTA, payload)

            if (response.data.isValid) {
                return response.data
            }

            setMessage(response.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        error,
        message,
        loading,
        setMessage,
        getList,
        store,
        update,
        destroy
    }
}

export default useServices
