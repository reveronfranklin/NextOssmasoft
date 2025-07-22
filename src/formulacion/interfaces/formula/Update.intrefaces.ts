import { IFormulaBase } from './FormulaBase.interfaces';

export interface DTOFormulaUpdate {
  id: number;
  descripcion: string;
  formula: string;
  usuarioInsert: number;
  codigoEmpresa: number;
}

export type IFormulaUpdateResponse = IFormulaBase