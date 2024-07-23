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
  fechaIniString? :string;
  fechaFinString? :string;
  fechaIngresoString? :string;
  fechaIni? :Date;
  fechaFin? :Date;
  fechaIngreso? :Date;
  fechaIniObj?:IFechaDto;
  fechaFinObj? :IFechaDto;
  fechaIngresoObj? :IFechaDto;



  codigoRelacionCargoPre :number;
  searchText:string
}
