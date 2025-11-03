export interface CreateVariableEntradaProcesoDTO {
  procesoId: number;
  variableId: number;
  usuarioConectado: number;
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

export interface CreateVariableEntradaProcesoResponse {
  data: VariableEntradaProceso;
}
