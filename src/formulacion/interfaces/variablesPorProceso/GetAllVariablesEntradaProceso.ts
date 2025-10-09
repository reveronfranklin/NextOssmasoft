export interface GetAllVariablesEntradaProcesoDTO {
  procesoId?: number;
  page?: number;
  limit?: number;
  searchText?: string;
}

export interface VariableEntradaProceso {
  id: number;
  procesoId: number;
  descripcionProceso: string;
  variableId: number;
  descripcionVariable: string;
  code: string;
  searchText?: string;
}

export interface GetAllVariablesEntradaProcesoResponse {
  data: VariableEntradaProceso[];
}
