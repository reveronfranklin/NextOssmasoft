export interface DTOVariableCreate {
  code: string;
  descripcion: string;
  tipoVariable: string;
  usuarioInsert: number;
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