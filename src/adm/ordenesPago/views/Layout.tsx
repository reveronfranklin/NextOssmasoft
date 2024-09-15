import { Card, CardContent, Grid, Typography } from "@mui/material"
import DataGridOrdenPagoComponent from '../components/Datagrid/ordenPago'
import DialogAdmOrdenPagoDetalle from "./DialogAdmOrdenPagoDetalle"

const LayoutComponent = () => {
    return (
        <Card>
            <CardContent>
                <Grid item justifyContent='flex-end'>
                    <Typography>
                        Orden de Pago
                    </Typography>
                </Grid>
                <DataGridOrdenPagoComponent />
                <DialogAdmOrdenPagoDetalle />
            </CardContent>
        </Card>
    )
}

export default LayoutComponent