import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'

export const REPORTE_RETENCION_ISLR_ENDPOINTS = {
  pdf: '/ReporteRetencionIslr/pdf'
}

export const generarReporteRetencionIslrPdf = async (codigoOrdenPago: number) => {
  const response = await ossmmasofApiVertical.post(
    REPORTE_RETENCION_ISLR_ENDPOINTS.pdf,
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
    throw new Error(errorText || 'No se pudo generar el comprobante de retencion ISLR')
  }

  const blob = new Blob([response.data], { type: 'application/pdf' })

  return URL.createObjectURL(blob)
}
