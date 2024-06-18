import { Button, Card, CardActions, CardContent, CardHeader, CircularProgress, FormControl, FormHelperText, Grid, TextField } from "@mui/material"
import { Controller, useForm } from 'react-hook-form'
import { FormInputs } from './../../interfaces/formImputs.interfaces'

import TipoSolicitud from '../../components/autocomplete/TipoSolicitud'
import CodigoProveedor from '../../components/autocomplete/CodigoProveedor'
import UnidadSolicitante from '../../components/autocomplete/UnidadSolicitante'

import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { useSelector } from "react-redux"
import { RootState } from "src/store"

import dayjs from 'dayjs'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'

import useServices from '../../services/useServices'
import { Create } from '../../interfaces/create.interfaces'
import { useState } from "react"
import { IFechaDto } from "src/interfaces/fecha-dto";

const FormCreateSolCompromiso = ({popperPlacement}: {popperPlacement: ReactDatePickerProps['popperPlacement']}) => {
    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)
    const { loading, crearSolicitudCompromiso } = useServices()
    const [fecha, setFecha] = useState<IFechaDto>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
    })

    const defaultValues: FormInputs = {
        codigoSolicitud: 0,
        numeroSolicitud: '',
        fechaSolicitud: new Date(),
        codigoSolicitante: 0,
        tipoSolicitudId: 0,
        codigoProveedor: 0,
        motivo: '',
        nota: '',
        status: '',
        codigoPresupuesto: 0,
        fechaSolicitudString: '',
        descripcionStatus: '',
    }

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({ defaultValues })

    const handleCodigoSolicitanteChange = (codigoSolicitante: number) => {
        setValue('codigoSolicitante', codigoSolicitante)
    }

    const handleTipoSolicitudChange = (tipoSolicitudId: number) => {
        setValue('tipoSolicitudId', tipoSolicitudId)
    }

    const handleCodigoProveedorChange = (codigoProveedor: number) => {
        setValue('codigoProveedor', codigoProveedor)
    }

    const handleFechaSolicitudChange: any = (desde: Date) => {
        const dateIsValid = dayjs(desde).isValid()
        if (dateIsValid) {
            const fechaObj: any = fechaToFechaObj(desde)
            setFecha(fechaObj)
            setValue('fechaSolicitud', fechaObj)
            setValue('fechaSolicitudString', desde.toISOString())
        }
    }

    const onSubmit = async (dataForm: FormInputs) => {
        try {
            const solicitudCompromisoCreate: Create = {
                codigoSolicitud: dataForm.codigoSolicitud,
                numeroSolicitud: dataForm.numeroSolicitud,
                fechaSolicitud: new Date(dataForm.fechaSolicitudString),
                codigoSolicitante: dataForm.codigoSolicitante,
                tipoSolicitudId: dataForm.tipoSolicitudId,
                codigoProveedor: dataForm.codigoProveedor,
                motivo: dataForm.motivo,
                nota: dataForm.nota,
                status: dataForm.status,
                codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto
            }

            const responseCreate = await crearSolicitudCompromiso(solicitudCompromisoCreate)

            if (responseCreate?.data.isValid) {
                console.log('Solicitud de Compromiso Creada')
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Card>
            <CardHeader title='Adm - Crear Solicitud Compromiso' />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={3} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='codigoSolicitud'
                                    control={control}
                                    rules={{
                                        required: true,
                                        min: 1,
                                        validate: (value) => value >= 0
                                    }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            type='number'
                                            value={value || ''}
                                            label="Codigo de Solicitud"
                                            onChange={onChange}
                                            placeholder='Codigo de Solicitud'
                                            error={Boolean(errors.codigoSolicitud )}
                                            aria-describedby='validation-async-codigoSolicitud'
                                            inputProps={{ min: 0 }}
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
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Estado de la Solicitud"
                                            onChange={onChange}
                                            placeholder='Estado de la Solicitud'
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <DatePickerWrapper>
                                <DatePicker
                                    selected={getDateByObject(fecha)}
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
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={7} xs={12}>
                            <UnidadSolicitante
                                id={0}
                                onSelectionChange={handleCodigoSolicitanteChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={5} xs={12}>
                            <TipoSolicitud
                                data={0}
                                onSelectionChange={handleTipoSolicitudChange}
                            />
                        </Grid>
                        <Grid item sm={7} xs={12}>
                            <CodigoProveedor
                                data={0}
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
                    </CardActions>
                </form>
            </CardContent>
        </Card>
    )
}

export default FormCreateSolCompromiso