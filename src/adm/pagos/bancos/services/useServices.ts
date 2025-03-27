import { useCallback, useState } from "react"

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { UrlServices } from '../enums/UrlServices.enum'
import { IResponse, SisBancoResponseDto, SisBancoFilterDto, SisBancoCreateDto } from '../interfaces'

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

    const createMaestroBanco = useCallback(async (payload: SisBancoCreateDto): Promise<any> => {
        console.log('createMaestroBanco', payload)

        try {
            setLoading(true)
            const responseCreatetMaestroBanco = await ossmmasofApi.post<any>(UrlServices.CREATEMAESTROBANCO, payload)

            if (responseCreatetMaestroBanco.data.isValid) {
                return responseCreatetMaestroBanco.data
            }

            setMessage(responseCreatetMaestroBanco.data.message)
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
        getMaestroBanco,
        createMaestroBanco
    }
}

export default useServices