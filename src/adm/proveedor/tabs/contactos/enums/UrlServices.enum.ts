export enum UrlServices {
  GET_CONTACTOS           = '/AdmProveedoresContacto/GetAll',
  CREATE_CONTACTOS        = '/AdmProveedoresContacto/Create',
  UPDATE_CONTACTOS        = '/AdmProveedoresContacto/Update',
  DELETE_CONTACTOS        = '/AdmProveedoresContacto/Delete',

  GET_BY_PERSONA          = '/RhDirecciones/GetByPersona',

  GET_PAISES              = '/SisUbicacion/GetPaises',
  GET_ESTADOS             = '/SisUbicacion/GetEstados',
  GET_MUNICIPIOS          = '/SisUbicacion/GetMunicipiosPorPaisEstado',
  GET_CIUDADES            = '/SisUbicacion/GetCiudadesPorPaisEstadoMunicipio',
  GET_PARROQUIAS          = '/SisUbicacion/GetParroquiasPorPaisEstadoMunicipioCiudad',

  GET_DIRECCIONES         = '/RhDescriptivas/GetByTitulo',
  GET_TITULO              = '/RhDescriptivas/GetByTitulo',
}