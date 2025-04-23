import { useCallback, useState } from 'react'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { UrlServices } from '../enums/urlServices.enum';
import {
    ResponseDto,
    LoteResponseDto,
    LoteFilterDto,
    LoteDto
} from '../interfaces';

const useServices = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const getList = useCallback(async (payload: LoteFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<LoteResponseDto>>(UrlServices.GET_LOTE, payload)

            return handleApiResponse<LoteResponseDto>(response.data, undefined, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const store = useCallback(async (payload: LoteDto): Promise<any> => {
/*         try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<CuentaResponseDto>>(UrlServices.CREATE_MAESTRO_CUENTA, payload)
            const message   = 'Cuenta creada exitosamente'

            return handleApiResponse<CuentaResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        } */
    }, [])

    const update = useCallback(async (payload: LoteDto): Promise<any> => {
/*         try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<CuentaResponseDto>>(UrlServices.UPDATE_MAESTRO_CUENTA, payload)
            const message   = 'Cuenta actualizada exitosamente'

            return handleApiResponse<CuentaResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        } */
    }, [])

    const remove = useCallback(async (payload: any): Promise<any> => {
/*         try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<CuentaResponseDto>>(UrlServices.DELETE_MAESTRO_CUENTA, payload)
            const message   = 'Cuenta eliminada exitosamente'

            return handleApiResponse<CuentaResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        } */
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
