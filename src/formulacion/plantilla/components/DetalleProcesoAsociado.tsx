import React from 'react';
import { List, ListItemButton, ListItemText, Paper } from '@mui/material';

interface DetalleProcesoAsociadoProps {
  detalles: any[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const DetalleProcesoAsociado = ({ detalles, selectedId, onSelect }: DetalleProcesoAsociadoProps) => {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      <List dense disablePadding>
        {detalles.map((det: any) => (
          <ListItemButton
            key={det.id}
            selected={det.id === selectedId}
            onClick={() => onSelect(det.id)}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemText
              primary={det.codigo}
              secondary={det.externalDescription}
              primaryTypographyProps={{ fontWeight: det.id === selectedId ? 600 : 500 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default DetalleProcesoAsociado;