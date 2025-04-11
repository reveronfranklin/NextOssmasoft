import { useCallback, useState } from 'react';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/urlServices.enum';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { ResponseDto, BancoFilterDto, BancoResponseDto } from '../interfaces';

const useServicesMaestroBanco = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const getList = useCallback(async (filters: BancoFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<BancoResponseDto>>(UrlServices.GET_MAESTRO_BANCOS, filters)
            
return handleApiResponse<BancoResponseDto>(response.data, undefined, setMessage, setError)
        } catch (e: any) {
            console.error('Error useServicesMaestroBanco getList', e)
            
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

export default useServicesMaestroBanco