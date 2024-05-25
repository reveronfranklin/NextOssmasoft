import { Card, CardContent, CardHeader, FormControl, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { Controller, useForm } from 'react-hook-form'
import { FormInputs  } from './../../interfaces/formImputs.interfaces'

// import TipoSolicitud from '../../components/TipoSolicitud'

const FormUpdateSolCompromiso = () => {
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
        codigoPresupuesto
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

    const { control, handleSubmit } = useForm<FormInputs>({ defaultValues })

    return (
        <Card>
            <CardHeader title='Adm - Modificar Solicitud Compromiso' />
            <CardContent>
                <form onSubmit={handleSubmit(() => { alert('enviar el form')})}>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={4} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='codigoSolicitud'
                                    control={control}
                                    render={({ field: {value, onChange} }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Codigo de Solicitud"
                                            onChange={onChange}
                                            placeholder='Codigo de Solicitud'
                                            disabled
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={4} xs={12}>
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
                                            disabled
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='fechaSolicitud'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Fecha de Solicitud"
                                            onChange={onChange}
                                            placeholder='Numero de Solicitud'
                                            disabled
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
                        {/* <TipoSolicitud /> */}
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
                                            disabled
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='tipoSolicitudId'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Tipo de Solicitud"
                                            onChange={onChange}
                                            placeholder='Tipo de Solicitud'
                                            disabled
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='codigoProveedor'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Codigo de Proveedor"
                                            onChange={onChange}
                                            placeholder='Codigo de Proveedor'
                                            disabled
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={12}>
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
                                            disabled
                                        />
                                    )}
                                />
                            </FormControl>
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
                </form>
            </CardContent>
        </Card>
    )
}

export default FormUpdateSolCompromiso