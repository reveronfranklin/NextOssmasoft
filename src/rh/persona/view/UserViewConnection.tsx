import Grid from '@mui/material/Grid'
import { Box, Typography, Card } from '@mui/material';
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import CardContent from '@mui/material/CardContent'
import { CardHeader, Divider } from '@mui/material'
import VariacionManager from 'src/rh/variacion/views/VariacionManager'

const UserViewConnection = () => {
  const { personaSeleccionado } = useSelector((state: RootState) => state.nomina)

  if (!personaSeleccionado.codigoPersona) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Selecciona una persona para ver las variaciones.
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Connected Accounts Cards */}

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Variacion' />
          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            <Grid item xs={12}>
              <VariacionManager></VariacionManager>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewConnection
