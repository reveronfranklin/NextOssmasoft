export interface PagoDto {
    codigoLote:           number | null;
    codigoOrdenPago:      number | null;
    numeroOrdenPago:      string | null;
    codigoBeneficiarioOP: number | null;
    monto:                number | null;
    motivo:               string | null;
}
