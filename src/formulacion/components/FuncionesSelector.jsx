import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';

const FuncionesSelector = ({ functions, onFunctionSelect }) => {
  const options = functions.map((func) => ({
    label: func.description,
    value: func.code,
  }));

  return (
    <Box sx={{ mb: 2 }}>
      <h3>Funciones Disponibles:</h3>
      {functions.length > 0 ? (
        <Autocomplete
          disablePortal
          options={options}
          sx={{ width: '100%', mb: 2 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecciona una función"
              variant="outlined"
            />
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              onFunctionSelect(newValue.value);
            }
            // setOpen(true);
          }}
          value={null}
        />
      ) : (
        <p>No hay funciones definidas.</p>
      )}
    </Box>
  );
};

export default FuncionesSelector;