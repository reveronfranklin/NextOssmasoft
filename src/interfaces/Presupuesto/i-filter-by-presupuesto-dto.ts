export interface FilterByPresupuestoDto{
  codigoPresupuesto:number;
}
export interface FilterPrePresupuestoDto{
  codigoPresupuesto:number;
  searchText? :string;
  codigoEmpresa:number;
  financiadoId:number;
  fechaDesde:Date;
  fechaHasta:Date;
}
