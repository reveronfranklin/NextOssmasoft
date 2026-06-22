import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'

export const REPORTE_COMPROBANTE_IVA_ENDPOINTS = {
  pdf: '/ReporteComprobanteIva/pdf'
}

export const generarReporteComprobanteIvaPdf = async (codigoOrdenPago: number) => {
  const response = await ossmmasofApiVertical.post(
    REPORTE_COMPROBANTE_IVA_ENDPOINTS.pdf,
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
    throw new Error(errorText || 'No se pudo generar el comprobante de retencion IVA')
  }

  const blob = new Blob([response.data], { type: 'application/pdf' })

  return URL.createObjectURL(blob)
}
