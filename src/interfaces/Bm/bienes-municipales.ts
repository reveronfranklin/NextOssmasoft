export type BmRow = Record<string, string | number | boolean | null | undefined>

export interface BmPagedFilter {
  searchText?: string
  page: number
  pageSize: number
}

export interface BmBienRow extends BmRow {
  codigoBien?: number
  codigoArticulo?: number
  codigoDirBien?: number
  articulo?: string
  numeroPlaca?: string
  numeroLote?: string
  cantidad?: number
  valorInicial?: number
  valorActual?: number
  fechaCompraString?: string
  numeroFactura?: string
  especificacion?: string
  responsableBien?: string
  unidadTrabajo?: string
}

export interface BmFotoRow extends BmRow {
  codigoBienFoto?: number
  codigoBien?: number
  numeroPlaca?: string
  foto?: string
  titulo?: string
  patch?: string
}

export interface BmDetalleBienRow extends BmRow {
  codigoDetalleBien?: number
  codigoBien?: number
  tipoEspecificacionId?: number
  tipoEspecificacion?: string
  especificacionId?: number
  especificacionIdDescripcion?: string
  especificacion?: string
}

export interface BmDetalleArticuloRow extends BmRow {
  codigoDetalleArticulo?: number
  codigoArticulo?: number
  tipoEspecificacionId?: number
  tipoEspecificacion?: string
}

export interface BmDescriptivaRow extends BmRow {
  id?: number
  descripcionId?: number
  tituloId?: number
  descripcion?: string
  codigo?: string
  extra1?: string
  extra2?: string
  extra3?: string
}

export interface BmUbicacionRow extends BmRow {
  codigoDirBien?: number
  codigoIcp?: number
  unidadEjecutora?: string
  vialidad?: string
  vivienda?: string
  nivel?: string
  numeroUnidad?: string
  complementoDir?: string
  direccion?: string
}

export interface BmMovimientoRow extends BmRow {
  codigoMovBien?: number
  codigoBien?: number
  numeroPlaca?: string
  articulo?: string
  tipoMovimiento?: string
  tipoMovimientoDescripcion?: string
  fechaMovimientoString?: string
  codigoDirBien?: number
  codigoIcp?: number
  unidadEjecutora?: string
  conceptoMovimiento?: string
  esMovimientoFinal?: boolean
}

export interface BmSolicitudMovimientoRow extends BmMovimientoRow {
  codigoSolMovBien?: number
  numeroSolicitud?: string
  aprobado?: boolean
  fechaSolicitaString?: string
  fechaIncidencia?: string
  notaIncidencia?: string
}

export interface BmProcesoMasivoRow extends BmRow {
  codigoProcesoMasivo?: number
  codigoProcesoMasivoDet?: number
  codigoBien?: number
  numeroPlaca?: string
  articulo?: string
  codigoDirOrigen?: number
  codigoIcpOrigen?: number
  unidadOrigen?: string
  codigoDirDestino?: number
  unidadDestino?: string
  estado?: string
  mensaje?: string
  codigoMovBien?: number
  totalProcesados?: number
  totalExitosos?: number
  totalRechazados?: number
}
