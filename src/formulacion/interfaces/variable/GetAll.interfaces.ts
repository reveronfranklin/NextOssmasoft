export interface DTOVariableGetAll {
  page: number;
  limit: number;
  searchText: string;
  tipoVariable: string;
}

export interface IVariableGetAllResponse {
  id: number;
  code: number;
  descripcion: string;
  tipoVariable: string;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: any;
  codigoEmpresa: number;
}