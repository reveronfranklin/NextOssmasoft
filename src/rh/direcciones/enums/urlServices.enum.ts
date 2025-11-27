export enum DireccionesUrls {
  GET_BY_PERSONA  = '/RhDirecciones/GetByPersona',
  GET_PAISES      = '/SisUbicacion/GetPaises',
  GET_ESTADOS     = '/SisUbicacion/GetEstados',
  GET_MUNICIPIOS  = '/SisUbicacion/GetMunicipiosPorPaisEstado',
  GET_CIUDADES    = '/SisUbicacion/GetCiudadesPorPaisEstadoMunicipio',
  GET_PARROQUIAS  = '/SisUbicacion/GetParroquiasPorPaisEstadoMunicipioCiudad',
  GET_DIRECCIONES = '/RhDescriptivas/GetByTitulo',
  GET_TITULO      = '/RhDescriptivas/GetByTitulo',

  CREATE_DIRECCION = '/RhDirecciones/Create',
  UPDATE_DIRECCION = '/RhDirecciones/Update',
  DELETE_DIRECCION = '/RhDirecciones/Delete'
}