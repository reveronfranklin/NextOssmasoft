import { useState, useEffect } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import {
    Box,
    Grid,
    TextField,
    FormControl,
    Button
} from '@mui/material';

import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import getRules from './rules';

import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { RootState } from 'src/store';
import { PreOrdenPagoDto, FechaEmisionDto } from '../../../interfaces';
import { setIsOpenDialogPreOrdenPago, resetPreOrdenPagoShow } from 'src/store/apps/preOrdenPago'
import { useServices } from '../../../services';

const StyledCustomInput = styled(TextField)(() => ({
    width: '100%'
}))

const FormUpdate = () => {
    const [isFormEnabled, setIsFormEnabled]         = useState<boolean>(true)
    const [dialogOpen, setDialogOpen]               = useState<boolean>(false)
    const [dialogDeleteOpen, setDialogDeleteOpen]   = useState<boolean>(false)

    const [fechaEmisionObj, setFechaEmisionObj] = useState<FechaEmisionDto>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
    })

    const dispatch          = useDispatch()
    const qc: QueryClient   = useQueryClient()
    const { preOrdenPago }  = useSelector((state: RootState) => state.admPreOrdenPago )
    const rules             = getRules()

    const {
        message,
        loading
    } = useServices()

    type FacturaField =
        | 'baseImponible'
        | 'iva'
        | 'montoTotal'
        | 'excento'

    const defaultValues: PreOrdenPagoDto = {
        id: preOrdenPago?.id || 0,
        nombreEmisor: preOrdenPago?.nombreEmisor || '',
        direccionEmisor: preOrdenPago?.direccionEmisor || '',
        rif: preOrdenPago?.rif || '',
        numeroFactura: preOrdenPago?.numeroFactura || '',
        fechaEmision: preOrdenPago?.fechaEmision || new Date(),
        baseImponible: preOrdenPago?.baseImponible || 0,
        porcentajeIva: preOrdenPago?.porcentajeIva || 0,
        iva: preOrdenPago?.iva || 0,
        montoTotal: preOrdenPago?.montoTotal || 0,
        excento: preOrdenPago?.excento || 0
    }

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid }
    } = useForm<PreOrdenPagoDto>({
        defaultValues,
        mode: 'onChange'
    })

    const formattedDate = (date: any) => {
        return moment(date).toDate()
    }

    const handleOnChangeAmount = (amount: string, field: FacturaField) => {
        const formattedTotal = parseFloat(amount) || 0

        /* setMonto(formattedTotal) */

        setValue(field, formattedTotal)
    }

    useEffect(() => {
        const resultFormattedDate   = formattedDate(preOrdenPago?.fechaEmision)
        const objectDate            = fechaToFechaObj(resultFormattedDate)

        setFechaEmisionObj(objectDate)
    }, [preOrdenPago, qc])

    const handleOpenDialog = () => { setDialogOpen(true) }
    const handleCloseDialog = () => { setDialogOpen(false) }
    const handleOpenDialogDelete = () => { setDialogDeleteOpen(true) }
    const handleCloseDialogDelete = () => { setDialogDeleteOpen(false) }

    const handleFechaEmisionChange = (date: Date | null) => {
        if (date && dayjs(date).isValid()) {
            const fechaEmisionObjFormatted  = fechaToFechaObj(date)
            const fechaEmisionFormatted     = formattedDate(date)

            setValue('fechaEmision', fechaEmisionFormatted)
            setFechaEmisionObj(fechaEmisionObjFormatted)
        }
    }

    const handleUpdatePreOrdenPago = async (data: PreOrdenPagoDto) => {
        console.log('Data to update PreOrdenPago:', data);

        setDialogOpen(false);
        setIsFormEnabled(true);

        // Lógica de actualización (ejemplo comentado)
        /* await updatePreOrdenPago(data);
        qc.invalidateQueries(['preOrdenPagoTable']); */
    }

    const handleDelete = async () => {
        setDialogDeleteOpen(false);
        dispatch(setIsOpenDialogPreOrdenPago(false))

        // Lógica de eliminación (ejemplo comentado)
        /* await deletePreOrdenPago(preOrdenPago.id);
        qc.invalidateQueries(['preOrdenPagoTable']); */
    }

    const clearDefaultValues = () => {
        const dateNow       = new Date()
        const dateFormatted = fechaToFechaObj(dateNow)

        setValue('id', 0)
        setValue('nombreEmisor', '')
        setValue('direccionEmisor', '')
        setValue('rif', '')
        setValue('numeroFactura', '')
        setValue('fechaEmision', dateNow)
        setFechaEmisionObj(dateFormatted)
        setValue('baseImponible', 0)
        setValue('porcentajeIva', 0)
        setValue('iva', 0)
        setValue('montoTotal', 0)
        setValue('excento', 0)
    }

    const handleClearPreOrdenPago = () => {
        dispatch(resetPreOrdenPagoShow())
        reset(defaultValues)
        clearDefaultValues()
    }

    return (
        <>
            <Grid container spacing={5} paddingTop={1}>
                <Grid
                    item
                    sm={12}
                    xs={12}
                    sx={{
                        overflow: 'auto',
                        padding: '0 1rem',
                    }}
                >
                    <Box>
                        {!!isFormEnabled ?
                            <form>
                                <Grid container spacing={0} paddingTop={0} paddingBottom={0} justifyContent="flex">
                                    <Grid container spacing={0} item sm={12} xs={12}>
                                        <Grid item sm={2} xs={2} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="id"
                                                    control={control}
                                                    render={({ field: { value } }) => (
                                                        <TextField
                                                            type="text"
                                                            fullWidth
                                                            label="ID de Pre-Orden"
                                                            value={value || ''}
                                                            disabled
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={2} xs={2} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="fechaEmision"
                                                    control={control}
                                                    rules={ rules.fechaEmision }
                                                    render={() => (
                                                        <DatePickerWrapper>
                                                            <DatePicker
                                                                selected={fechaEmisionObj ? getDateByObject(fechaEmisionObj) : null}
                                                                id='date-time-picker-emision'
                                                                dateFormat='dd/MM/yyyy'
                                                                onChange={(date: Date) => { handleFechaEmisionChange(date) }}
                                                                placeholderText='Fecha de Emisión'
                                                                customInput={<CustomInput label='Fecha de Emisión' />}
                                                                popperPlacement='left-start'
                                                                required
                                                            />
                                                        </DatePickerWrapper>
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={4} xs={4} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="numeroFactura"
                                                    control={control}
                                                    rules={ rules.numeroFactura }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="text"
                                                            fullWidth
                                                            label="Número de Factura"
                                                            value={value || ''}
                                                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                            error={!!errors.numeroFactura}
                                                            helperText={errors.numeroFactura?.message}
                                                            required
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={4} xs={4} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="rif"
                                                    control={control}
                                                    rules={ rules.rif }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="text"
                                                            fullWidth
                                                            label="RIF"
                                                            value={value || ''}
                                                            onChange={(e) => onChange(e.target.value.toUpperCase())}
                                                            error={!!errors.rif}
                                                            helperText={errors.rif?.message}
                                                            required
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={0} item sm={12} xs={12}>
                                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="nombreEmisor"
                                                    control={control}
                                                    rules={ rules.nombreEmisor }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="text"
                                                            fullWidth
                                                            label="Nombre del Emisor"
                                                            value={value || ''}
                                                            onChange={onChange}
                                                            error={!!errors.nombreEmisor}
                                                            helperText={errors.nombreEmisor?.message}
                                                            required
                                                            autoFocus
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={0} item sm={12} xs={12}>
                                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="direccionEmisor"
                                                    control={control}
                                                    rules={ rules.direccionEmisor }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="text"
                                                            fullWidth
                                                            label="Dirección del Emisor"
                                                            value={value || ''}
                                                            onChange={onChange}
                                                            multiline
                                                            rows={3}
                                                            error={!!errors.direccionEmisor}
                                                            helperText={errors.direccionEmisor?.message}
                                                            required
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={0} item sm={12} xs={12}>
                                        <Grid item sm={1} xs={1} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="porcentajeIva"
                                                    control={control}
                                                    rules={ rules.porcentajeIva }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="number"
                                                            fullWidth
                                                            label="% IVA"
                                                            value={value || 0}
                                                            onChange={onChange}
                                                            error={!!errors.porcentajeIva}
                                                            helperText={errors.porcentajeIva?.message}
                                                            required
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={3} xs={3} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="iva"
                                                    control={control}
                                                    rules={ rules.iva }
                                                    render={({ field: { value } }) => (
                                                       <NumericFormat
                                                            value={value}
                                                            customInput={StyledCustomInput}
                                                            thousandSeparator="."
                                                            decimalSeparator=","
                                                            allowNegative={false}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            label="Monto IVA"
                                                            required
                                                            onFocus={(event) => {
                                                                event.target.select()
                                                            }}
                                                            onValueChange={(values: any) => {
                                                                const { value } = values
                                                                handleOnChangeAmount(value, 'baseImponible')
                                                            }}
                                                            placeholder='Monto'
                                                            inputProps={{
                                                                type: 'text',
                                                                onKeyDown: (event) => {
                                                                    if (event.key === 'Enter') {
                                                                        event.preventDefault()
                                                                    }
                                                                }
                                                            }}
                                                            error={!!errors.iva}
                                                            helperText={errors.iva?.message}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={3} xs={3} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="baseImponible"
                                                    control={control}
                                                    rules={ rules.baseImponible }
                                                    render={({ field: { value } }) => (
                                                        <NumericFormat
                                                            value={value}
                                                            customInput={StyledCustomInput}
                                                            thousandSeparator="."
                                                            decimalSeparator=","
                                                            allowNegative={false}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            label="Base Imponible"
                                                            required
                                                            onFocus={(event) => {
                                                                event.target.select()
                                                            }}
                                                            onValueChange={(values: any) => {
                                                                const { value } = values
                                                                handleOnChangeAmount(value, 'baseImponible')
                                                            }}
                                                            placeholder='Monto'
                                                            inputProps={{
                                                                type: 'text',
                                                                onKeyDown: (event) => {
                                                                    if (event.key === 'Enter') {
                                                                        event.preventDefault()
                                                                    }
                                                                }
                                                            }}
                                                            error={!!errors.baseImponible}
                                                            helperText={errors.baseImponible?.message}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={2} xs={2} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="excento"
                                                    control={control}
                                                    rules={ rules.excento }
                                                    render={({ field: { value } }) => (
                                                        <NumericFormat
                                                            value={value}
                                                            customInput={StyledCustomInput}
                                                            thousandSeparator="."
                                                            decimalSeparator=","
                                                            allowNegative={false}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            label="Monto Excento"
                                                            required
                                                            onFocus={(event) => {
                                                                event.target.select()
                                                            }}
                                                            onValueChange={(values: any) => {
                                                                const { value } = values
                                                                handleOnChangeAmount(value, 'excento')
                                                            }}
                                                            placeholder='Monto'
                                                            inputProps={{
                                                                type: 'text',
                                                                onKeyDown: (event) => {
                                                                    if (event.key === 'Enter') {
                                                                        event.preventDefault()
                                                                    }
                                                                }
                                                            }}
                                                            error={!!errors.excento}
                                                            helperText={errors.excento?.message}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={3} xs={3} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="montoTotal"
                                                    control={control}
                                                    rules={ rules.montoTotal }
                                                    render={({ field: { value } }) => (
                                                        <NumericFormat
                                                            value={value}
                                                            customInput={StyledCustomInput}
                                                            thousandSeparator="."
                                                            decimalSeparator=","
                                                            allowNegative={false}
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            label="Monto Total"
                                                            required
                                                            onFocus={(event) => {
                                                                event.target.select()
                                                            }}
                                                            onValueChange={(values: any) => {
                                                                const { value } = values
                                                                handleOnChangeAmount(value, 'montoTotal')
                                                            }}
                                                            placeholder='Monto'
                                                            inputProps={{
                                                                type: 'text',
                                                                onKeyDown: (event) => {
                                                                    if (event.key === 'Enter') {
                                                                        event.preventDefault()
                                                                    }
                                                                }
                                                            }}
                                                            error={!!errors.montoTotal}
                                                            helperText={errors.montoTotal?.message}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <DialogConfirmation
                                    open={dialogOpen}
                                    onClose={handleCloseDialog}
                                    onConfirm={handleSubmit(handleUpdatePreOrdenPago)}
                                    loading={loading}
                                    title="Actualizar Pre-Orden de Pago"
                                    content="¿Desea continuar con la actualización de este registro?"
                                />

                                <DialogConfirmation
                                    open={dialogDeleteOpen}
                                    onClose={handleCloseDialogDelete}
                                    onConfirm={handleDelete}
                                    loading={loading}
                                    title="Eliminar Pre-Orden de Pago"
                                    content="¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer."
                                />

                                <Box sx={{ paddingTop: 6 }}>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        onClick={handleOpenDialog}
                                        disabled={!isValid && loading}
                                    >
                                        Actualizar
                                    </Button>
                                    <Button
                                        sx={{ mx: 4 }}
                                        variant='outlined'
                                        size='small'
                                        onClick={handleOpenDialogDelete}
                                        disabled={!isValid && loading}
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        color='primary'
                                        size='small'
                                        onClick={handleClearPreOrdenPago}
                                    >
                                        <CleaningServices /> Limpiar
                                    </Button>
                                </Box>
                            </form>
                            : null
                        }
                    </Box>
                </Grid>
            </Grid>
            <AlertMessage
                message={message?.text ?? ''}
                severity={message?.isValid ? 'success' : 'error'}
                duration={8000}
                show={message?.text ? true : false}
            />
        </>
    )
}

export default FormUpdate