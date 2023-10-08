// ** MUI Imports

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import TableServerSideBm1 from 'src/Bm/Bm1/components/TableServerSideBm1'

// ** Demo Components Imports


// ** Styled Component


const DataGrid = () => {
  //const theme = useTheme()
  //const { direction } = theme
  //const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


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
        <TableServerSideBm1 />
      </Grid>
    </Grid>
  )
}

export default DataGrid
