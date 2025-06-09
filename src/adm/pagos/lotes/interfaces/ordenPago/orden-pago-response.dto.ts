export interface OrdenPagoResponseDto {
    numeroOrdenPago:                string;
    codigoOrdenPago:                number;
    fechaOrdenPago:                 Date;
    tipoOrdenPago:                  string;
    numeroRecibo:                   null;
    codigoPeriodoOP:                number;
    codigoPresupuesto:              number;
    admBeneficiariosPendientesPago: AdmBeneficiariosPendientesPago[];
}

export interface AdmBeneficiariosPendientesPago {
    codigoOrdenPago:         number;
    codigoPresupuesto:       number;
    codigoPeriodoOP:         number;
    codigoProveedor:         number;
    numeroOrdenPago:         string;
    codigoContactoProveedor: number;
    pagarALaOrdenDe:         string;
    nombreProveedor:         string;
    montoPorPagar:           number;
    codigoBeneficiarioOp:    number;
    motivo:                  string;
    montoAPagar:             number;
}
