import { useDispatch } from 'react-redux';
import { Card, CardContent, Grid, Tooltip, IconButton, CardHeader} from '@mui/material';
import Icon from 'src/@core/components/icon';
/* import DataGridLotesComponent from '../components/dataGrid/Lotes'; */
import { setIsOpenDialogLote, setTypeOperation } from 'src/store/apps/pagos/lotes';

const LayoutPreOrdenPago = () => {
    const dispatch = useDispatch()

    const handleCreate = async () => {
        dispatch(setTypeOperation('create'))
        setTimeout(() => {
            dispatch(setIsOpenDialogLote(true))
        }, 1500)
    }

    return (
        <Card>
            <CardHeader title='Pre Orden de Pago'/>
            <CardContent>
                <Grid item justifyContent='flex-end'>
                    <Tooltip title='Agregar Lotes'>
                        <IconButton color='primary' size='small' onClick={ handleCreate }>
                            <Icon icon='ci:add-row' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </CardContent>
            <CardContent>
                <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                    {/* <DataGridLotesComponent /> */}
                </Grid>
            </CardContent>
        </Card>
    )
}

export default LayoutPreOrdenPago