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

    GETRETENCIONESOPBYORDENPAGO = '/AdmRetencionesOp/GetByOrdenPago',
    CREATERETENCIONESOP         = '/AdmRetencionesOp/Create',
    UPDATERETENCIONESOP         = '/AdmRetencionesOp/Update',
    DELETERETENCIONESOP         = '/AdmRetencionesOp/Delete',

    GETADMRETENCIONES           = '/AdmRetenciones/GetAll',
    CREATEADMRETENCIONES        = '/AdmRetenciones/Create',
    UPDATEADMRETENCIONES        = '/AdmRetenciones/Update',
    DELETEADMRETENCIONES        = '/AdmRetenciones/Delete',

    GETDOCUMENTOSOPBYORDENPAGO  = '/AdmDocumentosOp/GetByCodigoOrdenPago',
    CREATEDOCUMENTOSOP          = '/AdmDocumentosOp/Create',
    UPDATEDOCUMENTOSOP          = '/AdmDocumentosOp/Update',
    DELETEDOCUMENTOSOP          = '/AdmDocumentosOp/Delete',

    GETBENEFICIARIO             = '/AdmBeneficiariosOp/GetByOrdenPago',
    CREATEBENEFICIARIO          = '/AdmBeneficiariosOp/Update',
    UPDATEBENEFICIARIO          = '/AdmBeneficiariosOp/Create',
    DELETEBENEFICIARIO          = '/AdmBeneficiariosOp/Delete',
    UPDATEBENEFICIARIOMONTO     = '/AdmBeneficiariosOp/UpdateMonto',

    GETREPORTBYORDENPAGO        = 'payment-orders/pdf/report',
    GETREPORTBYRETENCIONES      = 'income-tax-withholding-voucher/pdf/report',
    GETREPORTBYCOMPROBANTE      = 'vat-withholding-voucher/pdf/report',
}