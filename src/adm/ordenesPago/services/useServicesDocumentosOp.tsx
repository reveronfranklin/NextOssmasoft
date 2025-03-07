import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"

import { useSelector } from "react-redux"
import { RootState } from "src/store"

import { IGetListByOrdenPago, IResponseListDocumentoByOrden } from '../interfaces/documentosOp/listDocumentoByOrdenPago'
import { ICreateDocumentosOp, IResponseCreateDocumentosOp } from '../interfaces/documentosOp/createDocumentosOp'
import { IUpdateDocumentosOp, IResponseUpdateDocumentosOp } from '../interfaces/documentosOp/updateDocumentosOp'
import { IDeleteDocumentoOp, IResponseDeleteDocumentoOp } from '../interfaces/documentosOp/deleteDocumentosOp'

import { setDocumentCount } from 'src/store/apps/ordenPago'
import { useDispatch } from 'react-redux'

const useServicesDocumentosOp = () => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

  const dispatch = useDispatch()

  const handleApiError = (e: any) => {
    setError(e.message);
    setMessage(`Error: ${e.message}`)
    console.error(e)

    return null
  }

  const handleApiResponse = <T,>(response: {data: T }, successMessage?: string): T | null => {
    if (response && response.data) {
      if (successMessage) {
        setMessage(successMessage)
      }

      return response.data
    }

    return null
  }

  const getListDocumentos = useCallback(async (filters: IGetListByOrdenPago): Promise<IResponseListDocumentoByOrden | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseListDocumentoByOrden>(UrlServices.GETDOCUMENTOSOPBYORDENPAGO, filters)
      const data = handleApiResponse(response)

      if (data) {
        dispatch(setDocumentCount(data.cantidadRegistros))

        return data
      }

      return null
    } catch (e: any) {

      return handleApiError(e)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const createDocumentos = useCallback(async (filters: ICreateDocumentosOp): Promise<IResponseCreateDocumentosOp | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseCreateDocumentosOp>(UrlServices.CREATEDOCUMENTOSOP, filters)
      const data = handleApiResponse(response, 'Documento creado con éxito.')

      if (data) {
        dispatch(setDocumentCount(data.cantidadRegistros))

        return data
      }

      return null
    } catch (e: any) {

      return handleApiError(e)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const updateDocumentos = useCallback(async (filters: IUpdateDocumentosOp): Promise<IResponseUpdateDocumentosOp | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseUpdateDocumentosOp>(UrlServices.UPDATEDOCUMENTOSOP, filters)

      return handleApiResponse(response, 'Documento actualizado con éxito.')
    } catch (e: any) {

      return handleApiError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteDocumentos = useCallback(async (filters: IDeleteDocumentoOp): Promise<IResponseDeleteDocumentoOp | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseDeleteDocumentoOp>(UrlServices.DELETEDOCUMENTOSOP, filters)
      const data = handleApiResponse(response, 'Documento eliminado con éxito.')

      if (data) {
        dispatch(setDocumentCount(data.cantidadRegistros))

        return data
      }

      return null
    } catch (e: any) {

      return handleApiError(e)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  return {
    error, message, loading,
    presupuestoSeleccionado,
    getListDocumentos,
    createDocumentos,
    updateDocumentos,
    deleteDocumentos,
  }
}

export default useServicesDocumentosOp