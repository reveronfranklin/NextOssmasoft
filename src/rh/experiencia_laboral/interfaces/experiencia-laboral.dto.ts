// Interface para la experiencia laboral individual
export interface FechaObj {
  year: string;
  month: string;
  day: string;
}

export interface ExperienciaLaboralDTO {
  codigoExpLaboral?: number;
  codigoPersona: number;
  nombreEmpresa: string;
  tipoEmpresa: string;
  cargo: string;
  fechaDesde: string;
  fechaHasta?: string;
  fechaDesdeString?: string;
  fechaHastaString?: string;
  fechaDesdeObj?: FechaObj;
  fechaHastaObj?: FechaObj;
  ultimoSueldo?: number;
  supervisor?: string;
  cargoSupervisor?: string;
  telefono?: string;
  descripcion?: string;
}

export interface ExperienciaLaboralListResponse {
  experiencias: ExperienciaLaboralDTO[];
}

export type CreateExperienciaLaboralRequest = Omit<ExperienciaLaboralDTO, 'codigoExpLaboral'>;
export type UpdateExperienciaLaboralRequest = ExperienciaLaboralDTO;

export interface DeleteExperienciaLaboralRequest {
  codigoExpLaboral: number;
  codigoPersona?: number;
}

export interface ExperienciaLaboralApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}