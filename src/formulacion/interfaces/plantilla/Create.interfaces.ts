export interface CreatePlantillaDTO {
  procesoDetalleId: number;
  variableId: number;
  formulaId: number;
  ordenCalculo: number;
  value: number;
  usuarioInsert: number;
  codigoEmpresa: number;
}

export interface IPlantillaCreateResponse {
  id: number;
  procesoDetalleId: number;
  variableId: number;
  code: string;
  formulaId: number;
  descripcionFormula: string;
  formulaValue: string;
  value: number;
  ordenCalculo: number;
  redondeo: number;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: any;
  codigoEmpresa: number;
}