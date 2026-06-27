import { Box, Grid } from '@mui/material'
import MovimientosList from 'src/Bm/BmMovimientos/views/MovimientosList'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

const BmMovimientosPage = () => (
  <Grid item xs={12}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
      <BmScreenHelpButton title='Movimientos BM - Flujo y reglas' docPath='/docs/bm/bm-movimientos.md' />
    </Box>
    <MovimientosList />
  </Grid>
)

export default BmMovimientosPage
