import { useDispatch } from "react-redux"
import { Box, Card, CardContent, Grid, IconButton, Toolbar, Tooltip, Typography } from "@mui/material"
import Spinner from 'src/@core/components/spinner'
import Icon from 'src/@core/components/icon'

import { setVerSolicitudCompromisosActive, setOperacionCrudAdmSolCompromiso } from "src/store/apps/adm"

import useServices from '../services/useServices'
import dataGrid from './DataGrid/DataGridGeneralSolicitud'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DialogAdmSolCompromisoInfo from './../views/DialogAdmSolCompromisoInfo'
import { CrudOperation } from './../enums/CrudOperations.enum'
import { Dispatch, AnyAction } from "@reduxjs/toolkit"

const handleAdd = (dispatch: any) => {
    dispatch(setVerSolicitudCompromisosActive(true))
    dispatch(setOperacionCrudAdmSolCompromiso(CrudOperation.CREATE))
}

const LayoutSolicitudCompromiso = () => {
    const { mensaje, loading } = useServices()
    const dispatch = useDispatch()

    return (
        <Card>
            {
                !loading ? headerDetail(dispatch) : <Typography>{mensaje}</Typography>
            }
            {
                loading ? <Spinner sx={{ height: '100%' }} /> : dataGrid()
            }
            <DatePickerWrapper>
                <DialogAdmSolCompromisoInfo />
            </DatePickerWrapper>
        </Card>
    )
}

const headerDetail = (dispatch: Dispatch<AnyAction>) => {
    return (
        <Box>
            <CardContent>
                <Typography>
                    Solicitud de compromiso
                </Typography>
            </CardContent>
            <Grid item justifyContent='flex-end'>
                <Toolbar sx={{ justifyContent: 'flex-start' }}>
                    <Tooltip title='Agregar Solicitud'>
                        <IconButton color='primary' size='small' onClick={() => handleAdd(dispatch)}>
                            <Icon icon='ci:add-row' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </Grid>
        </Box>
    )
}

export default LayoutSolicitudCompromiso