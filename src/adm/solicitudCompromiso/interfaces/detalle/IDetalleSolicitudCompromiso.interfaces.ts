export interface IDetalleSolicitudCompromiso {
    data: DetalleSolicitudCompromiso[]
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

export interface DetalleSolicitudCompromiso {
    codigoDetalleSolicitud: number
    codigoSolicitud: number
    cantidad: number
    cantidadComprada: number
    cantidadAnulada: number
    udmId: number
    descripcionUnidad: string
    descripcion: string
    precioUnitario: number
    porDescuento: number
    montoDescuento: number
    tipoImpuestoId: number
    porImpuesto: number
    montoImpuesto: number
    codigoPresupuesto: number
    codigoProducto: number
}