import { useDispatch } from 'react-redux';
import { Card, CardContent, Grid, Tooltip, IconButton, CardHeader} from '@mui/material';
import Icon from 'src/@core/components/icon';
import DataGridCuentasComponent from '../components/dataGrid/Lotes';
import { setIsOpenDialogCuenta, setTypeOperation } from 'src/store/apps/pagos/cuentas';

const LayoutLotes = () => {
    const dispatch = useDispatch()

    const handleCreate = async () => {
        dispatch(setTypeOperation('create'))
        setTimeout(() => {
            dispatch(setIsOpenDialogCuenta(true))
        }, 1500)
    }

    return (
        <Card>
            <CardHeader title='Lotes'/>
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
                    <DataGridCuentasComponent />
                </Grid>
            </CardContent>
        </Card>
    )
}

export default LayoutLotes