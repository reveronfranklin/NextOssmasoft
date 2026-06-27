import { Box, Grid } from '@mui/material'
import ReportesBmView from 'src/Bm/BmReportes/views/ReportesBmView'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

const BmReportesPage = () => (
  <Grid item xs={12}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
      <BmScreenHelpButton title='Reportes BM - Flujo y reglas' docPath='/docs/bm/bm-reportes.md' />
    </Box>
    <ReportesBmView />
  </Grid>
)

export default BmReportesPage
