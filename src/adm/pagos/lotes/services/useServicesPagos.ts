import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { UrlServices } from '../enums/urlServices.enum';
import {
    ResponseDto,
    PagoResponseDto,
    PagoFilterDto,
    PagoAmountDto,
    PagoDeleteDto,
    PagoDto
} from '../interfaces';

const useServicesPagos = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const codigoLoteSelected = useSelector((state: RootState) => state.admLotePagos.codigoLote)

    const getList = useCallback(async (payload: PagoFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<PagoResponseDto>>(UrlServices.GET_PAGOS, payload)

            return handleApiResponse<PagoResponseDto>(response.data, undefined, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const store = useCallback(async (payload: PagoDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<PagoResponseDto>>(UrlServices.CREATE_PAGO, payload)
            const message   = 'Pago creado exitosamente'

            return handleApiResponse<PagoResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const update = useCallback(async (payload: PagoDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<PagoResponseDto>>(UrlServices.UPDATE_PAGO, payload)
            const message   = 'Pago actualizado exitosamente'

            return handleApiResponse<PagoResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const updateAmount = useCallback(async (payload: PagoAmountDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<PagoResponseDto>>(UrlServices.UPDATE_MONTO_PAGO, payload)
            const message   = 'Monto de pago actualizado exitosamente'

            return handleApiResponse<PagoResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])


    const remove = useCallback(async (payload: PagoDeleteDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<PagoResponseDto>>(UrlServices.DELETE_PAGO, payload)
            const message   = 'Pago eliminado exitosamente'

            return handleApiResponse<PagoResponseDto>(response.data, message, setMessage, setError)
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
        codigoLoteSelected,
        setMessage,
        getList,
        store,
        update,
        updateAmount,
        remove
    }
}

export default useServicesPagos