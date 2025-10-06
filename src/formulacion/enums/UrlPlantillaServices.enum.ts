export enum UrlPlantillaServices {
  FINDALLPROCESO = 'proceso/findAll', //findAllProceso
  FINDALLPROCESODETALLE = 'proceso-detalle/findAllProcesoDetalleByProceso', //findAllProcesoDetalleByProceso
  GETALLPLANTILLASBYCODIGODETALLE = 'plantilla-calculo/getAllByCodigoDetalleProceso', //getAllPlantillas por codigo detalle de proceso
  REORDERPLANTILLA = 'plantilla-calculo/reorder', //reorderPlantilla

  CREATEPLANTILLA = 'plantilla-calculo/create',
  UPDATEPLANTILLA = 'plantilla-calculo/update',
  DELETEPLANTILLA = 'plantilla-calculo/delete',
}