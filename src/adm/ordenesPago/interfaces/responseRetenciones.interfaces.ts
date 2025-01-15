export interface IResponseGetRetenciones {
    data: Retencion[]
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

export interface Retencion {
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
    numeroComprobante: string | null
}