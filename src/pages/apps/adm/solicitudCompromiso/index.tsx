import Grid from '@mui/material/Grid'
import { CardContent } from '@mui/material'
import LayoutSolicitudCompromiso from 'src/adm/solicitudCompromiso/components/Layout'
import FilterOnlyPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterOnlyPresupuesto'

const solicitudCompromiso = () => {
    return (
        <Grid item xs={12}>
            <CardContent title='Solicitud de Compromiso'>
                <FilterOnlyPresupuesto />
                <LayoutSolicitudCompromiso />
            </CardContent>
        </Grid>
    )
}

export default solicitudCompromiso
