import React, { useMemo } from 'react';
import useFormulaService from 'src/formulacion/services/formula/UseFormulaService';
import useVariableService from 'src/formulacion/services/variable/UseVariableService';
import usePlantillaService from 'src/formulacion/services/plantilla/UsePlantillaService';
import useVariableEntradaProceso from 'src/formulacion/services/variableEntradaProceso/UseVariableEntradaProceso';

import { FormulaContext } from './FormulaContext';

export default function FormulaProvider({ children }) {
  const formulaService   = useFormulaService();
  const variableService  = useVariableService();
  const plantillaService = usePlantillaService();
  const variableEntradaProcesoService = useVariableEntradaProceso();

  const value = useMemo(() => ({
    formulaService,
    variableService,
    plantillaService,
    variableEntradaProcesoService
  }), [formulaService, variableService, plantillaService, variableEntradaProcesoService]);

  return (
    <FormulaContext.Provider value={value}>
      {children}
    </FormulaContext.Provider>
  );
}