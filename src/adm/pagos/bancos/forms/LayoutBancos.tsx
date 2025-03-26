import { Card, CardContent, Grid, Tooltip, IconButton, CardHeader} from "@mui/material"
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import DataGridBancosComponent from '../components/Datagrid/bancos'

import { setIsOpenDialogMaestroBancoDetalle, setTypeOperation } from 'src/store/apps/pagos/bancos'

const LayoutBancos = () => {
    const dispatch = useDispatch()

    const handleCreate = async () => {
        dispatch(setTypeOperation('create'))
        setTimeout(() => {
            dispatch(setIsOpenDialogMaestroBancoDetalle(true))
        }, 1500)
    }

    return (
        <Card>
            <CardHeader title='Maestro Bancos'/>
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
                    <DataGridBancosComponent />
                </Grid>
            </CardContent>
        </Card>
    )
}

export default LayoutBancos