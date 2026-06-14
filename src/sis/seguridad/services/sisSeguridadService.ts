import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import {
  ResultDto,
  SisSegCacheCommand,
  SisSegCacheResponse,
  SisSegCatalogosDto,
  SisSegCloneUserCommandDto,
  SisSegCloneUserResponseDto,
  SisSegInstallStatusDto,
  SisSegMenuDto,
  SisSegMenuSaveCommand,
  SisSegMenuItemDto,
  SisSegMigApplyCommand,
  SisSegRolDto,
  SisSegRolMenuSaveCommand,
  SisSegRolPermSaveCommand,
  SisSegRolSaveCommand,
  SisSegUsuarioDto,
  SisSegUsrRolSaveCommand
} from '../interfaces/SisSeguridadDtos'

export const SIS_SEGURIDAD_QUERY_KEY = 'sis-seguridad'

export const SIS_SEGURIDAD_ENDPOINTS = {
  getEstadoInstalacion: '/SisSeguridad/getEstadoInstalacion',
  getCatalogos: '/SisSeguridad/getCatalogos',
  getUsuario: '/SisSeguridad/getUsuario',
  saveUsuarioRoles: '/SisSeguridad/saveUsuarioRoles',
  saveRol: '/SisSeguridad/saveRol',
  saveMenu: '/SisSeguridad/saveMenu',
  saveRolPermisos: '/SisSeguridad/saveRolPermisos',
  saveRolMenus: '/SisSeguridad/saveRolMenus',
  regenerarCache: '/SisSeguridad/regenerarCache',
  aplicarMigracionSugerida: '/SisSeguridad/aplicarMigracionSugerida',
  clonarUsuario: '/SisSeguridad/clonarUsuario'
}

const normalizeJsonMenu = (jsonMenu: unknown): SisSegMenuItemDto[] => {
  if (Array.isArray(jsonMenu)) {
    return jsonMenu as SisSegMenuItemDto[]
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

const ensureValid = <T>(response: ResultDto<T>) => {
  if (response.isValid === false) {
    throw new Error(response.message)
  }

  return response.data
}

export const fetchSisSegCatalogos = async () => {
  const response = await ossmmasofApiVertical.post<ResultDto<SisSegCatalogosDto>>(
    SIS_SEGURIDAD_ENDPOINTS.getCatalogos,
    {}
  )

  return ensureValid(response.data)
}

export const fetchSisSegEstadoInstalacion = async () => {
  const response = await ossmmasofApiVertical.post<ResultDto<SisSegInstallStatusDto>>(
    SIS_SEGURIDAD_ENDPOINTS.getEstadoInstalacion,
    {}
  )

  return ensureValid(response.data)
}

export const fetchSisSegUsuario = async (codigoUsuario: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SisSegUsuarioDto>>(SIS_SEGURIDAD_ENDPOINTS.getUsuario, {
    codigoUsuario
  })

  const data = ensureValid(response.data)

  return {
    ...data,
    roles: data?.roles ?? [],
    permisos: data?.permisos ?? [],
    excepciones: data?.excepciones ?? [],
    jsonMenu: normalizeJsonMenu(data?.jsonMenu)
  }
}

export const saveSisSegUsuarioRoles = async (payload: SisSegUsrRolSaveCommand) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SisSegCacheResponse>>(
    SIS_SEGURIDAD_ENDPOINTS.saveUsuarioRoles,
    payload
  )

  return ensureValid(response.data)
}

export const saveSisSegRol = async (payload: SisSegRolSaveCommand) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SisSegRolDto>>(SIS_SEGURIDAD_ENDPOINTS.saveRol, payload)

  return ensureValid(response.data)
}

export const saveSisSegMenu = async (payload: SisSegMenuSaveCommand) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SisSegMenuDto>>(SIS_SEGURIDAD_ENDPOINTS.saveMenu, payload)

  return ensureValid(response.data)
}

export const saveSisSegRolPermisos = async (payload: SisSegRolPermSaveCommand) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>(SIS_SEGURIDAD_ENDPOINTS.saveRolPermisos, payload)

  return ensureValid(response.data)
}

export const saveSisSegRolMenus = async (payload: SisSegRolMenuSaveCommand) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>(SIS_SEGURIDAD_ENDPOINTS.saveRolMenus, payload)

  return ensureValid(response.data)
}

export const regenerateSisSegCache = async (payload: SisSegCacheCommand) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SisSegCacheResponse>>(
    SIS_SEGURIDAD_ENDPOINTS.regenerarCache,
    payload
  )

  return ensureValid(response.data)
}

export const applySisSegMigracionSugerida = async (payload: SisSegMigApplyCommand) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SisSegCacheResponse>>(
    SIS_SEGURIDAD_ENDPOINTS.aplicarMigracionSugerida,
    payload
  )

  return ensureValid(response.data)
}

export const cloneSisSegUsuario = async (payload: SisSegCloneUserCommandDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SisSegCloneUserResponseDto>>(
    SIS_SEGURIDAD_ENDPOINTS.clonarUsuario,
    payload
  )

  return ensureValid(response.data)
}
