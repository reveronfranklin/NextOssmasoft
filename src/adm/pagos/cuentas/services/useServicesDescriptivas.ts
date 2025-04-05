import { useCallback, useState } from 'react';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/urlServices.enum';
import { ResponseDto, DescriptivaFilterDto, DescriptivaResponseDto } from '../interfaces';

const useServicesDescriptivas = () => {
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const getList = useCallback(async (filters: DescriptivaFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ResponseDto<DescriptivaResponseDto>>(UrlServices.GET_DESCRIPTIVAS, filters)

            if (response.data.isValid) {
                return response.data
            }

            setMessage(response.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error('Error useServicesDescriptivas getList', e)
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

export default useServicesDescriptivas