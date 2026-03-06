export interface ResponseRhMovNominaCommand {
    codigoMovNomina:       number;
    codigoTipoNomina:      number;
    codigoPersona:         number;
    codigoConcepto:        number;
    complementoConcepto:   string;
    tipo:                  string;
    frecuenciaId:          number;
    monto:                 number;
    asignacion:            number;
    deduccion:             number;
    asignacionDeduccion:   number;
    status:                string;
    codigoFrecuencia:      string;
    descripcionFrecuencia: string;
    codigo:                string;
    denominacion:          string;
    tipoConcepto:          string;
    moduloId:              number;
    codigoModulo:          string;
    descripcionModulo:     string;
    extra1:                string;
    extra2:                string;
    extra3:                string;
}
