import { useState } from 'react';
import { Box, Card, CardActions, CardContent, CardHeader, CircularProgress, FormControl, FormHelperText, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { Controller, useForm } from 'react-hook-form'
import { FormInputs } from './../../interfaces/formImputs.interfaces'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { Update } from '../../interfaces/update.interfaces'
import { Delete } from '../../interfaces/delete.interfaces'
import { useDispatch } from 'react-redux'
import { setSolicitudCompromisoSeleccionado, setVerSolicitudCompromisosActive } from "src/store/apps/adm"
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import Button from '@mui/material/Button'
import CodigoProveedor from '../../components/Autocomplete/CodigoProveedor'
import UnidadSolicitante from '../../components/Autocomplete/UnidadSolicitante'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import dayjs from 'dayjs'
import useServices from '../../services/useServices'
import toast from 'react-hot-toast'
import IndexDetalleSolicitudCompromiso from '../detalle/formAdmSolCompromisoIndexAsync'
import HandleReport from '../../helpers/generateReport/SolicitudCompromiso'
import AprobacionComponent from '../../components/Estados/Aprobacion'
import AnulacionComponent from '../../components/Estados/Anulacion'
import DialogCustom from '../../components/Dialog/dialogCustom'
import { EliminarImputaciones } from '../../interfaces/detalle/eliminarImputaciones.interfaces'

const FormUpdateSolCompromiso = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [generatorReport, setGeneratorReport] = useState<boolean>(false)
    const [openDialogImputaciones, setOpenDialogImputaciones] = useState<boolean>(false)
    const [openDialogSolicitud, setOpenDialogSolicitud] = useState<boolean>(false)

    const {
        updateSolicitudCompromiso,
        eliminarSolicitudCompromiso,
        fetchSolicitudReportData,
        downloadReportByName,
        eliminarImputaciones,
        presupuestoSeleccionado
    } = useServices()

    const dispatch = useDispatch()
    const qc: QueryClient = useQueryClient()

    const solicitudCompromisoData = useSelector((state: RootState) => state.admSolicitudCompromiso.solicitudCompromisoSeleccionado)

    const {
        codigoSolicitud,
        numeroSolicitud,
        fechaSolicitud,
        codigoSolicitante,
        tipoSolicitudId,
        descripcionTipoSolicitud,
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
        descripcionTipoSolicitud,
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

    const handleCodigoProveedorChange = (codigoProveedor: number) => {
        setValue('codigoProveedor', codigoProveedor)
    }

    const handleFechaSolicitudChange = (fechaSolicitud: Date) => {
        if (dayjs(fechaSolicitud).isValid()) {
            const fechaObj: any = fechaToFechaObj(fechaSolicitud)

            const solCompromiso = {
                ...solicitudCompromisoData,
                fechaSolicitud: dayjs(fechaSolicitud).format('YYYY-MM-DDTHH:mm:ss'),
                fechaSolicitudString: dayjs(fechaSolicitud).format('DD/MM/YYYY'),
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
                fechaSolicitud: fechaSolicitud,
                fechaSolicitudString: fechaSolicitudString,
                codigoSolicitante: dataForm.codigoSolicitante,
                tipoSolicitudId: tipoSolicitudId,
                codigoProveedor: dataForm.codigoProveedor,
                motivo: dataForm.motivo,
                nota: dataForm.nota,
                status: dataForm.status,
                codigoPresupuesto: dataForm.codigoPresupuesto,
                descripcionStatus: dataForm.descripcionStatus,
            }

            const responseUpdate = await updateSolicitudCompromiso(solicitudCompromisoUpdate)

            if (responseUpdate?.data?.isValid) {
                toast.success('Form Submitted')

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

    const handleDeleteImputacion = async () => {
        try {
            setLoading(true)
            const filter: EliminarImputaciones = {
                codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
                codigoSolicitud: codigoSolicitud
            }
            const responseDeleteImputaciones = await eliminarImputaciones(filter)

            if (responseDeleteImputaciones?.data.isValid) {
                qc.invalidateQueries({
                    queryKey: ['detalleSolicitudCompromiso', codigoSolicitud]
                })
            }
            setErrorMessage(responseDeleteImputaciones?.data.message)
        } catch (e: any) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
            const data: Delete = {
                codigoSolicitud: codigoSolicitud,
            }

            const responseDelete = await eliminarSolicitudCompromiso(data)

            if (!responseDelete?.data.isValid) {
                setErrorMessage(responseDelete?.data.message)
            } else {
                handleClose('solCompromiso')
                qc.invalidateQueries({
                    queryKey: ['solicitudCompromiso']
                })

                setTimeout(() => {
                    dispatch(setVerSolicitudCompromisosActive(false))
                }, 2000)
            }
        } catch (e: any) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const handleDialogOpen = (params: string) => {
        if (params === 'solCompromiso') {
            setOpenDialogSolicitud(true)
        }

        else if (params === 'imputaciones') {
            setOpenDialogImputaciones(true)
        }
    }

    const handleClose = (params: string) => {
        if (params === 'solCompromiso') {
            setOpenDialogSolicitud(false)
        }

        else if (params === 'imputaciones') {
            setOpenDialogImputaciones(false)
        }
    }

    const handleReport = async () => {
        setGeneratorReport(true)
        const payload = {
            filter: {
                PageSize: 0,
                PageNumber: 0,
                codigoSolicitud: codigoSolicitud,
                codigoPresupuesto: codigoPresupuesto,
                SearchText: ''
            },
            fetchSolicitudReportData,
            downloadReportByName
        }
        await HandleReport(payload)
        setGeneratorReport(false)
    }

    return (
        <>
            <AprobacionComponent data={solicitudCompromisoData} />
            <AnulacionComponent data={solicitudCompromisoData} />
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
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value || ''}
                                                label="Codigo de Solicitud"
                                                onChange={onChange}
                                                placeholder='Codigo de Solicitud'
                                                error={Boolean(errors.codigoSolicitud)}
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
                                        render={({ field: { value } }) => (
                                            <TextField
                                                value={value || ''}
                                                label="Numero de Solicitud"
                                                placeholder='Numero de Solicitud'
                                                disabled
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='descripcionTipoSolicitud'
                                        control={controlFormGeneral}
                                        render={({ field: { value } }) => (
                                            <TextField
                                                value={value || ''}
                                                label="tipo de SolicitudId"
                                                placeholder='tipo de SolicitudId'
                                                disabled
                                            />
                                        )}
                                    />
                                </FormControl>
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
                            <Button
                                size='large'
                                type='submit'
                                variant='contained'
                                disabled={loading}
                            >
                                {loading ? (
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
                                ) : 'Guardar'}
                            </Button>
                            <Button variant='contained' size='large' onClick={() => handleReport()}>
                                { generatorReport ? (
                                    <>
                                        <CircularProgress
                                            sx={{
                                                color: 'common.white',
                                                width: '20px !important',
                                                height: '20px !important',
                                                mr: theme => theme.spacing(2)
                                            }}
                                        />
                                        Generando...
                                    </>
                                ) : 'Imprimir'}
                            </Button>
                            <Button variant='outlined' size='large' onClick={() => handleDialogOpen('solCompromiso')}>
                                Eliminar
                            </Button>
                            <DialogCustom
                                open={openDialogSolicitud}
                                onClose={() => handleClose('solCompromiso')}
                                handle={handleDelete}
                                title='Esta seguro de eliminar esta solicitud de compromiso?'
                                message='Se eliminaran los datos de esta solicitud de compromiso.'
                                loading={loading}
                            />
                            <Button variant='outlined' size='large' onClick={() => handleDialogOpen('imputaciones')}>
                                Eliminar Imputaciones
                            </Button>
                            <DialogCustom
                                open={openDialogImputaciones}
                                onClose={() =>handleClose('imputaciones')}
                                handle={handleDeleteImputacion}
                                title='Esta seguro de eliminar las imputaciones asociadas a esta solicitud?'
                                message='Se eliminaran todas las imputaciones vinculadas.'
                                loading={loading}
                            />
                        </CardActions>
                        <Box>
                            {errorMessage.length > 0 && (
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
        </>
    )
}

export default FormUpdateSolCompromiso