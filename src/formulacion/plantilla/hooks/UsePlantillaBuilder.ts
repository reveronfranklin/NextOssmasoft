import { useVariablesAndFunctions } from '../../shared/hooks/useVariablesAndFunctions';
import { PlantillaCRUD } from './usePlantillaCRUD'

// import { IBuilderServices } from 'src/formulacion/interfaces/BuilderServices.interfaces';

import { IFormulaService } from 'src/formulacion/interfaces/formula/FormulaService.interfaces'
import { IVariableService } from 'src/formulacion/interfaces/variable/VariableService.interfaces'
import { IPlantillaService } from 'src/formulacion/interfaces/plantilla/PlantillaService.interfaces'

interface FormulaBuilderServices {
  formulaService: IFormulaService;
  variableService: IVariableService;
  plantillaService: IPlantillaService;
}

const usePlantillaBuilder = (services: FormulaBuilderServices) => {
  const { plantillas, setPlantillas } = useVariablesAndFunctions(services);
  const {
    error, message,
    getListProcesos,
    getListDetalleProcesos,
    getPlantillasByDetalleProceso,
    reorderPlantilla,
    createPlantilla,
    updatePlantilla,
    deletePlantilla
  } = PlantillaCRUD({
    plantillaService: services.plantillaService,
    invalidateTable: () => console.log('Table invalidated'),
  });

  return {
    plantillas, setPlantillas,
    error, message,
    getListProcesos,
    getListDetalleProcesos,
    getPlantillasByDetalleProceso,
    reorderPlantilla,
    createPlantilla,
    updatePlantilla,
    deletePlantilla,
  };
};

export default usePlantillaBuilder;