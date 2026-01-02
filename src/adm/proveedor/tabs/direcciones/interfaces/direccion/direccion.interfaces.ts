export interface Direccion {
    codigoDirProveedor: number;
    codigoProveedor:    number;
    tipoDireccionId:    number;
    paisId:             number;
    estadoId:           number;
    municipioId:        number;
    ciudadId:           number;
    parroquiaId:        number;
    sectorId:           number;
    urbanizacionId:     number;
    tipoViviendaId:     number;
    vivienda:           string;
    tipoNivelId:        number;
    nivel:              string;
    nroUnidad:          null;
    complementoDir:     string;
    tenenciaId:         number;
    codigoPostal:       number;
    principal:          boolean;
}
