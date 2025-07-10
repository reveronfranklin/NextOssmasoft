export interface DTOFormulaCreate {
  formula: string;
  descripcion: string;
  usuarioInsert: number;
  codigoEmpresa: number;
}

export interface IFormulaCreateResponse {
  id: number;
  descripcion: string;
  formula: string;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: any;
  codigoEmpresa: number;
}