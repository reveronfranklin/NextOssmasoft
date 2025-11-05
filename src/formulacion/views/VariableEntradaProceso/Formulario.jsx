import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import VariableSelector from '../../shared/components/VariableSelector';
import FormulaProvider from '../../context/FormulaProvider';
import Box from '@mui/material/Box';

const FormularioVariableEntradaProceso = ({
    initialValues = {},
    onChange,
    availableVariables,
    onValidationChange
  }) => {
  const [values, setValues] = useState(initialValues);
  const [selectedVariable, setSelectedVariable] = useState(null);

  React.useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    setValues({
      id: initialValues?.id || '',
      code: initialValues?.code || '',
      descripcionVariable: initialValues?.descripcionVariable || '',
      descripcionProceso: initialValues?.descripcionProceso || '',
      variableId: initialValues?.variableId || '',
      procesoId: initialValues?.procesoId || '',
    });

    if (initialValues?.variableId) {
      const found = availableVariables.find(v => v.variableId === initialValues.variableId);
      setSelectedVariable(found || null);
    }
  }, [initialValues, availableVariables]);

  useEffect(() => {
    const valid = !!values.procesoId &&
      !!values.code &&
      !!values.descripcionVariable &&
      !!values.descripcionProceso &&
      !!values.variableId;

    if (onValidationChange) {
      onValidationChange(valid);
    }
  }, [values, onValidationChange]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    const newValues = {
      ...values,
      [name]: type === 'checkbox' ? checked : value
    };
    setValues(newValues);
    if (onChange) {
      onChange(newValues);
    }
  };

  const handleVariableSelect = (newValue) => {
    setSelectedVariable(newValue);

    if (newValue) {
      setValues(prev => ({
        ...prev,
        code: newValue.code,
        descripcionVariable: newValue.descripcion,
        variableId: newValue.id
      }));
    } else {
      setValues(prev => ({
        ...prev,
        code: '',
        descripcionVariable: '',
        variableId: ''
      }));
    }
  };

  useEffect(() => {
    if (selectedVariable) {
      const newValues = {
        ...values,
        code: selectedVariable.code,
        descripcionVariable: selectedVariable.descripcionVariable ?? selectedVariable.descripcion,
        variableId: selectedVariable.variableId ?? selectedVariable.id
      };
      setValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    }
  }, [selectedVariable]);

  const memoizedVariables = React.useMemo(
    () => availableVariables,
    [availableVariables]
  );

  return (
    <>
    <form style={{ minWidth: 350, maxWidth: 500 }}>
      <TextField
        name="procesoId"
        label="Proceso ID"
        value={values && values.procesoId}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
        type="number"
        InputProps={{ readOnly: true }}
      />
      <TextField
        name="descripcionProceso"
        label="DescripcionProceso"
        value={values && values.descripcionProceso}
        onChange={handleChange}
        fullWidth
        margin="dense"
      />
      {memoizedVariables && memoizedVariables.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <FormulaProvider>
            <VariableSelector
              variables={memoizedVariables}
              selectedVariableId={values.variableId || null}
              onVariableSelect={handleVariableSelect}
              showAddButton={false}
            />
          </FormulaProvider>
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          name="code"
          label="Código"
          value={values && values.code}
          onChange={handleChange}
          fullWidth
          margin="dense"
          required
          InputProps={{ readOnly: true }}
          sx={{ flex: 1 }}
        />
        <TextField
          name="descripcionVariable"
          label="Descripción de la Variable"
          value={values && values.descripcionVariable}
          onChange={handleChange}
          fullWidth
          margin="dense"
          required
          InputProps={{ readOnly: true }}
          sx={{ flex: 2 }}
        />
        <TextField
          name="variableId"
          label="Variable ID"
          value={values && values.variableId}
          onChange={handleChange}
          fullWidth
          margin="dense"
          InputProps={{ readOnly: true }}
          sx={{ flex: 1 }}
        />
      </Box>
    </form>
    </>
  );
};

export default FormularioVariableEntradaProceso;