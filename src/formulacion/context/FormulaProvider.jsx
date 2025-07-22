import React, { useMemo } from 'react';
import useFormulaService from 'src/formulacion/services/formula/UseFormulaService';
import useVariableService from 'src/formulacion/services/variable/UseVariableService';
import { FormulaContext } from './FormulaContext';

export default function FormulaProvider({
  children,
  formulaService: formulaServiceProp,
  variableService: variableServiceProp
}) {
  // Usa los servicios inyectados o los hooks por defecto
  const formulaService = formulaServiceProp || useFormulaService();
  const variableService = variableServiceProp || useVariableService();

  // Memoriza el value para evitar renders innecesarios
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