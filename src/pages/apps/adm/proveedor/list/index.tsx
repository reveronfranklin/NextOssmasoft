import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TableServerSide from 'src/adm/proveedor/list/TableServerSide';

const ProveedorList = () => {
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

export default ProveedorList