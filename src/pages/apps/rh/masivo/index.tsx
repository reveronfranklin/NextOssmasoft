// ** MUI Imports
import { CardContent } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'
import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports


// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import TableServerSideHistorico from 'src/rh/historico/components/TableServerSideHistorico'
import FilterHistoricoNominaMasivo from 'src/rh/historico/masivo/component/FilterHistoricoNominaMasivo'

const DataGrid = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h5'>
             Movimiento Historico de Nomina Masivo
          </Typography>
        }

      />
      <Grid item xs={12}>

        <CardContent     title='Desde-Hasta Nomina' >
        <DatePickerWrapper >
           <FilterHistoricoNominaMasivo popperPlacement={popperPlacement} />
        </DatePickerWrapper>

        </CardContent>
      </Grid>
      <Grid item xs={12}>
        <TableServerSideHistorico />
      </Grid>
    </Grid>
  )
}

export default DataGrid
