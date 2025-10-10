export interface DTOGetAllByCodigoDetalleProceso {
  page: number;
  limit: number;
  searchText: string;
  id: number;
}

export interface IGetAllByCodigoDetalleProcesoResponse {
  code: string;
  codigoEmpresa: number;
  descripcionFormula: string;
  estado: string;
  fechaIns: Date;
  fechaUpd: Date;
  formulaId: number;
  formulaValue: string;
  id: number;
  ordenCalculo: number;
  procesoDetalleId: number;
  redondeo: number;
  usuarioInsert: number;
  usuarioUpdate: any;
  value: number;
  variableId: number;
}
