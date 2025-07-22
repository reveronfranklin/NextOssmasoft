import { useState, useEffect } from 'react';

import { IFormulaService } from 'src/formulacion/interfaces/formula/FormulaService.interfaces'
import { IVariableService } from 'src/formulacion/interfaces/variable/VariableService.interfaces'
import { TipoVariableEnum } from 'src/formulacion/enums/TipoVariable.enum'

export const useVariablesAndFunctions = (services: {
  variableService: IVariableService;
  formulaService: IFormulaService;
}) => {
  const [variables, setVariables] = useState<any>([]);
  const [functions, setFunctions] = useState<any>([]);
  const [loading, setLoading] = useState({ variables: false, functions: false });

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

  return { variables, functions, loading };
};