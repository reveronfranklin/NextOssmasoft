import { Box, Collapse, Grid, IconButton, Toolbar, Tooltip } from '@mui/material'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import Component from '../../components/Datagrid/listRetenciones'
import FormCreateRetenciones from '../../forms/create/FormCreateRetenciones'

const handleAdd = (setIsUpdateFormOpen: any, isUpdateFormOpen: boolean) => {
    setIsUpdateFormOpen(!isUpdateFormOpen)
}

const Retenciones = () => {
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false)

    return (
        <>
            <Box>
                <Grid item justifyContent='flex-end'>
                    <Toolbar
                        sx={{ justifyContent: 'flex-start' }}
                    >
                        <Tooltip title='Agregar Retención'>
                            <IconButton
                                color='primary'
                                size='small'
                                onClick={() => handleAdd(setIsUpdateFormOpen, isUpdateFormOpen)}
                            >
                                <Icon icon='ci:add-row' fontSize={20} />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </Grid>
            </Box>
            <Collapse
                in={isUpdateFormOpen}
                sx={{
                    padding: '2px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginBottom: '5px'
                }}
            >
                <FormCreateRetenciones />
            </Collapse>
            <Box
                sx={{
                    marginTop: '10px',
                    maxHeight: '400px',
                    overflowY: 'auto'
                }}
            >
                <Component />
            </Box>
        </>
    )
}

export default Retenciones