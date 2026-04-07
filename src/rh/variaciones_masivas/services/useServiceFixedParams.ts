import { useCallback, useState } from 'react';
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { ApiPaths } from '../constants';
import { ApiResponse, FixedParams } from '../interfaces';

const useServices = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const getList = useCallback(async (): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApiVertical.post<ApiResponse<FixedParams>>(ApiPaths.GET_FIXED_PARAMS )

            return handleApiResponse<FixedParams>(response.data, undefined, setMessage, setError)
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
        getList
    }
}

export default useServices