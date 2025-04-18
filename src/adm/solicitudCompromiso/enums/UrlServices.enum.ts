export enum UrlServices {
    CREATE               = '/AdmSolicitudes/Create',
    UPDATE               = '/AdmSolicitudes/Update',
    DELETE               = '/AdmSolicitudes/Delete',
    PROVEEDORES          = '/AdmProveedores/GetAll',
    GETBYPRESUPUESTO     = '/AdmSolicitudes/GetByPresupuesto',
    DESCRIPTIVAS         = '/AdmDescriptivas/GetSelectDescriptiva',
    DETALLESOLICITUD     = '/AdmDetalleSolicitud/GetByCodigoSolicitud',
    DETALLEUPDATE        = '/AdmDetalleSolicitud/Update',
    DETALLECREATE        = '/AdmDetalleSolicitud/Create',
    DETALLEDELETE        = '/AdmDetalleSolicitud/Delete',
    GETLISTPRODUCTOS     = '/AdmProductos/GetAllPaginate',
    UPDATEPRODUCTOS      = '/AdmProductos/Update',
    GETPUCDETALLE        = '/AdmPucSolicitud/GetByDetalleSolicitud',
    PUCDETALLEUPDATE     = '/AdmPucSolicitud/Update',
    PUCDETALLECREATE     = '/AdmPucSolicitud/Create',
    PUCDETALLEDELETE     = '/AdmPucSolicitud/Delete',
    APROBARSOLICITUD     = '/PreCompromisos/CrearCompromisoDesdeSolicitud',
    ANULARSOLICITUD      = '/PreCompromisos/AnularDesdeSolicitud',
    ELIMINARIMPUTACIONES = '/AdmPucSolicitud/EliminarImputacion',

    GENERATEURLREPORTSOLICITUDCOMPROMISO = '/ReporteSolicitudCompromiso/ReportData',
    GENERATEURLREPORTORDENSERVICIO       = 'ReporteOrdenServicioPresupuestario/ReportData',

    GETREPORTBYURL       = '/Files/GetPdfFiles',
}