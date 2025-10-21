import Grid from '@mui/material/Grid'
import { CardContent } from '@mui/material'
import FilterOnlyPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterOnlyPresupuesto'
import StatusComponent from "src/adm/solicitudCompromiso/components/Filters/status"
import Layout from 'src/adm/preOrdenPago/views/Layout'

const OrdenesPago = () => {
    return (
        <Grid item xs={12}>
            <CardContent title='Pre Orden de Pago'>
                <Grid container spacing={6}>
                    <Grid item xs={6}>
                        <FilterOnlyPresupuesto />
                    </Grid>
                </Grid>
                <Layout />
            </CardContent>
        </Grid>
    )
}

export default OrdenesPago