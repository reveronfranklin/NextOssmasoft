export interface ICreateRetencionOp {
  codigoRetencionOp: number
  codigoOrdenPago: number
  tipoRetencionId: number
  codigoRetencion: number
  porRetencion: number
  montoRetencion: number
  codigoPresupuesto: number
  baseImponible: number
}

export interface IResponseCreateRetencion {
  data: IRetencionData
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

export interface IRetencionData {
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