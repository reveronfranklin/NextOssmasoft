export interface ResponseGetAll {
    data: ICompromiso[];
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

export interface ICompromiso {
    codigoCompromiso: number;
    ano: number;
    codigoSolicitud: number;
    numeroCompromiso: string;
    numeroSolicitud: string;
    fechaCompromiso: string;
    fechaCompromisoString: string;
    fechaCompromisoObj: FechaCompromiso;
    codigoProveedor: number;
    nombreProveedor: string;
    codigoDirEntrega: number;
    motivo: string;
    status: string;
    descripcionStatus: string;
    codigoPresupuesto: number;
}

interface FechaCompromiso {
    year: string;
    month: string;
    day: string;
}