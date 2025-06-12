import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
    Box,
    Grid,
    TextField,
    FormControl,
    Button
} from '@mui/material';

import { RootState } from 'src/store';
import { NumericFormat } from 'react-number-format';
import { useServicesPagos } from '../../../services';
import { setIsOpenDialogPago, resetPagoShow } from 'src/store/apps/pagos/lote-pagos'
import { PagoDto, PagoDeleteDto } from '../../../interfaces';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import useInvalidateReset from 'src/hooks/useInvalidateReset';
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import getRules from './rules';

const StyledCustomInput = styled(TextField)(() => ({
    width: '100%'
}))

const FormUpdateTwo = () => {
    const [monto, setMonto]                         = useState<number>(0)
    const [isFormEnabled, setIsFormEnabled]         = useState<boolean>(true)
    const [dialogOpen, setDialogOpen]               = useState(false)
    const [dialogDeleteOpen, setDialogDeleteOpen]   = useState<boolean>(false)

    const dispatch          = useDispatch()
    const invalidateReset   = useInvalidateReset()
    const rules             = getRules()
    const { pago }          = useSelector((state: RootState) => state.admLotePagos )

    const {
        update,
        remove,
        message,
        loading
    } = useServicesPagos()

    const defaultValues: PagoDto = {
        numeroOrdenPago: pago.numeroOrdenPago,
        codigoPago: pago.codigoPago,
        codigoBeneficiarioPago: pago.codigoBeneficiarioPago,
        monto: pago.monto,
        motivo: pago?.motivo ? pago.motivo.trim() : null
    }

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
        clearErrors,
        trigger,
        watch,
        getFieldState,
        formState: { errors, isValid }
    } = useForm<PagoDto>({
        defaultValues,
        mode: 'onChange'
    })

    const watchMonto = watch('monto')
    const stateMonto = getFieldState('monto')

    const setErrorMonto = () => {
        setError('monto', {
            type: 'manual',
            message: 'El monto debe ser mayor a 0. Por favor, ingrese un monto válido.'
        }, { shouldFocus: true })
    }

    useEffect(() => {
        setMonto(watchMonto || 0)
    }, [watchMonto, setMonto])

    useEffect(() => {
        if (monto <= 0) {
            setErrorMonto()
        } else {
            clearErrors('monto')
            trigger('monto')
        }
    }, [monto, setError, clearErrors, trigger])

    const clearDefaultValues = () => {
        setValue('motivo', null)
        setValue('monto', 0)
        setMonto(0)
        trigger(['monto', 'motivo'])
    }

    const handleClearPago = () => {
        dispatch(resetPagoShow())
        reset(defaultValues)
        clearDefaultValues()
    }

    const handleOpenDialog = () => {
        if (stateMonto.invalid) {
            setErrorMonto()
        } else {
            setDialogOpen(true)
        }
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
    }

    const handleUpdatePago = async (formValues: PagoDto) => {
        const { numeroOrdenPago, ...data } = formValues

        setIsFormEnabled(false)
        handleCloseDialog()

        try {

            const payload: PagoDto = {
                ...data,
                motivo: formValues.motivo ? formValues.motivo.trim() : null
            }

            await update(payload)
        } catch (e: any) {
            console.error('handleUpdatePago', e)
        } finally {
            console.log('numeroOrdenPago', numeroOrdenPago)
            setIsFormEnabled(true)
            invalidateReset({
                tables: ['lotePagosTable', 'ordenPagoPendientes']
            })
        }
    }

    const handleOnChangeAmount = (amount: string) => {
        const amountToPay = parseFloat(amount) || 0
        setMonto(amountToPay)
        setValue('monto', amountToPay)
    }

    const handleOpenDialogDelete = () => {
        setDialogDeleteOpen(true)
    }

    const handleCloseDialogDelete = () => {
        setDialogDeleteOpen(false)
    }

    const handleDelete = async () => {
        setIsFormEnabled(false)
        handleCloseDialogDelete()

        try {
            const payload: PagoDeleteDto = {
                codigoPago: pago.codigoPago
            }

            const response = await remove(payload)

            if (response?.isValid) {
                dispatch(setIsOpenDialogPago(false))
                handleClearPago()
            }
        } catch (e: any) {
            console.error('handleDelete', e)
        } finally {
            setIsFormEnabled(true)
            invalidateReset({
                tables: ['lotePagosTable', 'ordenPagoPendientes']
            })
        }
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
                                        <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="numeroOrdenPago"
                                                    control={control}
                                                    rules={ rules.numeroOrdenPago }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="text"
                                                            fullWidth
                                                            label="Número orden de pago"
                                                            placeholder="Título"
                                                            value={value || ''}
                                                            multiline
                                                            onChange={onChange}
                                                            error={!!errors.numeroOrdenPago}
                                                            helperText={errors.numeroOrdenPago?.message}
                                                            required
                                                            disabled
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                            <NumericFormat
                                                value={monto}
                                                customInput={StyledCustomInput}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                label="Monto"
                                                required
                                                onFocus={(event) => {
                                                    event.target.select()
                                                }}
                                                onValueChange={(values: any) => {
                                                    const { value } = values
                                                    handleOnChangeAmount(value)
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
                                                error={!!errors.monto}
                                                helperText={errors.monto?.message}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={0} item sm={12} xs={12}>
                                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name='motivo'
                                                    control={control}
                                                    rules={ rules.motivo }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            value={value || ''}
                                                            label="Motivo"
                                                            onChange={(e) => {
                                                                onChange(e)
                                                            }}
                                                            placeholder='Motivo'
                                                            multiline
                                                            rows={6}
                                                            helperText={errors.motivo?.message || 'Caracteres máximo 2000'}
                                                            error={!!errors.motivo}
                                                            required
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
                                    onConfirm={handleSubmit(handleUpdatePago)}
                                    loading={loading}
                                    title="Actualizar registro"
                                    content="¿Desea continuar con la actualización de este registro?"
                                />

                                <DialogConfirmation
                                    open={dialogDeleteOpen}
                                    onClose={handleCloseDialogDelete}
                                    onConfirm={handleDelete}
                                    loading={loading}
                                    title="Eliminar registro"
                                    content="¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer."
                                />

                                <Box sx={{ paddingTop: 6 }}>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        onClick={handleOpenDialog}
                                        disabled={!isValid}
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
                                        onClick={handleClearPago}
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

export default FormUpdateTwo