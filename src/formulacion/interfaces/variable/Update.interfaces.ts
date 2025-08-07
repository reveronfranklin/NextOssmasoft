export interface DTOVariableUpdate {
  id: number;
  code: string;
  descripcion: string;
  tipoVariable: string;
  usuarioUpdate: number;
  codigoEmpresa: number;
}

export interface IVariableUpdateResponse {
  id: number;
  code: string;
  descripcion: string;
  tipoVariable: string;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: any;
  codigoEmpresa: number;
}