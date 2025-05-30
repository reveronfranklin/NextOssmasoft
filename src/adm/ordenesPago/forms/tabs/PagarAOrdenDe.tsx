import { Box, Collapse, Grid, IconButton, Toolbar, Tooltip } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Component from '../../components/Datagrid/listBeneficiosOp'
import FormCreateBeneficioOp from '../create/FormCreateBeneficioOp'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { setIsCollapseRetenciones } from 'src/store/apps/ordenPago'
import { useDispatch } from 'react-redux'

const PagarAOrdenDe = () => {
    const dispatch = useDispatch()
    const { isCollapseRetenciones } = useSelector((state: RootState) => state.admOrdenPago)

    return (
        <>
            <Box>
                <Grid item justifyContent='flex-end'>
                    <Toolbar
                        sx={{ justifyContent: 'flex-start' }}
                    >
                        <Tooltip title='Agregar nuevo'>
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
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginBottom: '5px'
                }}
            >
                <FormCreateBeneficioOp />
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

export default PagarAOrdenDe
