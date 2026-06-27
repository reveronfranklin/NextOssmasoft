import { Box, Grid } from '@mui/material'
import React from 'react'
import ConteoList from 'src/Bm/BmConteo/views/ConteoList'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

const TipoNomina = () => {


  return (
    <Grid item xs={12}>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <BmScreenHelpButton title='Conteo - Flujo y reglas' docPath='/docs/bm/bm-conteo.md' />
      </Box>

      <ConteoList></ConteoList>

    </Grid>


  )
}

export default TipoNomina
