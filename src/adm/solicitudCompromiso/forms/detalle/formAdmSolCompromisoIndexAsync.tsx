import { Box, Collapse, Grid, IconButton, Toolbar, Tooltip } from '@mui/material'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'

import CreateDetalleSolicitudCompromiso from 'src/adm/solicitudCompromiso/forms/detalle/formAdmSolCompromisoCreateAsync'
import DataGridDetalleSolicitudComponent from 'src/adm/solicitudCompromiso/components/DataGrid/DataGridDetalleSolicitud'
import DialogAdmSolCompromisoDetalleInfo from './../../views/DialogAdmSolCompromisoDetalleInfo'

const handleAdd = (setIsUpdateFormOpen: any, isUpdateFormOpen: boolean) => {
    setIsUpdateFormOpen(!isUpdateFormOpen)
}

const HeaderDetail = () => {
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
            {
                HeaderDetail()
            }
            <DataGridDetalleSolicitudComponent codigoSolicitud={ props.codigoSolicitud } />
            <DialogAdmSolCompromisoDetalleInfo />
        </>
    )

}


export default IndexDetalleSolicitudCompromiso