export enum UrlServices {
    GETORDENESPAGOBYPRESUPUESTO = '/AdmOrdenPago/GetByPresupuesto',

    GETCOMPROMISOSBYPRESUPUESTO          = '/PreCompromisos/GetByPresupuesto',
    GETCOMPROMISOSPENDIENTEBYPRESUPUESTO = '/PreCompromisos/GetCompromisosPendientesByPresupuesto',

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

    GETIMPUESTOSDOCBYORDENPAGO  = '/AdmImpuestosDocumentosOp/GetByDocumento',
    CREATEIMPUESTODOCUMENTO     = '/AdmImpuestosDocumentosOp/Create',
    DELETEIMPUESTODOCUMENTO     = '/AdmImpuestosDocumentosOp/Delete',
    UPDATEIMPUESTODOCUMENTO     = '/AdmImpuestosDocumentosOp/Update',

    GETBENEFICIARIO             = '/AdmBeneficiariosOp/GetByOrdenPago',
    CREATEBENEFICIARIO          = '/AdmBeneficiariosOp/Update',
    UPDATEBENEFICIARIO          = '/AdmBeneficiariosOp/Create',
    DELETEBENEFICIARIO          = '/AdmBeneficiariosOp/Delete',
    UPDATEBENEFICIARIOMONTO     = '/AdmBeneficiariosOp/UpdateMonto',

    APROBARORDENPAGO            = 'AdmOrdenPago/Aprobar',
    ANULARORDENPAGO             = 'AdmOrdenPago/Anular',

    //Urls Reports
    GETREPORTBYORDENPAGO        = '/api-v1.0/payment-orders/pdf/report',
    GETREPORTBYRETENCIONES      = '/api-v1.0/income-tax-withholding-voucher/pdf/report',
    GETREPORTBYCOMPROBANTE      = '/api-v1.0/vat-withholding-voucher/pdf/report',
    TIMBREFISCAL                = '/api-v1.0/tax-stamp-voucher/pdf/report'
}