import { Grid } from '@mui/material'
import React from 'react'
import PageHeader from 'src/@core/components/page-header';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TableEditable from 'src/views/table/data-grid/TableEditable';
import TableColumns from 'src/views/table/data-grid/TableColumns';
import TableBasicSort from 'src/views/table/data-grid/TableBasicSort';
import TableFilter from 'src/views/table/data-grid/TableFilter';
import TableSelection from 'src/views/table/data-grid/TableSelection';
import TableServerSide from 'src/views/table/data-grid/TableServerSide';

const PresupuestoList = () => {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h5'>

            <Link href='https://mui.com/x/react-data-grid/' target='_blank'>
            Presupuesto
            </Link>
          </Typography>
        }
        subtitle={
          <Typography variant='body2'>
            Mantenimiento de presupuesto por ano
          </Typography>
        }
      />
     <Grid item xs={12}>
        <TableEditable />
      </Grid>
      <Grid item xs={12}>
        <TableColumns />
      </Grid>
      <Grid item xs={12}>
        <TableBasicSort />
      </Grid>
      <Grid item xs={12}>
        <TableFilter />
      </Grid>
      <Grid item xs={12}>
        <TableSelection />
      </Grid>
      <Grid item xs={12}>
        <TableServerSide/>
      </Grid>

    </Grid>
  )
}

export default PresupuestoList
