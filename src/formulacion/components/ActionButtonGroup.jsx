import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const ActionButtonGroup = ({ onEvaluate, onClear, isEdit }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <Tooltip title={isEdit ? "Actualizar fórmula" : "Crear fórmula"}>
        <IconButton
          color="success"
          onClick={onEvaluate}
          size="large"
        >
          {
            isEdit ? <SaveIcon /> : <AddCircleIcon />
          }
        </IconButton>
      </Tooltip>
      <Tooltip title="Limpiar">
        <IconButton
          color="error"
          onClick={onClear}
          size="large"
        >
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ActionButtonGroup;