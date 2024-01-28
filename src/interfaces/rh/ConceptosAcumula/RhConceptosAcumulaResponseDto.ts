import { IFechaDto } from "src/interfaces/fecha-dto";

export interface IRhConceptosAcumulaResponseDto{
  codigoConceptoAcumula :number;
  codigoConcepto:number;
  tipoAcumuladoId:number
  tipoAcumuladoDescripcion:string;
  codigoConceptoAsociado:number;
  codigoConceptoAsociadoDescripcion:string
  fechaDesdeString:string;
  fechaDesdeObj:IFechaDto | null;
  fechaHastaString :string
  fechaHastaObj :IFechaDto| null;
}
