export interface IResponseCompromisoByOrden {
    data: CompromisoByOrden[];
    isValid: boolean;
    linkData: null;
    linkDataArlternative: null;
    message: string;
    page: number;
    totalPage: number;
    cantidadRegistros: number;
    total1: number;
    total2: number;
    total3: number;
    total4: number;
}

interface CompromisoByOrden {
    codigoCompromisoOp: number;
    origenCompromisoId: number;
    codigoIdentificador: number;
    codigoOrdenPago: number;
    codigoProveedor: number;
    codigoPresupuesto: number;
    codigoValContrato: number;
}