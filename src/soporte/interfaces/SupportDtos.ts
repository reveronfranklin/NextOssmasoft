export interface ResultDto<T> {
  data: T
  isValid: boolean
  message: string
  page?: number
  totalPage?: number
  cantidadRegistros?: number
}

export interface SupportTicketDto {
  ticketId: number
  ticketNumero: string
  usuarioSolicitanteId: number
  usuarioSolicitante: string
  tipoSolicitudId: number
  tipoSolicitud: string
  moduloId: number
  modulo: string
  asunto: string
  descripcion: string
  prioridadId: number
  prioridad: string
  estadoId: number
  estado: string
  usuarioResponsableId?: number
  usuarioResponsable: string
  fechaCreacion: string
  fechaAsignacion?: string
  fechaResolucion?: string
  fechaCierre?: string
  observacionResolucion: string
  fechaVencimientoSla?: string
  codigoEmpresa: number
}

export interface SupportTicketGetAllDto {
  usuarioId: number
  pageSize: number
  pageNumber: number
  searchText: string
  estadoId?: number
  prioridadId?: number
  tipoSolicitudId?: number
  moduloId?: number
  responsableId?: number
  solicitanteId?: number
  fechaDesde?: string
  fechaHasta?: string
}

export interface SupportTicketCreateDto {
  usuarioSolicitanteId: number
  tipoSolicitudId: number
  moduloId: number
  asunto: string
  descripcion: string
  prioridadId: number
  createdBy: number
}

export interface SupportDashboardSummaryDto {
  totalTickets: number
  ticketsAbiertos: number
  ticketsCerrados: number
  ticketsCriticos: number
  ticketsVencidos: number
  ticketsSinAsignar: number
  tiempoPromedioResolucion: number
}

export interface SupportCatalogDto {
  id: number
  nombre: string
  descripcion: string
  orden: number
  activo: boolean
}

export interface SupportUserDto {
  codigoUsuario: number
  usuario: string
  login: string
  email: string
  esAnalistaSoporte: boolean
}

export interface SupportCommentDto {
  comentarioId: number
  ticketId: number
  usuarioId: number
  usuario: string
  comentario: string
  esInterno: boolean
  fechaComentario: string
}

export interface SupportHistoryDto {
  historialId: number
  ticketId: number
  tipoCambio: string
  campo: string
  valorAnterior: string
  valorNuevo: string
  comentario: string
  usuarioId: number
  fechaCambio: string
}

export interface SupportAttachmentDto {
  adjuntoId: number
  ticketId: number
  nombreOriginal: string
  identificadorArchivo: string
  rutaArchivo: string
  mimeType: string
  tamanoBytes: number
  usuarioCargaId: number
  fechaCarga: string
  activo: boolean
}

export interface SupportAttachmentCreateDto {
  ticketId: number
  nombreOriginal: string
  identificadorArchivo?: string
  rutaArchivo?: string
  mimeType?: string
  tamanoBytes: number
  usuarioCargaId: number
}

export interface SupportNotificationDto {
  notifId: number
  ticketId: number
  usuarioDestinoId: number
  evento: string
  titulo: string
  mensaje: string
  canal: string
  leida: boolean
  fechaCreacion: string
  fechaLectura?: string
}

export interface SupportPermissionsDto {
  usuarioId: number
  perfil: string
  permissions: string[]
}
