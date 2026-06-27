import { Box, Grid } from '@mui/material'
import React from 'react'
import ConteoDetalleCompareList from 'src/Bm/BmConteoDetalleCompare/views/ConteoDetalleCompareList'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

const TipoNomina = () => {


  return (
    <Grid item xs={12}>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <BmScreenHelpButton title='Comparar conteo - Flujo y reglas' docPath='/docs/bm/bm-conteo-detalle-compare.md' />
      </Box>

      <ConteoDetalleCompareList></ConteoDetalleCompareList>

    </Grid>


  )
}

export default TipoNomina
