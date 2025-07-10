export interface DTOVariableUpdate {
  id: number;
  descripcion: string;
  tipoVariable: string;
  estado: string;
  codigoEmpresa: number;
}

export interface IVariableUpdateResponse {
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