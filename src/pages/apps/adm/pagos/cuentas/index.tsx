import { CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import Layout from 'src/adm/pagos/cuentas/views/Layout';

const Cuentas = () => {
    return (
        <Grid item xs={12}>
            <CardContent title='Maestro Cuentas'>
                <Layout />
            </CardContent>
        </Grid>
    )
}

export default Cuentas