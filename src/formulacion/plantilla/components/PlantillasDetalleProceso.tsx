import React from 'react';
import { List, ListItemButton, ListItemText, Paper, Box } from '@mui/material';

const PlantillasDetalleProceso = ({ plantillas, detalleId, loading }) => {
  if (detalleId == null) return null;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      <List dense disablePadding>
        {plantillas.map(pl => (
          <ListItemButton key={pl.id} sx={{ py: 1, px: 2 }}>
            <ListItemText
              primary={pl.codigo}
              secondary={pl.descripcion}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        ))}
        {!loading && plantillas.length === 0 && (
          <Box sx={{ p: 2, fontSize: 13, color: 'text.secondary' }}>
            No hay plantillas para el detalle seleccionado.
          </Box>
        )}
      </List>
    </Paper>
  );
};

export default PlantillasDetalleProceso;