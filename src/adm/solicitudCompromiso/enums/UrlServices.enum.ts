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
    CREATEPRODUCTOS  =  '/AdmProductos/Create', //todo verificar
    UPDATEPRODUCTOS  = '/AdmProductos/Update', //todo verificar
    DELETEPRODUCTOS  = '/AdmProductos/Delete', //todo verificar
    GETPUCDETALLE    = '/AdmPucSolicitud/GetByDetalleSolicitud',
    PUCDETALLEUPDATE = '/AdmPucSolicitud/Update',
    PUCDETALLECREATE = '/AdmPucSolicitud/Create',
    PUCDETALLEDELETE = '/AdmPucSolicitud/Delete',
}