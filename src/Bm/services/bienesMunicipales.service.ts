import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import { ResultDto } from 'src/interfaces/Bm/result-dto'

const getDataOrDefault = <T>(response: ResultDto<T>, fallback: T) => {
  if (!response?.isValid) {
    throw new Error(response?.message || 'No se pudo completar la operacion de Bienes Municipales')
  }

  return response.data ?? fallback
}

export const bienesMunicipalesEndpoints = {
  bm1: {
    fechaPrimerMovimiento: '/Bm1/GetFechaPrimerMovimiento',
    listIcp: '/Bm1/GetListICP',
    byListIcp: '/Bm1/GetByListIcp',
    placas: '/Bm1/GetPlacas',
    productMobil: '/Bm1/GetProductMobil'
  },
  bienes: {
    getAll: '/BmBienes/GetAll',
    getById: '/BmBienes/GetById',
    getByNumeroPlaca: '/BmBienes/GetByNumeroPlaca',
    create: '/BmBienes/Create',
    update: '/BmBienes/Update'
  },
  detallesBien: {
    getByBien: '/BmDetalleBienes/GetByBien',
    create: '/BmDetalleBienes/Create',
    update: '/BmDetalleBienes/Update'
  },
  fotos: {
    getByNumeroPlaca: '/BmBienesFotos/GetByNumeroPlaca',
    addImage: (codigoBien: number) => `/BmBienesFotos/AddImage/${codigoBien}`,
    delete: '/BmBienesFotos/Delete'
  },
  catalogos: {
    titulos: '/BmTitulos/GetAll',
    titulosCreate: '/BmTitulos/Create',
    titulosUpdate: '/BmTitulos/Update',
    descriptivas: '/BmDescriptivas/GetAll',
    descriptivasByTitulo: '/BmDescriptivas/GetByTitulo',
    descriptivasByFk: '/BmDescriptivas/GetByFk',
    descriptivasCreate: '/BmDescriptivas/Create',
    descriptivasUpdate: '/BmDescriptivas/Update',
    clasificacion: '/BmClasificacionBienes/GetAll',
    clasificacionCreate: '/BmClasificacionBienes/Create',
    clasificacionUpdate: '/BmClasificacionBienes/Update',
    articulos: '/BmArticulos/GetAll',
    articulosCreate: '/BmArticulos/Create',
    articulosUpdate: '/BmArticulos/Update',
    detalleArticulosByArticulo: '/BmDetalleArticulos/GetByArticulo',
    detalleArticulosCreate: '/BmDetalleArticulos/Create',
    detalleArticulosUpdate: '/BmDetalleArticulos/Update'
  },
  ubicaciones: {
    getAll: '/BmUbicaciones/GetAll',
    getIcp: '/BmUbicaciones/GetIcp',
    getByIcp: '/BmUbicaciones/GetByIcp',
    create: '/BmUbicaciones/Create',
    update: '/BmUbicaciones/Update',
    historicoByDir: '/BmUbicacionesHistorico/GetByDir',
    responsableByUsuario: '/BmUbicacionesResponsable/GetByUsuarioResponsable'
  },
  movimientos: {
    byBien: '/BmMovBienes/GetByBien',
    create: '/BmMovBienes/Create',
    solicitudes: '/BmSolMovBienes/GetAll',
    solicitudesCreate: '/BmSolMovBienes/Create',
    solicitudesAprobar: '/BmSolMovBienes/Aprobar'
  },
  procesosMasivos: {
    preview: '/BmProcesosMasivos/Preview',
    execute: '/BmProcesosMasivos/Execute'
  },
  conteos: {
    getAll: '/BmConteo/GetAll',
    create: '/BmConteo/Create',
    update: '/BmConteo/Update',
    delete: '/BmConteo/Delete',
    cerrar: '/BmConteo/CerrarConteo',
    detalleByConteo: '/BmConteoDetalle/GetAllByConteo',
    detalleComparar: '/BmConteoDetalle/GetAllByConteoComparar',
    detalleUpdate: '/BmConteoDetalle/Update',
    recibeConteo: '/BmConteoDetalle/RecibeConteo',
    historicoGetAll: '/BmConteoHistorico/GetAll'
  },
  cuarentena: {
    getAll: '/BmPlacaCuarentena/GetAll',
    create: '/BmPlacaCuarentena/Create',
    delete: '/BmPlacaCuarentena/Delete'
  },
  reportes: {
    placa: '/BmReportes/Placa',
    placaPdf: '/BmReportes/PlacaPdf',
    placaExcel: '/BmReportes/PlacaExcel',
    lote: '/BmReportes/Lote',
    lotePdf: '/BmReportes/LotePdf',
    loteExcel: '/BmReportes/LoteExcel',
    ficha: '/BmReportes/Ficha',
    fichaPdf: '/BmReportes/FichaPdf',
    fichaExcel: '/BmReportes/FichaExcel',
    ubicacion: '/BmReportes/Ubicacion',
    ubicacionPdf: '/BmReportes/UbicacionPdf',
    ubicacionExcel: '/BmReportes/UbicacionExcel',
    movimientos: '/BmReportes/Movimientos',
    movimientosPdf: '/BmReportes/MovimientosPdf',
    movimientosExcel: '/BmReportes/MovimientosExcel',
    movimientosFiltro: '/BmReportes/MovimientosFiltro',
    movimientosFiltroPdf: '/BmReportes/MovimientosFiltroPdf',
    movimientosFiltroExcel: '/BmReportes/MovimientosFiltroExcel',
    solicitudes: '/BmReportes/Solicitudes',
    solicitudesPdf: '/BmReportes/SolicitudesPdf',
    solicitudesExcel: '/BmReportes/SolicitudesExcel',
    procesosMasivos: '/BmReportes/ProcesosMasivos',
    procesosMasivosPdf: '/BmReportes/ProcesosMasivosPdf',
    procesosMasivosExcel: '/BmReportes/ProcesosMasivosExcel',
    conteoDiferencias: '/BmReportes/ConteoDiferencias',
    conteoDiferenciasPdf: '/BmReportes/ConteoDiferenciasPdf',
    conteoDiferenciasExcel: '/BmReportes/ConteoDiferenciasExcel',
    conteoHistorico: '/BmReportes/ConteoHistorico',
    conteoHistoricoPdf: '/BmReportes/ConteoHistoricoPdf',
    conteoHistoricoExcel: '/BmReportes/ConteoHistoricoExcel'
  }
}

export const bmGet = async <T>(endpoint: string, fallback: T) => {
  const response = await ossmmasofApiVertical.get<ResultDto<T>>(endpoint)

  return getDataOrDefault(response.data, fallback)
}

export const bmPost = async <TResponse, TPayload = unknown>(endpoint: string, payload: TPayload, fallback: TResponse) => {
  const response = await ossmmasofApiVertical.post<ResultDto<TResponse>>(endpoint, payload)

  return getDataOrDefault(response.data, fallback)
}

export const bmPostResult = async <TResponse, TPayload = unknown>(endpoint: string, payload: TPayload) => {
  const response = await ossmmasofApiVertical.post<ResultDto<TResponse>>(endpoint, payload)

  return response.data
}

const readJsonBlobMessage = async (blob: Blob, fallback: string) => {
  try {
    const text = await blob.text()
    const parsed = JSON.parse(text)

    return parsed?.message || text || fallback
  } catch {
    return fallback
  }
}

export const bmPostPdf = async <TPayload = unknown>(endpoint: string, payload: TPayload) => {
  const response = await ossmmasofApiVertical.post(endpoint, payload, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/pdf'
    }
  })

  if (response.data?.type?.includes('application/json')) {
    throw new Error(await readJsonBlobMessage(response.data, 'No se pudo generar el PDF de Bienes Municipales'))
  }

  const blob = new Blob([response.data], { type: 'application/pdf' })

  return URL.createObjectURL(blob)
}

export const bmPostExcel = async <TPayload = unknown>(endpoint: string, payload: TPayload, fileName: string) => {
  const response = await ossmmasofApiVertical.post(endpoint, payload, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  })

  if (response.data?.type?.includes('application/json')) {
    throw new Error(await readJsonBlobMessage(response.data, 'No se pudo generar el Excel de Bienes Municipales'))
  }

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
