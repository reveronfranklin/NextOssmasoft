import { Grid } from '@mui/material'
import React from 'react'
import TableServerSide from 'src/rh/periodos/components/TableServerSide'
import FilterTipoNomina from 'src/rh/tipoNomina/views/FilterTipoNomina'

const Periodos = () => {


  return (
    <Grid item xs={12}>
       <FilterTipoNomina></FilterTipoNomina>
      <TableServerSide></TableServerSide>
    </Grid>


  )
}

export default Periodos
