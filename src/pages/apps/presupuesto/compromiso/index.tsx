import Grid from '@mui/material/Grid'
import { CardContent } from '@mui/material'
import FilterOnlyPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterOnlyPresupuesto'
import StatusComponent from "src/adm/solicitudCompromiso/components/Filters/status"
import LayoutComponent from 'src/presupuesto/compromiso/views/Layout'

const solicitudCompromiso = () => {
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
                <LayoutComponent />
            </CardContent>
        </Grid>
    )
}

export default solicitudCompromiso
