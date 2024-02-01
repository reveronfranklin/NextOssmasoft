import { IFechaDto } from "src/interfaces/fecha-dto";

export interface IRhConceptosFormulaResponseDto{
 codigoFormulaConcepto  :number;
  codigoConcepto:number;
  porcentaje:number;
  montoTope:number;
  porcentajePatronal:number;
  tipoSueldo:string;
  tipoSueldoDescripcion:string;
  fechaDesde:Date | null;
  fechaDesdeString:string;
  fechaDesdeObj:IFechaDto | null;
  fechaHasta:Date |null;
  fechaHastaString :string
  fechaHastaObj :IFechaDto| null;
}
