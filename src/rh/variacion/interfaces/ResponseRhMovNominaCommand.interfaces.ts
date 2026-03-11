export interface ResponseRhMovNominaCommand {
    codigoMovNomina?:       number;
    codigoTipoNomina?:      number;
    codigoPersona:         number | null;
    codigoConcepto:        number | null;
    complementoConcepto:   string | null;
    tipo?:                  string;
    frecuenciaId:          number | null;
    monto?:                 number;
    asignacion?:            number;
    deduccion?:             number;
    asignacionDeduccion?:   number;
    status?:                string;
    codigoFrecuencia?:      string;
    descripcionFrecuencia?: string;
    codigo?:                string;
    denominacion?:          string;
    tipoConcepto?:          string;
    moduloId?:              number;
    codigoModulo?:          string;
    descripcionModulo?:     string;
    extra1?:                string;
    extra2?:                string;
    extra3?:                string;
}
