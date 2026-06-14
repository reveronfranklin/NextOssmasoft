export interface ResultDto<T> {
  data: T
  isValid: boolean
  message: string
  page?: number
  totalPage?: number
  cantidadRegistros?: number
}

export interface SisUsuarioDto {
  codigoUsuario: number
  usuario: string
  login: string
  cedula?: number
  status: string
  email: string
  recibeEmail: boolean
  esAnalistaSoporte: boolean
  esAnalistaCnt: boolean
  esAdminCnt: boolean
  isSuperuser: boolean
  codigoEmpresa: number
}

export interface SisUsuarioGetAllDto {
  pageSize: number
  pageNumber: number
  searchText: string
  soloActivos?: boolean
}

export interface SisUsuarioUpdateEmailDto {
  codigoUsuario: number
  email: string
  recibeEmail: boolean
  esAnalistaSoporte: boolean
  esAnalistaCnt: boolean
  esAdminCnt: boolean
  isSuperuser: boolean
  usuarioUpd: number
}

export interface SisUsuarioUpdatePasswordDto {
  codigoUsuario: number
  nuevaClave: string
  usuarioUpd: number
}

export interface SisUsuarioApplySupportPermissionsDto {
  codigoUsuario: number
  usuarioUpd: number
}

export interface SisUsuarioApplySupportPermissionsResult {
  codigoUsuario: number
  perfil: string
  codigoUsuarioRol: number
  created: boolean
}

export interface SisUsuarioApplyCntPermissionsDto {
  codigoUsuario: number
  usuarioUpd: number
}

export interface SisUsuarioApplyCntPermissionsResult {
  codigoUsuario: number
  perfil: string
  codigoUsuarioRol: number
  created: boolean
}
