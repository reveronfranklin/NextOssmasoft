import React from 'react';
import { TextField } from '@mui/material';

const FormularioPlantilla = ({ initialValues = {}, onChange }) => {
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

  return (
    <>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <TextField
        name="code"
        label="Código"
        value={values.code || ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      />
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