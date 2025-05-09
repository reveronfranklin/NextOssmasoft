import { CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import Layout from 'src/adm/pagos/lotes/views/Layout';
import FilterOnlyPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterOnlyPresupuesto';
import LayoutFilterDate from 'src/adm/pagos/lotes/views/LayoutFilterDate';

const Lotes = () => {
    return (
        <Grid item xs={12}>
            <CardContent title='Lotes de pago'>
                <Grid container spacing={6}>
                    <Grid item xs={6}>
                        <FilterOnlyPresupuesto />
                    </Grid>
                    <Grid item xs={6}>
                        <LayoutFilterDate />
                    </Grid>
                </Grid>
                <Layout />
            </CardContent>
        </Grid>
    )
}

export default Lotes