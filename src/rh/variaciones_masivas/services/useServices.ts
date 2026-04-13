import { useCallback, useState } from 'react';
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { ApiPaths } from '../constants';

import {
    ApiResponse,
    Employee,
    FilterEmployee,
    VariationMovementForm
} from '../interfaces';

const useServices = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const getList = useCallback(async (filters: FilterEmployee): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApiVertical.post<ApiResponse<Employee>>(ApiPaths.GET_EMPLOYEES , filters)

            return handleApiResponse<Employee>(response.data, undefined, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const store = useCallback(async (payload: VariationMovementForm): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApiVertical.post<ApiResponse<VariationMovementForm>>(ApiPaths.STORE_LOTE_VARIACION, payload)
            const message   = 'Variaciones procesadas exitosamente'

            return handleApiResponse<any>(response.data, message, setMessage, setError)
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
        store
    }
}

export default useServices