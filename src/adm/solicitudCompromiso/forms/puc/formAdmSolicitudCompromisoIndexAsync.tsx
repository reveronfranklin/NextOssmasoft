import { Box, Collapse, Grid, IconButton, Toolbar, Tooltip } from '@mui/material'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'

import DataGridPucSolicitudComponent from 'src/adm/solicitudCompromiso/components/DataGrid/DataGridPucSolicitud'
import CreatePucDetalleSolicitudCompromiso from 'src/adm/solicitudCompromiso/forms/puc/formAdmSolicitudCompromisoCreateAsync'
import DialogAdmSolCompromisoPucInfo from './../../views/DialogAdmSolCompromisoPucInfo'

const  handleAdd = (setIsUpdateFormOpen: any, isUpdateFormOpen: boolean) => {
    setIsUpdateFormOpen(!isUpdateFormOpen)
}

const HeaderDetail = (props: any) => {
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false)

    return (
        <>
            <Box sx={{ borderRadius: '4px', marginBottom: '10px' }}>
                <Grid item justifyContent='flex-end'>
                    <Toolbar sx={{ justifyContent: 'flex-start' }}>
                        <Tooltip title='Agregar Puc'>
                            <IconButton color='primary' size='small' onClick={() => handleAdd(setIsUpdateFormOpen, isUpdateFormOpen)}>
                                <Icon icon='ci:add-row' fontSize={20} />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </Grid>
            </Box>
            <Collapse in={isUpdateFormOpen} sx={{ backgroundColor: '#f5f5f5', padding: '2px', borderRadius: '5px', marginBottom: '40px' }}>
                <CreatePucDetalleSolicitudCompromiso
                    codigoSolicitud={props.codigoSolicitud}
                    codigoDetalleSolicitud={props.codigoDetalleSolicitud}
                />
                <DialogAdmSolCompromisoPucInfo />
            </Collapse>
        </>
    )

}

const IndexPucSolicitudCompromiso = (props: any) => {

    return (
        <>
            {
                HeaderDetail(props)
            }
            <DataGridPucSolicitudComponent codigoDetalleSolicitud={props.codigoDetalleSolicitud} />
        </>
    )
}


export default IndexPucSolicitudCompromiso