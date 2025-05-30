export interface IResponseCreateImpuestoDocumentosOp {
  data: ICreateImpuestoDocumentosOp
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

export interface ICreateImpuestoDocumentosOp {
  codigoImpuestoDocumentoOp: number;
  codigoDocumentoOp: number;
  codigoRetencion: number;
  tipoRetencionId: number;
  periodoImpositivo: string;
  baseImponible: number;
  montoImpuesto: number;
  montoImpuestoExento: number;
  montoRetenido: number;
}