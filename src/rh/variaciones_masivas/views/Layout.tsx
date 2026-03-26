import { useDispatch } from 'react-redux';
import { Card, CardContent, Grid, Tooltip, IconButton, CardHeader } from '@mui/material';
import Icon from 'src/@core/components/icon';
import DataGridComponent from '../components/dataGrid/GridEmployees';
import { setIsOpenDialogCuenta, setTypeOperation } from 'src/store/apps/pagos/cuentas';

const LayoutComponent = () => {
    const dispatch = useDispatch()

    const handleCreate = async () => {
        dispatch(setTypeOperation('create'))
        setTimeout(() => {
            dispatch(setIsOpenDialogCuenta(true))
        }, 1500)
    }

    return (
        <Card>
            <CardHeader
                title='Movimientos Masivos (Empleados)'
                subheader='Panel de asignaciones masivas y ajustes de conceptos.'
            />
            <CardContent>
                <Grid item justifyContent='flex-end'>
                    <Tooltip title='Agregar Maestro Banco'>
                        <IconButton color='primary' size='small' onClick={ handleCreate }>
                            <Icon icon='ci:add-row' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </CardContent>
            <CardContent>
                <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                    {/* <DataGridComponent /> */}
                </Grid>
            </CardContent>
        </Card>
    )
}

export default LayoutComponent