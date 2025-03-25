import { Card, CardContent, Grid, Tooltip, IconButton, CardHeader} from "@mui/material"
/* import Icon from 'src/@core/components/icon' */

import { useDispatch } from 'react-redux'
import DataGridBancosComponent from '../components/Datagrid/bancos'

import {
    setIsOpenDialogOrdenPagoDetalle,
    setTypeOperation
} from 'src/store/apps/ordenPago'

const LayoutBancos = () => {
    const dispatch = useDispatch()

    const handleCreateOrden = async () => {
        dispatch(setTypeOperation('create'))
        setTimeout(() => {
            dispatch(setIsOpenDialogOrdenPagoDetalle(true))
        }, 1500)
    }

    return (
        <Card>
            <CardHeader title='Maestro Bancos'/>
            <CardContent>
{/*                 <Grid item justifyContent='flex-end'>
                    {presupuestoSeleccionado.codigoPresupuesto && (
                        <Tooltip title='Agregar Orden de Pago'>
                            <IconButton color='primary' size='small' onClick={handleCreateOrden}>
                                <Icon icon='ci:add-row' fontSize={20} />
                            </IconButton>
                        </Tooltip>)
                    }
                </Grid> */}
            </CardContent>
            <CardContent>
                <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                    <DataGridBancosComponent />
                </Grid>
            </CardContent>
        </Card>
    )
}

export default LayoutBancos