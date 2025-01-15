export interface IsolicitudesCompromiso {
    data: solicitudCompromiso[]
    isValid: boolean
    linkData: any
    linkDataArlternative: any
    message: string
    page: number
    totalPage: number
    cantidadRegistros: number
}

export interface solicitudCompromiso {
    codigoSolicitud: number
    ano: number
    numeroSolicitud: string
    fechaSolicitud: string
    fechaSolicitudString: string
    fechaSolicitudObj: FechaSolicitud
    codigoSolicitante: number
    tipoSolicitudId: number
    codigoProveedor: number
    motivo: string
    nota: any
    status: string
    codigoPresupuesto: number
    descripcionStatus: string
    nombreProveedor: string
    denominacionSolicitante: string
    descripcionTipoSolicitud: string
    searchText: string
    ordenServicio: boolean
}

export interface FechaSolicitud {
    year: string
    month: string
    day: string
}