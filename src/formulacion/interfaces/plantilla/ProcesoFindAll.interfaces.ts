export interface DTOProcesoFindAll {
  page: number;
  limit: number;
  searchText: string;
}

export interface IProcesoFindAllResponse {
  id: number;
  externalCode: string;
  descripcion: string;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: string | null;
  codigoEmpresa: number;
}
