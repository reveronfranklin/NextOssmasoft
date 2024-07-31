import { Box, Collapse, Card, Grid, IconButton, Toolbar, Tooltip } from '@mui/material'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import DataGridListProducts from '../components/DataGridListProduct'
import FormCreateProducts from './formCreateProducts'

const FormIndexProducts = () => {
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false)

    // const exportToExcel = () => {}

    const handleAdd = (setIsUpdateFormOpen: any, isUpdateFormOpen: boolean) => {
        setIsUpdateFormOpen(!isUpdateFormOpen)
    }

    return (
        <Card>
            <Grid m={2} pt={3} item justifyContent='flex-end'>
                <Toolbar sx={{ justifyContent: 'flex-start' }}>
                    <Tooltip title='Agregar Producto'>
                        <IconButton
                            color='primary'
                            size='small'
                            onClick={() => handleAdd(setIsUpdateFormOpen, isUpdateFormOpen)}
                        >
                            <Icon icon='ci:add-row' fontSize={20} />
                        </IconButton>
                    </Tooltip>
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
            <Box>
                <Collapse in={isUpdateFormOpen}>
                    <FormCreateProducts />
                </Collapse>
            </Box>
            <DataGridListProducts />
        </Card>
    )
}

export default FormIndexProducts