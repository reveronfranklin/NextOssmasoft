import { Card, CardContent, Grid, Typography, Tooltip, IconButton, Box} from "@mui/material"
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import DataGridOrdenPagoComponent from '../components/Datagrid/ordenPago'
import {
    setIsOpenDialogOrdenPagoDetalle,
    setTypeOperation
} from 'src/store/apps/ordenPago'

const LayoutOrdenPago = () => {
    const dispatch = useDispatch()

    const handleCreateOrden = async () => {
        dispatch(setIsOpenDialogOrdenPagoDetalle(true))
        dispatch(setTypeOperation('create'))
    }

    return (
        <Card>
            <CardContent>
                <Grid item justifyContent='flex-end'>
                    <Typography>
                        Orden de Pago
                    </Typography>
                </Grid>
                <Grid item justifyContent='flex-end'>
                    <Tooltip title='Agregar Orden de Pago'>
                        <IconButton color='primary' size='small' onClick={handleCreateOrden}>
                            <Icon icon='ci:add-row' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </CardContent>
            <CardContent>
                <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                    <DataGridOrdenPagoComponent />
                </Grid>
            </CardContent>
        </Card>
    )
}

export default LayoutOrdenPago