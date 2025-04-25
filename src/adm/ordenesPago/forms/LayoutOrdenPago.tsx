import { Card, CardContent, Grid, Tooltip, IconButton, CardHeader} from "@mui/material"
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import DataGridOrdenPagoComponent from '../components/Datagrid/ordenPago'
import {
    setIsOpenDialogOrdenPagoDetalle,
    setTypeOperation
} from 'src/store/apps/ordenPago'
import useServices from '../services/useServices'
import AlertMessage from 'src/views/components/alerts/AlertMessage'

const LayoutOrdenPago = () => {
    const dispatch = useDispatch()
    const { presupuestoSeleccionado, message } = useServices()

    const handleCreateOrden = async () => {
        dispatch(setTypeOperation('create'))
        setTimeout(() => {
            dispatch(setIsOpenDialogOrdenPagoDetalle(true))
        }, 1500)
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
                        </Tooltip>)
                    }
                </Grid>
            </CardContent>
            <CardContent>
                <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                    <DataGridOrdenPagoComponent />
                </Grid>
            </CardContent>
            <AlertMessage
                message={message?.text ?? ''}
                severity={message?.isValid ? 'success' : 'error'}
                duration={10000}
                show={message?.text ? true : false}
            />
        </Card>
    )
}

export default LayoutOrdenPago