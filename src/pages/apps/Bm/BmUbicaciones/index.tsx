import { Box, Grid } from '@mui/material'
import UbicacionesList from 'src/Bm/BmUbicaciones/views/UbicacionesList'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

const BmUbicacionesPage = () => (
  <Grid item xs={12}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
      <BmScreenHelpButton title='Ubicaciones BM - Flujo y reglas' docPath='/docs/bm/bm-ubicaciones.md' />
    </Box>
    <UbicacionesList />
  </Grid>
)

export default BmUbicacionesPage
