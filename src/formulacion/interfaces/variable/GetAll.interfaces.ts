import { TipoVariableEnum } from '../../enums/TipoVariable.enum';

export interface DTOVariableGetAll {
  page: number;
  limit: number;
  searchText: string;
  tipoVariable: TipoVariableEnum;
}

export interface IVariableGetAllResponse {
  id: number;
  code: number;
  descripcion: string;
  tipoVariable: TipoVariableEnum;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: any;
  codigoEmpresa: number;
}