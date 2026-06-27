import { Box, Grid } from '@mui/material'
import BienesList from 'src/Bm/BmBienes/views/BienesList'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

const BmBienesPage = () => (
  <Grid item xs={12}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
      <BmScreenHelpButton title='Ficha de bienes - Flujo y reglas' docPath='/docs/bm/bm-bienes.md' />
    </Box>
    <BienesList />
  </Grid>
)

export default BmBienesPage
