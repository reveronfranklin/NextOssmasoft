import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import {
  ReporteBm1ApiResponse,
  ReporteBm1FilterDto,
  ReporteBm1IcpDto,
  ReporteBm1ItemDto
} from '../interfaces/reporteBm1.types'

export const REPORTE_BM1_ENDPOINTS = {
  getAll: '/ReporteBm1/GetAll',
  getIcps: '/ReporteBm1/GetIcps',
  pdf: '/ReporteBm1/pdf',
  excel: '/ReporteBm1/excel'
}

const toIsoDate = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

export const buildReporteBm1Payload = (filter: ReporteBm1FilterDto) => ({
  fechaDesde: toIsoDate(filter.fechaDesde),
  fechaHasta: toIsoDate(filter.fechaHasta),
  codigosIcp: filter.codigosIcp
})

const readJsonBlobMessage = async (blob: Blob, fallback: string) => {
  try {
    const text = await blob.text()
    const parsed = JSON.parse(text)

    return parsed?.message || text || fallback
  } catch {
    return fallback
  }
}

export const getReporteBm1Icps = async () => {
  const response = await ossmmasofApiVertical.get<ReporteBm1ApiResponse<ReporteBm1IcpDto[]>>(
    REPORTE_BM1_ENDPOINTS.getIcps
  )

  if (!response.data?.isValid) {
    throw new Error(response.data?.message || 'No se pudo cargar la lista de ICP')
  }

  return response.data.data ?? []
}

export const getReporteBm1Data = async (filter: ReporteBm1FilterDto) => {
  const response = await ossmmasofApiVertical.post<ReporteBm1ApiResponse<ReporteBm1ItemDto[]>>(
    REPORTE_BM1_ENDPOINTS.getAll,
    buildReporteBm1Payload(filter)
  )

  if (!response.data?.isValid) {
    throw new Error(response.data?.message || 'No se pudo consultar el reporte BM1')
  }

  return response.data.data ?? []
}

export const generarReporteBm1Pdf = async (filter: ReporteBm1FilterDto) => {
  const response = await ossmmasofApiVertical.post(REPORTE_BM1_ENDPOINTS.pdf, buildReporteBm1Payload(filter), {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/pdf'
    }
  })

  if (response.data?.type?.includes('application/json')) {
    throw new Error(await readJsonBlobMessage(response.data, 'No se pudo generar el reporte BM1'))
  }

  const blob = new Blob([response.data], { type: 'application/pdf' })

  return URL.createObjectURL(blob)
}

export const descargarReporteBm1Excel = async (filter: ReporteBm1FilterDto) => {
  const response = await ossmmasofApiVertical.post(REPORTE_BM1_ENDPOINTS.excel, buildReporteBm1Payload(filter), {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  })

  if (response.data?.type?.includes('application/json')) {
    throw new Error(await readJsonBlobMessage(response.data, 'No se pudo generar el Excel BM1'))
  }

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `reporte-bm1-${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
