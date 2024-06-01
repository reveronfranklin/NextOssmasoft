import { Button, Card, CardActions, CardContent, CardHeader, CircularProgress, FormControl, Grid, TextField } from "@mui/material"
import { Controller, useForm } from 'react-hook-form'
import { FormInputs } from './../../interfaces/formImputs.interfaces'

import TipoSolicitud from '../../components/autocomplete/TipoSolicitud'
import CodigoProveedor from '../../components/autocomplete/CodigoProveedor'
import UnidadSolicitante from '../../components/autocomplete/UnidadSolicitante'


import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'

import useServices from '../../services/useServices'

const FormCreateSolCompromiso = ({popperPlacement}: {popperPlacement: ReactDatePickerProps['popperPlacement']}) => {
    const { loading, crearSolicitudCompromiso } = useServices()
    const defaultValues: FormInputs = {
        codigoSolicitud: 0,
        numeroSolicitud: '',
        fechaSolicitud : new Date(),
        codigoSolicitante : 0,
        tipoSolicitudId : 0,
        codigoProveedor : 0,
        motivo : '',
        nota : '',
        status : '',
        codigoPresupuesto : 0
    }

    const { control, handleSubmit, setValue } = useForm<FormInputs>({ defaultValues })

    const handleTipoSolicitudChange = (tipoSolicitudId: number) => {
        setValue('tipoSolicitudId', tipoSolicitudId)
    }

    const handleCodigoProveedorChange = (codigoProveedor: number) => {
        setValue('codigoProveedor', codigoProveedor)
    }

    const onSubmit = async (dataForm: FormInputs) => {
        try {
            const create: any = {
                CodigoSolicitud: dataForm.codigoSolicitud,
                NumeroSolicitud: dataForm.numeroSolicitud,
                FechaSolicitud: fechaToFechaObj(dataForm.fechaSolicitud),
                CodigoSolicitante: dataForm.codigoSolicitante,
                TipoSolicitudId: dataForm.tipoSolicitudId,
                CodigoProveedor: dataForm.codigoProveedor,
                Motivo: dataForm.motivo,
                Nota: dataForm.nota,
                Status: dataForm.status,
                CodigoPresupuesto: dataForm.codigoPresupuesto
            }
            await crearSolicitudCompromiso(create)
        } catch (e) {
            console.log(e)
        }
    }

    const fecha = {
        year: '2024',
        month: '05',
        day: '27'
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
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Codigo de Solicitud"
                                            onChange={onChange}
                                            placeholder='Codigo de Solicitud'
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
                                    onChange={(date: Date) => { alert(date)}}
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
                            <UnidadSolicitante />
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