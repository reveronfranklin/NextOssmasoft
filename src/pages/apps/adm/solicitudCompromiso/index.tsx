import Grid from '@mui/material/Grid'
import { CardContent } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import LayoutSolicitudCompromiso from 'src/adm/solicitudCompromiso/components/Layout'
import FilterOnlyPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterOnlyPresupuesto'

const solicitudCompromiso = () => {
    return (
        <Grid item xs={12}>
            <CardContent title='Solicitud de Compromiso'>
                <DatePickerWrapper>
                    <FilterOnlyPresupuesto />
                </DatePickerWrapper>
            </CardContent>
            <LayoutSolicitudCompromiso />
        </Grid>
    )
}

export default solicitudCompromiso
