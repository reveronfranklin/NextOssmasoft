import { IFormulaService } from 'src/formulacion/interfaces/formula/FormulaService.interfaces'
import { IVariableService } from 'src/formulacion/interfaces/variable/VariableService.interfaces'
import { IPlantillaService } from 'src/formulacion/interfaces/plantilla/PlantillaService.interfaces'

export interface IBuilderServices {
  formulaService?: IFormulaService;
  variableService?: IVariableService;
  plantillaService?: IPlantillaService;
}