export interface DTOFindOneParametro {
  id: number;
}

export type IFindOneParametroResponse = {
  id: number;
  variableId: number;
  orden: number;
  descripcionVariable: string;
  code: string;
  searchText: string;
};
