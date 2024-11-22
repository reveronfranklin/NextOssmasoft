export interface IDeleteBenenficiarioOp {
  codigoRetencionOp: number
}

export interface IResponseDeleteBeneficiario {
  data: IBenenficiario
  isValid: boolean
  linkData: null
  linkDataArlternative: null
  message: string
  page: number
  totalPage: number
  cantidadRegistros: number
  total1: number
  total2: number
  total3: number
  total4: number
}

export interface IBenenficiario {
  codigoRetencionOp: number
  codigoOrdenPago: number
  tipoRetencionId: number
  descripcionTipoRetencion: string
  codigoRetencion: number
  conceptoPago: string
  porRetencion: number
  montoRetencion: number
  montoRetenido: number
  codigoPresupuesto: number
  baseImponible: number
  numeroComprobante: any
}