export interface UpdatePlantillaDTO {
  id: number;
  procesoDetalleId: number;
  variableId: number;
  formulaId: number;
  ordenCalculo: number;
  value: number;
  usuarioUpdate: number;
  codigoEmpresa: number;
}

export interface IPlantillaUpdateResponse {
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