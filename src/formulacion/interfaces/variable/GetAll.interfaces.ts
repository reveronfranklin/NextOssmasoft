import { TipoVariableEnum } from '../../enums/TipoVariable.enum';

export interface DTOVariableGetAll {
  page: number;
  limit: number;
  searchText: string;
  tipoVariable?: TipoVariableEnum;
}

export interface IVariableGetAllResponse {
  id: number;
  code: number;
  descripcion: string;
  tipoVariable: TipoVariableEnum;
  funcion: string;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: number;
  codigoEmpresa: number;
  parametrosVariables: IParametrosVariable[] | [];
}

export interface IParametrosVariable {
  id: number;
  variableId: number;
  orden: number;
  code: string;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: number;
  codigoEmpresa: number;
}

