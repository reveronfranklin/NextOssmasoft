import { ICPGetDto } from "./BmConteo/ICPGetDto";

export interface Bm1FilterDto {
  listIcpSeleccionado:ICPGetDto[]
  fechaDesde: Date;
  fechaHasta:Date

}
