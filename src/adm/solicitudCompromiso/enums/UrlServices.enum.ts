export enum UrlServices {
    CREATE           = '/AdmSolicitudes/Create',
    UPDATE           = '/AdmSolicitudes/Update',
    DELETE           = '/AdmSolicitudes/Delete',
    PROVEEDORES      = '/AdmProveedores/GetAll',
    GETBYPRESUPUESTO = '/AdmSolicitudes/GetByPresupuesto',
    DESCRIPTIVAS     = '/AdmDescriptivas/GetSelectDescriptiva',
    DETALLESOLICITUD = '/AdmDetalleSolicitud/GetByCodigoSolicitud',
    DETALLEUPDATE    = '/AdmDetalleSolicitud/Update',
    DETALLECREATE    = '/AdmDetalleSolicitud/Create',
    DETALLEDELETE    = '/AdmDetalleSolicitud/Delete',
    GETLISTPRODUCTOS = '/AdmProductos/GetAllPaginate',
}