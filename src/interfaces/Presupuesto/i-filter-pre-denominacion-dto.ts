export interface IPreDenominacionDto{
  nivel:number;
  codigoPresupuesto:number;
  codigoPartida:string;
  codigoGenerica:string;
  codigoEspecifica:string;
  codigoSubEspecifica:string;
  codigoNivel5:string;
  codigoPucConcat:string;
  denominacionPuc:string;
  denominacion:string;
  presupuestado:number;
  modificado:number;
  vigente:number;
  comprometido:number;
  bloqueado:number;
  causado:number;
  pagado:number;
  deuda:number;
  disponibilidad:number;
  asignacion:number;
  disponibilidadFinan:number;

}


export interface IFilterPreDenominacionDto{
  codigoPresupuesto:number;
  financiadoId:number
  fechaDesde :string;
  fechaHasta:string;
  codigoGrupo:string;
  nivel:number;
}
