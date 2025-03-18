import { Box, Collapse, Grid, IconButton, Toolbar, Tooltip } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Component from '../../components/Datagrid/listRetencionesOp'
import FormCreateRetencionesOp from '../../forms/create/FormCreateRetencionesOp'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { setIsCollapseRetenciones } from 'src/store/apps/ordenPago'
import { useDispatch } from 'react-redux'

import DialogListRetenciones from '../../views/Dialog/ListRetenciones'

const Retenciones = () => {
    const dispatch = useDispatch()
    const { isCollapseRetenciones } = useSelector((state: RootState) => state.admOrdenPago)

    return (
        <>
            <Box>
                <Grid item justifyContent='flex-end'>
                    <Toolbar
                        sx={{ justifyContent: 'flex-start' }}
                    >
                        <Tooltip title='Agregar Retencion'>
                            <IconButton
                                size='small'
                                color='primary'
                                onClick={() => dispatch(setIsCollapseRetenciones(!isCollapseRetenciones))}
                            >
                                <Icon icon='ci:add-row' fontSize={20} />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </Grid>
            </Box>
            <Collapse
                in={isCollapseRetenciones}
                sx={{
                    padding: '2px',
                    maxHeight: '350px',
                    overflowY: 'auto',
                    marginBottom: '5px'
                }}
            >
                <FormCreateRetencionesOp />
                <DialogListRetenciones />
            </Collapse>
            <Box
                sx={{
                    marginTop: '0px',
                    maxHeight: 'auto',
                    overflowY: 'auto',
                    padding: '10px',
                }}
            >
                <Component />
            </Box>
        </>
    )
}

export default Retenciones