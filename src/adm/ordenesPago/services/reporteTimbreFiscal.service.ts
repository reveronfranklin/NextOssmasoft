import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'

export const REPORTE_TIMBRE_FISCAL_ENDPOINTS = {
  pdf: '/ReporteTimbreFiscal/pdf'
}

export const generarReporteTimbreFiscalPdf = async (codigoOrdenPago: number) => {
  const response = await ossmmasofApiVertical.post(
    REPORTE_TIMBRE_FISCAL_ENDPOINTS.pdf,
    { codigoOrdenPago },
    {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/pdf'
      }
    }
  )

  if (response.data?.type?.includes('application/json')) {
    const errorText = await response.data.text()
    throw new Error(errorText || 'No se pudo generar el reporte de timbre fiscal')
  }

  const blob = new Blob([response.data], { type: 'application/pdf' })

  return URL.createObjectURL(blob)
}
