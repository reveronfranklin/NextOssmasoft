export interface IPreDenominacionPuc{
  codigoPresupuesto:string;
  anoSaldo:number;
  mesSaldo:number;
  codigoPartida:string;
  codigoGenerica:string;
  codigoEspecifica:string;
  codigoSubEspecifica:string;
  codigoNivel5:string;
  denominacionPuc:string;
  presupuestado:number;
  modificado:number;
  comprometido:number;
  causado:number;
  pagado:number;
  deuda:number;
  disponibilidad:number;
  disponibilidadFinan:number;
  totalPresupuestado:number;
  presupuestadoString:string;
  disponibilidadString:string;
  disponibilidadFinanString:string;
}

export interface IFilterPreVDenominacionPuc{
  codigoPresupuesto:string;

}
export interface IPreDenominacionPucResumen{
  codigoPresupuesto:string;
  anoSaldo:number;
  codigoPartida:string;
  codigoGenerica:string;
  codigoEspecifica:string;
  codigoSubEspecifica:string;
  codigoNivel5:string;
  denominacionPuc:string;
  presupuestado:number;
  modificado:number;
  comprometido:number;
  causado:number;
  pagado:number;
  deuda:number;
  disponibilidad:number;
  disponibilidadFinan:number;
  totalPresupuestado:number;
  presupuestadoString:string;
  disponibilidadString:string;
  modificadoString:string;
  vigenteString:string;
  codigoPUC:string;
}
