import { Card, CardContent, Grid, Tooltip, IconButton, CardHeader} from "@mui/material"
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import DataGridOrdenPagoComponent from '../components/Datagrid/ordenPago'
import {
    setIsOpenDialogOrdenPagoDetalle,
    setTypeOperation
} from 'src/store/apps/ordenPago'
import useServices from '../services/useServices'

const LayoutOrdenPago = () => {
    const dispatch = useDispatch()
    const { presupuestoSeleccionado } = useServices()

    const handleCreateOrden = async () => {
        dispatch(setIsOpenDialogOrdenPagoDetalle(true))
        dispatch(setTypeOperation('create'))
    }

    return (
        <Card>
            <CardHeader title='Orden de Pago'/>
            <CardContent>
                <Grid item justifyContent='flex-end'>
                    {presupuestoSeleccionado.codigoPresupuesto && (
                        <Tooltip title='Agregar Orden de Pago'>
                            <IconButton color='primary' size='small' onClick={handleCreateOrden}>
                                <Icon icon='ci:add-row' fontSize={20} />
                            </IconButton>
                        </Tooltip> )
                    }
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