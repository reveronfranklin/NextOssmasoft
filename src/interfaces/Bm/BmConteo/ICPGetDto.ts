export interface ICPGetDto {
  codigoIcp:number;
  unidadTrabajo:string;


}
export interface Bm1Filter {
  listIcpSeleccionado:ICPGetDto[];
  fechaDesde:Date;
 fechaHasta :Date;


}
