import { IFormulaBase } from './FormulaBase.interfaces';

export interface DTOGetAllFormula {
  page: number;
  limit: number;
  searchText: string;
}

export type IFormulaResponse = IFormulaBase