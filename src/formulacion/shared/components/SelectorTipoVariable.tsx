// SelectorTipoVariable.tsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TipoVariableEnum } from 'src/formulacion/enums/TipoVariable.enum';

interface SelectorTipoVariableProps {
  value: TipoVariableEnum | '';
  onChange: (value: TipoVariableEnum) => void;
  label?: string;
  disabled?: boolean;
}

const SelectorTipoVariable: React.FC<SelectorTipoVariableProps> = ({
  value,
  onChange,
  label = 'Tipo de Variable',
  disabled = false
}) => {
  return (
    <FormControl fullWidth margin="dense" size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={e => onChange(e.target.value as TipoVariableEnum)}
        disabled={disabled}
      >
        {Object.values(TipoVariableEnum).map(tipo => (
          <MenuItem key={tipo} value={tipo}>
            {tipo}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectorTipoVariable;