export interface CreateOrdenPago {
    codigoOrdenPago: number | null;
    CodigoPresupuesto: number;
    codigoCompromiso: number;
    fechaOrdenPago: string;
    tipoOrdenPagoId: number;
    cantidadPago: number;
    frecuenciaPagoId: number;
    tipoPagoId: number;
    motivo: string;
    numeroComprobante: number | null;
    fechacomprobante: string;
    numeroComprobante2: number | null;
    numeroComprobante3: number | null;
    numeroComprobante4: number | null;
}