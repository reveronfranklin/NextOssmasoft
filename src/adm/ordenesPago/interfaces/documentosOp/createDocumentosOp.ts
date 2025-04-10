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
  tipoOperacionId: number
  descripcionTipoOperacion?: string
  tipoDocumentoId: number
  descripcionTipoDocumento?: string
  tipoTransaccionId: number
  descripcionTipoTransaccion?: string
  tipoImpuestoId: number
  descripcionTipoImpuesto?: string
  estatusFiscoId: number
  descripcionEstatusFisco?: string
  fechaDocumento: string
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
