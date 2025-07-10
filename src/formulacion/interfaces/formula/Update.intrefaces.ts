export interface DTOFormulaUpdate {
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

export interface IFormulaUpdateResponse {
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