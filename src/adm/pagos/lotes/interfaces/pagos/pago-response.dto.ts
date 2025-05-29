export interface PagoResponseDto {
    codigoLote:             number;
    codigoPago:             number;
    codigoCuentaBanco:      number;
    nroCuenta:              string;
    codigoBanco:            number;
    nombreBanco:            string;
    tipoChequeID:           number;
    descripcionTipoCheque:  string;
    fechaPago:              Date;
    fechaPagoString:        string;
    fechaPagoObj:           FechaObj;
    codigoProveedor:        number;
    nombreProveedor:        string;
    motivo:                 string;
    status:                 string;
    fechaEntrega:           Date;
    fechaEntregaString:     string;
    fechaEntregaObj:        FechaObj;
    usuarioEntrega:         number;
    codigoPresupuesto:      number;
    codigoBeneficiarioPago: number;
    codigoBeneficiarioOP:   number;
    codigoOrdenPago:        number;
    numeroOrdenPago:        string;
    monto:                  number;
    montoAnulado:           number;
}

export interface FechaObj {
    year:  string | number;
    month: string | number;
    day:   string | number;
}
