import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import {
  OssUsuarioRolCreateDto,
  OssUsuarioRolDeleteDto,
  OssUsuarioRolGetAllDto,
  OssUsuarioRolMenuItem,
  OssUsuarioRolResponseDto,
  OssUsuarioRolUpdateDto,
  ResultDto
} from '../interfaces/OssUsuarioRolDtos'

export const OSS_USUARIO_ROL_QUERY_KEY = 'oss-usuario-rol'

export const OSS_USUARIO_ROL_ENDPOINTS = {
  create: '/OssUsuarioRol/create',
  update: '/OssUsuarioRol/update',
  delete: '/OssUsuarioRol/delete',
  getById: '/OssUsuarioRol/getById',
  getByUsuario: '/OssUsuarioRol/getByUsuario',
  getAll: '/OssUsuarioRol/GetAll'
}

export interface OssUsuarioRolGetAllResult {
  data: OssUsuarioRolResponseDto[]
  page: number
  totalPage: number
  cantidadRegistros: number
}

const normalizeJsonMenu = (jsonMenu: unknown): OssUsuarioRolMenuItem[] => {
  if (Array.isArray(jsonMenu)) {
    return jsonMenu as OssUsuarioRolMenuItem[]
  }

  if (typeof jsonMenu === 'string' && jsonMenu.trim().length > 0) {
    try {
      const parsed = JSON.parse(jsonMenu)

      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  return []
}

export const normalizeUsuarioRol = (item: OssUsuarioRolResponseDto): OssUsuarioRolResponseDto => ({
  ...item,
  codigoUsuarioRol: item.codigoUsuarioRol ?? 0,
  usuario: item.usuario ?? '',
  codigoUsuario: item.codigoUsuario ?? 0,
  descripcion: item.descripcion ?? '',
  jsonMenu: normalizeJsonMenu(item.jsonMenu)
})

export const fetchOssUsuarioRol = async (
  payload: OssUsuarioRolGetAllDto
): Promise<OssUsuarioRolGetAllResult> => {
  const response = await ossmmasofApiVertical.post<ResultDto<OssUsuarioRolResponseDto[]>>(
    OSS_USUARIO_ROL_ENDPOINTS.getAll,
    payload
  )

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  const data = (response.data.data ?? []).map(normalizeUsuarioRol)

  return {
    data,
    page: response.data.page ?? payload.pageNumber,
    totalPage: response.data.totalPage ?? 1,
    cantidadRegistros: response.data.cantidadRegistros ?? data.length
  }
}

export const createOssUsuarioRol = async (payload: OssUsuarioRolCreateDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>(OSS_USUARIO_ROL_ENDPOINTS.create, payload)

  return response.data
}

export const updateOssUsuarioRol = async (payload: OssUsuarioRolUpdateDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>(OSS_USUARIO_ROL_ENDPOINTS.update, payload)

  return response.data
}

export const deleteOssUsuarioRol = async (payload: OssUsuarioRolDeleteDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>(OSS_USUARIO_ROL_ENDPOINTS.delete, payload)

  return response.data
}
