export interface IUpdateBeneficiarioOp {
  codigoBeneficiarioOp: number
  codigoOrdenPago: number
  codigoProveedor: number
  monto: number
  montoPagado: number
  montoAnulado: number
  codigoPresupuesto: number
}

export interface IResponseBenenficiarioOpUpdate {
  data: IBeneficiarioOpUpdate[]
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

export interface IBeneficiarioOpUpdate {
  codigoBeneficiarioOp: number
  codigoOrdenPago: number
  codigoProveedor: number
  nombreProveedor: string
  monto: number
  montoPagado: number
  montoAnulado: number
  codigoPresupuesto: number
}