import React, { useRef, useEffect } from 'react';
import { Container, Paper, Grid, Box } from '@mui/material';
import useFormulaBuilder from './hooks/useFormulaBuilder';
import FormulaInput from './components/FormulaInput';
import VariableSelector from './components/VariableSelector';
import FuncionesSelector from './components/FuncionesSelector';
import OperatorSelector from './components/OperatorSelector';
import ResultDisplay from './components/ResultDisplay';
import ActionButtonGroup from './components/ActionButtonGroup';

import useFormulaService from 'src/formulacion/services/formula/UseFormulaService';

export default function FormulaBuilder({ initialVariables: propInitialVariables = [], initialFunctions: propInitialFunctions = [] }) {
  const variablesToUse = [
    { code: 'v0', description: 'sueldo' },
    { code: 'v1', description: 'dias' },
    { code: 'v2', description: 'pagos' },
    { code: 'v3', description: 'salario' }
  ];

  const functionsToUse = [
    { code: 'SUMA(', description: 'SUMA(valor1, valor2, ...)' },
    { code: 'PROMEDIO(', description: 'PROMEDIO(valor1, valor2, ...)' },
    { code: 'MAX(', description: 'MÁXIMO(valor1, valor2, ...)' },
    { code: 'MIN(', description: 'MÍNIMO(valor1, valor2, ...)' },
    { code: 'SI(condicion, valor_verdadero, valor_falso)', description: 'SI(condicion, verdadero, falso)' },
  ];

  const { getListFormulas } = useFormulaService();

  useEffect(() => {
    const filter = {
      page: 1,
      limit: 10,
      searchText: '',
    }

    getListFormulas(filter).then(response => {
      console.log('Formulas:', response);
    });
  }, []);

  const {
    formula,
    setFormula,
    variables,
    functions: availableFunctions,
    result,
    error,
    syntaxError,
    evaluateCurrentFormula,
    clearFormula,
  } = useFormulaBuilder(variablesToUse, functionsToUse);

  const formulaInputRef = useRef(null);

  const insertTextIntoFormulaInput = (text) => {
    if (formulaInputRef.current && typeof formulaInputRef.current.insertText === 'function') {
      formulaInputRef.current.insertText(text);
    } else {
      // Fallback: este bloque solo se necesita si FormulaInput no usa useImperativeHandle
      // y estás dependiendo de formulaInputRef.current.inputElement.
      // Si ya ajustaste FormulaInput con useImperativeHandle, este bloque podría ser eliminado.
      const inputElement = formulaInputRef.current?.inputElement;
      if (inputElement) {
        const start = inputElement.selectionStart;
        const end = inputElement.selectionEnd;

        const newFormula = formula.substring(0, start) + text + formula.substring(end);
        setFormula(newFormula);

        setTimeout(() => {
          inputElement.focus();
          inputElement.setSelectionRange(start + text.length, start + text.length);
        }, 0);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormulaInput
              ref={formulaInputRef}
              formula={formula}
              setFormula={setFormula}
              syntaxError={syntaxError}
            />

            <ActionButtonGroup
              onEvaluate={evaluateCurrentFormula}
              onClear={clearFormula}
              sx={{ mt: 2, mb: 1 }}
            />

            <ResultDisplay
              result={result}
              error={error}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <OperatorSelector
              onOperatorSelect={insertTextIntoFormulaInput}
            />

            <Box sx={{ mt: 2 }}>
              <VariableSelector
                variables={variables}
                onVariableSelect={insertTextIntoFormulaInput}
              />
            </Box>

            {availableFunctions && availableFunctions.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <FuncionesSelector
                  functions={availableFunctions}
                  onFunctionSelect={insertTextIntoFormulaInput}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}