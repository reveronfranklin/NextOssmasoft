import { Grid } from '@mui/material'
import React from 'react'
import ConceptosList from 'src/rh/conceptos/views/ConceptosList'
import FilterTipoNomina from 'src/rh/tipoNomina/views/FilterTipoNomina'


const TipoNomina = () => {


  return (
    <Grid item xs={12}>

      <FilterTipoNomina></FilterTipoNomina>
      <ConceptosList></ConceptosList>

    </Grid>


  )
}

export default TipoNomina
