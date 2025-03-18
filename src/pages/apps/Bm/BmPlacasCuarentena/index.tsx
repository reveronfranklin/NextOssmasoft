import { Grid } from '@mui/material'
import React from 'react'
import ConteoList from 'src/Bm/BmConteo/views/ConteoList'
import PlacasCuarentenaList from 'src/Bm/BmPlacasCuarentena/views/PlacasCuarentenaList'

const TipoNomina = () => {
  return (
    <Grid item xs={12}>
      <PlacasCuarentenaList></PlacasCuarentenaList>
    </Grid>
  )
}

export default TipoNomina
