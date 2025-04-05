import { useCallback, useState } from 'react';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/urlServices.enum';
import { ResponseDto, BancoFilterDto, BancoResponseDto } from '../interfaces';

const useServicesMaestroBanco = () => {
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const getList = useCallback(async (filters: BancoFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<BancoResponseDto>>(UrlServices.GET_MAESTRO_BANCOS, filters)

            if (response.data.isValid) {
                return response.data
            }

            setMessage(response.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error('Error useServicesMaestroBanco getList', e)
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