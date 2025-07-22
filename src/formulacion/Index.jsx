import React, { useRef } from 'react';
import { Container, Paper, Grid, Box, TextField } from '@mui/material';
import FormulaInput from './components/FormulaInput';
import VariableSelector from './components/VariableSelector';
import OperatorSelector from './components/OperatorSelector';
import ResultDisplay from './components/ResultDisplay';
import ActionButtonGroup from './components/ActionButtonGroup';
import ListFormulas from './components/Datagrid/ListFormulas';

import useFormulaBuilder from './hooks/useFormulaBuilder';
import useFormulaService from 'src/formulacion/services/formula/UseFormulaService';
import useVariableService from 'src/formulacion/services/variable/UseVariableService';
import FormulaProvider from './context/FormulaProvider';

export default function FormulaBuilder({
  formulaService: formulaServiceProp,
  variableService: variableServiceProp
}) {
  const formulaService = formulaServiceProp || useFormulaService();
  const variableService = variableServiceProp || useVariableService();

  const services = React.useMemo(() => ({
    formulaService,
    variableService
  }), [formulaService, variableService]);

  const {
    description,
    setDescription,
    formula,
    setFormula,
    variables: availableVariables,
    functions: availableFormulas,
    result,
    error,
    syntaxError,
    handleCreate,
    handleUpdate,
    handleDelete,
    clearFormula,
    selectedFormula,
    setSelectedFormula
  } = useFormulaBuilder(services)

  const formulaInputRef = useRef(null)

  const insertTextIntoFormulaInput = (text = '', description = '') => {
    if (selectedFormula && selectedFormula.id) return;

    if (description) {
      setDescription(description);
    }

    if (formulaInputRef.current && typeof formulaInputRef.current.insertText === 'function') {
      formulaInputRef.current.insertText(text);
    } else {
      const inputElement = formulaInputRef.current?.inputElement;
      if (inputElement) {
        const start = inputElement.selectionStart || 0;
        const end = inputElement.selectionEnd || 0;

        setFormula(prev => {
          const newValue = prev.substring(0, start) + text + prev.substring(end);

          return newValue;
        });

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
            <TextField
              label="Descripción"
              value={description}
              onChange={e => setDescription(e.target.value)}
              fullWidth
              margin="normal"
            />

            <FormulaInput
              ref={formulaInputRef}
              formula={formula}
              setFormula={setFormula}
              syntaxError={syntaxError}
            />

            <ActionButtonGroup
              onEvaluate = {
                selectedFormula.id !== 0 ? handleUpdate : handleCreate
              }
              onClear={clearFormula}
              sx={{ mt: 2, mb: 1 }}
              isEdit={selectedFormula.id !== 0}
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

            {availableVariables && availableVariables.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <FormulaProvider>
                  <VariableSelector
                    variables={availableVariables}
                    onVariableSelect={insertTextIntoFormulaInput}
                  />
                </FormulaProvider>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormulaProvider >
              <ListFormulas
                formulas={availableFormulas}
                onFunctionSelect={insertTextIntoFormulaInput}
                onDeleteFormula={handleDelete}
                setSelectedFormula={setSelectedFormula}
              />
            </FormulaProvider>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}