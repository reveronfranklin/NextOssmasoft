import { IFormulaBase } from './FormulaBase.interfaces';

export interface DTOFormulaCreate {
  formula: string;
  descripcion: string;
  usuarioInsert: number;
  codigoEmpresa: number;
}

export type IFormulaCreateResponse = IFormulaBase