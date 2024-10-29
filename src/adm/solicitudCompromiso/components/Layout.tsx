import { useDispatch } from "react-redux"
import { Box, Card, CardHeader, Grid, IconButton, Toolbar, Tooltip, Typography } from "@mui/material"
import { Dispatch, AnyAction } from "@reduxjs/toolkit"
import { CrudOperation } from './../enums/CrudOperations.enum'
import Spinner from 'src/@core/components/spinner'
import Icon from 'src/@core/components/icon'
import useServices from '../services/useServices'
import dataGrid from './DataGrid/DataGridGeneralSolicitud'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DialogAdmSolCompromisoInfo from './../views/DialogAdmSolCompromisoInfo'
import {
    setVerSolicitudCompromisosActive,
    setOperacionCrudAdmSolCompromiso
} from "src/store/apps/adm"
import { useSelector } from "react-redux"
import { RootState } from "src/store"

const handleAdd = (dispatch: any) => {
    dispatch(setVerSolicitudCompromisosActive(true))
    dispatch(setOperacionCrudAdmSolCompromiso(CrudOperation.CREATE))
}

const HeaderDetail = (dispatch: Dispatch<AnyAction>) => {
    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    return (
        <>
            <Box>
                <CardHeader title='Solicitud de compromiso' />
                <Grid item justifyContent='flex-end'>
                    <Toolbar sx={{ justifyContent: 'flex-start' }}>
                        <Tooltip title='Agregar Solicitud'>
                            <IconButton
                                color='primary'
                                size='small'
                                onClick={() => handleAdd(dispatch)}
                                disabled={!presupuestoSeleccionado.codigoPresupuesto}
                            >
                                <Icon icon='ci:add-row' fontSize={20} />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </Grid>
            </Box>
        </>
    )
}

const LayoutSolicitudCompromiso = () => {
    const { mensaje, loading } = useServices()
    const dispatch = useDispatch()

    return (
        <Card>
            {
                !loading ? HeaderDetail(dispatch) : <Typography>{mensaje}</Typography>
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

export default LayoutSolicitudCompromiso