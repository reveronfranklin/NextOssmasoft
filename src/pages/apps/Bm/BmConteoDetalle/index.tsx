import { Box, Grid } from '@mui/material'
import React from 'react'
import ConteoDetalleList from 'src/Bm/BmConteoDetalle/views/ConteoDetalleList'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

const TipoNomina = () => {


  return (
    <Grid item xs={12}>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <BmScreenHelpButton title='Detalle de conteo - Flujo y reglas' docPath='/docs/bm/bm-conteo-detalle.md' />
      </Box>

      <ConteoDetalleList></ConteoDetalleList>

    </Grid>


  )
}

export default TipoNomina
