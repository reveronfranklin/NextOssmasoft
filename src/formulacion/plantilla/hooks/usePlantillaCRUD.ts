import { useCallback, useState } from 'react';
import { IPlantillaService } from 'src/formulacion/interfaces/plantilla/PlantillaService.interfaces';

interface IPlantillaCRUD {
  plantillaService: IPlantillaService;
  invalidateTable: () => void;
}

export const PlantillaCRUD = ({ plantillaService, invalidateTable }: IPlantillaCRUD) => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const getListProcesos = useCallback(async (filters: any) => {
    const response = await plantillaService.getListProcesos(filters);
    return response;
  }, [plantillaService.getListProcesos])

  const getListDetalleProcesos = useCallback(async (filters: any) => {
    console.log('Fetching detalle procesos with filters:', filters);
    // const response = await plantillaService.getListDetalleProcesos(filters);
    // return response;
  }, [plantillaService.getListDetalleProcesos])

  const getPlantillasByDetalleProceso = useCallback(async (filters: any) => {
    const response = await plantillaService.getPlantillasByDetalleProceso(filters);
    return response;
  }, [plantillaService.getPlantillasByDetalleProceso])

  return {
    error,
    message,
    getListProcesos,
    getListDetalleProcesos,
    getPlantillasByDetalleProceso
  }
};
