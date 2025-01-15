export interface IUpdateMontoBeneficiarioOp {
  codigoBeneficiarioOp: number
  monto: number
}

export interface IResponseBenenficiarioOpMontoUpdate {
  data: IBeneficiarioOpMontoUpdate[]
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

export interface IBeneficiarioOpMontoUpdate {
  codigoBeneficiarioOp: number
  codigoOrdenPago: number
  codigoProveedor: number
  nombreProveedor: string
  monto: number
  montoPagado: number
  montoAnulado: number
  codigoPresupuesto: number
}