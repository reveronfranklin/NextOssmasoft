// ** MUI Imports

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'
import { CardHeader, Divider } from '@mui/material'
import VariacionList from 'src/rh/variacion/views/VariacionList'

// ** Icon Imports






const UserViewConnection = () => {
  return (
    <Grid container spacing={6}>
      {/* Connected Accounts Cards */}

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Variacion' />
          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            <Grid item xs={12}>
              <VariacionList></VariacionList>
            </Grid>
          </CardContent>


        </Card>
      </Grid>

    </Grid>
  )
}

export default UserViewConnection
