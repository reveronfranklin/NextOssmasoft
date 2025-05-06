import Grid from '@mui/material/Grid';
import Layout from 'src/adm/pagos/lotes/views/Layout';
import LayoutFilterDate from 'src/adm/pagos/lotes/views/LayoutFilterDate';

const Bancos = () => {
  return (
    <Grid item xs={12}>
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <LayoutFilterDate />
            </Grid>
        </Grid>
      <Layout />
    </Grid>
  )
}

export default Bancos
