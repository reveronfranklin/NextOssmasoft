import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'

export const REPORTE_NOTA_DEBITO_TERCEROS_ENDPOINTS = {
  pdf: '/ReporteNotaDebitoTerceros/pdf'
}

export const generarReporteNotaDebitoTercerosPdf = async (codigoLotePago: number, codigoPago?: number) => {
  const response = await ossmmasofApiVertical.post(
    REPORTE_NOTA_DEBITO_TERCEROS_ENDPOINTS.pdf,
    { codigoLotePago, codigoPago: codigoPago ?? 0 },
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
    throw new Error(errorText || 'No se pudo generar el reporte de nota de debito de terceros')
  }

  const blob = new Blob([response.data], { type: 'application/pdf' })

  return URL.createObjectURL(blob)
}
