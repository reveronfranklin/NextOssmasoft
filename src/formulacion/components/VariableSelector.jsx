import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const VariableSelector = ({ variables, onVariableSelect }) => {
  const options = variables.map((variable) => ({
    label: variable.description,
    value: variable.code,
  }));

  return (
    <div style={{ marginBottom: '10px' }}>
      <h4>Variables:</h4>
      {variables.length > 0 ? (
        <Autocomplete
          disablePortal
          options={options}
          sx={{ width: '100%', mb: 2 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecciona una variable"
              variant="outlined"
            />
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              onVariableSelect(`[${newValue.value}]`);
            }
          }}
          value={null}
        />
      ) : (
        <p>No hay variables definidas.</p>
      )}
    </div>
  );
};

export default VariableSelector;