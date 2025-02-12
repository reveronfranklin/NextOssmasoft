export interface IResponseCreateDocumentosOp {
  data: ICreateDocumentosOp
  isValid: boolean
  linkData: any
  linkDataArlternative: any
  message: string
  page: number
  totalPage: number
  cantidadRegistros: number
  total1: number
  total2: number
  total3: number
  total4: number
}

export interface ICreateDocumentosOp {
  codigoDocumentoOp: number
  codigoOrdenPago: number
  fechaComprobante: string | null
  fechaComprobanteString?: string
  fechaComprobanteObj?: FechaComprobanteObj
  periodoImpositivo: string
  tipoOperacionId: number | null
  descripcionTipoOperacion?: string
  tipoDocumentoId: number | null
  descripcionTipoDocumento?: string
  tipoTransaccionId: number | null
  descripcionTipoTransaccion?: string
  tipoImpuestoId: number | null
  descripcionTipoImpuesto?: string
  estatusFiscoId: number | null
  descripcionEstatusFisco?: string
  fechaDocumento: string | null
  fechaDocumentoString?: string
  fechaDocumentoObj?: FechaDocumentoObj
  numeroDocumento: string
  numeroControlDocumento: string
  montoDocumento: number
  baseImponible: number
  montoImpuesto: number
  numeroDocumentoAfectado: any
  montoImpuestoExento: number
  montoRetenido: number
  codigoPresupuesto: number
  numeroExpediente: any
}

export interface FechaComprobanteObj {
  year: string
  month: string
  day: string
}

export interface FechaDocumentoObj {
  year: string
  month: string
  day: string
}
