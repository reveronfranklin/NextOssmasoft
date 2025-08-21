import React from 'react';
import { List, ListItemButton, ListItemText, Paper, Box } from '@mui/material';

interface PlantillasDetalleProcesoProps {
  plantillas: any[];
  detalleId: number | null;
  loading: boolean;
  onSelectPlantilla: (plantilla: any) => void;
}

const PlantillasDetalleProceso = ({ plantillas, detalleId, loading, onSelectPlantilla }: PlantillasDetalleProcesoProps) => {
  if (detalleId == null) return null;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      <List dense disablePadding>
        {plantillas.map((pl: any) => (
          <ListItemButton
            key={pl.id}
            sx={{ py: 1, px: 2 }}
            onClick={() => onSelectPlantilla(pl)}
          >
            <ListItemText
              primary={pl.code}
              secondary={pl.descripcionFormula}
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