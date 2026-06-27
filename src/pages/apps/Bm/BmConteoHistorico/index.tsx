import { Box, Grid } from '@mui/material'
import React from 'react'
import ConteoHistoricoList from 'src/Bm/BmConteoHistorico/views/ConteoHistoricoList'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

const TipoNomina = () => {


  return (
    <Grid item xs={12}>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <BmScreenHelpButton title='Historico de conteos - Flujo y reglas' docPath='/docs/bm/bm-conteo-historico.md' />
      </Box>

      <ConteoHistoricoList></ConteoHistoricoList>

    </Grid>


  )
}

export default TipoNomina
