import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'

export const REPORTE_PERSONAL_ENDPOINTS = {
  pdf: '/ReportePersonal/pdf'
}

export interface ReportePersonalPdfRequest {
  codigoTipoNomina: number
  status?: string
}

export const generarReportePersonalPdf = async (params: ReportePersonalPdfRequest) => {
  const payload = {
    codigoTipoNomina: params.codigoTipoNomina,
    status: params.status || 'A'
  }

  const response = await ossmmasofApiVertical.post(REPORTE_PERSONAL_ENDPOINTS.pdf, payload, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/pdf'
    }
  })

  if (response.data?.type?.includes('application/json')) {
    const errorText = await response.data.text()
    throw new Error(errorText || 'No se pudo generar el reporte de personal')
  }

  const blob = new Blob([response.data], { type: 'application/pdf' })

  return URL.createObjectURL(blob)
}
