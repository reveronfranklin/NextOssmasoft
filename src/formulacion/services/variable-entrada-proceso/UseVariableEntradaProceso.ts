import { useCallback, useState } from 'react';
import { ossmmasofApiGateway } from 'src/MyApis/ossmmasofApiGateway';
import { UrlVariableEntradaProcesoServices } from 'src/formulacion/enums/UrlVariableEntradaProcesoServices.enum';

import { GetAllVariablesEntradaProcesoDTO, GetAllVariablesEntradaProcesoResponse } from 'src/formulacion/interfaces/variablesPorProceso/GetAllVariablesEntradaProceso';
import { FindOneVariableEntradaProcesoDTO, FindOneVariableEntradaProcesoResponse } from 'src/formulacion/interfaces/variablesPorProceso/FindOneVariableEntradaProceso';
import { CreateVariableEntradaProcesoDTO, CreateVariableEntradaProcesoResponse } from 'src/formulacion/interfaces/variablesPorProceso/CreateVariableEntradaProceso';
import { UpdateVariableEntradaProcesoDTO, UpdateVariableEntradaProcesoResponse } from 'src/formulacion/interfaces/variablesPorProceso/UpdateVariableEntradaProceso';
import { DeleteVariableEntradaProcesoDTO, DeleteVariableEntradaProcesoResponse } from 'src/formulacion/interfaces/variablesPorProceso/DeleteVariableEntradaProceso';

import { handleApiResponse, handleApiError } from 'src/utilities/api-handlers';
import { IApiResponse } from 'src/interfaces/api-response-dto';
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto';

const useVariableEntradaProceso = () => {
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<IAlertMessageDto>({
    text: '',
    isValid: true,
    timestamp: Date.now(),
  });
  const [loading, setLoading] = useState<boolean>(false);

  const getAll = useCallback(async (filters: GetAllVariablesEntradaProcesoDTO): Promise<IApiResponse<GetAllVariablesEntradaProcesoResponse>> => {
    try {
      setLoading(true);
      const responseFetch = await ossmmasofApiGateway.post(UrlVariableEntradaProcesoServices.GETALLVARIABLESENTRADAPROCESO, filters);
      return handleApiResponse(responseFetch.data, undefined, setMessage, setError);
    } catch (e: any) {
      return handleApiError(e, setMessage, setError);
    } finally {
      setLoading(false);
    }
  }, []);

  const findOne = useCallback(async (filters: FindOneVariableEntradaProcesoDTO): Promise<IApiResponse<FindOneVariableEntradaProcesoResponse>> => {
    try {
      setLoading(true);
      const responseFetch = await ossmmasofApiGateway.post(UrlVariableEntradaProcesoServices.FINDONEVARIABLESENTRADAPROCESO, filters);
      return handleApiResponse(responseFetch.data, undefined, setMessage, setError);
    } catch (e: any) {
      return handleApiError(e, setMessage, setError);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (filters: CreateVariableEntradaProcesoDTO): Promise<IApiResponse<CreateVariableEntradaProcesoResponse>> => {
    try {
      setLoading(true);
      const responseFetch = await ossmmasofApiGateway.post(UrlVariableEntradaProcesoServices.CREATEVARIABLEENTRADAPROCESO, filters);
      return handleApiResponse(responseFetch.data, 'Variable creada con éxito', setMessage, setError);
    } catch (e: any) {
      return handleApiError(e, setMessage, setError);
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (filters: UpdateVariableEntradaProcesoDTO): Promise<IApiResponse<UpdateVariableEntradaProcesoResponse>> => {
    try {
      setLoading(true);
      const responseFetch = await ossmmasofApiGateway.post(UrlVariableEntradaProcesoServices.UPDATEVARIABLEENTRADAPROCESO, filters);
      return handleApiResponse(responseFetch.data, 'Variable actualizada con éxito', setMessage, setError);
    } catch (e: any) {
      return handleApiError(e, setMessage, setError);
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (filters: DeleteVariableEntradaProcesoDTO): Promise<IApiResponse<DeleteVariableEntradaProcesoResponse>> => {
    try {
      setLoading(true);
      const responseFetch = await ossmmasofApiGateway.post(UrlVariableEntradaProcesoServices.DELETEVARIABLEENTRADAPROCESO, filters);
      return handleApiResponse(responseFetch.data, 'Variable eliminada con éxito', setMessage, setError);
    } catch (e: any) {
      return handleApiError(e, setMessage, setError);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    error,
    message,
    loading,
    getAll,
    findOne,
    create,
    update,
    remove,
  };
};

export default useVariableEntradaProceso;
