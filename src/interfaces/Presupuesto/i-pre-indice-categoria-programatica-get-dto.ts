import { IFechaDto } from '../fecha-dto';

export interface IPreIndiceCategoriaProgramaticaGetDto{

  codigoIcp :number;
  codigoIcpPadre :number;
  ano :number;
  codigoSector:string;
  codigoPrograma :string;
  codigoSubPrograma :string
  codigoProyecto:string;
  codigoActividad :string;
  denominacion :string;
  unidadEjecutora?:string;
  descripcion:string;
  codigoFuncionario:number;
  fechaIni :string;
  fechaFin :string;
  fechaIniObj:IFechaDto;
  fechaFinObj :IFechaDto;
  extra1 :string;
  extra2 :string;
  extra3 :string;
  codigoOficina :string;
  codigoPresupuesto:number;
  codigoIcpConcat:string;
  searchText:string

}
