import { useCallback, useState } from "react"
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { UrlServices } from '../enums/UrlServices.enum'
import { IResponse, SisBancoResponseDto, SisBancoFilterDto, SisBancoCreateDto, SisBancoUpdateDto, SisBancoDeleteDto } from '../interfaces'

const useServices = () => {
    const [error, setError] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const getMaestroBanco = useCallback(async (filters: SisBancoFilterDto): Promise<any> => {
        try {
            setLoading(true)
            const responseGetMaestroBanco = await ossmmasofApi.post<IResponse<SisBancoResponseDto>>(UrlServices.GETMAESTROBANCO , filters)

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
        try {
            setLoading(true)
            const responseCreateMaestroBanco = await ossmmasofApi.post<IResponse<SisBancoResponseDto>>(UrlServices.CREATEMAESTROBANCO, payload)

            if (responseCreateMaestroBanco.data.isValid) {
                return responseCreateMaestroBanco.data
            }

            setMessage(responseCreateMaestroBanco.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const updateMaestroBanco = useCallback(async (payload: SisBancoUpdateDto): Promise<any> => {
        try {
            setLoading(true)
            const responseUpdateMaestroBanco = await ossmmasofApi.post<IResponse<SisBancoResponseDto>>(UrlServices.UPDATEMAESTROBANCO, payload)

            if (responseUpdateMaestroBanco.data.isValid) {
                return responseUpdateMaestroBanco.data
            }

            setMessage(responseUpdateMaestroBanco.data.message)
        } catch (e: any) {
            setError(e.message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const deleteMaestroBanco = useCallback(async (payload: SisBancoDeleteDto): Promise<any> => {
        try {
            setLoading(true)
            const responseDeleteMaestroBanco = await ossmmasofApi.post<IResponse<SisBancoDeleteDto>>(UrlServices.DELETEMAESTROBANCO, payload)

            if (responseDeleteMaestroBanco.data.isValid) {
                return responseDeleteMaestroBanco.data
            }

            setMessage(responseDeleteMaestroBanco.data.message)
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
        setMessage,
        getMaestroBanco,
        createMaestroBanco,
        updateMaestroBanco,
        deleteMaestroBanco
    }
}

export default useServices