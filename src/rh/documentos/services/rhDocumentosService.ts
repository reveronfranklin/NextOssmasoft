import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva'
import { IRhDocumentoCreateDto } from 'src/interfaces/rh/RhDocumentoCreateDto'
import { IRhDocumentoDeleteDto } from 'src/interfaces/rh/RhDocumentoDeleteDto'
import { IRhDocumentoResponseDto } from 'src/interfaces/rh/RhDocumentoResponseDto'
import { IRhDocumentoUpdateDto } from 'src/interfaces/rh/RhDocumentoUpdateDto'

export const DOCUMENTOS_QUERY_KEY = 'rh-documentos'

export const RH_DOCUMENTOS_ENDPOINTS = {
  create: '/RhDocumentos/create',
  update: '/RhDocumentos/update',
  delete: '/RhDocumentos/delete',
  getByPersona: '/RhDocumentos/getByPersona',
  descriptivasByTitulo: '/RhDescriptivas/GetByTitulo'
}

export const RH_DOCUMENTOS_TITULOS = {
  tipoDocumento: 26,
  tipoGrado: 30,
  grado: 8
}

export interface ResultDto<T> {
  data: T
  isValid: boolean
  message: string
  page?: number
  totalPage?: number
  cantidadRegistros?: number
}

export interface RhDocumentosByPersonaResult {
  data: IRhDocumentoResponseDto[]
  page: number
  totalPage: number
  cantidadRegistros: number
}

export const fetchRhDescriptivasByTitulo = async (tituloId: number): Promise<ISelectListDescriptiva[]> => {
  const response = await ossmmasofApi.post<ISelectListDescriptiva[]>(RH_DOCUMENTOS_ENDPOINTS.descriptivasByTitulo, {
    descripcionId: 0,
    tituloId
  })

  return response.data ?? []
}

const normalizeDocumento = (documento: IRhDocumentoResponseDto): IRhDocumentoResponseDto => ({
  ...documento,
  tipoDocumentoId: documento.tipoDocumentoId || documento.tipodocumentoId || 0,
  tipoGradoId: documento.tipoGradoId || documento.tipoGradoid || 0,
  gradoId: documento.gradoId || documento.gradoid || 0,
  tipoDocumento: documento.tipoDocumento || documento.descripcionDocumento || '',
  tipoGrado: documento.tipoGrado || documento.descripcionTipoGrado || '',
  grado: documento.grado || documento.descripcionGrado || '',
  fechaVencimiento:
    documento.fechaVencimiento?.startsWith('0001-01-01') || documento.fechaVencimientoString?.startsWith('0001-01-01')
      ? null
      : documento.fechaVencimiento || documento.fechaVencimientoString || null
})

export const fetchRhDocumentosByPersona = async (codigoPersona: number): Promise<RhDocumentosByPersonaResult> => {
  const response = await ossmmasofApi.post<ResultDto<IRhDocumentoResponseDto[]> | IRhDocumentoResponseDto[]>(
    RH_DOCUMENTOS_ENDPOINTS.getByPersona,
    { codigoPersona }
  )

  if (Array.isArray(response.data)) {
    const data = response.data.map(normalizeDocumento)

    return {
      data,
      page: 1,
      totalPage: 1,
      cantidadRegistros: data.length
    }
  }

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  const data = (response.data.data ?? []).map(normalizeDocumento)

  return {
    data,
    page: response.data.page ?? 1,
    totalPage: response.data.totalPage ?? 1,
    cantidadRegistros: response.data.cantidadRegistros ?? data.length
  }
}

export const createRhDocumento = async (payload: IRhDocumentoCreateDto) => {
  const response = await ossmmasofApi.post<ResultDto<number>>(RH_DOCUMENTOS_ENDPOINTS.create, payload)

  return response.data
}

export const updateRhDocumento = async (payload: IRhDocumentoUpdateDto) => {
  const response = await ossmmasofApi.post<ResultDto<string>>(RH_DOCUMENTOS_ENDPOINTS.update, payload)

  return response.data
}

export const deleteRhDocumento = async (payload: IRhDocumentoDeleteDto) => {
  const response = await ossmmasofApi.post<ResultDto<string>>(RH_DOCUMENTOS_ENDPOINTS.delete, payload)

  return response.data
}
