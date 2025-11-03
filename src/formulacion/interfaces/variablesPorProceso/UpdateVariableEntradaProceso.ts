// DTO y respuesta para UPDATEVARIABLEENTRADAPROCESO

export interface UpdateVariableEntradaProcesoDTO {
  id: number;
  procesoId?: number;
  variableId?: number;
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

export interface UpdateVariableEntradaProcesoResponse {
  data: VariableEntradaProceso;
}
