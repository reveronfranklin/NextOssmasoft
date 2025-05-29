import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { UrlServices } from '../enums/urlServices.enum';
import {
    ResponseDto,
    OrdenPagoResponseDto,
    OrdenPagoFilterDto
} from '../interfaces';

const useServicesOrdenPago = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    const getList = useCallback(async (payload: OrdenPagoFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<OrdenPagoResponseDto>>(UrlServices.GET_ORDEN_PAGO_PENDIENTES, payload)

            return handleApiResponse<OrdenPagoResponseDto>(response.data, undefined, setMessage, setError)
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
        setMessage,
        getList
    }
}

export default useServicesOrdenPago