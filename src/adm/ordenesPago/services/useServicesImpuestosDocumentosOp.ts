import { UrlServices } from '../enums/UrlServices.enum'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useCallback, useState } from "react"
import { useDispatch } from 'react-redux'

import { IListImpuestoByOrdenPago, IResponseListImpuestoByOrdenPago } from '../interfaces/impuestoDocumentosOp/listImpuestoDocumentosOp'
import { ICreateImpuestoDocumentosOp, IResponseCreateImpuestoDocumentosOp } from '../interfaces/impuestoDocumentosOp/createImpuestoDocumentosOp'
import { IUpdateImpuestoDocumentosOp, IResponseUpdateImpuestoDocumentosOp } from '../interfaces/impuestoDocumentosOp/updateImpuestoDocumentosOp'
import { IDeleteImpuestoDocumentosOp, IResponseDeleteImpuestoDocumentosOp } from '../interfaces/impuestoDocumentosOp/deleteImpuestoDocumentosOp'

const useServicesImpuestosDocumentosOp = () => {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const dispatch = useDispatch()

  const getListImpuestoDocumentosOp = useCallback(async (filters: IListImpuestoByOrdenPago): Promise<IResponseListImpuestoByOrdenPago | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseListImpuestoByOrdenPago>(UrlServices.GETIMPUESTOSDOCBYORDENPAGO , filters)

      if(response.data.isValid) {

        return response.data
      }

      setMessage(response.data.message)
    } catch (e: any) {
      console.log(e)
    } finally {
      setLoading(false)
    }

    return null
  }, [dispatch])

  const createImpuestoDocumentosOp = useCallback(async (filters: ICreateImpuestoDocumentosOp): Promise<IResponseCreateImpuestoDocumentosOp | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseCreateImpuestoDocumentosOp>(UrlServices.CREATEIMPUESTODOCUMENTO, filters)

      if (response.data.isValid) {

        return response.data
      }
      setMessage(response.data.message)
    } catch (e: any) {
      console.log(e)
    } finally {
      setLoading(false)
    }

    return null
  }, [dispatch])

  const updateImpuestoDocumentosOp = useCallback(async (filters: IUpdateImpuestoDocumentosOp): Promise<IResponseUpdateImpuestoDocumentosOp | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseUpdateImpuestoDocumentosOp>(UrlServices.UPDATEIMPUESTODOCUMENTO , filters)

      if (response.data.isValid) {

        return response.data
      }
    } catch (e: any) {
      console.log(e)
    } finally {
      setLoading(false)
    }

    return null
  }, [dispatch])

  const deleteImpuestoDocumentosOp = useCallback(async (filters: IDeleteImpuestoDocumentosOp): Promise<IResponseDeleteImpuestoDocumentosOp | null> => {
    try {
      setLoading(true)
      const response = await ossmmasofApi.post<IResponseDeleteImpuestoDocumentosOp>(UrlServices.DELETEIMPUESTODOCUMENTO , filters)

      if (response.data.isValid) {

        return response.data
      }
    } catch (e: any) {
      console.log(e)
    } finally {
      setLoading(false)
    }

    return null
  }, [dispatch])

  return {
    message, loading,
    getListImpuestoDocumentosOp,
    createImpuestoDocumentosOp,
    updateImpuestoDocumentosOp,
    deleteImpuestoDocumentosOp
  }
}

export default useServicesImpuestosDocumentosOp