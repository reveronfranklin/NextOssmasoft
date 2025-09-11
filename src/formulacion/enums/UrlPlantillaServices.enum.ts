export enum UrlPlantillaServices {
  FINDALLPROCESO = 'proceso/findAll', //findAllProceso
  FINDALLPROCESODETALLE = 'proceso-detalle/findAllProcesoDetalleByProceso', //findAllProcesoDetalleByProceso
  GETALLPLANTILLASBYCODIGODETALLE = 'plantilla-calculo/getAllByCodigoDetalleProceso', //getAllPlantillas por codigo detalle de proceso

  CREATEPLANTILLA = 'plantilla-calculo/create',
  UPDATEPLANTILLA = 'plantilla-calculo/update',
  DELETEPLANTILLA = 'plantilla-calculo/delete',
}