export interface SolicitudCompromiso {
    CodigoSolicitud: number
    NumeroSolicitud: string
    FechaSolicitud: Date | null
    CodigoSolicitante: number
    TipoSolicitudId: number
    CodigoProveedor: number
    Motivo: string
    Nota: string
    Status: string
    CodigoPresupuesto: number
}