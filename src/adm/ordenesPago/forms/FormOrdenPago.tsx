import { useEffect, useState } from "react"
import { Box, Grid, TextField, FormControl, Button, FormHelperText, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, CircularProgress } from "@mui/material"
import { Controller, useForm } from 'react-hook-form'
import FormaPago from '../components/AutoComplete/FormaPago'
import FrecuenciaPago from '../components/AutoComplete/FrecuenciaPago'

export interface FormInputs {
    codigoOrdenPago: number,
    descripcionStatus: string,
    iva: number ,
    numeroOrdenPago: number,
    islr: number,
    fechaOrdenPagoString: string,
    origenDescripcion: string,
    formaPago: number,
    frecuenciaPago: number,
    cantidadPago: number,
    fecha: string,
    nombreProveedor: string,
    motivo: string
}

const FormOrdenPago = (props: { orden?: any, onFormData: any, titleButton?: string, message?: string, loading?: boolean, type?: any }) => {
    const { orden, onFormData, titleButton, message, loading } = props
    const [open, setOpen] = useState<boolean>(false)

    const defaultValues: any = {
        codigoOrdenPago: 0,
        descripcionStatus: '',
        frecuenciaPago: 0,
        formaPago: 0,
        iva: 0,
        numeroOrdenPago: 0,
        islr: 0,
        fechaOrdenPagoString: '',
        origenDescripcion: '',
        cantidadPago: 0,
        fecha: '',
        nombreProveedor: '',
        motivo: ''
    }

    const { control, handleSubmit, setValue, formState: { errors }} = useForm<FormInputs>({ defaultValues })

    const onSubmit = async (data: FormInputs) => {
        onFormData(data)
    }

    const handleFormaPago = (formaPagoId: number) => {
        setValue('formaPago', formaPagoId)
    }

    const handleFrecuenciaPago = (frecuenciaPagoId: number) => {
        setValue('frecuenciaPago', frecuenciaPagoId)
    }

    const handleDialogOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        if (orden) {
            setValue('descripcionStatus', orden.descripcionStatus ?? '')
            setValue('origenDescripcion', orden.origenDescripcion ? orden.origenDescripcion : orden.descripcionTipoOrdenPago)
            setValue('cantidadPago', orden.cantidadPago ?? 0)
            setValue('nombreProveedor', orden.nombreProveedor ?? '')
            setValue('motivo', orden.motivo ?? '')
        }

        if (open && !loading) handleClose()
    }, [orden, loading]);

    return (
        <Box>
            <form>
                <Grid container spacing={0} paddingTop={5} justifyContent="flex">
                    <Grid container sm={6} xs={12}>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <FormControl fullWidth>
                                <Controller
                                    name="descripcionStatus"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            fullWidth
                                            label="Estatus"
                                            placeholder="Estatus"
                                            value={value || ''}
                                            rows={4}
                                            multiline
                                            onChange={onChange}
                                            disabled={true}
                                            {...errors.descripcionStatus && {
                                                error: true,
                                                helperText: errors.descripcionStatus.message,
                                            }}
                                        />
                                    )}
                                    rules={{ required: 'Este campo es requerido' }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid container justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                            </Grid>
                            <Grid item sm={4} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="iva"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                value={value || ''}
                                                label="IVA"
                                                placeholder="IVA"
                                                onChange={onChange}
                                                disabled={true}
                                            />
                                        )}
                                        rules={{ required: 'Estatus is required' }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                { !true ? <FormControl fullWidth>
                                    <Controller
                                        name="numeroOrdenPago"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                disabled={true}
                                                fullWidth
                                                label="N° Orden de Pago"
                                                placeholder="N° Orden de Pago"
                                                value={value || ''}
                                                onChange={onChange}
                                            />
                                        )}
                                        rules={{ required: 'Estatus is required' }}
                                    />
                                </FormControl> : null }
                            </Grid>
                            <Grid item sm={4} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="islr"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                label="ISLR"
                                                placeholder="ISLR"
                                                value={value || ''}
                                                onChange={onChange}
                                                disabled={true}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="fechaOrdenPagoString"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Fecha de la orden"
                                                placeholder="Fecha de la orden"
                                                value={value || ''}
                                                onChange={onChange}
                                                disabled={true}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={4} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="TF"
                                    placeholder="TF"
                                    value={0}
                                    disabled={true}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container sm={6} xs={12}>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <FormControl fullWidth>
                                <Controller
                                    name="origenDescripcion"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            fullWidth
                                            label="Tipo de Orden"
                                            placeholder="Tipo de Orden"
                                            value={value || ''}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <FormaPago
                                id={orden?.tipoPagoId ?? ''}
                                onSelectionChange={(value: any) => { handleFormaPago(value.id) }} />
                        </Grid>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <FrecuenciaPago
                                id={orden?.frecuenciaPagoId ?? ''}
                                onSelectionChange={(value: any) => { handleFrecuenciaPago(value.id) }} />
                        </Grid>
                        <Grid container direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="cantidadPago"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Cantidad de Pagos"
                                                placeholder="Cantidad de Pagos"
                                                value={value || ''}
                                                onChange={onChange}
                                                {...errors.cantidadPago && {
                                                    error: true,
                                                    helperText: errors.cantidadPago.message,
                                                }}
                                            />
                                        )}
                                        rules={{ required: 'Estatus is required' }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="cantidadPago"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="N°"
                                                placeholder="N°"
                                                value={value || ''}
                                                onChange={onChange}
                                                {...errors.cantidadPago && {
                                                    error: true,
                                                    helperText: errors.cantidadPago.message,
                                                }}
                                            />
                                        )}
                                        rules={{ required: 'Este campo es requerido' }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="Plazo de Pago Desde"
                                    placeholder="Plazo de Pago Desde"
                                    value={0}
                                />
                            </Grid>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="Hasta"
                                    placeholder="Hasta"
                                    value={0}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container sm={12} xs={12}>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <FormControl fullWidth>
                                <Controller
                                    name="nombreProveedor"
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <TextField
                                            fullWidth
                                            label="Proveedor"
                                            placeholder="Proveedor"
                                            value={value || ''}
                                            disabled={true}
                                            {...errors.nombreProveedor && {
                                                error: true,
                                                helperText: errors.nombreProveedor.message,
                                            }}
                                        />
                                    )}
                                    rules={{ required: 'Estatus is required' }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <FormControl fullWidth>
                                <Controller
                                    name="motivo"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            fullWidth
                                            label="Motivo"
                                            placeholder="Motivo"
                                            value={value || ''}
                                            multiline
                                            rows={6}
                                            onChange={onChange}
                                            {...errors.motivo && {
                                                error: true,
                                                helperText: errors.motivo.message,
                                            }}
                                        />
                                    )}
                                    rules={{ required: 'Este campo es requerido' }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title'>
                        {'Esta usted seguro de realizar esta acción?'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>No</Button>
                        <Button
                            variant='contained'
                            color='primary'
                            size='small'
                            onClick={handleSubmit(onSubmit)}
                        >
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
                                    Espere un momento...
                                </>
                            ) : 'Si' }
                        </Button>
                    </DialogActions>
                </Dialog>
                <Button
                    variant='contained'
                    color='primary'
                    size='small'
                    onClick={handleDialogOpen}
                >
                    { titleButton }
                </Button>
                <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{message}</FormHelperText>
            </form>
        </Box>
    )
}

export default FormOrdenPago