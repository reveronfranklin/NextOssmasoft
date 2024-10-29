import Grid from '@mui/material/Grid'
import { CardContent } from '@mui/material'
import FilterOnlyPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterOnlyPresupuesto'
import StatusComponent from "src/adm/solicitudCompromiso/components/Filters/status"
import Layout from 'src/adm/ordenesPago/views/Layout'

const OrdenesPago = () => {
    return (
        <Grid item xs={12}>
            <CardContent title='Solicitud de Compromiso'>
                <Grid container spacing={6}>
                    <Grid item xs={6}>
                        <FilterOnlyPresupuesto />
                    </Grid>
                    <Grid item xs={6}>
                        <StatusComponent />
                    </Grid>
                </Grid>
                <Layout />
            </CardContent>
        </Grid>
    )
}

export default OrdenesPago