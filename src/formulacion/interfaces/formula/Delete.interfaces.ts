export interface DTOFormulaDelete {
  id: number;
}

export interface IFormulaDeleteResponse {
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