export interface ReporteBm1FilterDto {
  fechaDesde: Date | string
  fechaHasta: Date | string
  codigosIcp: number[]
}

export interface ReporteBm1IcpDto {
  codigoIcp: number
  unidadTrabajo: string
}

export interface ReporteBm1ItemDto {
  unidadTrabajo: string
  codigoGrupo: string
  codigoNivel1: string
  codigoNivel2: string
  numeroLote: string
  cantidad: number
  numeroPlaca: string
  valorActual: number
  articulo: string
  especificacion: string
  servicio: string
  responsableBien: string
  fechaMovimiento: string | null
}

export interface ReporteBm1ApiResponse<T> {
  data?: T | null
  isValid?: boolean
  message?: string
  cantidadRegistros?: number
}
