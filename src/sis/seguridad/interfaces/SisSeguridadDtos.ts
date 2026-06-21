export interface ResultDto<T> {
  data: T
  isValid: boolean
  message: string
  page?: number
  totalPage?: number
  cantidadRegistros?: number
}

export interface SisSegModuloDto {
  codigoMod: number
  codigo: string
  nombre: string
  icono: string
  orden: number
  activo: boolean
}

export interface SisSegMenuDto {
  codigoMenu: number
  codigoMod: number
  codigoPadre?: number | null
  titulo: string
  path: string
  icono: string
  orden: number
  activo: boolean
}

export interface SisSegPermisoDto {
  codigoPerm: number
  codigoMod: number
  clave: string
  nombre: string
  descripcion: string
  activo: boolean
}

export interface SisSegRolDto {
  codigoRol: number
  codigoMod: number
  clave: string
  nombre: string
  descripcion: string
  activo: boolean
}

export interface SisSegCatalogosDto {
  modulos: SisSegModuloDto[]
  menus: SisSegMenuDto[]
  permisos: SisSegPermisoDto[]
  roles: SisSegRolDto[]
  rolPermisos: SisSegRolPermDto[]
  rolMenus: SisSegRolMenuDto[]
}

export interface SisSegInstallStatusDto {
  instalacionCompleta: boolean
  tablasFaltantes: string[]
  mensaje: string
}

export interface SisSegRolPermDto {
  codigoRol: number
  codigoPerm: number
}

export interface SisSegRolMenuDto {
  codigoRol: number
  codigoMenu: number
}

export interface SisSegUsuarioPermisoDto extends SisSegPermisoDto {
  tipo?: 'ALLOW' | 'DENY'
}

export interface SisSegMenuItemDto {
  title?: string
  icon?: string
  path?: string
  permissions?: string[]
  children?: SisSegMenuItemDto[]
}

export interface SisSegUsuarioDto {
  codigoUsuario: number
  usuario: string
  login: string
  isSuperuser: boolean
  roles: SisSegRolDto[]
  permisos: SisSegUsuarioPermisoDto[]
  excepciones: SisSegUsuarioPermisoDto[]
  jsonMenu: SisSegMenuItemDto[]
}

export interface SisSegUsrPermCommand {
  codigoPerm: number
  tipo: 'ALLOW' | 'DENY'
  activo: boolean
}

export interface SisSegUsrRolSaveCommand {
  codigoUsuario: number
  roles: number[]
  permisos: SisSegUsrPermCommand[]
  usuarioUpd: number
}

export interface SisSegCacheCommand {
  codigoUsuario: number
  codigoModulo?: string | null
}

export interface SisSegCacheResponse {
  codigoUsuario: number
  modulosActualizados: string[]
  jsonMenu: SisSegMenuItemDto[]
}

export interface SisSegMigApplyCommand {
  codigoUsuario: number
  codigoModulo?: string | null
  usuarioUpd: number
}

export interface SisSegRolSaveCommand {
  codigoRol: number
  codigoMod: number
  clave: string
  nombre: string
  descripcion: string
  activo: boolean
  usuarioUpd: number
}

export interface SisSegMenuSaveCommand {
  codigoMenu: number
  codigoMod: number
  codigoPadre?: number | null
  titulo: string
  path: string
  icono: string
  orden: number
  activo: boolean
  usuarioUpd: number
}

export interface SisSegRolPermSaveCommand {
  codigoRol: number
  permisos: number[]
  usuarioUpd: number
}

export interface SisSegRolMenuSaveCommand {
  codigoRol: number
  menus: number[]
  usuarioUpd: number
}

export interface SisSegCloneUserDataDto {
  usuario: string
  login: string
  clave: string
  cedula?: number | null
  email?: string | null
  recibeEmail: boolean
}

export interface SisSegCloneUserCommandDto {
  codigoUsuarioOrigen: number
  codigoUsuarioDestino?: number | null
  usuarioDestino?: SisSegCloneUserDataDto | null
  sobrescribirAccesos: boolean
  usuarioUpd: number
}

export interface SisSegCloneUserResponseDto {
  codigoUsuarioOrigen: number
  codigoUsuarioDestino: number
  usuarioDestinoCreado: boolean
  rolesCopiados: number
  excepcionesCopiadas: number
  jsonMenu: SisSegMenuItemDto[]
}
