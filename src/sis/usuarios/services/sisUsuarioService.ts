import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import {
  ResultDto,
  SisUsuarioApplyCntPermissionsDto,
  SisUsuarioApplyCntPermissionsResult,
  SisUsuarioApplySupportPermissionsDto,
  SisUsuarioApplySupportPermissionsResult,
  SisUsuarioDto,
  SisUsuarioGetAllDto,
  SisUsuarioUpdateEmailDto,
  SisUsuarioUpdatePasswordDto
} from '../interfaces/SisUsuarioDtos'

export const SIS_USUARIOS_QUERY_KEY = 'sis-usuarios'

export interface SisUsuarioGetAllResult {
  data: SisUsuarioDto[]
  page: number
  totalPage: number
  cantidadRegistros: number
}

export const fetchSisUsuarios = async (payload: SisUsuarioGetAllDto): Promise<SisUsuarioGetAllResult> => {
  const response = await ossmmasofApiVertical.post<ResultDto<SisUsuarioDto[]>>('/SisUsuarios/GetAll', payload)

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

export const updateSisUsuarioEmail = async (payload: SisUsuarioUpdateEmailDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/SisUsuarios/updateEmail', payload)

  return response.data
}

export const updateSisUsuarioPassword = async (payload: SisUsuarioUpdatePasswordDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/SisUsuarios/updatePassword', {
    codigoUsuario: payload.codigoUsuario,
    clave: payload.nuevaClave,
    usuarioUpd: payload.usuarioUpd
  })

  return response.data
}

export const applySisUsuarioSupportPermissions = async (payload: SisUsuarioApplySupportPermissionsDto) => {
  try {
    const response = await ossmmasofApiVertical.post<ResultDto<SisUsuarioApplySupportPermissionsResult>>(
      '/SisUsuarios/applySupportPermissions',
      payload
    )

    return response.data
  } catch (error: any) {
    if (error?.response?.status === 404) {
      throw new Error('El endpoint applySupportPermissions no esta publicado en la API Vertical Slice.')
    }

    throw error
  }
}

export const applySisUsuarioCntPermissions = async (payload: SisUsuarioApplyCntPermissionsDto) => {
  try {
    const response = await ossmmasofApiVertical.post<ResultDto<SisUsuarioApplyCntPermissionsResult>>(
      '/SisUsuarios/applyCntPermissions',
      payload
    )

    return response.data
  } catch (error: any) {
    if (error?.response?.status === 404) {
      throw new Error('El endpoint applyCntPermissions no esta publicado en la API Vertical Slice.')
    }

    throw error
  }
}
