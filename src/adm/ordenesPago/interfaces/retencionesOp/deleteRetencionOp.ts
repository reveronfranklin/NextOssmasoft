export interface IDeleteRetencionOp {
  codigoRetencionOp: number
}

export interface IResponseDeleteRetencion {
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
}