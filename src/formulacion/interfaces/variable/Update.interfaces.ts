export interface DTOVariableUpdate {
  id: number;
  code: string;
  descripcion: string;
  tipoVariable: string;
  usuarioUpdate: number;
  codigoEmpresa: number;
  parametros: Iparametro[] | [];
}

export interface Iparametro {
  id: number;
  variableId: number;
  code: string;
  orden: number;
  estado: string;
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