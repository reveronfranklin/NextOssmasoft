import { Box, Grid } from '@mui/material'
import React from 'react'
import PlacasCuarentenaList from 'src/Bm/BmPlacasCuarentena/views/PlacasCuarentenaList'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

const TipoNomina = () => {
  return (
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <BmScreenHelpButton title='Placas en cuarentena - Flujo y reglas' docPath='/docs/bm/bm-placas-cuarentena.md' />
      </Box>
      <PlacasCuarentenaList></PlacasCuarentenaList>
    </Grid>
  )
}

export default TipoNomina
