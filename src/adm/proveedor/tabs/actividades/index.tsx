import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';
import ActividadList, { ActividadItem } from './components/ActividadList';

const ActividadesView: React.FC = () => {
  const [actividadSeleccionada, setActividadSeleccionada] = useState<ActividadItem | null>(null);

  const limpiarSeleccion = () => setActividadSeleccionada(null);

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={limpiarSeleccion} sx={{ mb: 2 }}>
        Limpiar selección
      </Button>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <ActividadList
            selectedActividadId={actividadSeleccionada?.id}
            onActividadSelect={setActividadSeleccionada}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ActividadesView;
