export interface Employee {
    codigoPersona:           number;
    cedula:                  string;
    foto:                    string;
    nombre:                  string;
    apellido:                string;
    nacionalidad:            string;
    descripcionNacionalidad: string;
    sexo:                    string;
    estadoCivilId:           number;
    estadoCivil:             string;
    status:                  string;
    descripcionStatus:       string;
    codigoEmpresa:           number;
    descricionSexo:          string;
    codigoRelacionCargo:     number;
    codigoCargo:             number;
    cargoCodigo:             string;
    codigoIcp:               number;
    codigoIcpUbicacion:      number;
    sueldo:                  number;
    descripcionCargo:        string;
    codigoTipoNomina:        number;
    tipoNomina:              string;
    frecuenciaPagoId:        number;
    codigoSector:            string;
    codigoPrograma:          string;
    codigoSubPrograma:       string;
    codigoProyecto:          string;
    codigoActividad:         string;
    codigoOficina:           string;
    denominacionIcp:         string;
    fechaIngreso:            Date;
    tipoCuentaId:            number;
    descripcionTipoCuenta:   string;
    bancoId:                 number;
    descripcionBanco:        string;
    noCuenta:                string;
    siglastipoNomina:        string;
    rif:                     string;
}

export interface Concept {
    codigoConcepto:        number;
    codigo:                string;
    codigoTipoNomina:      number;
    tipoNominaDescripcion: string;
    denominacion:          string;
    descripcion:           string;
    tipoConcepto:          string;
    moduloId:              number;
    moduloDescripcion:     string;
    codigoPuc:             number;
    codigoPucConcat:       string;
    status:                string;
    frecuenciaId:          number;
    frecuenciaDescripcion: string;
    dedusible:             number;
    automatico:            number;
    idModeloCalculo:       number;
    extra1:                string;
}

export interface Frequency {
    id:          number;
    descripcion: string;
}

export interface TypePayroll {
    codigoTipoNomina: number;
    descripcion:      string;
    siglasTipoNomina: string;
    frecuenciaPagoId: number;
    frecuenciaPago:   string;
    sueldoMinimo:     number;
}

export interface AutocompleteOption {
    label: string;
    value: string;
    id?: string;
    type?: string;
    sendAs?: string | null;
}

export interface FieldOptionMap {
    [key: string]: AutocompleteOption[];
}

export interface Value {
    code:        string;
    description: string;
}

export interface Item {
    field:              string;
    fieldDescription:   string;
    values:             Value[];
}

export interface FixedParams {
    items: Item[];
}