import { IFechaDto } from "../fecha-dto";

export interface IFilterFechaTipoNomina{

  fechaDesde:string;
  fechaHasta :string;
  tipoNomina:number;
  fechaDesdeObj:IFechaDto;
  fechaHastaObj:IFechaDto;

}
