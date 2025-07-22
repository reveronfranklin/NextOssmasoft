import React from 'react';
import { TextField } from '@mui/material';

const FormularioVariable = ({ initialValues = {}, onChange }) => {
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
      <TextField
        name="descripcion"
        label="Descripción"
        value={values.descripcion || ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      />
      <TextField
        name="tipoVariable"
        label = "tipoVariable"
        value={values.descripcion || ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      />
    </>
  );
};

export default FormularioVariable;