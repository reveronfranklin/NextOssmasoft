import { useCallback, useState } from "react"
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'
import { createApiHandlers } from '../../utils/api-handlers';
import { UrlServices } from '../enums/UrlServices.enum'
import { IResponse, SisBancoResponseDto, SisBancoFilterDto, SisBancoCreateDto, SisBancoUpdateDto, SisBancoDeleteDto } from '../interfaces'

const useServices = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const { handleApiError, handleApiResponse } = createApiHandlers(setError, setMessage)

    const getList = useCallback(async (filters: SisBancoFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<IResponse<SisBancoResponseDto>>(UrlServices.GETMAESTROBANCO , filters)

            if (response?.data?.isValid === false) {
                return handleApiError(response?.data)
            }

            return handleApiResponse(response)
        } catch (e: any) {
            return handleApiError(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const store = useCallback(async (payload: SisBancoCreateDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<IResponse<SisBancoResponseDto>>(UrlServices.CREATEMAESTROBANCO, payload)
            const message   = 'Cuenta creada exitosamente'

            if (response?.data?.isValid === false) {
                return handleApiError(response?.data)
            }

            return handleApiResponse(response, message)
        } catch (e: any) {
            return handleApiError(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const update = useCallback(async (payload: SisBancoUpdateDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<IResponse<SisBancoResponseDto>>(UrlServices.UPDATEMAESTROBANCO, payload)
            const message   = 'Cuenta actualizada exitosamente'

            if (response?.data?.isValid === false) {
                return handleApiError(response?.data)
            }

            return handleApiResponse(response, message)
        } catch (e: any) {
            return handleApiError(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const remove = useCallback(async (payload: SisBancoDeleteDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<IResponse<SisBancoDeleteDto>>(UrlServices.DELETEMAESTROBANCO, payload)
            const message   = 'Cuenta eliminada exitosamente'

            if (response?.data?.isValid === false) {
                return handleApiError(response?.data)
            }

            return handleApiResponse(response, message)
        } catch (e: any) {
            return handleApiError(e)
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
        remove
    }
}

export default useServices