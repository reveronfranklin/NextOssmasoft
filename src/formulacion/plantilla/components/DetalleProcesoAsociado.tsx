import React from 'react';
import { List, ListItemButton, ListItemText, Paper } from '@mui/material';

const DetalleProcesoAsociado = ({ detalles, selectedId, onSelect }) => {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      <List dense disablePadding>
        {detalles.map(det => (
          <ListItemButton
            key={det.id}
            selected={det.id === selectedId}
            onClick={() => onSelect(det.id)}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemText
              primary={det.codigo}
              secondary={det.descripcion}
              primaryTypographyProps={{ fontWeight: det.id === selectedId ? 600 : 500 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default DetalleProcesoAsociado;