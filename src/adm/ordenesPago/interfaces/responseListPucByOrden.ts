export interface IResponseListPucByOrden {
    data: Datum[];
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

interface Datum {
    codigoPucOrdenPago: number;
    codigoOrdenPago: number;
    codigoPucCompromiso: number;
    codigoIcp: number;
    descripcionIcp: string;
    codigoPuc: number;
    descripcionPuc: string;
    financiadoId: number;
    descripcionFinanciado: string;
    codigoFinanciado: number;
    codigoSaldo: number;
    monto: number;
    montoPagado: number;
    montoAnulado: number;
    codigoCompromisoOp: number;
    codigoPresupuesto: number;
    montoCompromiso: number;
    icpConcat: string;
    pucConcat: string;
}