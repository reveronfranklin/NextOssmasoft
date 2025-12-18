import { useCallback, useState } from 'react';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { UrlServices } from '../enums/UrlServices.enum';
import {
    IResponse,
    IProveedor,
    ProveedorFilter,
    ProveedorDelete
} from '../interfaces';

const useServices = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const getList = useCallback(async (filters: ProveedorFilter): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<IResponse<IProveedor>>(UrlServices.GET_PROVEEDORES , filters)
            return handleApiResponse<IProveedor>(response.data, undefined, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const store = useCallback(async (payload: IProveedor): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<IResponse<IProveedor>>(UrlServices.CREATE_PROVEEDOR, payload)
            const message   = 'Proveedor creado exitosamente'

            return handleApiResponse<IProveedor>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const update = useCallback(async (payload: IProveedor): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<IResponse<IProveedor>>(UrlServices.UPDATE_PROVEEDOR, payload)
            const message   = 'Proveedor actualizado exitosamente'

            return handleApiResponse<IProveedor>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const remove = useCallback(async (payload: ProveedorDelete): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<IResponse<IProveedor>>(UrlServices.DELETE_PROVEEDOR, payload)
            const message   = 'Proveedor eliminado exitosamente'

            return handleApiResponse<IProveedor>(response.data, message, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const active = useCallback(async (payload: ProveedorDelete): Promise<any> => {
        try {
            setLoading(true)
            const response  = await ossmmasofApi.post<IResponse<IProveedor>>(UrlServices.ACTIVE_PROVEEDOR, payload)
            const message   = 'Proveedor activado exitosamente'

            return handleApiResponse<IProveedor>(response.data, message, setMessage, setError)
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
        store,
        update,
        remove,
        active
    }
}

export default useServices