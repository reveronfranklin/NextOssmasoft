export interface ICreateRetencion {
  codigoRetencion: number
  tipoRetencionId: number
  conceptoPago: string
  tipoPersonaId: string
  baseImponible: number
  porRetencion: number
  montoRetencion: number
  fechaIni: null
  fechaFin: null
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
  codigoRetencion: number
  tipoRetencionId: number
  descripcionTipoRetencion: string
  conceptoPago: string
  tipoPersonaId: string
  descripcionTipoPersona: string
  baseImponible: number
  porRetencion: number
  montoRetencion: number
  fechaIni: null
  fechaIniString: string
  fechaIniObject: null
  fechaFin: null
  fechaFinString: string
  fechaFinObject: null
}