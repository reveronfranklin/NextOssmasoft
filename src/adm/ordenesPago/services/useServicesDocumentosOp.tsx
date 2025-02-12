import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"

import { useSelector } from "react-redux"
import { RootState } from "src/store"

import { IGetListByOrdenPago, IResponseListDocumentoByOrden } from '../interfaces/documentosOp/listDocumentoByOrdenPago'
import { ICreateDocumentosOp, IResponseCreateDocumentosOp } from '../interfaces/documentosOp/createDocumentosOp'
import { IUpdateDocumentosOp, IResponseUpdateDocumentosOp } from '../interfaces/documentosOp/updateDocumentosOp'
import { IDeleteDocumentoOp, IResponseDeleteDocumentoOp } from '../interfaces/documentosOp/deleteDocumentosOp'

const useServicesDocumentosOp = () => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

  const getListDocumentos = useCallback(async (filters: IGetListByOrdenPago): Promise<IResponseListDocumentoByOrden | null> => {
    try {
      setLoading(true)

      const response = await ossmmasofApi.post<IResponseListDocumentoByOrden>(
        UrlServices.GETDOCUMENTOSOPBYORDENPAGO,
        filters
      )

      if (response && response.data) {
        return response.data
      }

      setMessage(response.data.message)

      return null
    } catch (e: any) {
      setError(e.message)
      console.error(e)

      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createDocumentos = useCallback(async (filters: ICreateDocumentosOp): Promise<IResponseCreateDocumentosOp | null> => {
    try {
      setLoading(true)

      const response = await ossmmasofApi.post<IResponseCreateDocumentosOp>(
        UrlServices.CREATEDOCUMENTOSOP ,
        filters
      )

      if (response && response.data) {

        return response.data
      }

      return null
    } catch (e: any) {
      setError(e.message)
      console.error(e)

      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateDocumentos = useCallback(async (filters: IUpdateDocumentosOp): Promise<IResponseUpdateDocumentosOp | null> => {
    try {
      setLoading(true)

      const response = await ossmmasofApi.post<IResponseUpdateDocumentosOp>(
        UrlServices.UPDATEDOCUMENTOSOP,
        filters
      )

      if (response && response.data) {

        return response.data
      }

      return null
    } catch (e: any) {
      setError(e.message)
      console.error(e)

      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteDocumentos = useCallback(async (filters: IDeleteDocumentoOp): Promise<IResponseDeleteDocumentoOp | null> => {
    try {
      setLoading(true)

      const response = await ossmmasofApi.post<IResponseDeleteDocumentoOp>(
        UrlServices.DELETEDOCUMENTOSOP,
        filters
      )

      if (response && response.data) {

        return response.data
      }

      return null
    } catch (e: any) {
      setError(e.message)
      console.error(e)

      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    error, message, loading,
    presupuestoSeleccionado,
    getListDocumentos,
    createDocumentos,
    updateDocumentos,
    deleteDocumentos
  }
}

export default useServicesDocumentosOp