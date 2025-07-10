export interface DTOGetAllFormula {
  page: number;
  limit: number;
  searchText: string;
}

export interface IFormulaResponse {
  id: number;
  descripcion: string;
  formula: string;
  estado: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: any;
  codigoEmpresa: number;
}