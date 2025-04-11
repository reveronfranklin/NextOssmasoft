import { useCallback, useState } from 'react';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { UrlServices } from '../enums/UrlServices.enum';
import {
    IResponse,
    SisBancoResponseDto,
    SisBancoFilterDto,
    SisBancoCreateDto,
    SisBancoUpdateDto,
    SisBancoDeleteDto
} from '../interfaces';

const useServices = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const getList = useCallback(async (filters: SisBancoFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<IResponse<SisBancoResponseDto>>(UrlServices.GETMAESTROBANCO , filters)
            
return handleApiResponse<SisBancoResponseDto>(response.data, undefined, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const store = useCallback(async (payload: SisBancoCreateDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<IResponse<SisBancoResponseDto>>(UrlServices.CREATEMAESTROBANCO, payload)
            const message   = 'Cuenta creada exitosamente'

            return handleApiResponse<SisBancoResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const update = useCallback(async (payload: SisBancoUpdateDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<IResponse<SisBancoResponseDto>>(UrlServices.UPDATEMAESTROBANCO, payload)
            const message   = 'Cuenta actualizada exitosamente'

            return handleApiResponse<SisBancoResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const remove = useCallback(async (payload: SisBancoDeleteDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<IResponse<SisBancoDeleteDto>>(UrlServices.DELETEMAESTROBANCO, payload)
            const message   = 'Cuenta eliminada exitosamente'

            return handleApiResponse<SisBancoDeleteDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
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