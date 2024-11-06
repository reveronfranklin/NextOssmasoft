import { Grid } from "@mui/material"
import DataGridListCompromisoByOrden from "../../components/Datagrid/compromisosByOrden"
import DialogListPucByOrdenPago from '../../views/Dialog/ListPucByOrdenPago'

const Compromiso = () => {
    return (
        <Grid container spacing={2} padding={5}>
            <Grid item xs={12}>
                <DataGridListCompromisoByOrden />
                <DialogListPucByOrdenPago />
            </Grid>
        </Grid>
    )
}

export default Compromiso