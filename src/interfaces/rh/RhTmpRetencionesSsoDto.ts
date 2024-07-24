
export interface RhTmpRetencionesSsoDto{

  id:number;
  codigoRetencionAporte:number;
  secuencia:number;
  unidadEjecutora :string;
  nombresApellidos:string;
  descripcionCargo:string;
  fechaIngreso:Date
  montoSsoTrabajador :number;
  montoRpeTrabajador :number;
  montoSsoPatrono :number;
  montoRpePatrono :number;
  montoTotalRetencion :number;
  fechaNomina :string;
  siglasTipoNomina:string;
  fechaDesde :Date;
  fechaHasta :Date;
  codigoTipoNomina:number;
}
