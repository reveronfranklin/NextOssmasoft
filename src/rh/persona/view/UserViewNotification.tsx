// ** MUI Imports
import { CardContent, Divider, Grid } from '@mui/material'
import Card from '@mui/material/Card'

import CardHeader from '@mui/material/CardHeader'
import EducacionList from 'src/rh/educacion/views/EducacionList'
import ExperienciaList from 'src/rh/experiencia/views/ExperienciaList'


const UserViewNotification = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Educacion' />
          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            <Grid item xs={12}>
              <EducacionList></EducacionList>
            </Grid>
          </CardContent>


        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Experiencia' />
          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            <Grid item xs={12}>
              <ExperienciaList></ExperienciaList>
            </Grid>
          </CardContent>


        </Card>
      </Grid>


    </Grid>
  )
}

export default UserViewNotification
