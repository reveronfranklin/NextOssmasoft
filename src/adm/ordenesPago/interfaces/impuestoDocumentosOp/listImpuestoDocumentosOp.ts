export interface IResponseListImpuestoByOrdenPago {
  data: IListImpuestoByOrdenPago[]
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

export interface IListImpuestoByOrdenPago {
  codigoDocumentoOp: number;
}