import { useCallback, useState } from "react"

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { UrlServices } from '../enums/UrlServices.enum'
import { IResponse, SisBancoResponseDto, SisBancoFilterDto } from '../interfaces'

const useServices = () => {
    const [error, setError] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const getMaestroBanco = useCallback(async (filters: SisBancoFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const responseGetMaestroBanco = await ossmmasofApi.post<IResponse<SisBancoResponseDto>>(UrlServices.GETMAESTROBANCO , filters)
            console.log('responseGetMaestroBanco', responseGetMaestroBanco)

            if (responseGetMaestroBanco.data.isValid) {
                return responseGetMaestroBanco.data
            }

            setMessage(responseGetMaestroBanco.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        error,
        message,
        loading,
        getMaestroBanco
    }
}

export default useServices