// ** MUI Imports
import { CardContent } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import FilterHistoricoNomina from 'src/views/forms/form-elements/rh/FilterHistoricoNomina'

// ** Demo Components Imports

import TableServerSide from 'src/views/table/rh/historico/TableServerSide'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const DataGrid = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h5'>
            <Link href='https://mui.com/x/react-data-grid/' target='_blank'>
              Movimiento Historico de Nomina
            </Link>
          </Typography>
        }
        subtitle={
          <Typography variant='body2'>
            Data Grid is a fast and extendable react data table and react data grid.
          </Typography>
        }
      />
      <Grid item xs={12}>

        <CardContent     title='Desde-Hasta Nomina' >
        <DatePickerWrapper >
           <FilterHistoricoNomina popperPlacement={popperPlacement} />
        </DatePickerWrapper>

        </CardContent>
      </Grid>
      <Grid item xs={12}>
        <TableServerSide />
      </Grid>
    </Grid>
  )
}

export default DataGrid
