import React, { useRef, useEffect, useCallback } from 'react';
import { Container, Paper, Grid, Box, TextField } from '@mui/material';

//componentes comunes
import FormulaInput from '../shared/components/FormulaInput';
import VariableSelector from '../shared/components/VariableSelector';
import OperatorSelector from '../shared/components/OperatorSelector';
import ResultDisplay from '../shared/components/ResultDisplay';
import ActionButtonGroup from '../shared/components/ActionButtonGroup';
import ListFormulas from './components/Datagrid/ListFormulas';

//contextos y hooks
import FormulaProvider from '../context/FormulaProvider';
import useFormulaBuilder from './hooks/useFormulaBuilder';
import useFormulaHistory from './../shared/hooks/useFormulaHistory.ts';

//servicios
import useFormulaService from '../services/formula/UseFormulaService';
import useVariableService from '../services/variable/UseVariableService';
import usePlantillaService from '../services/plantilla/UsePlantillaService';

export default function FormulaBuilder({
  formulaService: formulaServiceProp,
  variableService: variableServiceProp,
  plantillaService: plantillaServiceProp
}) {
  const formulaServiceFromHook = useFormulaService();
  const variableServiceFromHook = useVariableService();
  const plantillaServiceFromHook = usePlantillaService();

  // const builderClearFormula = useFormulaBuilderClear();

  const formulaService = formulaServiceProp ?? formulaServiceFromHook;
  const variableService = variableServiceProp ?? variableServiceFromHook;
  const plantillaService = plantillaServiceProp ?? plantillaServiceFromHook;

  const services = React.useMemo(() => ({
    formulaService,
    variableService,
    plantillaService
  }), [formulaService, variableService, plantillaService]);

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
  }, [selectedFormula, getFormulaFromInput, handleBuilderUpdate, handleBuilderCreate]);

  const handleClear = useCallback(() => {
    setSelectedFormula(null);
    formulaInputRef.current?.setFormulaValue('');
    builderClearFormula();
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

  useEffect(() => {
    setSelectedFormula(null);
  }, []);

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
            {/* {
              <pre>{JSON.stringify(selectedFormula, null, 2)}</pre>
            } */}
            <ActionButtonGroup
              onEvaluate={handleEvaluate}
              onDeleteFormula={handleDelete}
              onClear={handleClear}
              onUndo={undo}
              clearAllHistory={clearAllHistory}
              formulaHistory={formulaHistory}
              sx={{ mt: 2, mb: 1 }}
              isEdit={!!selectedFormula && selectedFormula.id !== 0}
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