export enum UrlPlantillaServices {
  FINDALLPROCESO                  = '/proceso/findAll',
  FINDALLPROCESODETALLE           = '/proceso-detalle/findAllProcesoDetalleByProceso',
  GETALLPLANTILLASBYCODIGODETALLE = '/plantilla-calculo/getAllByCodigoDetalleProceso',
  REORDERPLANTILLA                = '/plantilla-calculo/update-list',

  CREATEPLANTILLA = '/plantilla-calculo/create',
  UPDATEPLANTILLA = '/plantilla-calculo/update',
  DELETEPLANTILLA = '/plantilla-calculo/delete',
}