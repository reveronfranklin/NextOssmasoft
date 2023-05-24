// ** MUI Imports
import { CardContent } from '@mui/material'

import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

//import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports


// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import FilterPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterPresupuesto'
import TableServerSidePreVSaldo from 'src/views/table/presupuesto/prevsaldo/TableServerSidePreVSaldo'

const DataGrid = () => {

  //const theme = useTheme()
  //const { direction } = theme

  //const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h5'>
            <Link href='https://mui.com/x/react-data-grid/' target='_blank'>
              Presupuesto
            </Link>
          </Typography>
        }
        subtitle={
          <Typography variant='body2'>
            Saldos
          </Typography>
        }
      />
      <Grid item xs={12}>

        <CardContent     title='Desde-Hasta Nomina' >
        <DatePickerWrapper>
           <FilterPresupuesto />
        </DatePickerWrapper>

        </CardContent>
      </Grid>
      <Grid item xs={12}>
        <TableServerSidePreVSaldo />
      </Grid>

    </Grid>
  )
}

export default DataGrid
