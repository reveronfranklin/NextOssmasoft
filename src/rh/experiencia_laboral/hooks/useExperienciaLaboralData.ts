import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useExperienciaLaboralService } from "../services/experienciaLaboralService";
import {
  ExperienciaLaboralDTO,
  CreateExperienciaLaboralRequest,
  UpdateExperienciaLaboralRequest,
  DeleteExperienciaLaboralRequest,
  ExperienciaLaboralApiResponse,
} from "../interfaces/experiencia-laboral.dto";

export const useExperienciaLaboralByPersona = (codigoPersona: number, enabled = true) => {
  const qc = useQueryClient();
  const { getByPersona } = useExperienciaLaboralService();

  return useQuery<ExperienciaLaboralDTO[]>({
    queryKey: ["experienciaLaboral", codigoPersona],
    queryFn: () => getByPersona(codigoPersona),
    initialData: () => qc.getQueryData(["experienciaLaboral", codigoPersona]),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: !!codigoPersona && enabled,
  });
};

export const useCreateExperienciaLaboral = () => {
  const qc = useQueryClient();
  const { create } = useExperienciaLaboralService();

  return useMutation<ExperienciaLaboralApiResponse, unknown, CreateExperienciaLaboralRequest>({
    mutationFn: (payload) => create(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["experienciaLaboral", variables.codigoPersona] });
    },
  });
};

export const useUpdateExperienciaLaboral = () => {
  const qc = useQueryClient();
  const { update } = useExperienciaLaboralService();

  return useMutation<ExperienciaLaboralApiResponse, unknown, UpdateExperienciaLaboralRequest>({
    mutationFn: (payload) => update(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["experienciaLaboral", variables.codigoPersona] });
    },
  });
};

export const useDeleteExperienciaLaboral = () => {
  const qc = useQueryClient();
  const { remove } = useExperienciaLaboralService();

  return useMutation<ExperienciaLaboralApiResponse, unknown, DeleteExperienciaLaboralRequest>({
    mutationFn: (payload) => remove(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["experienciaLaboral", (variables as any).codigoPersona] });
    },
  });
};