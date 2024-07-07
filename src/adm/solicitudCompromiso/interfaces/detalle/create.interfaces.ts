export interface CreateDetalle {
    codigoDetalleSolicitud: number;
    codigoSolicitud: number;
    cantidad: number;
    udmId: number;
    descripcion: string;
    precioUnitario: number;
    tipoImpuestoId: number;
    codigoProducto: number;
}