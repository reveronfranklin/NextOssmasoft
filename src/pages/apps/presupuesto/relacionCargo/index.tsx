// ** MUI Imports
import Card from '@mui/material/Card'

import CardHeader from '@mui/material/CardHeader'


// ** Data Import



import FilterPresupuestoRelacionCargo from 'src/presupuesto/relacionCargo/components/FilterPresupuestoRelacionCargo'
import {  CardContent, Grid  } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import TableServerSide from 'src/presupuesto/relacionCargo/components/TableServerSide';

import DialogPreRelacionCargoInfo from 'src/presupuesto/relacionCargo/views/DialogPreRelacionCargoInfo'


const TableEditable = () => {


  return (
    <Card>
      <CardHeader title='Relacion Cargo' />


        <Grid item xs={12}>

        <CardContent >
                <DatePickerWrapper >
                  <FilterPresupuestoRelacionCargo/>
                </DatePickerWrapper>

        </CardContent>
        </Grid>

        <Grid item xs={12}>
           <TableServerSide />
        </Grid>
        <DatePickerWrapper>
          <DialogPreRelacionCargoInfo/>
        </DatePickerWrapper>
    </Card>

  )
}

export default TableEditable
