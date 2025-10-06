import React, { useMemo } from 'react';
import useFormulaService from 'src/formulacion/services/formula/UseFormulaService';
import useVariableService from 'src/formulacion/services/variable/UseVariableService';
import usePlantillaService from 'src/formulacion/services/plantilla/UsePlantillaService';

import { FormulaContext } from './FormulaContext';

export default function FormulaProvider({ children }) {
  const formulaService   = useFormulaService();
  const variableService  = useVariableService();
  const plantillaService = usePlantillaService();

  const value = useMemo(() => ({
    formulaService,
    variableService,
    plantillaService
  }), [formulaService, variableService, plantillaService]);

  return (
    <FormulaContext.Provider value={value}>
      {children}
    </FormulaContext.Provider>
  );
}