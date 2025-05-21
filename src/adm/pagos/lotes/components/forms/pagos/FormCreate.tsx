import { useEffect, useState } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
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
import { PagoDto, AdmBeneficiariosPendientesPago } from '../../../interfaces';
import { OrdenPagoPendiente, BeneficiariosOrdenPago } from '../../autoComplete';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import getRules from './rules';

const StyledCustomInput = styled(TextField)(() => ({
    width: '100%'
}))

const FormCreate = () => {
    const [monto, setMonto]                                 = useState<number>(0)
    const [isFormEnabled, setIsFormEnabled]                 = useState<boolean>(true)
    const [dialogOpen, setDialogOpen]                       = useState(false)
    const [beneficiarios, setBeneficiarios]                 = useState<AdmBeneficiariosPendientesPago[]>([])
    const [beneficiarioSelected, setBeneficiarioSelected]   = useState<AdmBeneficiariosPendientesPago>({} as AdmBeneficiariosPendientesPago)

    const qc: QueryClient   = useQueryClient()
    const rules             = getRules()

    const {
        store,
        message,
        loading,
        codigoLoteSelected
    } = useServicesPagos()

    const defaultValues: PagoDto = {
        codigoLote: codigoLoteSelected,
        codigoOrdenPago: null,
        numeroOrdenPago: null,
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
        formState: { errors, isValid }
    } = useForm<PagoDto>({
        defaultValues,
        mode: 'onChange'
    })

    const handleClearPago = () => {
        setBeneficiarios([] as AdmBeneficiariosPendientesPago[])
        setBeneficiarioSelected({} as AdmBeneficiariosPendientesPago)
        setMonto(0)
        reset(defaultValues)
    }

    const handleOnChangeBeneficiario = (selected: any) => {
        const beneficiarioSelectedOP        = selected
        const codigoBeneficiarioSelectedOp  = beneficiarioSelectedOP.codigoBeneficiarioOp || null

        if (!codigoBeneficiarioSelectedOp) {
            handleClearPago()
        } else {
            const montoPorPagar = parseFloat(beneficiarioSelectedOP?.montoPorPagar) || 0

            setValue('numeroOrdenPago', beneficiarioSelectedOP?.numeroOrdenPago)
            setValue('motivo', beneficiarioSelectedOP?.motivo)
            setValue('monto', montoPorPagar)
            setMonto(montoPorPagar)
            setBeneficiarioSelected(selected)
        }

        return codigoBeneficiarioSelectedOp
    }

    const handleOnChangeOrdenPagoPendiente = (selected: any) => {
        const ordenPagoSelected         = selected
        const codigoOrdenPagoSelected   = ordenPagoSelected?.codigoOrdenPago || null
        const beneficiariosPendientes   = ordenPagoSelected?.admBeneficiariosPendientesPago ?? []
        const listBeneficiariosSelected = codigoOrdenPagoSelected ? beneficiariosPendientes : []

        if (!codigoOrdenPagoSelected) {
            handleClearPago()
        } else {
            setBeneficiarios(listBeneficiariosSelected)
        }

        return codigoOrdenPagoSelected
    }

    const handleOpenDialog = () => {
        setDialogOpen(true);
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    const handleCreatePago = async (formValues: PagoDto) => {
        setIsFormEnabled(false)
        handleCloseDialog()

        try {
            const payload: PagoDto = {
                ...formValues
            }

            const response = await store(payload)

            if (response?.isValid) {
                handleClearPago()
            }
        } catch (e: any) {
            console.error('handleCreatePago', e)
        } finally {
            setIsFormEnabled(true)
            qc.invalidateQueries({
                queryKey: ['lotePagosTable']
            })
        }
    }

    const isBeneficiarioValid = (beneficiarioSelected: AdmBeneficiariosPendientesPago) => {
        return (
            typeof beneficiarioSelected === 'object' &&
            beneficiarioSelected !== null &&
            Object.keys(beneficiarioSelected).length > 0
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
        console.log('monto is valid', isValid)
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
                                                name="codigoOrdenPago"
                                                control={control}
                                                rules={ rules.codigoOrdenPago }
                                                render={({ field: { value, onChange } }) => (
                                                    <OrdenPagoPendiente
                                                        id={value || null}
                                                        onSelectionChange={(selected) => onChange(handleOnChangeOrdenPagoPendiente(selected))}
                                                        error={errors.codigoOrdenPago?.message}
                                                        required
                                                        autoFocus
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        {
                                            beneficiarios.length > 0 &&
                                            (
                                                <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                                    <Controller
                                                        name="codigoBeneficiarioOP"
                                                        control={control}
                                                        rules={ rules.codigoBeneficiarioOP }
                                                        render={({ field: { value, onChange } }) => (
                                                            <BeneficiariosOrdenPago
                                                                id={value || null}
                                                                onSelectionChange={(selected) => onChange(handleOnChangeBeneficiario(selected))}
                                                                error={errors.codigoOrdenPago?.message}
                                                                required
                                                                options={beneficiarios}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                    {
                                        isBeneficiarioValid(beneficiarioSelected) &&
                                        (
                                            <>
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
                                                                type: 'text'
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
                                            </>
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

export default FormCreate