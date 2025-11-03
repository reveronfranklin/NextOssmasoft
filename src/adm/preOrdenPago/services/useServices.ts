import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { ossmmasofApiN8N } from 'src/MyApis/ossmmasofApiN8N';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { UrlServices } from '../enums/urlServices.enum';
import {
    ResponseDto,
    PreOrdenPagoFilterDto,
    PreOrdenPagoDto
} from '../interfaces';

const useServices = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    const getList = useCallback(async (payload: PreOrdenPagoFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<PreOrdenPagoDto>>(UrlServices.GET_PRE_ORDEN_PAGO, payload)

            return handleApiResponse<PreOrdenPagoDto>(response.data, undefined, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [ presupuestoSeleccionado.codigoPresupuesto ])

    const store = useCallback(async (payload: PreOrdenPagoDto): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApiN8N.post<ResponseDto<PreOrdenPagoDto>>(UrlServices.CREATE_PRE_ORDEN_PAGO, payload)
            const message   = 'Facturas procesadas exitosamente'

            return handleApiResponse<PreOrdenPagoDto>(response.data, message, setMessage, setError)
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
        getList,
        store
    }
}

export default useServices
