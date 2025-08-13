import { useVariablesAndFunctions } from '../../shared/hooks/useVariablesAndFunctions';

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

  return { plantillas, setPlantillas };
};

export default usePlantillaBuilder;