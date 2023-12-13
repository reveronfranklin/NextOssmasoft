// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports






const UserViewConnection = () => {
  return (
    <Grid container spacing={6}>
      {/* Connected Accounts Cards */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontWeight: 500 }}>Variacion..</Typography>

            </Box>

          </CardContent>
        </Card>
      </Grid>

    </Grid>
  )
}

export default UserViewConnection
