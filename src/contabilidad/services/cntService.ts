import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import {
  CntAutomaticConfirmDto,
  CntAutomaticConfirmResultDto,
  CntAuxiliarAdminDto,
  CntAuxiliarPucDto,
  CntAuxiliarPucSaveDto,
  CntAutomaticPreviewDto,
  CntAutomaticPreviewResultDto,
  CntAuxiliarDto,
  CntAuxiliarSaveDto,
  CntBalanceDto,
  CntBalanceSaveDto,
  CntBancoArchivoConfirmDto,
  CntBancoArchivoConfirmResultDto,
  CntBancoArchivoBatchCreateDto,
  CntBancoArchivoBatchCreateResultDto,
  CntBancoArchivoDetalleGetDto,
  CntBancoArchivoDetalleLineDto,
  CntBancoArchivoDto,
  CntBancoArchivoExtractDto,
  CntBancoArchivoExtractResultDto,
  CntBancoArchivoGetDto,
  CntBancoArchivoTraceDto,
  CntBancoArchivoTraceGetDto,
  CntBancoFormatoDeleteDto,
  CntBancoFormatoDto,
  CntBancoFormatoGetAllDto,
  CntBancoFormatoSaveDto,
  CntBancoDto,
  CntCatalogDto,
  CntCierreActionDto,
  CntCierreActionResultDto,
  CntCierreModificacionesDto,
  CntCierreModificacionesResultDto,
  CntCierrePeriodoDto,
  CntCierrePeriodoGetDto,
  CntCloneDescriptivasDto,
  CntCloneDescriptivasResultDto,
  CntConciliacionActionDto,
  CntConciliacionDto,
  CntConciliacionBancoMovimientoDto,
  CntConciliacionCreateDto,
  CntConciliacionDetalleGetDto,
  CntConciliacionGetAllDto,
  CntConciliacionLibroMovimientoDto,
  CntConciliacionMatchDto,
  CntConciliacionMatchMultiDto,
  CntConciliacionSuggestionDto,
  CntConciliacionSuggestionGetDto,
  CntConciliacionTemporalDto,
  CntConciliacionTemporalGetDto,
  CntConciliacionUnmatchDto,
  CntClonePlanCuentasDto,
  CntClonePlanCuentasResultDto,
  CntComprobanteDto,
  CntComprobanteGetAllDto,
  CntComprobantePrintDto,
  CntComprobanteReorderDto,
  CntComprobanteReorderResultDto,
  CntComprobanteSaveDto,
  CntCuentaBancoDto,
  CntDescriptivaDto,
  CntDescriptivaSaveDto,
  CntEstadoCuentaDetalleDto,
  CntEstadoCuentaDetalleGetDto,
  CntEstadoCuentaDto,
  CntEstadoCuentaGetDto,
  CntLibroBancoDetalleDto,
  CntLibroBancoDetalleGetDto,
  CntLibroBancoDto,
  CntLibroBancoGenerateDto,
  CntLibroBancoGenerateResultDto,
  CntLibroBancoGetDto,
  CntDetalleDto,
  CntMayorAnaliticoDto,
  CntMayorAnaliticoGetAllDto,
  CntMayorAdminDto,
  CntMayorDto,
  CntMayorSaveDto,
  CntMovimientoAuxiliarDto,
  CntMovimientoAuxiliarGetAllDto,
  CntPermissionDto,
  CntPermissionResultDto,
  CntPeriodoAdminDto,
  CntPeriodoGenerateYearDto,
  CntPeriodoDto,
  CntPeriodoSaveDto,
  CntRelacionDocumentoDto,
  CntRelacionDocumentoSaveDto,
  CntRubroDto,
  CntRubroSaveDto,
  CntSaldoDto,
  CntSaldoSaveDto,
  CntTituloDto,
  CntTituloSaveDto,
  ResultDto
} from '../interfaces/CntDtos'

export const CNT_COMPROBANTES_QUERY_KEY = 'cnt-comprobantes'
export const CNT_CATALOGS_QUERY_KEY = 'cnt-catalogs'
export const CNT_PERIODOS_QUERY_KEY = 'cnt-periodos'
export const CNT_MAYORES_QUERY_KEY = 'cnt-mayores'
export const CNT_AUXILIARES_QUERY_KEY = 'cnt-auxiliares'
export const CNT_AUXILIARES_ADMIN_QUERY_KEY = 'cnt-auxiliares-admin'
export const CNT_AUXILIARES_PUC_QUERY_KEY = 'cnt-auxiliares-puc'
export const CNT_PERIODOS_ADMIN_QUERY_KEY = 'cnt-periodos-admin'
export const CNT_REL_DOCUMENTOS_QUERY_KEY = 'cnt-relacion-documentos'
export const CNT_SALDOS_QUERY_KEY = 'cnt-saldos'
export const CNT_TITULOS_QUERY_KEY = 'cnt-titulos'
export const CNT_DESCRIPTIVAS_QUERY_KEY = 'cnt-descriptivas'
export const CNT_RUBROS_QUERY_KEY = 'cnt-rubros'
export const CNT_BALANCES_QUERY_KEY = 'cnt-balances'
export const CNT_MAYORES_ADMIN_QUERY_KEY = 'cnt-mayores-admin'
export const CNT_RPT_MAYOR_ANALITICO_QUERY_KEY = 'cnt-rpt-mayor-analitico'
export const CNT_RPT_MOV_AUX_QUERY_KEY = 'cnt-rpt-mov-aux'
export const CNT_AUTOMATIC_PREVIEW_QUERY_KEY = 'cnt-automatic-preview'
export const CNT_BANCOS_QUERY_KEY = 'cnt-bancos'
export const CNT_CUENTAS_BANCO_QUERY_KEY = 'cnt-cuentas-banco'
export const CNT_CONCILIACIONES_QUERY_KEY = 'cnt-conciliaciones'
export const CNT_BANCO_ARCHIVO_QUERY_KEY = 'cnt-banco-archivo'
export const CNT_BANCO_FORMATOS_QUERY_KEY = 'cnt-banco-formatos'
export const CNT_ESTADOS_CUENTA_QUERY_KEY = 'cnt-estados-cuenta'
export const CNT_LIBRO_BANCO_QUERY_KEY = 'cnt-libro-banco'
export const CNT_CIERRE_CONTABLE_QUERY_KEY = 'cnt-cierre-contable'
export const CNT_PERMISSIONS_QUERY_KEY = 'cnt-permissions'
export const CNT_PERMISSION_CATALOG_VIEW = 'contabilidad.catalogos.ver'
export const CNT_PERMISSION_CATALOG_ADMIN = 'contabilidad.catalogos.admin'
export const CNT_PERMISSION_REPORT_VIEW = 'contabilidad.reportes.ver'
export const CNT_PERMISSION_EDIT_AUTOMATIC = 'contabilidad.comprobantes.editar_automatico'
export const CNT_PERMISSION_REORDER = 'contabilidad.comprobantes.reordenar'
export const CNT_PERMISSION_CONCILIACION_VIEW = 'contabilidad.conciliacion.ver'
export const CNT_PERMISSION_CONCILIACION_IMPORT = 'contabilidad.conciliacion.importar'
export const CNT_PERMISSION_CONCILIACION_ADMIN = 'contabilidad.conciliacion.admin'
export const CNT_PERMISSION_CONCILIACION_FORCE_CLOSE = 'contabilidad.conciliacion.cierre_forzado'
export const CNT_PERMISSION_CONCILIACION_EDIT_PRECLOSE = 'contabilidad.conciliacion.editar_precierre'
export const CNT_PERMISSION_CONCILIACION_FORMATS_VIEW = 'contabilidad.conciliacion.formatos.ver'
export const CNT_PERMISSION_CONCILIACION_FORMATS_EDIT = 'contabilidad.conciliacion.formatos.editar'
export const CNT_PERMISSION_CONCILIACION_OCR = 'contabilidad.conciliacion.ocr'
export const CNT_PERMISSION_CONCILIACION_REPROCESS = 'contabilidad.conciliacion.reprocesar'
export const CNT_PERMISSION_CIERRE_VIEW = 'contabilidad.cierre.ver'
export const CNT_PERMISSION_CIERRE_PRECIERRE = 'contabilidad.cierre.precierre'
export const CNT_PERMISSION_CIERRE_CIERRE = 'contabilidad.cierre.cierre'
export const CNT_PERMISSION_CIERRE_REVERSO = 'contabilidad.cierre.reverso'

export interface CntComprobanteGetAllResult {
  data: CntComprobanteDto[]
  page: number
  totalPage: number
  cantidadRegistros: number
}

export interface CntMayorAnaliticoGetAllResult {
  data: CntMayorAnaliticoDto[]
  page: number
  totalPage: number
  cantidadRegistros: number
}

export interface CntMovimientoAuxiliarGetAllResult {
  data: CntMovimientoAuxiliarDto[]
  page: number
  totalPage: number
  cantidadRegistros: number
}

export const fetchCntComprobantes = async (payload: CntComprobanteGetAllDto): Promise<CntComprobanteGetAllResult> => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntComprobanteDto[]>>('/CntComprobantes/GetAll', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  const data = response.data.data ?? []

  return {
    data,
    page: response.data.page ?? payload.pageNumber,
    totalPage: response.data.totalPage ?? 1,
    cantidadRegistros: response.data.cantidadRegistros ?? data.length
  }
}

export const fetchCntComprobanteById = async (codigoComprobante: number, usuarioId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntComprobanteDto>>('/CntComprobantes/getById', {
    codigoComprobante,
    usuarioId
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const fetchCntComprobantePrint = async (codigoComprobante: number, usuarioId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntComprobantePrintDto>>('/CntComprobantes/print', {
    codigoComprobante,
    usuarioId
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const reorderCntComprobanteNumbers = async (payload: CntComprobanteReorderDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntComprobanteReorderResultDto>>('/CntComprobantes/reorderNumbers', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const checkCntPermission = async (payload: CntPermissionDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntPermissionResultDto>>('/CntPermissions/check', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const fetchCntDetalles = async (codigoComprobante: number, usuarioId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntDetalleDto[]>>('/CntComprobantes/getDetails', {
    codigoComprobante,
    usuarioId
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const createCntComprobante = async (payload: CntComprobanteSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntComprobantes/create', payload)

  return response.data
}

export const updateCntComprobante = async (payload: CntComprobanteSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntComprobantes/update', payload)

  return response.data
}

export const previewCntAutomatico = async (payload: CntAutomaticPreviewDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntAutomaticPreviewResultDto>>('/CntAutomaticos/preview', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const confirmCntAutomatico = async (payload: CntAutomaticConfirmDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntAutomaticConfirmResultDto>>('/CntAutomaticos/confirm', payload)

  return response.data
}

export const fetchCntCatalog = async (catalogo: 'tipos-comprobante' | 'origenes-comprobante') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntCatalogDto[]>>('/CntCatalogos/GetAll', {
    catalogo
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchCntTitulos = async (usuarioId: number, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntTituloDto[]>>('/CntCatalogos/titulos', {
    usuarioId,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const saveCntTitulo = async (payload: CntTituloSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntCatalogos/titulos/save', payload)

  return response.data
}

export const deleteCntTitulo = async (usuarioId: number, tituloId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntCatalogos/titulos/delete', {
    usuarioId,
    tituloId
  })

  return response.data
}

export const fetchCntDescriptivas = async (usuarioId: number, tituloId?: number, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntDescriptivaDto[]>>('/CntCatalogos/descriptivas', {
    usuarioId,
    tituloId: tituloId || null,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const saveCntDescriptiva = async (payload: CntDescriptivaSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntCatalogos/descriptivas/save', payload)

  return response.data
}

export const deleteCntDescriptiva = async (usuarioId: number, descripcionId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntCatalogos/descriptivas/delete', {
    usuarioId,
    descripcionId
  })

  return response.data
}

export const fetchCntDescriptivaUsedBy = async (usuarioId: number, descripcionId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntCatalogos/descriptivas/usedBy', {
    usuarioId,
    descripcionId
  })

  return response.data
}

export const cloneCntDescriptivas = async (payload: CntCloneDescriptivasDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntCloneDescriptivasResultDto>>('/CntCatalogClone/descriptivas', payload)

  return response.data
}

export const fetchCntRubros = async (usuarioId: number, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntRubroDto[]>>('/CntRubros/GetAll', {
    usuarioId,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const saveCntRubro = async (payload: CntRubroSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntRubros/save', payload)

  return response.data
}

export const deleteCntRubro = async (usuarioId: number, codigoRubro: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntRubros/delete', {
    usuarioId,
    codigoRubro
  })

  return response.data
}

export const fetchCntBalances = async (usuarioId: number, codigoRubro?: number, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntBalanceDto[]>>('/CntBalances/GetAll', {
    usuarioId,
    codigoRubro: codigoRubro || null,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const saveCntBalance = async (payload: CntBalanceSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntBalances/save', payload)

  return response.data
}

export const deleteCntBalance = async (usuarioId: number, codigoBalance: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntBalances/delete', {
    usuarioId,
    codigoBalance
  })

  return response.data
}

export const fetchCntMayoresAdmin = async (usuarioId: number, codigoBalance?: number, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntMayorAdminDto[]>>('/CntMayores/GetAll', {
    usuarioId,
    codigoBalance: codigoBalance || null,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const saveCntMayor = async (payload: CntMayorSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntMayores/save', payload)

  return response.data
}

export const deleteCntMayor = async (usuarioId: number, codigoMayor: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntMayores/delete', {
    usuarioId,
    codigoMayor
  })

  return response.data
}

export const fetchCntMayorUsedBy = async (usuarioId: number, codigoMayor: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntMayores/usedBy', {
    usuarioId,
    codigoMayor
  })

  return response.data
}

export const fetchCntAuxiliaresAdmin = async (usuarioId: number, codigoMayor?: number, soloVigentes = false, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntAuxiliarAdminDto[]>>('/CntAuxiliares/GetAll', {
    usuarioId,
    codigoMayor: codigoMayor || null,
    soloVigentes,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const saveCntAuxiliar = async (payload: CntAuxiliarSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntAuxiliares/save', payload)

  return response.data
}

export const deleteCntAuxiliar = async (usuarioId: number, codigoAuxiliar: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntAuxiliares/delete', {
    usuarioId,
    codigoAuxiliar
  })

  return response.data
}

export const fetchCntAuxiliarUsedBy = async (usuarioId: number, codigoAuxiliar: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntAuxiliares/usedBy', {
    usuarioId,
    codigoAuxiliar
  })

  return response.data
}

export const cloneCntPlanCuentas = async (payload: CntClonePlanCuentasDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntClonePlanCuentasResultDto>>('/CntCatalogClone/planCuentas', payload)

  return response.data
}

export const fetchCntAuxiliaresPuc = async (usuarioId: number, codigoAuxiliar?: number, codigoPuc?: number, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntAuxiliarPucDto[]>>('/CntAuxiliaresPuc/GetAll', {
    usuarioId,
    codigoAuxiliar: codigoAuxiliar || null,
    codigoPuc: codigoPuc || null,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const saveCntAuxiliarPuc = async (payload: CntAuxiliarPucSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntAuxiliaresPuc/save', payload)

  return response.data
}

export const deleteCntAuxiliarPuc = async (usuarioId: number, codigoAuxiliarPuc: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntAuxiliaresPuc/delete', {
    usuarioId,
    codigoAuxiliarPuc
  })

  return response.data
}

const getDtoValue = <T>(row: Record<string, unknown>, camelKey: string, dbKey: string, defaultValue: T): T =>
  (row[camelKey] ?? row[dbKey] ?? defaultValue) as T

const normalizeCntPeriodo = (periodo: CntPeriodoDto): CntPeriodoDto => {
  const row = periodo as unknown as Record<string, unknown>

  return {
    codigoPeriodo: getDtoValue(row, 'codigoPeriodo', 'CODIGO_PERIODO', 0),
    nombrePeriodo: getDtoValue(row, 'nombrePeriodo', 'NOMBRE_PERIODO', ''),
    fechaDesde: getDtoValue(row, 'fechaDesde', 'FECHA_DESDE', ''),
    fechaHasta: getDtoValue(row, 'fechaHasta', 'FECHA_HASTA', ''),
    anoPeriodo: getDtoValue(row, 'anoPeriodo', 'ANO_PERIODO', 0),
    numeroPeriodo: getDtoValue(row, 'numeroPeriodo', 'NUMERO_PERIODO', 0),
    cerrado: getDtoValue(row, 'cerrado', 'CERRADO', false)
  }
}

const normalizeCntPeriodoAdmin = (periodo: CntPeriodoAdminDto): CntPeriodoAdminDto => {
  const row = periodo as unknown as Record<string, unknown>

  return {
    ...normalizeCntPeriodo(periodo),
    fechaCierre: getDtoValue(row, 'fechaCierre', 'FECHA_CIERRE', undefined),
    extra1: getDtoValue(row, 'extra1', 'EXTRA1', ''),
    extra2: getDtoValue(row, 'extra2', 'EXTRA2', ''),
    extra3: getDtoValue(row, 'extra3', 'EXTRA3', ''),
    codigoEmpresa: getDtoValue(row, 'codigoEmpresa', 'CODIGO_EMPRESA', undefined)
  }
}

const normalizeCntCierrePeriodo = (periodo: CntCierrePeriodoDto): CntCierrePeriodoDto => {
  const row = periodo as unknown as Record<string, unknown>

  return {
    codigoPeriodo: getDtoValue(row, 'codigoPeriodo', 'CODIGO_PERIODO', 0),
    nombrePeriodo: getDtoValue(row, 'nombrePeriodo', 'NOMBRE_PERIODO', ''),
    fechaDesde: getDtoValue(row, 'fechaDesde', 'FECHA_DESDE', ''),
    fechaHasta: getDtoValue(row, 'fechaHasta', 'FECHA_HASTA', ''),
    anoPeriodo: getDtoValue(row, 'anoPeriodo', 'ANO_PERIODO', 0),
    numeroPeriodo: getDtoValue(row, 'numeroPeriodo', 'NUMERO_PERIODO', 0),
    fechaPrecierre: getDtoValue(row, 'fechaPrecierre', 'FECHA_PRECIERRE', null),
    usuarioPrecierre: getDtoValue(row, 'usuarioPrecierre', 'USUARIO_PRECIERRE', null),
    fechaCierre: getDtoValue(row, 'fechaCierre', 'FECHA_CIERRE', null),
    usuarioCierre: getDtoValue(row, 'usuarioCierre', 'USUARIO_CIERRE', null),
    estado: getDtoValue(row, 'estado', 'ESTADO', 'ABIERTO'),
    cantidadTmpSaldos: getDtoValue(row, 'cantidadTmpSaldos', 'CANT_TMP_SALDOS', 0),
    cantidadTmpAnalitico: getDtoValue(row, 'cantidadTmpAnalitico', 'CANT_TMP_ANALITICO', 0),
    cantidadSaldos: getDtoValue(row, 'cantidadSaldos', 'CANT_SALDOS', 0),
    cantidadHistAnalitico: getDtoValue(row, 'cantidadHistAnalitico', 'CANT_HIST_ANALITICO', 0),
    cantidadModificaciones: getDtoValue(row, 'cantidadModificaciones', 'CANT_MODIFICACIONES', 0),
    codigoEmpresa: getDtoValue(row, 'codigoEmpresa', 'CODIGO_EMPRESA', null)
  }
}

export const fetchCntPeriodos = async (soloAbiertos = true, fecha?: string) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntPeriodoDto[]>>('/CntCatalogos/periodos', {
    soloAbiertos,
    fecha: fecha || null
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return (response.data.data ?? []).map(normalizeCntPeriodo)
}

export const fetchCntPeriodosAdmin = async (usuarioId: number, anoPeriodo?: number, soloAbiertos = false, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntPeriodoAdminDto[]>>('/CntPeriodos/GetAll', {
    usuarioId,
    anoPeriodo: anoPeriodo || null,
    soloAbiertos,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return (response.data.data ?? []).map(normalizeCntPeriodoAdmin)
}

export const saveCntPeriodo = async (payload: CntPeriodoSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntPeriodos/save', payload)

  return response.data
}

export const deleteCntPeriodo = async (usuarioId: number, codigoPeriodo: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntPeriodos/delete', {
    usuarioId,
    codigoPeriodo
  })

  return response.data
}

export const generateCntPeriodoYear = async (payload: CntPeriodoGenerateYearDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntPeriodos/generateYear', payload)

  return response.data
}

export const fetchCntCierrePeriodos = async (payload: CntCierrePeriodoGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntCierrePeriodoDto[]>>('/CntCierreContable/GetPeriodos', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return (response.data.data ?? []).map(normalizeCntCierrePeriodo)
}

export const fetchCntCierreModificaciones = async (payload: CntCierreModificacionesDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntCierreModificacionesResultDto>>('/CntCierreContable/Modificaciones', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const precierreCntContable = async (payload: CntCierreActionDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntCierreActionResultDto>>('/CntCierreContable/Precierre', payload)

  return response.data
}

export const cierreCntContable = async (payload: CntCierreActionDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntCierreActionResultDto>>('/CntCierreContable/Cierre', payload)

  return response.data
}

export const reversoCntContable = async (payload: CntCierreActionDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntCierreActionResultDto>>('/CntCierreContable/Reverso', payload)

  return response.data
}

export const fetchCntRelacionDocumentos = async (usuarioId: number, tipoDocumentoId?: number, tipoTransaccionId?: number, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntRelacionDocumentoDto[]>>('/CntRelacionDocumentos/GetAll', {
    usuarioId,
    tipoDocumentoId: tipoDocumentoId || null,
    tipoTransaccionId: tipoTransaccionId || null,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const saveCntRelacionDocumento = async (payload: CntRelacionDocumentoSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntRelacionDocumentos/save', payload)

  return response.data
}

export const deleteCntRelacionDocumento = async (usuarioId: number, codigoRelacionDocumento: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntRelacionDocumentos/delete', {
    usuarioId,
    codigoRelacionDocumento
  })

  return response.data
}

export const fetchCntSaldos = async (usuarioId: number, codigoPeriodo?: number, codigoMayor?: number, codigoAuxiliar?: number, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntSaldoDto[]>>('/CntSaldos/GetAll', {
    usuarioId,
    codigoPeriodo: codigoPeriodo || null,
    codigoMayor: codigoMayor || null,
    codigoAuxiliar: codigoAuxiliar || null,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const saveCntSaldo = async (payload: CntSaldoSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntSaldos/save', payload)

  return response.data
}

export const deleteCntSaldo = async (usuarioId: number, codigoSaldo: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntSaldos/delete', {
    usuarioId,
    codigoSaldo
  })

  return response.data
}

export const fetchCntBancos = async (usuarioId: number, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntBancoDto[]>>('/CntBancos/GetAll', {
    usuarioId,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchCntCuentasBanco = async (usuarioId: number, codigoBanco?: number, soloConfiguradas = false, searchText = '') => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntCuentaBancoDto[]>>('/CntCuentasBanco/GetAll', {
    usuarioId,
    codigoBanco: codigoBanco || null,
    soloConfiguradas,
    searchText
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchCntConciliaciones = async (payload: CntConciliacionGetAllDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntConciliacionDto[]>>('/CntConciliaciones/GetAll', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchCntConciliacionById = async (codigoConciliacion: number, usuarioId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntConciliacionDto>>('/CntConciliaciones/getById', {
    codigoConciliacion,
    usuarioId
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const createCntConciliacion = async (payload: CntConciliacionCreateDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntConciliaciones/Create', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? 0
}

export const precloseCntConciliacion = async (payload: CntConciliacionActionDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntConciliaciones/Preclose', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? 'OK'
}

export const closeCntConciliacion = async (payload: CntConciliacionActionDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntConciliaciones/Close', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? 'OK'
}

export const reverseCntConciliacion = async (payload: CntConciliacionActionDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntConciliaciones/Reverse', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? 'OK'
}

export const fetchCntBancoArchivos = async (payload: CntBancoArchivoGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntBancoArchivoDto[]>>('/CntBancoArchivo/GetAll', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const confirmCntBancoArchivo = async (payload: CntBancoArchivoConfirmDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntBancoArchivoConfirmResultDto>>('/CntBancoArchivo/Confirm', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const fetchCntBancoArchivoDetalles = async (payload: CntBancoArchivoDetalleGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntBancoArchivoDetalleLineDto[]>>('/CntBancoArchivo/Details', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchCntBancoArchivoPreview = async (payload: CntBancoArchivoDetalleGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntBancoArchivoExtractResultDto>>('/CntBancoArchivo/Preview', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const fetchCntBancoArchivoTrace = async (payload: CntBancoArchivoTraceGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntBancoArchivoTraceDto[]>>('/CntBancoArchivo/Trace', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const extractCntBancoArchivo = async (payload: CntBancoArchivoExtractDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntBancoArchivoExtractResultDto>>('/CntBancoArchivo/Extract', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const createCntBancoArchivoBatch = async (payload: CntBancoArchivoBatchCreateDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntBancoArchivoBatchCreateResultDto>>('/CntBancoArchivo/CreateBatch', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const fetchCntBancoFormatos = async (payload: CntBancoFormatoGetAllDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntBancoFormatoDto[]>>('/CntBancoFormatos/GetAll', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const saveCntBancoFormato = async (payload: CntBancoFormatoSaveDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntBancoFormatos/Save', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const deleteCntBancoFormato = async (payload: CntBancoFormatoDeleteDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntBancoFormatos/Delete', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const fetchCntEstadosCuenta = async (payload: CntEstadoCuentaGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntEstadoCuentaDto[]>>('/CntEstadosCuenta/GetAll', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchCntEstadoCuentaDetalles = async (payload: CntEstadoCuentaDetalleGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntEstadoCuentaDetalleDto[]>>('/CntEstadosCuenta/Details', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchCntLibrosBanco = async (payload: CntLibroBancoGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntLibroBancoDto[]>>('/CntLibroBanco/GetAll', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchCntLibroBancoDetalles = async (payload: CntLibroBancoDetalleGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntLibroBancoDetalleDto[]>>('/CntLibroBanco/Details', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const generateCntLibroBanco = async (payload: CntLibroBancoGenerateDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntLibroBancoGenerateResultDto>>('/CntLibroBanco/Generate', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const fetchCntConciliacionBancoMovimientos = async (payload: CntConciliacionDetalleGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntConciliacionBancoMovimientoDto[]>>('/CntConciliacionDetalle/banco', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchCntConciliacionLibroMovimientos = async (payload: CntConciliacionDetalleGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntConciliacionLibroMovimientoDto[]>>('/CntConciliacionDetalle/libro', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchCntConciliacionTemporales = async (payload: CntConciliacionTemporalGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntConciliacionTemporalDto[]>>('/CntConciliacionDetalle/temporales', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const matchCntConciliacion = async (payload: CntConciliacionMatchDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntConciliacionMatching/match', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? 0
}

export const matchMultiCntConciliacion = async (payload: CntConciliacionMatchMultiDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/CntConciliacionMatching/match-multi', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? 0
}

export const fetchCntConciliacionSuggestions = async (payload: CntConciliacionSuggestionGetDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntConciliacionSuggestionDto[]>>('/CntConciliacionMatching/suggestions', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const unmatchCntConciliacion = async (payload: CntConciliacionUnmatchDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/CntConciliacionMatching/unmatch', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? 'OK'
}

export const searchCntMayores = async (searchText: string) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntMayorDto[]>>('/CntCatalogos/mayores', {
    searchText,
    pageSize: 20
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const searchCntAuxiliares = async (searchText: string, codigoMayor?: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntAuxiliarDto[]>>('/CntCatalogos/auxiliares', {
    searchText,
    codigoMayor,
    pageSize: 20
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchCntMayorAnalitico = async (payload: CntMayorAnaliticoGetAllDto): Promise<CntMayorAnaliticoGetAllResult> => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntMayorAnaliticoDto[]>>('/CntReportes/mayorAnalitico', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  const data = response.data.data ?? []

  return {
    data,
    page: response.data.page ?? payload.pageNumber,
    totalPage: response.data.totalPage ?? 1,
    cantidadRegistros: response.data.cantidadRegistros ?? data.length
  }
}

export const fetchCntMovimientoAuxiliar = async (payload: CntMovimientoAuxiliarGetAllDto): Promise<CntMovimientoAuxiliarGetAllResult> => {
  const response = await ossmmasofApiVertical.post<ResultDto<CntMovimientoAuxiliarDto[]>>('/CntReportes/movimientoAuxiliar', payload)

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  const data = response.data.data ?? []

  return {
    data,
    page: response.data.page ?? payload.pageNumber,
    totalPage: response.data.totalPage ?? 1,
    cantidadRegistros: response.data.cantidadRegistros ?? data.length
  }
}
