export interface ICreateOrdenPago {
    codigoOrdenPago: number;
    codigoPresupuesto: number;
    codigoCompromiso: string | number;
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