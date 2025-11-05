import React from 'react';
import {
  TextField,
  Box,
  Autocomplete,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import VariableSelector from '../../shared/components/VariableSelector';
import FormulaProvider from '../../context/FormulaProvider';
import { useFormulaContext } from 'src/formulacion/context/FormulaContext';
import InputAdornment from '@mui/material/InputAdornment';

const FormularioPlantilla = ({
    initialValues = {},
    onChange,
    availableVariables
  }) => {
  const [values, setValues] = React.useState(initialValues);
  const [formulas, setFormulas] = React.useState([]);
  const [formulaSeleccionada, setFormulaSeleccionada] = React.useState(null);
  const [redondeo, setRedondeo] = React.useState(initialValues.redondeo ? initialValues.redondeo : 0);
  const [acumular, setAcumular] = React.useState(
    typeof initialValues.acumular === 'boolean' ? initialValues.acumular : false
  );

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

  const handleRedondeoChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Solo números
    setRedondeo(value === '' ? '' : parseInt(value, 10));
    const newValues = { ...values, redondeo: value === '' ? '' : parseInt(value, 10) };
    setValues(newValues);
    onChange && onChange(newValues);
  };

  const handleAcumularChange = (e) => {
    setAcumular(e.target.checked);
    const newValues = { ...values, acumular: e.target.checked };
    setValues(newValues);
    onChange && onChange(newValues);
  };

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

      <TextField
        name="redondeo"
        label="Redondeo"
        value={redondeo}
        onChange={handleRedondeoChange}
        fullWidth
        margin="dense"
        required
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        InputProps={{
          endAdornment: <InputAdornment position="end">entero</InputAdornment>,
        }}
        helperText="Solo números enteros"
      />

      <TextField
        name="ordenCalculo"
        label="Orden de cálculo"
        value={values.ordenCalculo ?? ''}
        onChange={e => {
          const value = e.target.value.replace(/[^0-9]/g, ''); // Solo números
          const newValues = { ...values, ordenCalculo: value === '' ? '' : parseInt(value, 10) };
          setValues(newValues);
          onChange && onChange(newValues);
        }}
        fullWidth
        margin="dense"
        required
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        InputProps={{
          readOnly: true,
          endAdornment: <InputAdornment position="end">número</InputAdornment>,
        }}
        helperText="Solo números enteros"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={acumular}
            onChange={handleAcumularChange}
            name="acumular"
            color="primary"
          />
        }
        label="Acumular"
        sx={{ mt: 1, mb: 1 }}
      />

    </>
  );
};

export default FormularioPlantilla;