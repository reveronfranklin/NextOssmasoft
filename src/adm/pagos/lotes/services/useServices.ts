import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { UrlServices } from '../enums/urlServices.enum';
import {
    ResponseDto,
    LoteResponseDto,
    LoteFilterDto,
    LoteDto,
    LoteStatusDto
} from '../interfaces';

const useServices = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const presupuestoSeleccionado   = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)
    const { batchPaymentDate }      = useSelector((state: RootState) => state.admLote )

    const getList = useCallback(async (payload: LoteFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<LoteResponseDto>>(UrlServices.GET_LOTES, payload)

            return handleApiResponse<LoteResponseDto>(response.data, undefined, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [ presupuestoSeleccionado.codigoPresupuesto, batchPaymentDate ])

    const store = useCallback(async (payload: LoteDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<LoteResponseDto>>(UrlServices.CREATE_LOTE, payload)
            const message   = 'Lote de pago creada exitosamente'

            return handleApiResponse<LoteResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const update = useCallback(async (payload: LoteDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<LoteResponseDto>>(UrlServices.UPDATE_LOTE, payload)
            const message   = 'Lote de pago actualizado exitosamente'

            return handleApiResponse<LoteResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const remove = useCallback(async (payload: any): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<LoteResponseDto>>(UrlServices.DELETE_LOTE, payload)
            const message   = 'Lote de pago eliminada exitosamente'

            return handleApiResponse<LoteResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])


    const approve = useCallback(async (payload: LoteStatusDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<LoteResponseDto>>(UrlServices.APPROVE_LOTE, payload)
            const message   = 'Lote de pago aprobado'

            return handleApiResponse<LoteResponseDto>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const cancel = useCallback(async (payload: LoteStatusDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<ResponseDto<LoteResponseDto>>(UrlServices.CANCEL_LOTE, payload)
            const message   = 'Lote de pago anulado'

            return handleApiResponse<LoteResponseDto>(response.data, message, setMessage, setError)
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
        presupuestoSeleccionado,
        batchPaymentDate,
        setMessage,
        getList,
        store,
        update,
        remove,
        approve,
        cancel
    }
}

export default useServices
