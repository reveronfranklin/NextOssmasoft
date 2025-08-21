import React, { useMemo } from 'react';
import useFormulaService from 'src/formulacion/services/formula/UseFormulaService';
import useVariableService from 'src/formulacion/services/variable/UseVariableService';
import usePlantillaService from 'src/formulacion/services/plantilla/UsePlantillaService';

import { FormulaContext } from './FormulaContext';

export default function FormulaProvider({
  children,
  formulaService: formulaServiceProp,
  variableService: variableServiceProp,
  plantillaService: plantillaServiceProp
}) {
  const formulaServiceFromHook = useFormulaService();
  const variableServiceFromHook = useVariableService();
  const plantillaServiceFromHook = usePlantillaService();

  const formulaService = formulaServiceProp || formulaServiceFromHook;
  const variableService = variableServiceProp || variableServiceFromHook;
  const plantillaService = plantillaServiceProp || plantillaServiceFromHook;

  const value = useMemo(() => ({
    formulaService,
    variableService,
    plantillaService
  }), [
    formulaService,
    variableService,
    plantillaService
  ]);

  return (
    <FormulaContext.Provider value={value}>
      {children}
    </FormulaContext.Provider>
  );
}