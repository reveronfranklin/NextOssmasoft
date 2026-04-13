export enum ApiPaths {
    GET_FIXED_PARAMS        = '/RhPersonalCargoParametrosFilter/GetAll',
    GET_EMPLOYEES           = '/RhPersonalCargoGetAll/GetAll',
    STORE_LOTE_VARIACION    = '/RhMovNominaMasivo/create',

    // AutoSelect (conceptos, frecuencias, tipos de nomina)
    GET_CONCEPTOS           = '/RhConceptos/GetAll',
    GET_FRECUENCIAS         = '/RhDescriptivas/GetByTitulo',
    GET_TIPO_NOMINA         = '/RhTipoNomina/GetAll'
}