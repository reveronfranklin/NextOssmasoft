export enum UrlServices {
  GET_DIRECCIONES       = '/AdmProveedoresDirecciones/GetAll',
  CREATE_DIRECCION      = '/AdmProveedoresDirecciones/Create',
  UPDATE_DIRECCION      = '/AdmProveedoresDirecciones/Update',
  DELETE_DIRECCION      = '/AdmProveedoresDirecciones/Delete',

  GET_PAISES            = '/SisUbicacion/GetPaises',
  GET_ESTADOS           = '/SisUbicacion/GetEstados',
  GET_MUNICIPIOS        = '/SisUbicacion/GetMunicipiosPorPaisEstado',
  GET_CIUDADES          = '/SisUbicacion/GetCiudadesPorPaisEstadoMunicipio',
  GET_PARROQUIAS        = '/SisUbicacion/GetParroquiasPorPaisEstadoMunicipioCiudad',
  GET_DIRECCIONES_TITLE = '/RhDescriptivas/GetByTitulo',
  GET_TITULO            = '/RhDescriptivas/GetByTitulo',
}