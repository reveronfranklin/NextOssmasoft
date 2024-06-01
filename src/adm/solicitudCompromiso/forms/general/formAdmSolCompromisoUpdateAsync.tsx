import { useState } from 'react';
import { Box, Card, CardActions, CardContent, CardHeader, CircularProgress, FormControl, FormHelperText, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { Controller, useForm } from 'react-hook-form'
import { FormInputs  } from './../../interfaces/formImputs.interfaces'

import Button from '@mui/material/Button'

import TipoSolicitud from '../../components/autocomplete/TipoSolicitud'
import CodigoProveedor from '../../components/autocomplete/CodigoProveedor'
import UnidadSolicitante from '../../components/autocomplete/UnidadSolicitante'

import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

import { getDateByObject } from 'src/utilities/ge-date-by-object'
import dayjs from 'dayjs'

import { SolicitudCompromiso } from '../../interfaces/SolicitudCompromiso.interfaces'
import useServices from '../../services/useServices'

const FormUpdateSolCompromiso = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
    const { loading, updateSolicitudCompromiso, eliminarSolicitudCompromiso } = useServices()
    const [errorMessage, setErrorMessage] = useState<string>('')

    const {
        codigoSolicitud,
        numeroSolicitud,
        fechaSolicitud,
        codigoSolicitante,
        tipoSolicitudId,
        codigoProveedor,
        motivo,
        nota,
        status,
        codigoPresupuesto,
        fechaSolicitudObj,
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
        codigoPresupuesto
    }

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({ defaultValues })

    const handleTipoSolicitudChange = (tipoSolicitudId: number) => {
        setValue('tipoSolicitudId', tipoSolicitudId)
    }

    const handleCodigoProveedorChange = (codigoProveedor: number) => {
        setValue('codigoProveedor', codigoProveedor)
    }

    const handleFechaSolicitudChange = (fechaSolicitud: Date) => {
        if (dayjs(fechaSolicitud).isValid()) {
            // setValue('fechaSolicitud', fechaSolicitud.toISOString())
        }
    }

    const onSubmit = async (dataForm: FormInputs) => {
        try {
            const update: SolicitudCompromiso = {
                CodigoSolicitud: dataForm.codigoSolicitud,
                NumeroSolicitud: dataForm.numeroSolicitud,
                FechaSolicitud: dataForm.fechaSolicitud,
                CodigoSolicitante: dataForm.codigoSolicitante,
                TipoSolicitudId: dataForm.tipoSolicitudId,
                CodigoProveedor: dataForm.codigoProveedor,
                Motivo: dataForm.motivo,
                Nota: dataForm.nota,
                Status: dataForm.status,
                CodigoPresupuesto: dataForm.codigoPresupuesto
            }

            await updateSolicitudCompromiso(update)
        } catch (e: any) {
            setErrorMessage(e.message)
            console.log(e)
        }
    }

    const handleDelete = async () => {
        try {
            await eliminarSolicitudCompromiso(codigoSolicitud)
        } catch (e: any) {
            setErrorMessage(e.message)
            console.log(e)
        }
    }

    return (
        <Card>
            <CardHeader title='Adm - Modificar Solicitud Compromiso' />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={3} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='codigoSolicitud'
                                    control={control}
                                    render={({ field: {value, onChange} }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Codigo de Solicitud"
                                            onChange={onChange}
                                            placeholder='0'
                                            disabled
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='status'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Estado de la Solicitud"
                                            onChange={onChange}
                                            placeholder='Estado de la Solicitud'
                                            error={Boolean(errors.status)}
                                            aria-describedby='validation-async-statusProceso'
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
                        <Grid item sm={5} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='numeroSolicitud'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Numero de Solicitud"
                                            onChange={onChange}
                                            placeholder='Numero de Solicitud'
                                            error={Boolean(errors.numeroSolicitud)}
                                            aria-describedby='validation-async-numeroSolicitud'
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
                        <Grid item sm={7} xs={12}>
                            <UnidadSolicitante id={codigoSolicitante}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={5} xs={12}>
                            <TipoSolicitud
                                id={tipoSolicitudId}
                                onSelectionChange={handleTipoSolicitudChange}
                            />
                        </Grid>
                        <Grid item sm={7} xs={12}>
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
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Motivo"
                                            onChange={onChange}
                                            placeholder='Motivo'
                                            multiline
                                            rows={4}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='nota'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Nota"
                                            onChange={onChange}
                                            placeholder='Nota'
                                            multiline
                                            rows={4}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <CardActions sx={{ justifyContent: 'start', paddingLeft: 0 }}>
                        <Button size='large' type='submit' variant='contained'>
                            {loading ? (
                                <CircularProgress
                                    sx={{
                                        color: 'common.white',
                                        width: '20px !important',
                                        height: '20px !important',
                                        mr: theme => theme.spacing(2)
                                    }}
                                />
                            ) : null}
                            Guardar
                        </Button>
                        <Button variant='outlined' size='large' onClick={handleDelete}>Eliminar</Button>
                    </CardActions>
                    <Box>
                        {errorMessage.length > 0 && (
                            <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{errorMessage}</FormHelperText>
                        )}
                    </Box>
                </form>
            </CardContent>
        </Card>
    )
}

export default FormUpdateSolCompromiso