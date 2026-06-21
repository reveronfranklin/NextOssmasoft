import React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { LayoutComponent } from 'src/rh/variaciones_masivas';

const variaciones = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <LayoutComponent />
        </Card>
      </Grid>
    </Grid>
  )
}

export default variaciones
