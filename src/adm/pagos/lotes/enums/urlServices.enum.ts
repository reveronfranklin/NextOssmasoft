export enum UrlServices {
    GET_LOTES                   = '/AdmLotePago/GetAll',
    CREATE_LOTE                 = '/AdmLotePago/Create',
    UPDATE_LOTE                 = '/AdmLotePago/Update',
    DELETE_LOTE                 = '/AdmLotePago/Delete',

    APPROVE_LOTE                = '/AdmLotePago/Aprobar',
    CANCEL_LOTE                 = '/AdmLotePago/Anular',

    GET_MAESTRO_CUENTAS         = '/SisCuentaBanco/GetAll',
    GET_DESCRIPTIVAS            = '/AdmDescriptivas/GetSelectDescriptiva',

    GET_PAGOS                   = '/AdmPagos/GetByLote',
    CREATE_PAGO                 = '/AdmPagos/Create',
    UPDATE_PAGO                 = '/AdmPagos/Update',
    DELETE_PAGO                 = '/AdmPagos/Delete',
    UPDATE_MONTO_PAGO           = '/AdmPagos/UpdateMonto',

    GET_ORDEN_PAGO_PENDIENTES   = '/AdmOrdenesPagoPendientesPago/GetAll',

    GET_FILE_LOTE               = '/Files/GetTxtFiles/',

    GET_PROVEEDORES             = '/AdmProveedores/GetAllProveedoresContactos',
}