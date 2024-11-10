export interface IUpdateOrdenPago {
    codigoOrdenPago: number;
    codigoPresupuesto: number;
    codigoCompromiso: number | string; //todo verificar si es string o number
    fechaOrdenPago: string;
    tipoOrdenPagoId: number;
    cantidadPago: number;
    frecuenciaPagoId: number;
    tipoPagoId: number;
    motivo: string;
    numeroComprobante: number | null;
    fechaComprobante: string | null;
    numeroComprobante2: number | null;
    numeroComprobante3: number | null;
    numeroComprobante4: number | null;
    conFactura: boolean;
}