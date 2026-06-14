export interface OssUsuarioRolMenuItem {
  title: string
  icon?: string
  path?: string
  permissions?: string[]
  children?: OssUsuarioRolMenuItem[]
}

export interface OssUsuarioRolResponseDto {
  codigoUsuarioRol: number
  usuario: string
  codigoUsuario: number
  descripcion: string
  jsonMenu: OssUsuarioRolMenuItem[]
}

export interface OssUsuarioRolCreateDto {
  usuario: string
  codigoUsuario: number
  descripcion: string
  jsonMenu: OssUsuarioRolMenuItem[]
}

export interface OssUsuarioRolUpdateDto extends OssUsuarioRolCreateDto {
  codigoUsuarioRol: number
}

export interface OssUsuarioRolDeleteDto {
  codigoUsuarioRol: number
}

export interface OssUsuarioRolGetAllDto {
  pageSize: number
  pageNumber: number
  searchText: string
}

export interface ResultDto<T> {
  data: T
  isValid: boolean
  message: string
  page?: number
  totalPage?: number
  cantidadRegistros?: number
}
