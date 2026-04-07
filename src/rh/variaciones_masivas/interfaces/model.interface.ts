export interface Value {
    code:        string;
    description: string;
}

export interface Item {
    field:  string;
    values: Value[];
}

export interface FixedParams {
    items: Item[];
}

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
