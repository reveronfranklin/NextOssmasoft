export interface LoteDto {
    codigoLotePago:    number;
    tipoPagoId:        number | null;
    fechaPago:         string | null;
    codigoCuentaBanco: number | null;
    codigoPresupuesto: number;
    titulo:            string | null;
}