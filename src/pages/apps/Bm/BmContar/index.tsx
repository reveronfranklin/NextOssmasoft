import { Box, Grid } from '@mui/material'
import React from 'react'
import Contar from 'src/Bm/BmContar/views/Contar'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

const TipoNomina = () => {
  return (
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <BmScreenHelpButton title='Contar - Flujo y reglas' docPath='/docs/bm/bm-contar.md' />
      </Box>
      <Contar></Contar>
    </Grid>
  )
}

export default TipoNomina
