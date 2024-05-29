import { Button, Card, CardActions, CardContent, CardHeader, FormControl, Grid, TextField } from "@mui/material"
import { Controller, useForm } from 'react-hook-form'
import { FormInputs } from './../../interfaces/formImputs.interfaces'

import TipoSolicitud from '../../components/autocomplete/TipoSolicitud'
import CodigoProveedor from '../../components/autocomplete/CodigoProveedor'

import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { getDateByObject } from 'src/utilities/ge-date-by-object'

const FormCreateSolCompromiso = ({popperPlacement}: {popperPlacement: ReactDatePickerProps['popperPlacement']}) => {
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
            // const route = '/Create'
            //const responseAll = await ossmmasofApi.post<any>(route, data)
            setTimeout(() => {
                console.log(dataForm)
            }, 2000);
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
                        <Grid item sm={4} xs={12}>
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
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={3} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='codigoSolicitante'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Codigo de Solicitante"
                                            onChange={onChange}
                                            placeholder='Codigo de Solicitante'
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={5} xs={12}>
                            <TipoSolicitud
                                data={0}
                                onSelectionChange={handleTipoSolicitudChange}
                            />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='codigoPresupuesto'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Codigo de Presupuesto"
                                            onChange={onChange}
                                            placeholder='Codigo de Presupuesto'
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12}>
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
                        <Grid item sm={6} xs={12}>
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
                                            rows={4}
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
                    </Grid>
                    <CardActions sx={{ justifyContent: 'end', paddingRight: 0 }}>
                        <Button type='submit' variant="contained">Crear</Button>
                    </CardActions>
                </form>
            </CardContent>
        </Card>
    )
}

export default FormCreateSolCompromiso