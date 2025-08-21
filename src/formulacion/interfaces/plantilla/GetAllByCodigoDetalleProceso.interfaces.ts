export interface DTOGetAllByCodigoDetalleProceso {
  page: number;
  limit: number;
  searchText: string;
  id: number;
}

export interface IGetAllByCodigoDetalleProcesoResponse {
  id: number;
  procesoDetalleId: number;
  variableId: number;
  code: string;
  formulaId: number;
  descripcionFormula: string;
  formulaValue: string;
  value: number;
  ordenCalculo: number;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: any;
  codigoEmpresa: number;
}
