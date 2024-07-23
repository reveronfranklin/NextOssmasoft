import { useState } from 'react';
import { Box, Card, CardActions, CardContent, CardHeader, CircularProgress, DialogContent, FormControl, FormHelperText, Grid, TextField, Dialog, DialogActions, DialogContentText, DialogTitle } from '@mui/material';
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { Controller, useForm } from 'react-hook-form'
import { FormInputs  } from './../../interfaces/formImputs.interfaces'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { Update } from '../../interfaces/update.interfaces'
import { Delete } from '../../interfaces/delete.interfaces'
import { useDispatch } from 'react-redux'
import { setSolicitudCompromisoSeleccionado, setVerSolicitudCompromisosActive } from "src/store/apps/adm"
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import Button from '@mui/material/Button'
import TipoSolicitud from '../../components/autocomplete/TipoSolicitud'
import CodigoProveedor from '../../components/autocomplete/CodigoProveedor'
import UnidadSolicitante from '../../components/autocomplete/UnidadSolicitante'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import dayjs from 'dayjs'
import useServices from '../../services/useServices'
import toast from 'react-hot-toast'
import IndexDetalleSolicitudCompromiso from '../detalle/formAdmSolCompromisoIndexAsync'

// import { SolicitudCompromiso } from '../../interfaces/SolicitudCompromiso.interfaces'

const FormUpdateSolCompromiso = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)

    const dispatch = useDispatch()
    const { updateSolicitudCompromiso, eliminarSolicitudCompromiso } = useServices()
    const qc: QueryClient = useQueryClient()

    const solicitudCompromisoData = useSelector((state: RootState) => state.admSolicitudCompromiso.solicitudCompromisoSeleccionado)

    const {
        codigoSolicitud,
        numeroSolicitud,
        fechaSolicitud,
        codigoSolicitante,
        tipoSolicitudId,
        codigoProveedor,
        descripcionStatus,
        motivo,
        nota,
        status,
        codigoPresupuesto,
        fechaSolicitudObj,
        fechaSolicitudString,
    } = useSelector((state: RootState) => state.admSolicitudCompromiso.solicitudCompromisoSeleccionado)

    const defaultValues: FormInputs = {
        codigoSolicitud,
        numeroSolicitud,
        fechaSolicitud,
        codigoSolicitante,
        tipoSolicitudId,
        codigoProveedor,
        motivo,
        nota,
        status,
        descripcionStatus,
        codigoPresupuesto,
        fechaSolicitudString
    }

    const {
        control: controlFormGeneral,
        handleSubmit: handleSubmitGeneral,
        setValue,
        formState: { errors }
    } = useForm<FormInputs>({ defaultValues })

    const handleCodigoSolicitanteChange = (codigoSolicitante: number) => {
        setValue('codigoSolicitante', codigoSolicitante)
    }

    const handleTipoSolicitudChange = (tipoSolicitudId: number) => {
        setValue('tipoSolicitudId', tipoSolicitudId)
    }

    const handleCodigoProveedorChange = (codigoProveedor: number) => {
        setValue('codigoProveedor', codigoProveedor)
    }

    const handleFechaSolicitudChange = (fechaSolicitud: Date) => {
        if (dayjs(fechaSolicitud).isValid()) {
            const fechaObj: any = fechaToFechaObj(fechaSolicitud)

            const solCompromiso = {
                ...solicitudCompromisoData,
                fechaSolicitud: fechaSolicitud,
                fechaSolicitudString: fechaSolicitud.toISOString(),
                fechaSolicitudObj: fechaObj
            }

            dispatch(setSolicitudCompromisoSeleccionado(solCompromiso))
            setValue('fechaSolicitudString', fechaSolicitud.toISOString())
        }
    }

    const onSubmitGeneral = async (dataForm: FormInputs) => {
        try {
            setLoading(true)
            const solicitudCompromisoUpdate: Update = {
                codigoSolicitud: dataForm.codigoSolicitud,
                numeroSolicitud: dataForm.numeroSolicitud,
                fechaSolicitud: dataForm.fechaSolicitud,
                codigoSolicitante: dataForm.codigoSolicitante,
                tipoSolicitudId: dataForm.tipoSolicitudId,
                codigoProveedor: dataForm.codigoProveedor,
                motivo: dataForm.motivo,
                nota: dataForm.nota,
                status: dataForm.status,
                codigoPresupuesto: dataForm.codigoPresupuesto,
                fechaSolicitudString: dataForm.fechaSolicitudString,
                descripcionStatus: dataForm.descripcionStatus,
            }

            const responseUpdate = await updateSolicitudCompromiso(solicitudCompromisoUpdate)

            if (responseUpdate?.data?.isValid) {
                toast.success('Form Submitted')
                dispatch(setVerSolicitudCompromisosActive(false))
                qc.invalidateQueries({
                    queryKey: ['solicitudCompromiso']
                })
            }

            setErrorMessage(responseUpdate?.data.message)
        } catch (e: any) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            const data: Delete = {
                codigoSolicitud: codigoSolicitud,
            }
            const responseDelete = await eliminarSolicitudCompromiso(data)

            if (!responseDelete?.data.isValid) {
                setErrorMessage(responseDelete?.data.message)
            } else {
                handleClose()
                qc.invalidateQueries({
                    queryKey: ['solicitudCompromiso']
                })
            }
        } catch (e: any) {
            console.log(e)
        }
    }

    const handleDialogOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Card>
            <CardHeader title='Adm - Modificar Solicitud Compromiso' />
            <CardContent>
                <form onSubmit={handleSubmitGeneral(onSubmitGeneral)}>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={3} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='codigoSolicitud'
                                    control={controlFormGeneral}
                                    render={({ field: {value, onChange} }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Codigo de Solicitud"
                                            onChange={onChange}
                                            placeholder='Codigo de Solicitud'
                                            error={Boolean(errors.codigoSolicitud )}
                                            aria-describedby='validation-async-codigoSolicitud'
                                            disabled
                                        />
                                    )}
                                />
                                {errors.codigoSolicitud && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoSolicitud'>
                                        This field is required
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='descripcionStatus'
                                    control={controlFormGeneral}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Estado de la Solicitud"
                                            onChange={onChange}
                                            placeholder='Estado de la Solicitud'
                                            error={Boolean(errors.status)}
                                            aria-describedby='validation-async-statusProceso'
                                            disabled
                                        />
                                    )}
                                />
                                {errors.status && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-statusProceso'>
                                        This field is required
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <DatePickerWrapper>
                                <DatePicker
                                    selected={getDateByObject(fechaSolicitudObj)}
                                    id='date-time-picker-desde'
                                    dateFormat='dd/MM/yyyy'
                                    popperPlacement={popperPlacement}
                                    onChange={(date: Date) => { handleFechaSolicitudChange(date) }}
                                    placeholderText='Click to select a date'
                                    customInput={<CustomInput label='Fecha Solicitud' />}
                                />
                            </DatePickerWrapper>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='numeroSolicitud'
                                    control={controlFormGeneral}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Numero de Solicitud"
                                            onChange={onChange}
                                            placeholder='Numero de Solicitud'
                                            error={Boolean(errors.numeroSolicitud)}
                                            aria-describedby='validation-async-numeroSolicitud'
                                            disabled
                                        />
                                    )}
                                />
                                {errors.numeroSolicitud && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-numeroSolicitud'>
                                        This field is required
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TipoSolicitud
                                id={tipoSolicitudId}
                                onSelectionChange={handleTipoSolicitudChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={6} xs={12}>
                            <UnidadSolicitante
                                id={codigoSolicitante}
                                onSelectionChange={handleCodigoSolicitanteChange}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <CodigoProveedor
                                id={codigoProveedor}
                                onSelectionChange={handleCodigoProveedorChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={12} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='motivo'
                                    control={controlFormGeneral}
                                    rules={{
                                        required: false,
                                        maxLength: 1150,
                                    }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            helperText="Caracteres máximo 1150"
                                            value={value || ''}
                                            label="Motivo"
                                            onChange={onChange}
                                            placeholder='Motivo'
                                            error={Boolean(errors.motivo)}
                                            aria-describedby='validation-async-motivo'
                                            multiline
                                            rows={5}
                                        />
                                    )}
                                />
                                {errors.motivo && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-motivo'></FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='nota'
                                    control={controlFormGeneral}
                                    rules={{
                                        required: false,
                                        maxLength: 1000,
                                    }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            helperText="Caracteres máximo 1000"
                                            value={value || ''}
                                            label="Nota"
                                            onChange={onChange}
                                            placeholder='Nota'
                                            multiline
                                            rows={4}
                                            error={Boolean(errors.nota)}
                                            aria-describedby='validation-async-nota'
                                        />
                                    )}
                                />
                                {errors.nota && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-nota'></FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <CardActions sx={{ justifyContent: 'start', paddingLeft: 0 }}>
                        <Button size='large' type='submit' variant='contained'>
                            { loading ? (
                                <>
                                    <CircularProgress
                                        sx={{
                                            color: 'common.white',
                                            width: '20px !important',
                                            height: '20px !important',
                                            mr: theme => theme.spacing(2)
                                        }}
                                    />
                                    Guardando...
                                </>
                            ) : 'Guardar' }
                        </Button>
                        <Button variant='outlined' size='large' onClick={handleDialogOpen}>
                            Eliminar
                        </Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby='alert-dialog-title'
                            aria-describedby='alert-dialog-description'
                        >
                            <DialogTitle id='alert-dialog-title'>
                                {'Esta Seguro de Eliminar esta solicitud de Compromiso?'}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id='alert-dialog-description'>
                                    Se eliminaran los datos de esta solicitud de compromiso
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>No</Button>
                                <Button onClick={handleDelete} autoFocus>
                                    Si
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </CardActions>
                    <Box>
                        { errorMessage.length > 0 && (
                            <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{errorMessage}</FormHelperText>
                        )}
                    </Box>
                    <Grid container spacing={5} paddingTop={0}>
                        <Grid item sm={12} xs={12}>
                            <IndexDetalleSolicitudCompromiso codigoSolicitud={codigoSolicitud} />
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    )
}

export default FormUpdateSolCompromiso