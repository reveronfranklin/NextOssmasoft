
// ** MUI Imports

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import CardHeader from '@mui/material/CardHeader'



// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { CardContent, Divider } from '@mui/material'
import FamiliaresList from 'src/rh/familiar/views/FamiliaresList'



const UserViewBilling = () => {
  // ** States

  // Handle Edit Card dialog and get card ID






  // Handle Upgrade Plan dialog


  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Familiares' />
          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            <Grid item xs={12}>

            <FamiliaresList></FamiliaresList>
            </Grid>
          </CardContent>


        </Card>
      </Grid>


    </Grid>
  )
}

export default UserViewBilling
