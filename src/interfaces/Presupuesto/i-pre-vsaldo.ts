
export interface IPreVSaldo{
  codigoSaldo :number;
  ano :number;
  financiadoId :number;
  codigoFinanciado:number;
  descripcionFinanciado :string;
  codigoIcp :number;
  codigoSector :string;
  codigoPrograma :string;
  codigoSubPrograma :string;
  codigoProyecto :string;
  codigoActividad :string;
  codigoOficina :string;
  codigoIcpConcat :string;
  denominacionIcp :string;
  unidadEjecutora :string;
  codigoPuc :number;
  codigoGrupo:string;
  codigoPartida :string;
  codigoGenerica :string;
  codigoEspecifica :string;
  codigoSubEspecifica :string;
  codigoNivel5 :string;
  codigoPucConcat :string;
  denominacionPuc :string;
  presupuestado :number;
  asignacion :number;
  bloqueado :number;
  modificado  :number;
  ajustado  :number;
  vigente  :number;
  comprometido  :number;
  porComprometido  :number;
  disponible :number;
  causado  :number;
  porCausado :number;
  pagado  :number;
  porPagado  :number;
  codigoEmpresa  :number;
  codigoPresupuesto  :number;
  fechaSolicitud :Date;

  descripcionPresupuesto:string;

  presupuestadoFormat :string;
  disponibleFormat :string;
  asignacionFormat:string;
  bloqueadoFormat:string;
  modificadoFormat:string;
  ajustadoFormat:string;
  vigenteFormat:string;
  comprometidoFormat:string;
  causadoFormat:string;
  pagadoFormat:string;
  searchText:string;

}
