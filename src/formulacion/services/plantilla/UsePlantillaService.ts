import { useCallback, useState } from 'react'
import { ossmmasofApiGateway } from 'src/MyApis/ossmmasofApiGateway'
import { UrlPlantillaServices } from 'src/formulacion/enums/UrlPlantillaServices.enum'

import { DTOProcesoDetalleFindAll, IProcesoDetalleFindAllResponse } from 'src/formulacion/interfaces/plantilla/ProcesoDetalleFindAll.interfaces'
import { DTOProcesoFindAll, IProcesoFindAllResponse } from 'src/formulacion/interfaces/plantilla/ProcesoFindAll.interfaces'
import { DTOGetAllByCodigoDetalleProceso, IGetAllByCodigoDetalleProcesoResponse } from 'src/formulacion/interfaces/plantilla/GetAllByCodigoDetalleProceso.interfaces'
import { DTOReorderPlantilla, IPlantillaReorderResponse } from 'src/formulacion/interfaces/plantilla/Reorder.interfaces'

import { CreatePlantillaDTO, IPlantillaCreateResponse } from 'src/formulacion/interfaces/plantilla/Create.interfaces'
import { UpdatePlantillaDTO, IPlantillaUpdateResponse } from 'src/formulacion/interfaces/plantilla/Update.interfaces'
import { DeletePlantillaDTO, IPlantillaDeleteResponse } from 'src/formulacion/interfaces/plantilla/Delete.interfaces'

import { IPlantillaService } from 'src/formulacion/interfaces/plantilla/PlantillaService.interfaces'

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers'
import { IApiResponse } from 'src/interfaces/api-response-dto'
import { IResponseBase } from 'src/interfaces/response-base-dto'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'

const usePlantillaService = (): IPlantillaService => {
  const [error, setError] = useState<string>('')
  const [message, setMessage] = useState<IAlertMessageDto>({
    text: '',
    isValid: true,
    timestamp: Date.now(),
  })
  const [loading, setLoading] = useState<boolean>(false)

  // Obtener lista de procesos
  const getListProcesos = useCallback(async (filters: DTOProcesoFindAll): Promise<IApiResponse<IProcesoFindAllResponse[]>> => {
    try {
      setLoading(true)
      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IProcesoFindAllResponse[]>>(UrlPlantillaServices.FINDALLPROCESO, filters)
      const responseHandleApi = handleApiResponse<IProcesoFindAllResponse[]>(responseFetch.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {
      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  // Obtener lista de detalles de proceso
  const getListDetalleProcesos = useCallback(async (filters: DTOProcesoDetalleFindAll): Promise<IApiResponse<IProcesoDetalleFindAllResponse[]>> => {
    try {
      setLoading(true)
      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IProcesoDetalleFindAllResponse[]>>(UrlPlantillaServices.FINDALLPROCESODETALLE, filters)
      const responseHandleApi = handleApiResponse<IProcesoDetalleFindAllResponse[]>(responseFetch.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {
      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  // Obtener plantillas por código de detalle de proceso
  const getPlantillasByDetalleProceso = useCallback(async (filters: DTOGetAllByCodigoDetalleProceso): Promise<IApiResponse<IGetAllByCodigoDetalleProcesoResponse[]>> => {
    try {
      setLoading(true)
      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IGetAllByCodigoDetalleProcesoResponse[]>>(UrlPlantillaServices.GETALLPLANTILLASBYCODIGODETALLE, filters)
      const responseHandleApi = handleApiResponse<IGetAllByCodigoDetalleProcesoResponse[]>(responseFetch.data, undefined, setMessage, setError)

      return responseHandleApi
    } catch (e: any) {
      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  //reordenar plantilla
  const reorderPlantilla = useCallback(async (filters: DTOReorderPlantilla): Promise<any> => {
    try {
      console.log('servicio para actualizar el reordenamiento de la plantilla', filters)
      setLoading(true)
      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IPlantillaReorderResponse>>(UrlPlantillaServices.REORDERPLANTILLA, filters)
      const responseHandleApi = handleApiResponse<IPlantillaReorderResponse>(responseFetch.data, 'Plantilla reordenada con éxito', setMessage, setError)

      return responseHandleApi
    } catch (e: any) {
      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  const createPlantilla = useCallback(async (filters: CreatePlantillaDTO): Promise<IApiResponse<IPlantillaCreateResponse>> => {
    try {
      setLoading(true)
      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IPlantillaCreateResponse>>(UrlPlantillaServices.CREATEPLANTILLA, filters)
      const responseHandleApi = handleApiResponse<IPlantillaCreateResponse>(responseFetch.data, 'Plantilla creada con éxito', setMessage, setError)

      return responseHandleApi
    } catch (e: any) {
      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePlantilla = useCallback(async (filters: UpdatePlantillaDTO): Promise<IApiResponse<IPlantillaUpdateResponse>> => {
    try {
      setLoading(true)
      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IPlantillaUpdateResponse>>(UrlPlantillaServices.UPDATEPLANTILLA, filters)
      const responseHandleApi = handleApiResponse<IPlantillaUpdateResponse>(responseFetch.data, 'Plantilla actualizada con éxito', setMessage, setError)

      return responseHandleApi
    } catch (e: any) {
      return handleApiError(e, setMessage, setError)
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePlantilla = useCallback(async (filters: DeletePlantillaDTO): Promise<IApiResponse<IPlantillaDeleteResponse>> => {
    try {
      setLoading(true)
      const responseFetch = await ossmmasofApiGateway.post<IResponseBase<IPlantillaDeleteResponse>>(UrlPlantillaServices.DELETEPLANTILLA, filters)
      const responseHandleApi = handleApiResponse<IPlantillaDeleteResponse>(responseFetch.data, 'Plantilla eliminada con éxito', setMessage, setError)

      return responseHandleApi
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
    getListProcesos,
    getListDetalleProcesos,
    getPlantillasByDetalleProceso,
    reorderPlantilla,
    createPlantilla,
    updatePlantilla,
    deletePlantilla,
  }
}

export default usePlantillaService