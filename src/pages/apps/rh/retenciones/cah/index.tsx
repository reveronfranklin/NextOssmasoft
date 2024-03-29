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
import FilterDesdeHastaTipoNomina from 'src/rh/retenciones/FilterDesdeHastaTipoNomina'
import CahList from 'src/rh/retenciones/CahList'

const DataGrid = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h5'>
            CAH
          </Typography>
        }

      />
      <Grid item xs={12}>

        <CardContent     title='Desde-Hasta Nomina' >
        <DatePickerWrapper >
           <FilterDesdeHastaTipoNomina popperPlacement={popperPlacement} />
        </DatePickerWrapper>

        </CardContent>
      </Grid>
      <Grid item xs={12}>
       <CahList />
      </Grid>
    </Grid>
  )
}

export default DataGrid
