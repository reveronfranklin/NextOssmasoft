import React from 'react';
import { TextField, Box, Autocomplete} from '@mui/material';
import VariableSelector from '../../shared/components/VariableSelector';
import FormulaProvider from '../../context/FormulaProvider';
import { useFormulaContext } from 'src/formulacion/context/FormulaContext';

const FormularioPlantilla = ({
    initialValues = {},
    onChange,
    availableVariables
  }) => {
  const [values, setValues] = React.useState(initialValues);
  const [formulas, setFormulas] = React.useState([]);
  const [formulaSeleccionada, setFormulaSeleccionada] = React.useState(null);

  const { formulaService } = useFormulaContext();
  const { getListFormulas } = formulaService;

  React.useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  React.useEffect(() => {
    async function fetchFormulas() {
      const response = await getListFormulas({
        page: 1,
        limit: 1000,
        searchText: ''
      });
      setFormulas(response.data || []);
    }
    fetchFormulas();
  }, [getListFormulas]);

  React.useEffect(() => {
    if (initialValues.formulaId && formulas.length > 0) {
      const formulaActual = formulas.find(f => f.id === initialValues.formulaId);
      setFormulaSeleccionada(formulaActual || null);
    }
  }, [initialValues.formulaId, formulas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    onChange && onChange(newValues);
  };

  const handleFormulaSelect = (event, formula) => {
    const newValues = {
      ...values,
      formulaId: formula ? formula.id : null,
    };

    setFormulaSeleccionada(formula);
    setValues(newValues);
    onChange && onChange(newValues);
  };

  const handleVariableSelect = (variable) => {
    setValues(prev => ({
      ...prev,
      variableId: variable ? variable.id : null,
    }));

    onChange && onChange({
      ...values,
      variableId: variable ? variable.id : null,
    });
  };

  const memoizedVariables = React.useMemo(
    () => availableVariables,
    [availableVariables]
  );

  return (
    <>
      {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}

      {memoizedVariables && memoizedVariables.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <FormulaProvider>
            <VariableSelector
              variables={memoizedVariables}
              selectedVariableId={values.variableId || null}
              onVariableSelect={handleVariableSelect}
            />
          </FormulaProvider>
        </Box>
      )}

      <Autocomplete
        options={formulas}
        getOptionLabel={(option) => option.descripcion || option.nombre || ''}
        value={formulaSeleccionada || null}
        onChange={handleFormulaSelect}
        renderInput={(params) => (
          <TextField {...params} label="Selecciona una fórmula" variant="outlined" margin="dense" required />
        )}
        sx={{ mt: 2, mb: 2 }}
      />

      {/* <TextField
        name="descripcion"
        label="Descripción"
        value={values.descripcion || ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      /> */}

      <TextField
        name="formula"
        label="Fórmula Seleccionada"
        value={formulaSeleccionada?.formula || values?.formulaValue || ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
        InputProps={{ readOnly: true }}
      />
    </>
  );
};

export default FormularioPlantilla;