import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'

export const REPORTE_ORDEN_PAGO_ENDPOINTS = {
  pdf: '/ReporteOrdenPago/pdf'
}

export const generarReporteOrdenPagoPdf = async (codigoOrdenPago: number) => {
  const response = await ossmmasofApiVertical.post(
    REPORTE_ORDEN_PAGO_ENDPOINTS.pdf,
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
    throw new Error(errorText || 'No se pudo generar el reporte de orden de pago')
  }

  const blob = new Blob([response.data], { type: 'application/pdf' })

  return URL.createObjectURL(blob)
}
