export interface Update {
    codigoSolicitud: number
    numeroSolicitud: string
    fechaSolicitud: Date
    codigoSolicitante: number
    tipoSolicitudId: number
    codigoProveedor: number
    motivo: string
    nota: string
    status: string
    codigoPresupuesto: number,
    fechaSolicitudString: string,
    descripcionStatus: string,
}