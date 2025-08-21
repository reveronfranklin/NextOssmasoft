export interface DTOVariableDelete {
  id: number;
}

export interface IVariableDeleteResponse {
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