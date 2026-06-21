import { useCallback, useState } from 'react';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';
import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { ApiPaths } from '../constants';
import { ApiResponse, Concept, Frequency, TypePayroll } from '../interfaces';

const useServiceAutoSelects = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError]     = useState<string>('')
    const [message, setMessage] = useState<IAlertMessageDto>({
        text: '',
        timestamp: Date.now(),
        isValid: true
    })

    const wrapForHandler = <T>(data: any): ApiResponse<T> => {
        return {
            data: data,
            isValid: true,
            message: 'successful',
            linkData: null,
            linkDataAlternative: null,
            page: 0,
            totalPage: 0,
            cantidadRegistros: data.length,
            total1: 0,
            total2: 0,
            total3: 0,
            total4: 0
        }
    }

    const getListConceptos = useCallback(async (): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.get<ApiResponse<Concept>>(ApiPaths.GET_CONCEPTOS)

            return handleApiResponse<Concept>(wrapForHandler(response.data), undefined, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const getListFrecuencias = useCallback(async (): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.post<ApiResponse<Frequency>>(ApiPaths.GET_FRECUENCIAS, { tituloId: 49 })

            return handleApiResponse<Frequency>(wrapForHandler(response.data), undefined, setMessage, setError)
        } catch (e: any) {
            return handleApiError(e, setMessage, setError)
        } finally {
            setLoading(false)
        }
    }, [])

    const getListTipoNomina = useCallback(async (): Promise<any> => {
        try {
            setLoading(true)
            const response = await ossmmasofApi.get<ApiResponse<TypePayroll>>(ApiPaths.GET_TIPO_NOMINA)

            return handleApiResponse<TypePayroll>(wrapForHandler(response.data), undefined, setMessage, setError)
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
        getListConceptos,
        getListFrecuencias,
        getListTipoNomina
    }
}

export default useServiceAutoSelects














/*   const getConceptos = async () => {
    const responseAllConceptos = await ossmmasofApi.get<any>('/RhConceptos/GetAll')
    const { data } = responseAllConceptos

    return data
  }

  const getFrecuencias = async () => {
    const responseAllFrecuencias = await ossmmasofApi.post<any>('/RhDescriptivas/GetByTitulo', { tituloId: 49})
    const { data } = responseAllFrecuencias

    return data
  }

  const getTipoNomina = async () => {
    const responseAllTipoNomina = await ossmmasofApi.get<any>('/RhTipoNomina/GetAll')
    const { data } = responseAllTipoNomina

    return data
  } */