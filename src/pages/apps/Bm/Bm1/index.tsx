// ** MUI Imports

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import TableServerSideBm1 from 'src/Bm/Bm1/components/TableServerSideBm1'
import { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { CardContent } from '@mui/material'

// ** Demo Components Imports


// ** Styled Component


const DataGrid = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h5'>
              Bienes Municipales

          </Typography>
        }

      />

      <Grid item xs={12}>
      <CardContent     title='Desde-Hasta Nomina' >

          <DatePickerWrapper >
          <TableServerSideBm1 popperPlacement={popperPlacement} />

          </DatePickerWrapper>

        </CardContent>


      </Grid>
    </Grid>
  )
}

export default DataGrid
