import React, { useMemo } from 'react';
import useFormulaService from 'src/formulacion/services/formula/UseFormulaService';
import useVariableService from 'src/formulacion/services/variable/UseVariableService';
import { FormulaContext } from './FormulaContext';

export default function FormulaProvider({
  children,
  formulaService: formulaServiceProp,
  variableService: variableServiceProp
}) {
  const formulaServiceFromHook = useFormulaService();
  const variableServiceFromHook = useVariableService();

  const formulaService = formulaServiceProp || formulaServiceFromHook;
  const variableService = variableServiceProp || variableServiceFromHook;

  const value = useMemo(() => ({
    formulaService,
    variableService,
  }), [formulaService, variableService]);

  return (
    <FormulaContext.Provider value={value}>
      {children}
    </FormulaContext.Provider>
  );
}