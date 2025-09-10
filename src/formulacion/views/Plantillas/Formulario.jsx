import React from 'react';
import { TextField, Box} from '@mui/material';
import VariableSelector from '../../shared/components/VariableSelector';
import FormulaProvider from '../../context/FormulaProvider';

const FormularioPlantilla = ({
    initialValues = {},
    onChange,
    availableVariables
  }) => {
  const [values, setValues] = React.useState(initialValues);

  React.useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    onChange && onChange(newValues);
  };

  const handleVariableSelect = (variable) => {
    setValues(prev => ({
      ...prev,
      variableId: variable ? variable.id : null,
      variableSeleccionada: variable
    }));

    onChange && onChange({
      ...values,
      variableId: variable ? variable.id : null,
      variableSeleccionada: variable,
    });
  };

  const memoizedVariables = React.useMemo(
    () => availableVariables,
    [availableVariables]
  );

  return (
    <>
      <pre>{JSON.stringify(values, null, 2)}</pre>

      {memoizedVariables && memoizedVariables.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <FormulaProvider>
            <VariableSelector
              variables={memoizedVariables}
              setVariables={() => {}}
              selectedVariableId={values.variableId || null}
              onVariableSelect={handleVariableSelect}
              setEditingItem={() => {}}
              editingItem={{}}
            />
          </FormulaProvider>
        </Box>
      )}

      {/* <TextField
        name="code"
        label="Código"
        value={values.code || ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      /> */}
      <TextField
        name="descripcion"
        label="Descripción"
        value={values.descripcionFormula || ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      />
      <TextField
        name="formula"
        label="Fórmula"
        value={values.formulaValue || ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      />
      <TextField
        name="Estado"
        label="Estado"
        value={values.estado || ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      />
    </>
  );
};

export default FormularioPlantilla;