export interface IGetListByOrdenPago {
  codigoOrdenPago?: number;
  pageStart?: number;
  pageNumber?: number;
  searchText?: string;
  status?: string;
}

export interface IResponseGetBeneficiarioOp {
  data: BeneficiarioOp[]
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

export interface BeneficiarioOp {
  codigoBeneficiarioOp: number
  codigoOrdenPago: number
  codigoProveedor: number
  nombreProveedor: string
  monto: number
  montoPagado: number
  montoAnulado: number
  codigoPresupuesto: number
}