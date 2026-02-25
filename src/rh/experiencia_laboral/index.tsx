import React from "react";
import { Box } from "@mui/material";
import ExperienciaPersonaList from "./components/experienciaPersonaList";

const ExperienciaLaboralIndex: React.FC<{ codigoPersona: number }> = ({ codigoPersona }) => {

  return (
    <Box sx={{ p: 3 }}>
      <ExperienciaPersonaList codigoPersona={codigoPersona} />
    </Box>
  );
};

export default ExperienciaLaboralIndex;