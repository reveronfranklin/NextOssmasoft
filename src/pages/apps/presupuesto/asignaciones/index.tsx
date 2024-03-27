import { Grid } from '@mui/material'
import React from 'react'
import { CardContent } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import FilterPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterPresupuesto'
import TableServerSide from 'src/presupuesto/asignaciones/views/TableServerSide'

const Asignaciones= () => {


  return (

      <Grid item xs={12}>

      <CardContent     title='Desde-Hasta Nomina' >
      <DatePickerWrapper>
         <FilterPresupuesto />
      </DatePickerWrapper>

      </CardContent>
      <TableServerSide></TableServerSide>
    </Grid>



  )
}

export default Asignaciones
