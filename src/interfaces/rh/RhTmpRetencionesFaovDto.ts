export interface RhTmpRetencionesFaovDto {
  id: number
  codigoRetencionAporte: number
  secuencia: number
  unidadEjecutora: string
  cedulaTexto: string
  nombresApellidos: string
  descripcionCargo: string
  fechaIngreso: Date
  fechaEgreso: Date
  montoFaovTrabajador: number
  montoFaovPatrono: number
  montoTotalRetencion: number
  fechaNomina: string
  siglasTipoNomina: string
  registroConcat: string
  fechaDesde: Date
  fechaHasta: Date
  codigoTipoNomina: number
}


export interface RhTmpRetencionesFaovTxtDto {
  registroConcat:string
}
