import { Card, CardContent, Grid, Typography, Button } from "@mui/material"
import DataGridOrdenPagoComponent from '../components/Datagrid/ordenPago'
import { useDispatch } from 'react-redux'
import { setIsOpenDialogOrdenPagoDetalle, setTypeOperation } from 'src/store/apps/ordenPago'

const LayoutOrdenPago = () => {
    const dispatch = useDispatch()

    const handleCreateOrden = async () => {
        dispatch(setIsOpenDialogOrdenPagoDetalle(true))
        dispatch(setTypeOperation('create'))
    }

    return (
        <Card>
            <CardContent>
                <Grid container direction="row" justifyContent="space-between" sm={12} xs={12} sx={{ padding: '5px' }}>
                    <Typography>
                        Orden de Pago
                    </Typography>
                    <Button variant='contained' color='primary' size='small' onClick={handleCreateOrden}>
                        Crear
                    </Button>
                </Grid>
                <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                    <DataGridOrdenPagoComponent />
                </Grid>
            </CardContent>
        </Card>
    )
}

export default LayoutOrdenPago