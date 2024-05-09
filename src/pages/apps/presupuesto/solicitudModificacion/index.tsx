import { Grid } from '@mui/material'
import React from 'react'
import { CardContent } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import TableServerSide from 'src/presupuesto/solicitudModificacion/components/TableServerSide'
import FilterOnlyPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterOnlyPresupuesto'

const Asignaciones = () => {
  return (
    <Grid item xs={12}>
      <CardContent title='Solicitud Modificacion'>
        <DatePickerWrapper>
          <FilterOnlyPresupuesto />
        </DatePickerWrapper>
      </CardContent>
      <TableServerSide></TableServerSide>
    </Grid>
  )
}

export default Asignaciones
