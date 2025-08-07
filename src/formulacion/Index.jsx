import React, { useRef, useEffect, useCallback } from 'react';
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

import useFormulaHistory from 'src/formulacion/hooks/useFormulaHistory';

export default function FormulaBuilder({
  formulaService: formulaServiceProp,
  variableService: variableServiceProp
}) {
  const formulaServiceFromHook = useFormulaService();
  const variableServiceFromHook = useVariableService();

  // const builderClearFormula = useFormulaBuilderClear();

  const formulaService = formulaServiceProp || formulaServiceFromHook;
  const variableService = variableServiceProp || variableServiceFromHook;

  const services = React.useMemo(() => ({
    formulaService,
    variableService
  }), [formulaService, variableService]);

  const {
    description,
    setDescription,
    variables: availableVariables, setVariables,
    functions: availableFormulas,
    result,
    error,
    syntaxError,
    handleCreate: handleBuilderCreate,
    handleUpdate: handleBuilderUpdate,
    handleDelete,
    clearFormula: builderClearFormula,
    selectedFormula,
    setSelectedFormula,
    editingItem,
    setEditingItem
  } = useFormulaBuilder(services)

  const {
    formula,
    setFormula,
    undo,
    clearAllHistory,
    history: formulaHistory,
  } = useFormulaHistory('');

  const formulaInputRef = useRef(null)

  const memoizedVariables = React.useMemo(
    () => availableVariables,
    [availableVariables]
  );

  const getFormulaFromInput = React.useCallback(() => {
    return formulaInputRef.current?.getFormulaValue() || '';
  }, []);

  const insertTextIntoFormulaInput = React.useCallback((text = '', description = '', type = 'variable') => {
    console.log(description)
    const currentFormula = getFormulaFromInput();

    if (type === 'formula') {
      if (currentFormula === text) return;
      if (selectedFormula && selectedFormula.id) return;
    }

    formulaInputRef.current?.insertText(text);
  }, [getFormulaFromInput, selectedFormula]);

  const handleEvaluate = useCallback(() => {
    const currentFormula = getFormulaFromInput();

    if (selectedFormula.id !== 0) {
      handleBuilderUpdate(currentFormula);
    } else {
      handleBuilderCreate(currentFormula);
    }
  }, [selectedFormula.id, getFormulaFromInput, handleBuilderUpdate, handleBuilderCreate]);

  const handleClear = useCallback(() => {
    formulaInputRef.current?.setFormulaValue('');
    builderClearFormula;
  }, [builderClearFormula]);

  useEffect(() => {
    if (selectedFormula && selectedFormula.formula !== undefined && formulaInputRef.current) {
      formulaInputRef.current.setFormulaValue(selectedFormula.formula);
      setDescription(selectedFormula.descripcion || '');
    } else if (formulaInputRef.current) {
      formulaInputRef.current.setFormulaValue('');
      setDescription('');
    }
  }, [selectedFormula, setDescription]);

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
              syntaxError={syntaxError}
              formula={formula}
              setFormula={setFormula}
            />
            <ActionButtonGroup
              onEvaluate={handleEvaluate}
              onDeleteFormula={handleDelete}
              onClear={handleClear}
              onUndo={undo}
              clearAllHistory={clearAllHistory}
              formulaHistory={formulaHistory}
              sx={{ mt: 2, mb: 1 }}
              isEdit={selectedFormula.id !== 0}
              clearDisabled={getFormulaFromInput().trim() === ''}
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
            { memoizedVariables && memoizedVariables.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <FormulaProvider>
                  <VariableSelector
                    variables={memoizedVariables}
                    setVariables={setVariables}
                    onVariableSelect={insertTextIntoFormulaInput}
                    setEditingItem={setEditingItem}
                    editingItem={editingItem}
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
                setSelectedFormula={setSelectedFormula}
              />
            </FormulaProvider>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}