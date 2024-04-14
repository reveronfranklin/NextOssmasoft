import { Grid } from '@mui/material'
import React from 'react'
import FilterPeriodo from 'src/rh/periodos/components/FilterPeriodo'
import FilterOficina from 'src/rh/recibos/views/FilterOficina'
import RecibosList from 'src/rh/recibos/views/RecibosList'
import FilterTipoNomina from 'src/rh/tipoNomina/views/FilterTipoNomina'

const TipoNomina = () => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={5}>
        <Grid item xs={6}>
          <FilterTipoNomina></FilterTipoNomina>
        </Grid>
        <Grid item xs={6}>
          <FilterPeriodo></FilterPeriodo>
        </Grid>
        <Grid item xs={6}>
          <FilterOficina></FilterOficina>
        </Grid>
      </Grid>

      <RecibosList></RecibosList>
    </Grid>
  )
}

export default TipoNomina
