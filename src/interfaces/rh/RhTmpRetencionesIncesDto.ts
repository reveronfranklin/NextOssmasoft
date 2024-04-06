export interface RhTmpRetencionesIncesDto {
  id: number
  codigoRetencionAporte: number
  secuencia: number
  unidadEjecutora: string
  cedulaTexto: string
  nombresApellidos: string
  descripcionCargo: string
  fechaIngreso: Date
  montoIncesTrabajador: number
  montoIncesPatrono: number
  montoTotalRetencion: number
  fechaNomina: string
  siglasTipoNomina: string
  fechaDesde: Date
  fechaHasta: Date
  codigoTipoNomina: number
}
