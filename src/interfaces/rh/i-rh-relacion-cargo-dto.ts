import { IFechaDto } from "../fecha-dto";

export interface  IRhRelacionCargoDto{
  codigoRelacionCargo:number;

  codigoCargo :number
  denominacionCargo :string;
  tipoNomina:number;
  codigoIcp:number;
  codigoPersona :number;
  nombre:string;
  apellido :string;
  cedula:number;
  sueldo :number;
  fechaIni? :string;
  fechaFin? :string;
  fechaIniObj:IFechaDto;
  fechaFinObj :IFechaDto;

  codigoRelacionCargoPre :number;
  searchText:string
}
