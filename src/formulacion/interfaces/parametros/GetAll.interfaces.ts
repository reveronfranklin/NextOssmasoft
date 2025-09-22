export interface DTOGetAllParametros {
  page: number;
  limit: number;
  searchText: string;
}

export type IGetAllParametrosResponse = {
  id: number;
  variableId: number;
  orden: number;
  descripcionVariable: string;
  code: string;
  searchText: string;
};
