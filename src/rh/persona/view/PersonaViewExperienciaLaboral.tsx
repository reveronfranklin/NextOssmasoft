import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import ExperienciaLaboralIndex from 'src/rh/experiencia_laboral/index';

const PersonaViewExperienciaLaboral = () => {
  const { personaSeleccionado } = useSelector((state: RootState) => state.nomina)

  if (!personaSeleccionado.codigoPersona) {

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Selecciona una persona para ver la experiencia laboral.
        </Typography>
      </Box>
    );
  }

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <ExperienciaLaboralIndex codigoPersona={personaSeleccionado?.codigoPersona} />
      </Box>
    </Card>
  );
}

export default PersonaViewExperienciaLaboral