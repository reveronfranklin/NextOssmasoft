import { Box, Grid, TextField, FormControl, Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, CircularProgress,
Checkbox, FormControlLabel } from "@mui/material"
import { useEffect, useState, useRef } from "react"
import { Controller, useForm } from 'react-hook-form'
import FormaPago from '../components/AutoComplete/FormaPago'
import TipoOrden from '../components/AutoComplete/TipoOrden'
import FrecuenciaPago from '../components/AutoComplete/FrecuenciaPago'
import { CleaningServices } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import dayjs from 'dayjs'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { useDispatch } from 'react-redux'
import { setCompromisoSeleccionadoDetalle, resetCompromisoSeleccionadoDetalle } from 'src/store/apps/ordenPago'
import useServicesDocumentosOp from './../services/useServicesDocumentosOp'
import { ButtonWithConfirm } from "src/views/components/buttons/ButtonsWithConfirm"

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Para aprobar
import BlockIcon from '@mui/icons-material/Block'; // Para anular
import SettingsIcon from '@mui/icons-material/Settings'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'

import MensajeCompromiso from './mensajeCompromiso'

export interface FormInputs {
    codigoOrdenPago: number,
    estatusText: string,
    iva: number ,
    islr: number,
    fechaOrdenPagoString: string | Date,
    origenDescripcion: string,
    tipoPagoId: number,
    tipoOrdenId: number,
    frecuenciaPagoId: number,
    cantidadPago: number,
    fecha: string,
    nombreProveedor: string,
    plazoPagoDesde: number,
    plazoPagoHasta: number,
    motivo: string,
    numeroOrdenPago: number | string,
    conFactura: boolean
}
export interface IFechaDto {
    year: string | number;
    month: string | number;
    day: string | number;
}

const FormOrdenPago = (props: {
        modo?: string,
        orden?: any,
        onFormData: any,
        onFormClear?: any,
        handleGestionOrdenPago?: any,
        onViewerPdf?: any,
        titleButton?: string,
        message?: IAlertMessageDto,
        loading?: boolean
    }) => {

    const {
        modo,
        orden,
        onFormData,
        handleGestionOrdenPago,
        titleButton,
        onViewerPdf,
        loading,
        onFormClear,
    } = props

    const { getListDocumentos } = useServicesDocumentosOp()

    const [tipoOrdenPagoId, setTipoOrdenPago] = useState<number>(0)
    const [tipoPagoId, setTipoPagoId] = useState<number>(0)
    const [frecuenciaPagoId, setFrecuenciaPagoId] = useState<number>(0)

    const [ordenLocal, setOrdenLocal] = useState<any>(orden)

    const [open, setOpen] = useState<boolean>(false)
    const [fecha] = useState<IFechaDto>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
    })

    const [fechaOrdenPago, setFechaOrdenPago] = useState<IFechaDto>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
    })

    const defaultValues: any = {
        codigoOrdenPago: 0,
        estatusText: '',
        frecuenciaPagoId: 0,
        tipoPagoId: 0,
        tipoOrdenId: 0,        iva: 0,
        numeroOrdenPago: 0,
        islr: 0,
        fechaOrdenPagoString: '',
        origenDescripcion: '',
        cantidadPago: 1,
        fecha: '',
        plazoPagoDesde: 0,
        plazoPagoHasta: 0,
        nombreProveedor: '',
        motivo: '',
        conFactura: false
    }

    const autocompleteRef = useRef()
    const dispatch = useDispatch()
    const { typeOperation, documentCount } = useSelector((state: RootState) => state.admOrdenPago)

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isValid }
    } = useForm<FormInputs>({
        defaultValues,
        mode: 'onChange'
    })

    const onSubmit = async (data: FormInputs) => {
        onFormData({ ...data })
    }

    useEffect(() => {
        if (typeOperation !== 'update') {
            dispatch(resetCompromisoSeleccionadoDetalle())
        }
    }, [])

    useEffect(() => {
        if (orden && orden.codigoOrdenPago) {
            getListDocumentos({ codigoOrdenPago: orden.codigoOrdenPago });
        }
    }, [orden, documentCount])

    const handleTipoOrden = (tipoOrden: any) => {
        setValue('tipoOrdenId', tipoOrden.id)
        setTipoOrdenPago(tipoOrden.id)
    }

    const handleFormaPago = (formaPago: any) => {
        setValue('tipoPagoId', formaPago.id)
        setTipoPagoId(formaPago.id)
    }

    const handleFrecuenciaPago = (frecuenciaPago: any) => {
        setValue('frecuenciaPagoId', frecuenciaPago.id)
        setFrecuenciaPagoId(frecuenciaPago.id)
    }

    const handleDialogOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleFechaSolicitudChange = (fecha: Date | null) => {
        if (fecha && dayjs(fecha).isValid()) {
            const fechaOrdenPagoObj = fechaToFechaObj(fecha)
            const fechaOrdenPagoString = dayjs(fecha).format('DD/MM/YYYY')
            const fechaOrdenPago = dayjs(fecha).format('YYYY-MM-DDTHH:mm:ss')

            const ordenNew: any = {
                ...orden,
                fechaOrdenPagoObj,
                fechaOrdenPagoString,
                fechaOrdenPago
            }

            dispatch(setCompromisoSeleccionadoDetalle(ordenNew))
            setValue('fechaOrdenPagoString', fechaOrdenPagoString.toString())
        }
    }

    useEffect(() => {
        if (orden && Object.keys(orden).length) {
            if (typeOperation === 'update') {
                setValue('estatusText', orden.estatusText ?? '')
            }

            setValue('origenDescripcion', orden.origenDescripcion ? orden.origenDescripcion : orden.descripcionTipoOrdenPago)
            setValue('cantidadPago', orden.cantidadPago ?? 1)
            setValue('nombreProveedor', orden.nombreProveedor ?? '')
            setValue('motivo', orden.motivo ?? '')
            setValue('numeroOrdenPago', Number(orden.numeroOrdenPago) ?? 0)
            setValue('fechaOrdenPagoString', orden.fechaOrdenPagoString ?? null, { shouldValidate: true })
            setValue('tipoPagoId', orden.tipoPagoId ?? 0)
            setValue('tipoOrdenId', orden.tipoOrdenId ?? 0)
            setValue('frecuenciaPagoId', orden.frecuenciaPagoId ?? 0)
            setValue('conFactura', orden.conFactura ?? false)

            setFechaOrdenPago(orden.fechaOrdenPagoObj)

            setTipoPagoId(orden.tipoPagoId)
            setTipoOrdenPago(orden.tipoOrdenPagoId)
            setFrecuenciaPagoId(orden.frecuenciaPagoId)
        }

        if (open && !loading) handleClose()
    }, [orden, loading, setValue ])

    useEffect(() => {
        if (modo === 'creacion' && !orden) {
            setOrdenLocal({})
        } else {
            setOrdenLocal(orden)
        }
    }, [modo, orden])

    const getActionIcon = (actionName: string) => {
        switch (actionName?.toLowerCase()) {
            case 'aprobar': return <CheckCircleIcon />
            case 'anular': return <BlockIcon />
            default: return <SettingsIcon />
        }
    }

    return (
        <Box>
            { Object.keys(ordenLocal || {}).length > 0 ?
                <form>
                    <Grid container spacing={0} paddingTop={0} paddingBottom={0} justifyContent="flex">
                        <Grid item xs={12} sx={{ paddingTop: 1 }}>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="conFactura"
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <Checkbox
                                                checked={value}
                                                onChange={() => setValue('conFactura', !value)}
                                                color='primary'
                                                size='small'
                                                disabled={ typeOperation === 'create' ? false : documentCount >= 1 }
                                            />
                                        )}
                                    />
                                }
                                label={ true ? 'con Factura' : 'sin Factura' }
                            />
                        </Grid>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={6}>
                                <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name="estatusText"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    fullWidth
                                                    label="Estatus"
                                                    placeholder="Estatus"
                                                    value={value || ''}
                                                    rows={6}
                                                    multiline
                                                    onChange={onChange}
                                                    disabled={true}
                                                    error={!!errors.estatusText}
                                                    helperText={errors.estatusText?.message}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid container item justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                                    <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                    </Grid>
                                </Grid>
                                <Grid container item justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ paddingTop: '5px' }}>
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
                                </Grid>
                                <Grid container item justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ paddingTop: '5px' }}>
                                    <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                        { typeOperation === 'update' ? (
                                            <FormControl fullWidth>
                                                <DatePickerWrapper>
                                                    <DatePicker
                                                        selected={fechaOrdenPago ? getDateByObject(fechaOrdenPago) : null}
                                                        id='date-time-picker-desde'
                                                        dateFormat='dd/MM/yyyy'
                                                        onChange={(date: Date) => { handleFechaSolicitudChange(date) }}
                                                        placeholderText='Fecha de la orden'
                                                        customInput={<CustomInput label='Fecha Orden Pago' />}
                                                    />
                                                </DatePickerWrapper>
                                            </FormControl>
                                        ) : null }
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Grid item sm={12} xs={12} sx={{ paddingTop: '5px' }}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name="origenDescripcion"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    fullWidth
                                                    label="Origen de compromiso"
                                                    placeholder="Origen de compromiso"
                                                    value={value || ''}
                                                    onChange={onChange}
                                                    disabled={true}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={12} xs={12} sx={{ paddingTop: '10px' }}>
                                    <TipoOrden
                                        id={tipoOrdenPagoId}
                                        autocompleteRef={autocompleteRef}
                                        onSelectionChange={handleTipoOrden}
                                    />
                                </Grid>
                                <Grid item sm={12} xs={12} sx={{ paddingTop: '10px' }}>
                                    <FormaPago
                                        id={tipoPagoId}
                                        autocompleteRef={autocompleteRef}
                                        onSelectionChange={handleFormaPago}
                                    />
                                </Grid>
                                <Grid item sm={12} xs={12} sx={{ paddingTop: '10px' }}>
                                    <FrecuenciaPago
                                        id={frecuenciaPagoId}
                                        autocompleteRef={autocompleteRef}
                                        onSelectionChange={handleFrecuenciaPago}
                                    />
                                </Grid>
                                <Grid container item direction="row" sm={12} xs={12} sx={{ paddingTop: '5px' }}>
                                    <Grid item sm={6} xs={12} sx={{ paddingTop: '5px', paddingRight: '5px' }}>
                                        <FormControl fullWidth>
                                            <Controller
                                                name="cantidadPago"
                                                control={control}
                                                defaultValue={1}
                                                render={({ field: { value } }) => (
                                                    <TextField
                                                        fullWidth
                                                        label="N°"
                                                        value={value}
                                                        disabled
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={6} xs={12} sx={{ paddingTop: '5px' }}>
                                        <FormControl fullWidth>
                                            <Controller
                                                name="cantidadPago"
                                                control={control}
                                                defaultValue={1}
                                                render={({ field: { value } }) => (
                                                    <TextField
                                                        fullWidth
                                                        label="N°"
                                                        value={value}
                                                        disabled
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container item direction="row" sm={12} xs={12} sx={{ paddingTop: '5px' }}>
                                    {typeOperation === 'update' && (
                                        <>
                                            <Grid item sm={6} xs={12} sx={{ paddingTop: '5px', paddingRight: '5px' }}>
                                                <FormControl fullWidth>
                                                    <DatePickerWrapper>
                                                        <DatePicker
                                                            selected={fecha ? getDateByObject(fecha) : null}
                                                            id='date-time-picker-desde'
                                                            dateFormat='dd/MM/yyyy'
                                                            onChange={(date: Date) => { handleFechaSolicitudChange(date) }}
                                                            placeholderText='Plazo de Pago Desde'
                                                            customInput={<CustomInput label='Plazo de Pago Desde' />}
                                                            disabled={true}
                                                        />
                                                    </DatePickerWrapper>
                                                </FormControl>
                                            </Grid>
                                            <Grid item sm={6} xs={12} sx={{ paddingTop: '5px' }}>
                                                <FormControl fullWidth>
                                                    <DatePickerWrapper>
                                                        <DatePicker
                                                            selected={fecha ? getDateByObject(fecha) : null}
                                                            id='date-time-picker-hasta'
                                                            dateFormat='dd/MM/yyyy'
                                                            onChange={(date: Date) => { handleFechaSolicitudChange(date) }}
                                                            placeholderText='Plazo de Pago Hasta'
                                                            customInput={<CustomInput label='Plazo de Pago Hasta' />}
                                                            disabled={true}
                                                        />
                                                    </DatePickerWrapper>
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item sm={12} xs={12} sx={{ paddingTop: '15px' }}>
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
                            <Grid item sm={12} xs={12} sx={{ paddingTop: '15px' }}>
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
                                                rows={8}
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
                    <Box sx={{ paddingTop: 6 }}>
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
                        { typeOperation === 'update' && (
                            <Button
                                color='primary'
                                size='small'
                                onClick={onViewerPdf}
                            >
                                <PictureAsPdfIcon />
                                VER PDF
                            </Button>
                        )}
                        { handleGestionOrdenPago?.showButton && (
                            <span>
                                <ButtonWithConfirm
                                    color="primary"
                                    onAction={() => handleGestionOrdenPago?.handle()}
                                    confirmMessage={handleGestionOrdenPago?.message}
                                    showLoading={true}
                                    disableBackdropClick={true}
                                    startIcon={getActionIcon(handleGestionOrdenPago?.nameButton)}
                                    sx={{ minWidth: '120px' }}
                                >
                                    {handleGestionOrdenPago?.nameButton}
                                </ButtonWithConfirm>
                            </span>
                        )}
                    </Box>
                </form> : <MensajeCompromiso />
            }
        </Box>
    )
}

export default FormOrdenPago