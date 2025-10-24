import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

const FormularioVariableEntradaProceso = ({ initialValues = {}, onSubmit }) => {
  const [values, setValues] = useState({
    id: initialValues?.id || '',
    code: initialValues?.code || '',
    nombre: initialValues?.nombre || '',
    descripcion: initialValues?.descripcion || '',
    variableId: initialValues?.variableId || '',
    procesoId: initialValues?.procesoId || '',
  });

  useEffect(() => {
    setValues({
      id: initialValues?.id || '',
      code: initialValues?.code || '',
      descripcionVariable: initialValues?.descripcionVariable || '',
      descripcionProceso: initialValues?.descripcionProceso || '',
      variableId: initialValues?.variableId || '',
      procesoId: initialValues?.procesoId || '',
    });
  }, [initialValues]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit && onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} style={{ minWidth: 350, maxWidth: 500 }}>
      <TextField
        name="procesoId"
        label="Proceso ID"
        value={values.procesoId}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
        type="number"
        InputProps={{ readOnly: true }}
      />
      <TextField
        name="code"
        label="Código"
        value={values.code}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      />
      <TextField
        name="descripcionVariable"
        label="Descripción de la Variable"
        value={values.descripcionVariable}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      />
      <TextField
        name="descripcionProceso"
        label="DescripcionProceso"
        value={values.descripcionProceso}
        onChange={handleChange}
        fullWidth
        margin="dense"
      />
      <TextField
        name="variableId"
        label="Variable ID"
        value={values.variableId}
        onChange={handleChange}
        fullWidth
        margin="dense"
      />
    </form>
  );
};

export default FormularioVariableEntradaProceso;