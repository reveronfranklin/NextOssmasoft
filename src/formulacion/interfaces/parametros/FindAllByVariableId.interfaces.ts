export interface DTOFindAllByVariableId {
  variableId: number;
}

export type IFindAllByVariableIdResponse = {
  id: number;
  variableId: number;
  orden: number;
  descripcionVariable: string;
  code: string;
  searchText: string;
};
