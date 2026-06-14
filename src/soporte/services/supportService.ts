import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import {
  SupportAttachmentCreateDto,
  SupportAttachmentDto,
  SupportCatalogDto,
  SupportCommentDto,
  ResultDto,
  SupportDashboardSummaryDto,
  SupportHistoryDto,
  SupportNotificationDto,
  SupportPermissionsDto,
  SupportTicketCreateDto,
  SupportTicketDto,
  SupportTicketGetAllDto,
  SupportUserDto
} from '../interfaces/SupportDtos'

export const SUPPORT_TICKETS_QUERY_KEY = 'support-tickets'
export const SUPPORT_DASHBOARD_QUERY_KEY = 'support-dashboard'
export const SUPPORT_CATALOGS_QUERY_KEY = 'support-catalogs'
export const SUPPORT_NOTIFICATIONS_QUERY_KEY = 'support-notifications'
export const SUPPORT_PERMISSIONS_QUERY_KEY = 'support-permissions'
export const SUPPORT_ANALYSTS_QUERY_KEY = 'support-analysts'

export interface SupportTicketGetAllResult {
  data: SupportTicketDto[]
  page: number
  totalPage: number
  cantidadRegistros: number
}

export const fetchSupportTickets = async (payload: SupportTicketGetAllDto): Promise<SupportTicketGetAllResult> => {
  const response = await ossmmasofApiVertical.post<ResultDto<SupportTicketDto[]>>('/SupportTickets/GetAll', payload)

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

export const createSupportTicket = async (payload: SupportTicketCreateDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/SupportTickets/create', payload)

  return response.data
}

export const fetchSupportTicketById = async (ticketId: number, usuarioId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SupportTicketDto>>('/SupportTickets/getById', {
    ticketId,
    usuarioId
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const assignSupportTicket = async (payload: {
  ticketId: number
  usuarioResponsableId: number
  updatedBy: number
  comentario?: string
}) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/SupportTickets/assign', payload)

  return response.data
}

export const changeSupportTicketStatus = async (payload: {
  ticketId: number
  estadoId: number
  updatedBy: number
  comentario?: string
}) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/SupportTickets/changeStatus', payload)

  return response.data
}

export const closeSupportTicket = async (payload: { ticketId: number; updatedBy: number; observacionResolucion: string }) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/SupportTickets/close', payload)

  return response.data
}

export const createSupportComment = async (payload: {
  ticketId: number
  usuarioId: number
  comentario: string
  esInterno: boolean
}) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/SupportComments/create', payload)

  return response.data
}

export const fetchSupportComments = async (ticketId: number, usuarioId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SupportCommentDto[]>>('/SupportComments/getByTicket', {
    ticketId,
    usuarioId
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchSupportHistory = async (ticketId: number, usuarioId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SupportHistoryDto[]>>('/SupportHistory/getByTicket', {
    ticketId,
    usuarioId
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const createSupportAttachment = async (payload: SupportAttachmentCreateDto) => {
  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/SupportAttachments/create', payload)

  return response.data
}

export const uploadSupportAttachment = async (payload: { ticketId: number; usuarioCargaId: number; file: File }) => {
  const formData = new FormData()
  formData.append('ticketId', String(payload.ticketId))
  formData.append('usuarioCargaId', String(payload.usuarioCargaId))
  formData.append('file', payload.file)

  const response = await ossmmasofApiVertical.post<ResultDto<number>>('/SupportAttachments/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return response.data
}

export const fetchSupportAttachments = async (ticketId: number, usuarioId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SupportAttachmentDto[]>>('/SupportAttachments/getByTicket', {
    ticketId,
    usuarioId
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchSupportCatalog = async (catalogo: 'types' | 'priorities' | 'statuses' | 'modules') => {
  const response = await ossmmasofApiVertical.post<ResultDto<SupportCatalogDto[]>>('/SupportCatalogs/GetAll', {
    catalogo
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchSupportAnalysts = async (searchText: string) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SupportUserDto[]>>('/SisUsuarios/getSupportUsers', {
    pageSize: 20,
    pageNumber: 1,
    searchText,
    soloActivos: true
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const fetchSupportNotifications = async (usuarioId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SupportNotificationDto[]>>('/SupportNotifications/getByUser', {
    usuarioId
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data ?? []
}

export const markSupportNotificationRead = async (notifId: number, usuarioId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<string>>('/SupportNotifications/markRead', {
    notifId,
    usuarioId
  })

  return response.data
}

export const fetchSupportPermissions = async (usuarioId: number) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SupportPermissionsDto>>('/SupportPermissions/getByUser', {
    usuarioId
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}

export const fetchSupportDashboard = async (usuarioId: number, fechaDesde?: string, fechaHasta?: string) => {
  const response = await ossmmasofApiVertical.post<ResultDto<SupportDashboardSummaryDto>>('/SupportDashboard/summary', {
    usuarioId,
    fechaDesde: fechaDesde || null,
    fechaHasta: fechaHasta || null
  })

  if (response.data.isValid === false) {
    throw new Error(response.data.message)
  }

  return response.data.data
}
