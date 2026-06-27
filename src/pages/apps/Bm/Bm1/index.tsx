// ** MUI Imports

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import TableServerSideBm1 from 'src/Bm/Bm1/components/TableServerSideBm1'
import { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box, CardContent } from '@mui/material'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BmScreenHelpButton title='BM1 - Flujo y reglas' docPath='/docs/bm/bm1.md' />
        </Box>
      </Grid>

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
