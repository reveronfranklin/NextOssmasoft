export interface ICreateBeneficiarioOp {
  codigoBeneficiarioOp: number
  codigoOrdenPago: number
  codigoProveedor: number
  monto: number
  montoPagado: number
  montoAnulado: number
  codigoPresupuesto: number
}

export interface IResponseBenenficiarioOpCreate {
  data: IBeneficiarioOpCreate[]
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

export interface IBeneficiarioOpCreate {
  codigoBeneficiarioOp: number
  codigoOrdenPago: number
  codigoProveedor: number
  nombreProveedor: string
  monto: number
  montoPagado: number
  montoAnulado: number
  codigoPresupuesto: number
}