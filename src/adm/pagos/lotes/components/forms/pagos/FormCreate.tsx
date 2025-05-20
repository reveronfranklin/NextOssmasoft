import { useState } from 'react';
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
    const [errorMessage, setErrorMessage]                   = useState<string>('')
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
        monto: null,
        motivo: null
    }

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid }
    } = useForm<PagoDto>({
        defaultValues,
        mode: 'onChange'
    })

    const clearFields = () => {
        setBeneficiarios([] as AdmBeneficiariosPendientesPago[])
        setBeneficiarioSelected({} as AdmBeneficiariosPendientesPago)
        setMonto(0)
        reset()
    }

    const handleOnChangeBeneficiario = (selected: any) => {
        const beneficiarioSelectedOP        = selected
        const codigoBeneficiarioSelectedOp  = beneficiarioSelectedOP.codigoBeneficiarioOp || null

        if (!codigoBeneficiarioSelectedOp) {
            /* Verificar esto, para que vuelva al ultimo valor seleccionado */
            setValue('codigoOrdenPago', beneficiarioSelected.codigoOrdenPago)
            clearFields()
        } else {
            setValue('numeroOrdenPago', beneficiarioSelectedOP?.numeroOrdenPago)
            setValue('monto', parseFloat(beneficiarioSelectedOP?.montoPorPagar))
            setValue('motivo', beneficiarioSelectedOP?.motivo)

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
            clearFields()
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

    const handleClearPago = () => {
        reset(defaultValues)
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

/*     useEffect(() => {
        if (preSaldoDisponibleSeleccionado.disponible) {
            if (monto > preSaldoDisponibleSeleccionado.disponible) {
                setErrorMessage('Por favor, verifica el monto. No puede sobrepasar la disponibilidad de la partida.')
            }
        }
    }, [monto]) */

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
                                                            onFocus={(event) => {
                                                                event.target.select()
                                                            }}
                                                            onValueChange={(values: any) => {
                                                                const { value } = values
                                                                setMonto(parseFloat(value) || 0)
                                                                setErrorMessage('')
                                                            }}
                                                            placeholder='Monto'
                                                            inputProps={{
                                                                type: 'text'
                                                            }}
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
                                                                        helperText="Caracteres máximo 2000"
                                                                        value={value || ''}
                                                                        label="Motivo"
                                                                        onChange={onChange}
                                                                        placeholder='Motivo'
                                                                        multiline
                                                                        rows={5}
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