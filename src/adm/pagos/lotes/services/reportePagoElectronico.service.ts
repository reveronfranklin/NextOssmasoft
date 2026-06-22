import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'

export const REPORTE_PAGO_ELECTRONICO_ENDPOINTS = {
  pdf: '/ReportePagoElectronico/pdf',
  tercerosPdf: '/ReportePagoElectronico/terceros/pdf'
}

const generarPdf = async (endpoint: string, codigoLotePago: number, codigoPago?: number) => {
  const response = await ossmmasofApiVertical.post(
    endpoint,
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
    throw new Error(errorText || 'No se pudo generar el reporte de pago electronico')
  }

  const blob = new Blob([response.data], { type: 'application/pdf' })

  return URL.createObjectURL(blob)
}

export const generarReportePagoElectronicoPdf = async (codigoLotePago: number, codigoPago?: number) => {
  return generarPdf(REPORTE_PAGO_ELECTRONICO_ENDPOINTS.pdf, codigoLotePago, codigoPago)
}

export const generarReportePagoElectronicoTercerosPdf = async (codigoLotePago: number, codigoPago?: number) => {
  return generarPdf(REPORTE_PAGO_ELECTRONICO_ENDPOINTS.tercerosPdf, codigoLotePago, codigoPago)
}
