export interface RhTmpRetencionesFjpDto {
  id: number
  codigoRetencionAporte: number
  secuencia: number
  unidadEjecutora: string
  cedulaTexto: string
  nombresApellidos: string
  descripcionCargo: string
  fechaIngreso: Date
  montoFjpTrabajador: number
  montoFjpPatrono: number
  montoTotalRetencion: number
  fechaNomina: number
  siglasTipoNomina: string
  fechaDesde: Date
  fechaHasta: Date
  codigoTipoNomina: number
}
