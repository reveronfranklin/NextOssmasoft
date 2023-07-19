import { IPreFinanciadoDto } from "./i-list-pre-financiado-dto";

export interface IListPresupuestoDto{
  codigoPresupuesto:number;
  descripcion:string;
  ano:number;
  preFinanciadoDto:IPreFinanciadoDto[];
}
