import { Card, Grid, IconButton, Toolbar, Tooltip } from '@mui/material'
import Icon from 'src/@core/components/icon'
import DataGridListProducts from '../components/DataGridListProduct'
import DialogUpdateProductsInfo from '../view/DialogUpdateProductsInfo'

const FormIndexProducts = () => {
    // const exportToExcel = () => {}

    return (
        <Card>
            <Grid m={2} pt={3} item justifyContent='flex-end'>
                <Toolbar sx={{ justifyContent: 'flex-start' }}>
                    <Tooltip title='Descargar'>
                        <IconButton
                            color='primary'
                            size='small'

                            // onClick={() => exportToExcel()}
                        >
                            <Icon icon='ci:download' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </Grid>
            <DataGridListProducts />
            <DialogUpdateProductsInfo />
        </Card>
    )
}

export default FormIndexProducts