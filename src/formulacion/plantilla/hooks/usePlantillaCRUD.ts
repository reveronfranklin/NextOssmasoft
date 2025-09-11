import { useCallback, useState } from 'react';
import { IPlantillaService } from 'src/formulacion/interfaces/plantilla/PlantillaService.interfaces';

import { CreatePlantillaDTO } from 'src/formulacion/interfaces/plantilla/Create.interfaces'
import { UpdatePlantillaDTO } from 'src/formulacion/interfaces/plantilla/Update.interfaces'
import { DeletePlantillaDTO } from 'src/formulacion/interfaces/plantilla/Delete.interfaces'

interface IPlantillaCRUD {
  plantillaService: IPlantillaService;
  invalidateTable: () => void;
}

export const PlantillaCRUD = ({ plantillaService }: IPlantillaCRUD) => {
  const [error] = useState<string | null>(null);
  const [message] = useState<string | null>(null);

  const getListProcesos = useCallback(async (filters: any) => {

    return await plantillaService.getListProcesos(filters);
  }, [plantillaService.getListProcesos])

  const getListDetalleProcesos = useCallback(async (filters: any) => {

    return await plantillaService.getListDetalleProcesos(filters);
  }, [plantillaService.getListDetalleProcesos])

  const getPlantillasByDetalleProceso = useCallback(async (filters: any) => {

    return await plantillaService.getPlantillasByDetalleProceso(filters);
  }, [plantillaService.getPlantillasByDetalleProceso])

  const createPlantilla = useCallback(async (payload: CreatePlantillaDTO) => {

    return await plantillaService.createPlantilla(payload);
  }, [plantillaService.createPlantilla])

  const updatePlantilla = useCallback(async (payload: UpdatePlantillaDTO) => {

    return await plantillaService.updatePlantilla(payload);
  }, [plantillaService.updatePlantilla])

  const deletePlantilla = useCallback(async (payload: DeletePlantillaDTO) => {

    return await plantillaService.deletePlantilla(payload);
  }, [plantillaService.deletePlantilla])

  return {
    error,
    message,
    getListProcesos,
    getListDetalleProcesos,
    getPlantillasByDetalleProceso,
    createPlantilla,
    updatePlantilla,
    deletePlantilla,
  }
};
