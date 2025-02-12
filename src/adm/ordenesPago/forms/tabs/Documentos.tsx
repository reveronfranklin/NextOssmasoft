import { Box, Grid, IconButton, Toolbar, Tooltip } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Component from '../../components/Datagrid/listDocumentosOp'
import { useDispatch } from 'react-redux'
import DialogDocumentosEdit from '../../views/Dialog/DocumentosEdit'
import { setIsOpenDialogDocumentosEdit, setTypeOperationDocumento } from "src/store/apps/ordenPago"

const Documentos = () => {
    const dispatch = useDispatch()

    const handle = () => {
        dispatch(setIsOpenDialogDocumentosEdit(true))
        dispatch(setTypeOperationDocumento('create'))
    }

    return (
        <>
            <Box>
                <Grid item justifyContent='flex-end'>
                    <Toolbar
                        sx={{ justifyContent: 'flex-start' }}
                    >
                        <Tooltip title='Agregar Documento'>
                            <IconButton
                                size='small'
                                color='primary'
                                onClick={handle}
                            >
                                <Icon icon='ci:add-row' fontSize={20} />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </Grid>
            </Box>
            <Box
                sx={{
                    marginTop: '0px',
                    maxHeight: 'auto',
                    overflowY: 'auto',
                    padding: '10px',
                }}
            >
                <DialogDocumentosEdit />
                <Component />
            </Box>
        </>
    )
}

export default Documentos