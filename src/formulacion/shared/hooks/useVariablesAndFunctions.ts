import { useState, useEffect } from 'react';
import { TipoVariableEnum } from 'src/formulacion/enums/TipoVariable.enum'
import { IFormulaService } from 'src/formulacion/interfaces/formula/FormulaService.interfaces'
import { IVariableService } from 'src/formulacion/interfaces/variable/VariableService.interfaces'
import { IPlantillaService } from 'src/formulacion/interfaces/plantilla/PlantillaService.interfaces'

export const useVariablesAndFunctions = (services: {
  variableService: IVariableService;
  formulaService: IFormulaService;
  plantillaService: IPlantillaService;
}) => {
  const [variables, setVariables] = useState<any>([]);
  const [functions, setFunctions] = useState<any>([]);
  const [plantillas, setPlantillas] = useState<any>([]);

  useEffect(() => {
    const fetchVariables = async () => {
      const response = await services.variableService.getListVariables({
        page: 1,
        limit: 10,
        searchText: '',
        tipoVariable: TipoVariableEnum.FUNCION
      });

      if (response.isValid) {
        setVariables(response.data);
      }
    };
    fetchVariables();
  }, [services.variableService.getListVariables]);

  useEffect(() => {
    const fetchFunctions = async () => {
      const response = await services.formulaService.getListFormulas({
        page: 1,
        limit: 10,
        searchText: ''
      });

      if (response.isValid) {
        setFunctions(response.data);
      }
    };
    fetchFunctions();
  }, [services.formulaService.getListFormulas]);

  useEffect(() => {
    const fetchPlantillas = async () => {
      const response = await services.plantillaService.getListProcesos({
        page: 1,
        limit: 10,
        searchText: '',
      });

      console.log('Plantillas fetched:', response);

      if (response.isValid) {
        setPlantillas(response.data);
      }
    };
    fetchPlantillas();
  }, [services.plantillaService.getListProcesos]);

  return {
    variables,
    setVariables,
    functions,
    setFunctions,
    plantillas,
    setPlantillas,
  };
};