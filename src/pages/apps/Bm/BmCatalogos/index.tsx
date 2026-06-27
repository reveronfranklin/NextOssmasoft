import { Box, Grid } from '@mui/material'
import CatalogosList from 'src/Bm/BmCatalogos/views/CatalogosList'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

const BmCatalogosPage = () => (
  <Grid item xs={12}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
      <BmScreenHelpButton title='Catalogos BM - Flujo y reglas' docPath='/docs/bm/bm-catalogos.md' />
    </Box>
    <CatalogosList />
  </Grid>
)

export default BmCatalogosPage
