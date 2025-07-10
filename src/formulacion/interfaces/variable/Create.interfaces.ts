export interface DTOVariableCreate {
  descripcion: string;
  tipoVariable: string;
  estado: string;
  codigoEmpresa: number;
}

export interface IVariableCreateResponse {
  id: number;
  descripcion: string;
  tipoVariable: string;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: any;
  codigoEmpresa: number;
}