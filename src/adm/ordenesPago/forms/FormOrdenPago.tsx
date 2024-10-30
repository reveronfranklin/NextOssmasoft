import { Box, Grid, TextField, FormControl, Button, FormHelperText, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, CircularProgress } from "@mui/material"
import { useEffect, useState, useRef } from "react"
import { Controller, useForm } from 'react-hook-form'
import FormaPago from '../components/AutoComplete/FormaPago'
import FrecuenciaPago from '../components/AutoComplete/FrecuenciaPago'
import { CleaningServices } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import dayjs from 'dayjs'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
export interface FormInputs {
    codigoOrdenPago: number,
    descripcionStatus: string,
    iva: number ,
    islr: number,
    fechaOrdenPagoString: string | Date,
    origenDescripcion: string,
    formaPago: number,
    frecuenciaPago: number,
    cantidadPago: number,
    fecha: string,
    nombreProveedor: string,
    plazoPagoDesde: number,
    plazoPagoHasta: number,
    motivo: string,
    numeroOrdenPago: number | string
}

export interface IFechaDto {
    year: string | number;
    month: string | number;
    day: string | number;
}

const FormOrdenPago = (props: { orden?: any, onFormData: any, onFormClear?: any, titleButton?: string, message?: string, loading?: boolean }) => {
    const { orden, onFormData, titleButton, message, loading, onFormClear } = props
    const [open, setOpen] = useState<boolean>(false)
    const [fecha, setFecha] = useState<IFechaDto>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
    })

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
        plazoPagoDesde: 0,
        plazoPagoHasta: 0,
        nombreProveedor: '',
        motivo: '',
    }

    const { typeOperation } = useSelector((state: RootState) => state.admOrdenPago)
    const autocompleteRef = useRef()

    const { control, handleSubmit, setValue, formState: { errors, isValid } } = useForm<FormInputs>({
        defaultValues,
        mode: 'onChange'
    })

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

    const handleFechaSolicitudChange = (fecha: Date | null) => {
        if (fecha && dayjs(fecha).isValid()) {
            const fechaFormat = dayjs(fecha).format('YYYY-MM-DDTHH:mm:ss')
            setValue('fechaOrdenPagoString', fechaFormat, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            })
        } else {
            setValue('fechaOrdenPagoString', '', {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            })
        }
    }

    useEffect(() => {
        console.log('ORDEN', orden)

        if (orden) {
            setValue('descripcionStatus', orden.descripcionStatus ?? '')
            setValue('origenDescripcion', orden.origenDescripcion ? orden.origenDescripcion : orden.descripcionTipoOrdenPago)
            setValue('cantidadPago', orden.cantidadPago ?? 0)
            setValue('nombreProveedor', orden.nombreProveedor ?? '')
            setValue('motivo', orden.motivo ?? '')
            setValue('numeroOrdenPago', Number(orden.numeroOrdenPago) ?? 0)
            setValue('fechaOrdenPagoString', orden.fechaOrdenPagoString ?? null, { shouldValidate: true });
        }

        if (open && !loading) handleClose()
    }, [orden, loading, setValue ])

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
                                            error={!!errors.descripcionStatus}
                                            helperText={errors.descripcionStatus?.message}
                                        />
                                    )}
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
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                {(typeOperation === 'update') ? <FormControl fullWidth>
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
                                { typeOperation === 'update' ? (
                                    <FormControl fullWidth>
                                        <DatePickerWrapper>
                                            <DatePicker
                                                selected={getDateByObject(orden.fechaOrdenPagoObj)}
                                                id='date-time-picker-desde'
                                                dateFormat='dd/MM/yyyy'
                                                onChange={(date: Date) => { handleFechaSolicitudChange(date) }}
                                                placeholderText='Fecha de la orden'
                                                customInput={<CustomInput label='Fecha Solicitud' />}
                                            />
                                        </DatePickerWrapper>
                                    </FormControl>
                                ) : null }
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
                                autocompleteRef={autocompleteRef}
                                onSelectionChange={(value: any) => { handleFormaPago(value.id) }} />
                        </Grid>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <FrecuenciaPago
                                id={orden?.frecuenciaPagoId ?? ''}
                                autocompleteRef={autocompleteRef}
                                onSelectionChange={(value: any) => { handleFrecuenciaPago(value.id) }} />
                        </Grid>
                        <Grid container direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="cantidadPago"
                                        control={control}
                                        rules={{ required: 'Estatus is required' }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Cantidad de Pagos"
                                                placeholder="Cantidad de Pagos"
                                                value={value || ''}
                                                onChange={onChange}
                                                error={!!errors.cantidadPago}
                                                helperText={errors.cantidadPago?.message}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="cantidadPago"
                                        control={control}
                                        rules={{ required: 'Este campo es requerido' }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="N°"
                                                placeholder="N°"
                                                value={value || ''}
                                                onChange={onChange}
                                                error={!!errors.cantidadPago}
                                                helperText={errors.cantidadPago?.message}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <DatePickerWrapper>
                                        <DatePicker
                                            selected={getDateByObject(fecha)}
                                            id='date-time-picker-desde'
                                            dateFormat='dd/MM/yyyy'
                                            onChange={(date: Date) => { handleFechaSolicitudChange(date) }}
                                            placeholderText='Plazo de Pago Desde'
                                            customInput={<CustomInput label='Plazo de Pago Desde' />}
                                        />
                                    </DatePickerWrapper>
                                </FormControl>
                            </Grid>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <DatePickerWrapper>
                                        <DatePicker
                                            selected={getDateByObject(fecha)}
                                            id='date-time-picker-hasta'
                                            dateFormat='dd/MM/yyyy'
                                            onChange={(date: Date) => { handleFechaSolicitudChange(date) }}
                                            placeholderText='Plazo de Pago Hasta'
                                            customInput={<CustomInput label='Plazo de Pago Hasta' />}
                                        />
                                    </DatePickerWrapper>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container sm={12} xs={12}>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <FormControl fullWidth>
                                <Controller
                                    name="nombreProveedor"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field: { value } }) => (
                                        <TextField
                                            fullWidth
                                            label="Proveedor"
                                            placeholder="Proveedor"
                                            value={value || ''}
                                            disabled={true}
                                            error={!!errors.nombreProveedor}
                                            helperText={errors.nombreProveedor?.message}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <FormControl fullWidth>
                                <Controller
                                    name="motivo"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            fullWidth
                                            label="Motivo"
                                            placeholder="Motivo"
                                            value={value || ''}
                                            multiline
                                            rows={6}
                                            onChange={onChange}
                                            error={!!errors.motivo}
                                            helperText={errors.motivo?.message}
                                        />
                                    )}
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
                    disabled={!isValid}
                >
                    { titleButton }
                </Button>
                <Button
                    color='primary'
                    size='small'
                    onClick={onFormClear}
                >
                    <CleaningServices /> Limpiar
                </Button>
                <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{message}</FormHelperText>
            </form>
        </Box>
    )
}

export default FormOrdenPago