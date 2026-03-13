export interface ResponseRhMovNominaCommand {
    automatico:            boolean
    codigoMovNomina?:       number | null;
    codigoTipoNomina?:      number | null;
    codigoPersona:         number | null;
    codigoConcepto:        number | null;
    complementoConcepto:   string | null;
    tipo?:                  string | null;
    frecuenciaId:          number | null;
    monto?:                 number | null;
    asignacion?:            number | null;
    deduccion?:             number | null;
    asignacionDeduccion?:   number | null;
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
    searchText?:            string;
}
