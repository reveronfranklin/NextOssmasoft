export interface LoteResponseDto {
    codigoLotePago:      number;
    tipoPagoId:          number;
    descripcionTipoPago: string;
    fechaPago:           string;
    fechaPagoString:     string;
    fechaPagoDto:        FechaPagoDto;
    codigoCuentaBanco:   number;
    numeroCuenta:        string;
    codigoBanco:         number;
    nombreBanco:         string;
    searchText:          string;
    status:              string;
    titulo:              string;
    codigoPresupuesto:   number;
    fileName:            string;
}

export interface FechaPagoDto {
    year:  string | number;
    month: string | number;
    day:   string | number;
}
