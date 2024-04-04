

// ** MUI Imports

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'


// ** Custom Table Components Imports

import TableServerSide from 'src/rh/persona/list/TableServerSide';




// ** Vars






const UserList = () => {
  // ** State




  return (
    <Grid container spacing={6}>

      <Grid item xs={12}>
        <Card>


          <TableServerSide></TableServerSide>


        </Card>
      </Grid>

    </Grid>
  )
}

export default UserList
