import { Box, Collapse, Grid, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import DataGridDetalleSolicitudComponent from 'src/adm/solicitudCompromiso/components/DataGrid/DataGridDetalleSolicitud'

import CreateDetalleSolicitudCompromiso from 'src/adm/solicitudCompromiso/forms/detalle/formAdmSolCompromisoCreateAsync'
import DialogAdmSolCompromisoDetalleInfo from './../../views/DialogAdmSolCompromisoDetalleInfo'

const handleAdd = (setIsUpdateFormOpen: any, isUpdateFormOpen: boolean) => {
    setIsUpdateFormOpen(!isUpdateFormOpen)
}

const headerDetail = () => {
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false)
    return (
        <>
            <Box>
                <Grid item justifyContent='flex-end'>
                    <Toolbar sx={{ justifyContent: 'flex-start' }}>
                        <Tooltip title='Agregar Detalle'>
                            <IconButton color='primary' size='small' onClick={() => handleAdd(setIsUpdateFormOpen, isUpdateFormOpen)}>
                                <Icon icon='ci:add-row' fontSize={20} />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </Grid>
            </Box>
            <Collapse in={isUpdateFormOpen}>
                <CreateDetalleSolicitudCompromiso />
            </Collapse>
        </>
    )
}

const IndexDetalleSolicitudCompromiso = (props: any) => {
    return (
        <>
            { headerDetail() }
            <DataGridDetalleSolicitudComponent codigoSolicitud={ props.codigoSolicitud } />
            <DialogAdmSolCompromisoDetalleInfo />
        </>
    )
}


export default IndexDetalleSolicitudCompromiso