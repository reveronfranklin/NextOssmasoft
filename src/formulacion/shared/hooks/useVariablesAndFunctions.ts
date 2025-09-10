import { useState, useEffect, useCallback } from 'react';
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

  const fetchVariables = useCallback(async () => {
    const response = await services.variableService.getListVariables({
      page: 1,
      limit: 10,
      searchText: ''
    });

    if (response.isValid) {
      console.log('Variables fetched:', response.data);
      setVariables(response.data);
    }
  }, [services.variableService.getListVariables]);

  useEffect(() => {
    fetchVariables();
  }, [fetchVariables]);

  const fetchFunctions = useCallback(async () => {
    const response = await services.formulaService.getListFormulas({
      page: 1,
      limit: 10,
      searchText: ''
    });

    if (response.isValid) {
      setFunctions(response.data);
    }
  }, [services.formulaService.getListFormulas]);

  useEffect(() => {
    fetchFunctions();
  }, [fetchFunctions]);

  const fetchPlantillas = useCallback(async () => {
    const response = await services.plantillaService.getListProcesos({
      page: 1,
      limit: 10,
      searchText: '',
    });

    if (response.isValid) {
      setPlantillas(response.data);
    }
  }, [services.plantillaService.getListProcesos]);


  useEffect(() => {
    fetchPlantillas();
  }, [fetchPlantillas]);

  return {
    variables,
    setVariables,
    functions,
    setFunctions,
    plantillas,
    setPlantillas,
    fetchVariables,
    fetchFunctions,
    fetchPlantillas
  };
};