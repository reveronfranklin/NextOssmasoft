export enum UrlServices {
    GETORDENESPAGOBYPRESUPUESTO = '/AdmOrdenPago/GetByPresupuesto',
    GETCOMPROMISOSBYPRESUPUESTO = '/PreCompromisos/GetByPresupuesto',
    GETPUCORDENPAGO             = '/AdmPucOrdenPago/GetByOrdenPago',
    CREATEORDENPAGO             = '/AdmOrdenPago/Create',
    UPDATEORDENPAGO             = '/AdmOrdenPago/Update',
    DESCRIPTIVAS                = '/AdmDescriptivas/GetSelectDescriptiva',
    GETCOMPROMISOBYORDENPAGO    = '/AdmCompromisoOp/GetByOrdenPago',
    LISTPUCBYORDENPAGO          = '/AdmPucOrdenPago/GetByOrdenPago',
    UPDATEPUCBYORDENPAGO        = '/AdmPucOrdenPago/UpdateField',

    GETRETENCIONESBYORDENPAGO   = '/AdmRetencionesOp/GetByOrdenPago',
    CREATERETENCIONES           = '/AdmRetencionesOp/Create',
    UPDATERETENCIONES           = '/AdmRetencionesOp/Update',
    DELETERETENCIONES           = '/AdmRetencionesOp/Delete',
}