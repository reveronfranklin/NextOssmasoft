import { useEffect, useState } from 'react';
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
import { NumericFormat } from 'react-number-format';
import { useServicesPagos } from '../../../services';
import { PagoDto, ProveeedorResponseDto } from '../../../interfaces';
import { BeneficiariosProveedoresContactos } from '../../autoComplete';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import useInvalidateReset from 'src/hooks/useInvalidateReset';
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import getRules from './rules';

const StyledCustomInput = styled(TextField)(() => ({
    width: '100%'
}))

const FormCreateTwo = () => {
    const [monto, setMonto]                                                 = useState<number>(0)
    const [isFormEnabled, setIsFormEnabled]                                 = useState<boolean>(true)
    const [dialogOpen, setDialogOpen]                                       = useState(false)
    const [beneficiarioProveedorSelected, setBeneficiarioProveedorSelected] = useState<ProveeedorResponseDto>({} as ProveeedorResponseDto)

    const invalidateReset   = useInvalidateReset()
    const rules             = getRules()

    const {
        store,
        message,
        loading,
        codigoLoteSelected
    } = useServicesPagos()

    const defaultValues: PagoDto = {
        codigoLote: codigoLoteSelected,
        codigoBeneficiarioOP: null,
        monto: monto,
        motivo: null
    }

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
        clearErrors,
        trigger,
        getFieldState,
        formState: { errors, isValid }
    } = useForm<PagoDto>({
        defaultValues,
        mode: 'onChange'
    })

    const stateMonto = getFieldState('monto')

    const setErrorMonto = () => {
        setError('monto', {
            type: 'manual',
            message: 'El monto debe ser mayor a 0. Por favor, ingrese un monto válido.'
        }, { shouldFocus: true })
    }

    useEffect(() => {
        if (monto <= 0) {
           setErrorMonto()
        } else {
            clearErrors('monto')
            trigger('monto')
        }
    }, [monto, setError, clearErrors, trigger])

    const handleClearPago = () => {
        setBeneficiarioProveedorSelected({} as ProveeedorResponseDto)
        setMonto(0)
        reset(defaultValues)
    }

    const handleOnChangeBeneficiarioProveedor = (selected: any) => {
        const beneficiarioSelectedProveedor         = selected
        const codigoBeneficiarioSelectedProveedor   = beneficiarioSelectedProveedor.codigoProveedor || null

        if (!codigoBeneficiarioSelectedProveedor) {
            handleClearPago()
        } else {
            setBeneficiarioProveedorSelected(selected)
        }

        return codigoBeneficiarioSelectedProveedor
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

    const handleCreatePago = async (formValues: PagoDto) => {
        setIsFormEnabled(false)
        handleCloseDialog()

        try {
            const payload: PagoDto = {
                ...formValues,
                motivo: formValues.motivo ? formValues.motivo.trim() : null
            }

            const response = await store(payload)

            if (response?.isValid) {
                handleClearPago()
            }
        } catch (e: any) {
            console.error('handleCreatePago', e)
        } finally {
            setIsFormEnabled(true)
            invalidateReset({
                tables: ['lotePagosTable', 'ordenPagoPendientes']
            })
        }
    }

    const isBeneficiarioProveedorValid = (beneficiarioProveedorSelected: ProveeedorResponseDto) => {
        return (
            typeof beneficiarioProveedorSelected === 'object' &&
            beneficiarioProveedorSelected !== null &&
            Object.keys(beneficiarioProveedorSelected).length > 0
        )
    }

    const handleOnChangeAmount = (amount: string) => {
        const amountToPay = parseFloat(amount) || 0
        setMonto(amountToPay)
        setValue('monto', amountToPay)
    }

    useEffect(() => {
        if (monto <= 0) {
            setError('monto', {
                type: 'manual',
                message: 'El monto debe ser mayor a 0. Por favor, ingrese un monto válido.'
            }, { shouldFocus: true })
        } else {
            clearErrors('monto')
            trigger('monto')
        }
    }, [monto, setError, clearErrors, trigger])

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
                                            <Controller
                                                name="codigoBeneficiarioOP"
                                                control={control}
                                                rules={ rules.codigoBeneficiarioOP }
                                                render={({ field: { value, onChange } }) => (
                                                    <BeneficiariosProveedoresContactos
                                                        id={value || null}
                                                        onSelectionChange={(selected) => onChange(handleOnChangeBeneficiarioProveedor(selected))}
                                                        error={errors.codigoBeneficiarioOP?.message}
                                                        required
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        {
                                            isBeneficiarioProveedorValid(beneficiarioProveedorSelected) &&
                                            (
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
                                                            type: 'text'
                                                        }}
                                                        error={!!errors.monto}
                                                        helperText={errors.monto?.message}
                                                    />
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                    {
                                        isBeneficiarioProveedorValid(beneficiarioProveedorSelected) &&
                                        (
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
                                                                    rows={5}
                                                                    helperText={errors.motivo?.message || 'Caracteres máximo 2000'}
                                                                    error={!!errors.motivo}
                                                                    required
                                                                />
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        )
                                    }
                                </Grid>

                                <DialogConfirmation
                                    open={dialogOpen}
                                    onClose={handleCloseDialog}
                                    onConfirm={handleSubmit(handleCreatePago)}
                                    loading={loading}
                                    title="Crear nuevo registro"
                                    content="¿Desea continuar con la creación del registro?"
                                />

                                <Box sx={{ paddingTop: 6 }}>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        onClick={handleOpenDialog}
                                        disabled={!isValid}
                                    >
                                        { 'Crear' }
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

export default FormCreateTwo