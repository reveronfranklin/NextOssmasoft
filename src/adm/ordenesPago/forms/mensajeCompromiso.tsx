import { Box, Typography } from "@mui/material"
import WarningIcon from '@mui/icons-material/Warning'

const MensajeCompromiso = () => {
  return (
    <Box sx={{ textAlign: 'center', padding: 10 }}>
      <WarningIcon color="error" />
      <Typography variant="h6" gutterBottom>
        No hay un compromiso seleccionado
      </Typography>
      <Typography variant="body1" gutterBottom>
        Por favor, seleccione uno de la lista haciendo clic en el botón de "Ver Compromisos".
      </Typography>
    </Box>
  )
}

export default MensajeCompromiso