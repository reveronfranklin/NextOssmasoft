export interface PreOrdenPagoDto {
    id:               number;
    nombreEmisor:     string;
    direccionEmisor:  string;
    rif:              string;
    numeroFactura:    string;
    fechaEmision:     Date;
    baseImponible:    number;
    porcentajeIva:    number;
    iva:              number;
    montoTotal:       number;
    excento:          number;
    usuarioConectado: number;
}
