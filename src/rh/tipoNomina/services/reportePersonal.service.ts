import axios from 'axios'
import authConfig from 'src/configs/auth'

export const REPORTE_PERSONAL_ENDPOINTS = {
  pdf: '/api-v1.0/personnel-list/pdf/report',
  api: 'RhTipoNomina/Report'
}

export interface ReportePersonalPdfRequest {
  codigoTipoNomina: number
}

export const generarReportePersonalPdf = async (params: ReportePersonalPdfRequest) => {
  const urlProductionReport = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT_PRODUCTION
  const urlDevelopmentReport = process.env.NEXT_PUBLIC_BASE_URL_API_NET_REPORT

  const urlProduction = process.env.NEXT_PUBLIC_BASE_URL_API_NET_PRODUCTION
  const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET

  const urlReportBase: string | undefined = !authConfig.isProduction ? urlDevelopmentReport : urlProductionReport
  const urlBase: string | undefined = !authConfig.isProduction ? urlDevelopment : urlProduction

  if (!urlBase || !urlReportBase) {
    throw new Error('Una de las URL base para generar el reporte no esta definida.')
  }

  const payload = {
    CodigoTipoNomina: params.codigoTipoNomina,
    Report: `${urlReportBase}${REPORTE_PERSONAL_ENDPOINTS.pdf}`,
    Usuario: JSON.parse(window.localStorage.getItem('userData') || '{}').username || ''
  }

  const response = await axios.post(`${urlBase}/${REPORTE_PERSONAL_ENDPOINTS.api}`, payload, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/pdf'
    }
  })

  const blob = new Blob([response.data], { type: 'application/pdf' })

  return URL.createObjectURL(blob)
}
