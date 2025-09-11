export enum UrlServices {
    GET_LOTES                               = '/AdmLotePago/GetAll',
    CREATE_LOTE                             = '/AdmLotePago/Create',
    UPDATE_LOTE                             = '/AdmLotePago/Update',
    DELETE_LOTE                             = '/AdmLotePago/Delete',

    APPROVE_LOTE                            = '/AdmLotePago/Aprobar',
    CANCEL_LOTE                             = '/AdmLotePago/Anular',

    GET_MAESTRO_CUENTAS                     = '/SisCuentaBanco/GetAll',
    GET_DESCRIPTIVAS                        = '/AdmDescriptivas/GetSelectDescriptiva',

    GET_PAGOS                               = '/AdmPagos/GetByLote',
    CREATE_PAGO                             = '/AdmPagos/Create',
    UPDATE_PAGO                             = '/AdmPagos/Update',
    DELETE_PAGO                             = '/AdmPagos/Delete',
    UPDATE_MONTO_PAGO                       = '/AdmPagos/UpdateMonto',

    GET_ORDEN_PAGO_PENDIENTES               = '/AdmOrdenesPagoPendientesPago/GetAll',

    GET_FILE_LOTE                           = '/Files/GetTxtFiles/',

    GET_PROVEEDORES                         = '/AdmProveedores/GetAllProveedoresContactos',

    GET_REPORT_BY_ELECTRONIC                = '/api-v1.0/electronic-payment/pdf/report',
    GET_REPORT_BY_ELECTRONIC_THIRD_PARTIES  = '/api-v1.0/electronic-payment-third-parties/pdf/report',
    GET_REPORT_BY_DEBIT_NOTE_THIRD_PARTIES  = '/api-v1.0/debit-note-third-parties/pdf/report'
}