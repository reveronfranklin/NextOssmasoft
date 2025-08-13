export interface DTOProcesoDetalleFindAll {
  page: number;
  limit: number;
  searchText: string;
  codigoProceso: number;
}

export interface IProcesoDetalleFindAllResponse {
  id: number;
  codigoProceso: number;
  externalCode: string;
  externalDescription: string;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: any;
  codigoEmpresa: number;
}
