import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import DireccionesPersonaList from 'src/rh/direcciones/components/DireccionesPersonaList';

const PersonaViewDirecciones = () => {
  const { personaSeleccionado } = useSelector((state: RootState) => state.nomina)

  if (!personaSeleccionado.codigoPersona) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Selecciona una persona para ver las direcciones.
        </Typography>
      </Box>
    );
  }

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <DireccionesPersonaList codigoPersona={personaSeleccionado?.codigoPersona} />
      </Box>
    </Card>
  );
};

export default PersonaViewDirecciones;