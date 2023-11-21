
// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import ComunicacionList from 'src/rh/comunicacion/views/ComunicacionList'
import { CardContent } from '@mui/material'

const ComunicacionesView = () => {
  // ** States


  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Comunicaciones...' />

          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            <Grid item xs={12}>

            <ComunicacionList></ComunicacionList>
            </Grid>
          </CardContent>



        </Card>
      </Grid>
    </Grid>
  )
}

export default ComunicacionesView
