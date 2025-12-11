import { useCallback } from "react";
import { ossmmasofApi } from "src/MyApis/ossmmasofApi";
import { ExperienciaLaboralUrls } from "../enums/urlServices.enum";
import {
  ExperienciaLaboralDTO,
  CreateExperienciaLaboralRequest,
  UpdateExperienciaLaboralRequest,
  DeleteExperienciaLaboralRequest,
  ExperienciaLaboralApiResponse,
} from "../interfaces/experiencia-laboral.dto";

export const useExperienciaLaboralService = () => {
  const getByPersona = useCallback(async (codigoPersona: number): Promise<ExperienciaLaboralDTO[]> => {
    const { data } = await ossmmasofApi.post(ExperienciaLaboralUrls.GET_BY_PERSONA, { codigoPersona });

    return data;
  }, []);

  const create = useCallback(async (payload: CreateExperienciaLaboralRequest): Promise<ExperienciaLaboralApiResponse> => {
    const { data } = await ossmmasofApi.post(ExperienciaLaboralUrls.CREATE_EXPERIENCIA, payload);

    return data;
  }, []);

  const update = useCallback(async (payload: UpdateExperienciaLaboralRequest): Promise<ExperienciaLaboralApiResponse> => {
    const { data } = await ossmmasofApi.post(ExperienciaLaboralUrls.UPDATE_EXPERIENCIA, payload);

    return data;
  }, []);

  const remove = useCallback(async (payload: DeleteExperienciaLaboralRequest): Promise<ExperienciaLaboralApiResponse> => {
    const { data } = await ossmmasofApi.post(ExperienciaLaboralUrls.DELETE_EXPERIENCIA, payload);

    return data;
  }, []);

  return { getByPersona, create, update, remove };
};