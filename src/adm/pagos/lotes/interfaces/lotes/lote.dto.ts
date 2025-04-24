export interface LoteDto {
    codigoLotePago:    number;
    tipoPagoId:        number | null;
    fechaPago:         Date | null;
    codigoCuentaBanco: number | null;
    codigoPresupuesto: number;
    Titulo:            string | null;
}