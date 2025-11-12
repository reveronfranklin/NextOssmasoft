import Grid from '@mui/material/Grid'
import { CardContent } from '@mui/material'
import Layout from 'src/adm/preOrdenPago/views/Layout'

/* import FilterOnlyPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterOnlyPresupuesto' */

const OrdenesPago = () => {
    return (
        <Grid item xs={12}>
            <CardContent title='Pre Orden de Pago'>
                <Grid container spacing={6}>
                    <Grid item xs={6}>
                        {/* <FilterOnlyPresupuesto /> */}
                    </Grid>
                </Grid>
                <Layout />
            </CardContent>
        </Grid>
    )
}

export default OrdenesPago