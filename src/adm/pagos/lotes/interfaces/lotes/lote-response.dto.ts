export interface LoteResponseDto {
    codigoLotePago:      number;
    tipoPagoId:          number;
    descripcionTipoPago: string;
    fechaPago:           Date;
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
}

export interface FechaPagoDto {
    year:  string;
    month: string;
    day:   string;
}
