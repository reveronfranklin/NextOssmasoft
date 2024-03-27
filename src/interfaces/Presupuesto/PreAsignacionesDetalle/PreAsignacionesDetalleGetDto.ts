import { IFechaDto } from "src/interfaces/fecha-dto";

export interface IPreAsignacionesDetalleGetDto {
  codigoAsignacionDetalle:number;
	codigoAsignacion :number;
  fechaDesembolso:Date | null;
  fechaDesembolsoString:string;
  fechaDesembolsoObj :IFechaDto | null;
  monto:number;
  notas:string;
  searchText:string;
}
