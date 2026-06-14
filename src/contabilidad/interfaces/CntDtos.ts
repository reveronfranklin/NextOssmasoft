export interface ResultDto<T> {
  data: T
  isValid: boolean
  message: string
  page?: number
  totalPage?: number
  cantidadRegistros?: number
}

export interface CntCatalogDto {
  id: number
  codigo: string
  descripcion: string
  extra1: string
  extra2: string
  extra3: string
}

export interface CntTituloDto {
  tituloId: number
  tituloFkId?: number
  titulo: string
  codigo: string
  extra1: string
  extra2: string
  extra3: string
  codigoEmpresa?: number
}

export interface CntTituloSaveDto {
  usuarioId: number
  tituloId?: number
  tituloFkId?: number
  titulo: string
  codigo?: string
  extra1?: string
  extra2?: string
  extra3?: string
}

export interface CntDescriptivaDto {
  descripcionId: number
  descripcionFkId?: number
  tituloId: number
  titulo: string
  descripcion: string
  codigo: string
  extra1: string
  extra2: string
  extra3: string
  codigoEmpresa?: number
}

export interface CntDescriptivaSaveDto {
  usuarioId: number
  descripcionId?: number
  descripcionFkId?: number
  tituloId: number
  descripcion: string
  codigo?: string
  extra1?: string
  extra2?: string
  extra3?: string
}

export interface CntRubroDto {
  codigoRubro: number
  numeroRubro: string
  denominacion: string
  descripcion: string
  extra1: string
  extra2: string
  extra3: string
  codigoEmpresa?: number
}

export interface CntRubroSaveDto {
  usuarioId: number
  codigoRubro?: number
  numeroRubro: string
  denominacion: string
  descripcion?: string
  extra1?: string
  extra2?: string
  extra3?: string
}

export interface CntBalanceDto {
  codigoBalance: number
  numeroBalance: string
  denominacion: string
  descripcion: string
  extra1: string
  extra2: string
  extra3: string
  codigoEmpresa?: number
  codigoRubro?: number
  numeroRubro: string
  rubro: string
}

export interface CntBalanceSaveDto {
  usuarioId: number
  codigoBalance?: number
  numeroBalance: string
  denominacion: string
  descripcion?: string
  extra1?: string
  extra2?: string
  extra3?: string
  codigoRubro?: number
}

export interface CntMayorAdminDto {
  codigoMayor: number
  numeroMayor: string
  denominacion: string
  descripcion: string
  codigoBalance?: number
  numeroBalance: string
  balance: string
  codigoRubro?: number
  numeroRubro: string
  rubro: string
  columnaBalance: string
  extra1: string
  extra2: string
  extra3: string
  codigoEmpresa?: number
}

export interface CntMayorSaveDto {
  usuarioId: number
  codigoMayor?: number
  numeroMayor: string
  denominacion: string
  descripcion?: string
  codigoBalance: number
  columnaBalance?: string
  extra1?: string
  extra2?: string
  extra3?: string
}

export interface CntAuxiliarAdminDto {
  codigoAuxiliar: number
  codigoMayor: number
  numeroMayor: string
  mayor: string
  segmento1: string
  segmento2: string
  segmento3: string
  segmento4: string
  segmento5: string
  segmento6: string
  segmento7: string
  segmento8: string
  segmento9: string
  segmento10: string
  denominacion: string
  descripcion: string
  extra1: string
  extra2: string
  extra3: string
  codigoEmpresa?: number
  fechaFinVigencia?: string
  codigoProveedor?: number
  vigente: boolean
}

export interface CntAuxiliarSaveDto {
  usuarioId: number
  codigoAuxiliar?: number
  codigoMayor: number
  segmento1?: string
  segmento2?: string
  segmento3?: string
  segmento4?: string
  segmento5?: string
  segmento6?: string
  segmento7?: string
  segmento8?: string
  segmento9?: string
  segmento10?: string
  denominacion: string
  descripcion?: string
  extra1?: string
  extra2?: string
  extra3?: string
  fechaFinVigencia?: string | null
  codigoProveedor?: number
}

export interface CntAuxiliarPucDto {
  codigoAuxiliarPuc: number
  codigoAuxiliar: number
  auxiliar: string
  codigoMayor: number
  mayor: string
  codigoPuc: number
  tipoDocumentoId: string
  codigoEmpresa?: number
}

export interface CntAuxiliarPucSaveDto {
  usuarioId: number
  codigoAuxiliarPuc?: number
  codigoAuxiliar: number
  codigoPuc: number
  tipoDocumentoId?: string
}

export interface CntCloneDescriptivasDto {
  usuarioId: number
  empresaOrigen: number
}

export interface CntCloneDescriptivasResultDto {
  titulos: number
  descriptivas: number
}

export interface CntClonePlanCuentasDto {
  usuarioId: number
  empresaOrigen: number
}

export interface CntClonePlanCuentasResultDto {
  rubros: number
  balances: number
  mayores: number
  auxiliares: number
  relacionesPuc: number
}

export interface CntPeriodoDto {
  codigoPeriodo: number
  nombrePeriodo: string
  fechaDesde: string
  fechaHasta: string
  anoPeriodo: number
  numeroPeriodo: number
  cerrado: boolean
}

export interface CntPeriodoAdminDto extends CntPeriodoDto {
  fechaCierre?: string
  extra1: string
  extra2: string
  extra3: string
  codigoEmpresa?: number
}

export interface CntPeriodoSaveDto {
  usuarioId: number
  codigoPeriodo?: number
  nombrePeriodo: string
  fechaDesde: string
  fechaHasta: string
  anoPeriodo: number
  numeroPeriodo: number
  cerrado: boolean
  extra1?: string
  extra2?: string
  extra3?: string
}

export interface CntPeriodoGenerateYearDto {
  usuarioId: number
  anoPeriodo: number
}

export interface CntCierrePeriodoGetDto {
  usuarioId: number
  anoPeriodo?: number | null
  soloPendientes?: boolean
  searchText?: string
}

export interface CntCierrePeriodoDto {
  codigoPeriodo: number
  nombrePeriodo: string
  fechaDesde: string
  fechaHasta: string
  anoPeriodo: number
  numeroPeriodo: number
  fechaPrecierre?: string | null
  usuarioPrecierre?: number | null
  fechaCierre?: string | null
  usuarioCierre?: number | null
  estado: 'ABIERTO' | 'PRECIERRE' | 'MODIFICADO' | 'CERRADO' | string
  cantidadTmpSaldos: number
  cantidadTmpAnalitico: number
  cantidadSaldos: number
  cantidadHistAnalitico: number
  cantidadModificaciones: number
  codigoEmpresa?: number | null
}

export interface CntCierreActionDto {
  usuarioId: number
  codigoPeriodo: number
}

export interface CntCierreActionResultDto {
  codigoPeriodo: number
  estado: string
  mensaje: string
  cantidadSaldos: number
  cantidadAnalitico: number
}

export interface CntCierreModificacionesDto {
  usuarioId: number
  codigoPeriodo: number
}

export interface CntCierreModificacionesResultDto {
  codigoPeriodo: number
  cantidadModificaciones: number
}

export interface CntRelacionDocumentoDto {
  codigoRelacionDocumento: number
  tipoDocumentoId: number
  tipoDocumentoCodigo: string
  tipoDocumento: string
  tipoDocumentoTituloId: number
  tipoTransaccionId: number
  tipoTransaccionCodigo: string
  tipoTransaccion: string
  tipoTransaccionTituloId: number
  extra1: string
  extra2: string
  extra3: string
  codigoEmpresa?: number
}

export interface CntRelacionDocumentoSaveDto {
  usuarioId: number
  codigoRelacionDocumento?: number
  tipoDocumentoId: number
  tipoTransaccionId: number
  extra1?: string
  extra2?: string
  extra3?: string
}

export interface CntSaldoDto {
  codigoSaldo: number
  codigoPeriodo: number
  periodo: string
  codigoMayor: number
  mayor: string
  codigoAuxiliar: number
  auxiliar: string
  debitos: number
  creditos: number
  monto: number
  extra1: string
  extra2: string
  extra3: string
  codigoEmpresa?: number
}

export interface CntSaldoSaveDto {
  usuarioId: number
  codigoSaldo?: number
  codigoPeriodo: number
  codigoMayor: number
  codigoAuxiliar: number
  debitos: number
  creditos: number
  extra1?: string
  extra2?: string
  extra3?: string
}

export interface CntBancoDto {
  codigoBanco: number
  nombre: string
  codigoInterbancario: string
  codigoEmpresa?: number
}

export interface CntCuentaBancoDto {
  codigoCuentaBanco: number
  codigoBanco: number
  banco: string
  tipoCuentaId?: number
  noCuenta: string
  formatoMascara: string
  denominacionFuncionalId?: number
  denominacionFuncional: string
  codigo: string
  principal: boolean
  recaudadora: boolean
  codigoMayor?: number
  mayor: string
  codigoAuxiliar?: number
  auxiliar: string
  searchText: string
  codigoEmpresa?: number
}

export interface CntConciliacionDto {
  codigoConciliacion: number
  codigoPeriodo: number
  nombrePeriodo: string
  anoPeriodo: number
  numeroPeriodo: number
  codigoCuentaBanco: number
  codigoBanco: number
  banco: string
  noCuenta: string
  denominacionFuncional: string
  saldoBanco: number
  saldoLibro: number
  fechaPrecierre?: string
  fechaCierre?: string
  estado: string
  codigoEmpresa?: number
}

export interface CntConciliacionGetAllDto {
  usuarioId: number
  codigoPeriodo?: number | null
  codigoBanco?: number | null
  codigoCuentaBanco?: number | null
  estado?: string
  searchText?: string
}

export interface CntConciliacionCreateDto {
  usuarioId: number
  codigoPeriodo: number
  codigoCuentaBanco: number
}

export interface CntConciliacionActionDto {
  usuarioId: number
  codigoConciliacion: number
  forzarDiferencia?: boolean
}

export interface CntConciliacionDetalleGetDto {
  usuarioId: number
  codigoConciliacion: number
  soloPendientes?: boolean
  searchText?: string
}

export interface CntConciliacionTemporalGetDto {
  usuarioId: number
  codigoConciliacion: number
  searchText?: string
}

export interface CntConciliacionMatchDto {
  usuarioId: number
  codigoConciliacion: number
  codigoDetalleEdoCta?: number | null
  codigoDetalleLibro?: number | null
}

export interface CntConciliacionMatchMultiDto {
  usuarioId: number
  codigoConciliacion: number
  codigosDetalleEdoCta: number[]
  codigosDetalleLibro: number[]
}

export interface CntConciliacionSuggestionGetDto {
  usuarioId: number
  codigoConciliacion: number
  toleranciaDias: number
  toleranciaMonto: number
  maxRows?: number
}

export interface CntConciliacionSuggestionDto {
  codigoDetalleEdoCta: number
  codigoDetalleLibro: number
  bancoFecha: string
  libroFecha: string
  numeroTransaccion: string
  numeroDocumento: string
  bancoDescripcion: string
  libroDescripcion: string
  bancoMonto: number
  libroMonto: number
  diferenciaMonto: number
  diferenciaDias: number
  matchMonto: boolean
  matchNumero: boolean
  matchFecha: boolean
  score: number
  motivos: string
  codigoEmpresa?: number
}

export interface CntConciliacionUnmatchDto {
  usuarioId: number
  codigoTmpConciliacion: number
}

export interface CntConciliacionBancoMovimientoDto {
  codigoDetalleEdoCta: number
  codigoEstadoCuenta: number
  numeroEstadoCuenta: string
  tipoTransaccionId?: number
  tipoTransaccion: string
  numeroTransaccion: string
  fechaTransaccion: string
  descripcion: string
  monto: number
  status: string
  codigoTmpConciliacion?: number
  enTemporal: boolean
  codigoEmpresa?: number
}

export interface CntConciliacionLibroMovimientoDto {
  codigoDetalleLibro: number
  codigoLibro: number
  fechaLibro: string
  tipoDocumentoId: number
  tipoDocumento: string
  codigoCheque?: number
  codigoIdentificador?: number
  origenId?: number
  numeroDocumento: string
  descripcion: string
  monto: number
  status: string
  codigoTmpConciliacion?: number
  enTemporal: boolean
  codigoEmpresa?: number
}

export interface CntConciliacionTemporalDto {
  codigoTmpConciliacion: number
  codigoConciliacion: number
  codigoPeriodo: number
  codigoCuentaBanco: number
  codigoDetalleLibro?: number
  codigoDetalleEdoCta?: number
  fecha: string
  numero: string
  monto: number
  tipo: string
  bancoDescripcion: string
  libroDescripcion: string
  codigoEmpresa?: number
}

export interface CntBancoArchivoGetDto {
  usuarioId: number
  codigoBanco?: number | null
  codigoCuentaBanco?: number | null
  searchText?: string
}

export interface CntBancoArchivoDto {
  codigoBancoArchivoControl: number
  codigoBanco: number
  banco: string
  codigoCuentaBanco: number
  noCuenta: string
  nombreArchivo: string
  fechaDesde: string
  fechaHasta: string
  saldoInicial: number
  saldoFinal: number
  codigoEstadoCuenta?: number
  confirmado: boolean
  cantidadMovimientos: number
  montoMovimientos: number
  codigoEmpresa?: number
}

export interface CntBancoArchivoTraceGetDto {
  usuarioId: number
  codigoBanco?: number | null
  codigoCuentaBanco?: number | null
  soloConErrores?: boolean
  searchText?: string
}

export interface CntBancoArchivoTraceDto {
  codigoBancoArchivoControl: number
  nombreArchivo: string
  banco: string
  noCuenta: string
  tipoFormato: string
  estadoExtraccion: string
  confianzaPromedio: number
  cantidadErrores: number
  cantidadCambios: number
  cantidadMovimientos: number
  fechaExtraccion: string
  usuarioExtrae?: number | null
  usuarioCorrige?: number | null
  usuarioConfirma?: number | null
  fechaConfirma?: string | null
  confirmado: boolean
}

export interface CntBancoArchivoConfirmDto {
  usuarioId: number
  codigoBancoArchivoControl: number
}

export interface CntBancoArchivoConfirmResultDto {
  codigoEstadoCuenta: number
  cantidad: number
}

export interface CntBancoArchivoDetalleGetDto {
  usuarioId: number
  codigoBancoArchivoControl: number
}

export interface CntBancoArchivoDetalleLineDto {
  fechaTransaccion: string
  numeroTransaccion: string
  tipoTransaccionId: number
  tipoTransaccion: string
  descripcionTransaccion: string
  montoTransaccion: number
  confianza?: number | null
  advertencias?: string[] | null
}

export interface CntBancoArchivoExtractDto {
  usuarioId: number
  codigoBanco?: number | null
  codigoCuentaBanco?: number | null
  codigoFormato?: number | null
  tipoFormato: string
  nombreArchivo?: string | null
  contenidoBase64?: string | null
  textoPegado?: string | null
}

export interface CntBancoArchivoExtractErrorDto {
  numeroLinea: number
  campo: string
  mensaje: string
  textoOrigen: string
}

export interface CntBancoArchivoExtractPageDto {
  numeroPagina: number
  texto: string
}

export interface CntBancoArchivoExtractResultDto {
  tipoFormato: string
  cantidadLineas: number
  cantidadErrores: number
  confianzaPromedio: number
  lineas: CntBancoArchivoDetalleLineDto[]
  errores: CntBancoArchivoExtractErrorDto[]
  textoExtraido?: string | null
  paginasTexto?: CntBancoArchivoExtractPageDto[] | null
  detallesOriginales?: CntBancoArchivoDetalleLineDto[] | null
}

export interface CntBancoFormatoGetAllDto {
  usuarioId: number
  codigoBanco?: number | null
  codigoCuentaBanco?: number | null
  tipoFormato?: string
  soloActivos?: boolean
  searchText?: string
}

export interface CntBancoFormatoDto {
  codigoFormato: number
  codigoBanco: number
  banco: string
  codigoCuentaBanco?: number | null
  cuenta: string
  nombreFormato: string
  tipoFormato: string
  delimitador: string
  tieneEncabezado: boolean
  filaInicio: number
  hojaExcel: string
  mapeoJson: string
  reglasJson: string
  activo: boolean
  codigoEmpresa: number
}

export interface CntBancoFormatoSaveDto {
  usuarioId: number
  codigoFormato?: number | null
  codigoBanco: number
  codigoCuentaBanco?: number | null
  nombreFormato: string
  tipoFormato: string
  delimitador?: string | null
  tieneEncabezado: boolean
  filaInicio: number
  hojaExcel?: string | null
  mapeoJson?: string | null
  reglasJson?: string | null
  activo: boolean
}

export interface CntBancoFormatoDeleteDto {
  usuarioId: number
  codigoFormato: number
}

export interface CntBancoArchivoBatchCreateDto {
  usuarioId: number
  codigoBanco: number
  codigoCuentaBanco: number
  codigoFormato?: number | null
  tipoFormato?: string | null
  nombreArchivo: string
  fechaDesde: string
  fechaHasta: string
  saldoInicial: number
  saldoFinal: number
  confianzaPromedio?: number | null
  contenidoBase64?: string | null
  textoOrigen?: string | null
  paginasTexto?: CntBancoArchivoExtractPageDto[] | null
  errores?: CntBancoArchivoExtractErrorDto[] | null
  detallesOriginales?: CntBancoArchivoDetalleLineDto[] | null
  detalles: CntBancoArchivoDetalleLineDto[]
}

export interface CntBancoArchivoBatchCreateResultDto {
  codigoBancoArchivoControl: number
  cantidad: number
}

export interface CntEstadoCuentaGetDto {
  usuarioId: number
  codigoBanco?: number | null
  codigoCuentaBanco?: number | null
  fechaDesde?: string | null
  fechaHasta?: string | null
  searchText?: string
}

export interface CntEstadoCuentaDto {
  codigoEstadoCuenta: number
  codigoCuentaBanco: number
  noCuenta: string
  codigoBanco: number
  banco: string
  numeroEstadoCuenta: string
  fechaDesde: string
  fechaHasta: string
  saldoInicial: number
  saldoFinal: number
  cantidadMovimientos: number
  montoMovimientos: number
  codigoEmpresa?: number
}

export interface CntEstadoCuentaDetalleGetDto {
  usuarioId: number
  codigoEstadoCuenta: number
  status?: string
  searchText?: string
}

export interface CntEstadoCuentaDetalleDto {
  codigoDetalleEdoCta: number
  codigoEstadoCuenta: number
  tipoTransaccionId?: number
  tipoTransaccion: string
  numeroTransaccion: string
  fechaTransaccion: string
  descripcion: string
  monto: number
  status: string
  codigoEmpresa?: number
}

export interface CntLibroBancoGetDto {
  usuarioId: number
  codigoBanco?: number | null
  codigoCuentaBanco?: number | null
  fechaDesde?: string | null
  fechaHasta?: string | null
  status?: string
  searchText?: string
}

export interface CntLibroBancoDto {
  codigoLibro: number
  codigoCuentaBanco: number
  noCuenta: string
  codigoBanco: number
  banco: string
  fechaLibro: string
  status: string
  cantidadMovimientos: number
  montoMovimientos: number
  codigoEmpresa?: number
}

export interface CntLibroBancoDetalleGetDto {
  usuarioId: number
  codigoLibro: number
  status?: string
  searchText?: string
}

export interface CntLibroBancoGenerateDto {
  usuarioId: number
  codigoCuentaBanco: number
  fechaDesde: string
  fechaHasta: string
}

export interface CntLibroBancoGenerateResultDto {
  cantidadLibros: number
  cantidadMovimientos: number
}

export interface CntLibroBancoDetalleDto {
  codigoDetalleLibro: number
  codigoLibro: number
  tipoDocumentoId: number
  tipoDocumento: string
  codigoCheque?: number
  codigoIdentificador?: number
  origenId?: number
  numeroDocumento: string
  descripcion: string
  monto: number
  status: string
  codigoEmpresa?: number
}

export interface CntMayorDto {
  codigoMayor: number
  numeroMayor: string
  denominacion: string
  descripcion: string
  columnaBalance: string
}

export interface CntAuxiliarDto {
  codigoAuxiliar: number
  codigoMayor: number
  segmento1: string
  segmento2: string
  denominacion: string
  descripcion: string
}

export interface CntComprobanteDto {
  codigoComprobante: number
  codigoPeriodo: number
  periodo: string
  tipoComprobanteId: number
  tipoComprobante: string
  numeroComprobante: string
  fechaComprobante: string
  origenId?: number
  origen: string
  observacion: string
  totalDebe: number
  totalHaber: number
  diferencia: number
  esAutomatico: boolean
  codigoEmpresa: number
}

export interface CntDetalleDto {
  codigoDetalleComprobante: number
  codigoComprobante: number
  codigoMayor: number
  mayor: string
  codigoAuxiliar: number
  auxiliar: string
  referencia1: string
  referencia2: string
  referencia3: string
  descripcion: string
  monto: number
  debe: number
  haber: number
  codigoEmpresa: number
}

export interface CntComprobantePrintDto {
  encabezado: CntComprobanteDto
  detalles: CntDetalleDto[]
}

export interface CntComprobanteReorderDto {
  usuarioId: number
  codigoPeriodo: number
  tipoComprobanteId: number
}

export interface CntComprobanteReorderResultDto {
  cantidad: number
}

export interface CntPermissionDto {
  usuarioId: number
  permission: string
}

export interface CntPermissionResultDto {
  hasPermission: boolean
  permission: string
}

export interface CntDetalleCreateDto {
  codigoMayor: number
  codigoAuxiliar: number
  referencia1?: string
  referencia2?: string
  referencia3?: string
  descripcion?: string
  monto: number
}

export interface CntComprobanteGetAllDto {
  usuarioId: number
  pageSize: number
  pageNumber: number
  searchText: string
  codigoPeriodo?: number
  origenId?: number
  fechaDesde?: string
  fechaHasta?: string
  esAutomatico?: boolean | null
}

export interface CntComprobanteSaveDto {
  codigoComprobante?: number
  usuarioId: number
  codigoPeriodo: number
  tipoComprobanteId: number
  fechaComprobante: string
  origenId?: number
  observacion?: string
  detalles: CntDetalleCreateDto[]
}

export interface CntAutomaticPreviewDto {
  usuarioId: number
  codigoPeriodo: number
  tipoComprobanteId: number
  origenId: number
  fechaDesde: string
  fechaHasta: string
}

export interface CntAutomaticConfirmDto extends CntAutomaticPreviewDto {
  observacion?: string
}

export interface CntAutomaticLineDto {
  secuencia: number
  codigoMayor: number
  mayor: string
  codigoAuxiliar: number
  auxiliar: string
  referencia1: string
  referencia2: string
  referencia3: string
  descripcion: string
  monto: number
  debe: number
  haber: number
}

export interface CntAutomaticPreviewResultDto {
  codigoPeriodo: number
  tipoComprobanteId: number
  origenId: number
  fechaDesde: string
  fechaHasta: string
  totalDebe: number
  totalHaber: number
  diferencia: number
  lineas: CntAutomaticLineDto[]
}

export interface CntAutomaticDailyConfirmResultDto {
  fechaComprobante: string
  codigoComprobante: number
  numeroComprobante: string
  cantidadLineas: number
  totalDebe: number
  totalHaber: number
  diferencia: number
  estado: string
  mensaje: string
}

export interface CntAutomaticConfirmResultDto {
  cantidadComprobantes: number
  cantidadDiasSinLineas: number
  cantidadErrores: number
  totalLineas: number
  totalDebe: number
  totalHaber: number
  diferencia: number
  comprobantes: CntAutomaticDailyConfirmResultDto[]
}

export interface CntMayorAnaliticoGetAllDto {
  usuarioId: number
  pageSize: number
  pageNumber: number
  searchText: string
  codigoPeriodo?: number
  codigoMayor?: number
  codigoAuxiliar?: number
  fechaDesde?: string
  fechaHasta?: string
}

export interface CntMovimientoAuxiliarGetAllDto {
  usuarioId: number
  pageSize: number
  pageNumber: number
  searchText: string
  codigoPeriodo?: number
  codigoAuxiliar?: number
  fechaDesde?: string
  fechaHasta?: string
}

export interface CntMayorAnaliticoDto {
  codigoComprobante?: number
  codigoMayor: number
  codigoAuxiliar: number
  codigoCuenta: string
  denominacionCuenta: string
  numeroComprobante: string
  fechaComprobante?: string
  descripcion: string
  referencia1: string
  referencia2: string
  monto: number
  debe: number
  haber: number
  codigoEmpresa: number
}

export interface CntMovimientoAuxiliarDto {
  codigoComprobante?: number
  codigoAuxiliar: number
  numeroContable: string
  nombreAuxiliar: string
  numeroComprobante: string
  fechaComprobante?: string
  descripcion: string
  referencia1: string
  referencia2: string
  monto: number
  debe: number
  haber: number
  codigoEmpresa: number
}
