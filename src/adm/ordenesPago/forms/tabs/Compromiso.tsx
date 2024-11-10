import { Grid } from "@mui/material"
import DataGridListCompromisoByOrden from "../../components/Datagrid/compromisosByOrden"
import DialogListPucByOrdenPago from '../../views/Dialog/ListPucByOrdenPago'
import DialogListPucByOrdenPagoEdit from '../../views/Dialog/ListPucByOrdenEdit'

const Compromiso = () => {
    return (
        <Grid container spacing={2} padding={5}>
            <Grid item xs={12}>
                <DataGridListCompromisoByOrden />
                <DialogListPucByOrdenPago />
                <DialogListPucByOrdenPagoEdit />
            </Grid>
        </Grid>
    )
}

export default Compromiso