export interface FindOneVariableEntradaProcesoDTO {
  id: number;
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

export interface FindOneVariableEntradaProcesoResponse {
  data: VariableEntradaProceso | null;
}
