export interface DeleteVariableEntradaProcesoDTO {
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

export interface DeleteVariableEntradaProcesoResponse {
  data: VariableEntradaProceso | null;
}
