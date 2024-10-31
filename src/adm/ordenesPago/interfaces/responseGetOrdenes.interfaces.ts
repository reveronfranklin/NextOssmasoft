export interface ResponseGetOrdenes {
    data: Orden[];
    isValid: boolean;
    linkData: null;
    linkDataArlternative: null;
    message: string;
    page: number;
    totalPage: number;
    cantidadRegistros: number;
    total1: number;
    total2: number;
}

export interface Orden {
    fechaCompromisoString: string;
    fechaCompromiso: string;

    codigoOrdenPago: number;
    ano: number;
    codigoCompromiso: string;
    codigoProveedor: number;
    nombreProveedor: string;
    numeroOrdenPago: string;
    fechaOrdenPago: string;
    fechaOrdenPagoString: string;
    fechaOrdenPagoObj: FechaOrdenPagoObj;
    tipoOrdenPagoId: number;
    descripcionTipoOrdenPago: string;
    cantidadPago: number;
    frecuenciaPagoId: number;
    descripcionFrecuencia: string;
    tipoPagoId: number;
    descripcionTipoPago: string;
    status: string;
    descripcionStatus: string;
    motivo: string;
    codigoPresupuesto: number;
    numeroComprobante: null;
    fechaComprobante: string;
    fechaComprobanteString: null;
    fechaComprobanteObj: null;
    numeroComprobante2: null;
    numeroComprobante3: null;
    numeroComprobante4: null;
    origenId: number;
}

export interface FechaOrdenPagoObj {
    year: string;
    month: string;
    day: string;
}