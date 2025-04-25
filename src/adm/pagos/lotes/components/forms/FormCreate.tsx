import { useState } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material';
import {
    Box,
    Grid,
    TextField,
    FormControl,
    Button
} from '@mui/material';

import { useServices } from '../../services';
import { LoteDto } from '../../interfaces';
import { TipoPago, MaestroCuenta } from '../autoComplete';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import getRules from './rules';

const FormCreate = () => {
    const [isFormEnabled, setIsFormEnabled] = useState<boolean>(true)
    const [dialogOpen, setDialogOpen]       = useState(false)

    const qc: QueryClient   = useQueryClient()
    const rules             = getRules()

    const {
        store,
        message,
        loading
    } = useServices()

    const defaultValues: LoteDto = {
        codigoLotePago: 0,
        tipoPagoId: null,
        fechaPago: null,
        codigoCuentaBanco: null,
        codigoPresupuesto: 19,
        Titulo: null
    }

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<LoteDto>({
        defaultValues,
        mode: 'onChange'
    })

    const handleOpenDialog = () => {
        setDialogOpen(true);
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    const handleClearMaestroCuenta = () => {
        reset(defaultValues)
    }

    const handleCreateMaestroCuenta = async (formValues: LoteDto) => {
        setIsFormEnabled(false)
        handleCloseDialog()

        try {
            const payload: LoteDto = {
                ...formValues
            }

            const response = await store(payload)

            if (response?.isValid) {
                handleClearMaestroCuenta()
            }
        } catch (e: any) {
            console.error('handleCreateMaestroCuenta', e)
        } finally {
            setIsFormEnabled(true)
            qc.invalidateQueries({
                queryKey: ['maestroCuentaTable']
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
                                            <Controller
                                                name="tipoPagoId"
                                                control={control}
                                                rules={ rules.tipoPagoId }
                                                render={({ field: { value, onChange } }) => (
                                                    <TipoPago
                                                        id={value || null}
                                                        onSelectionChange={(selected) => onChange(selected?.id || null)}
                                                        error={errors.tipoPagoId?.message}
                                                        required
                                                        autoFocus
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                            <Controller
                                                name="fechaPago"
                                                control={control}
                                                rules={ rules.fechaPago }
                                                render={({ field: { value, onChange } }) => (
                                                    <TextField
                                                        type="date"
                                                        fullWidth
                                                        label="Fecha de pago"
                                                        placeholder="Fecha de pago"
                                                        value={value || ''}
                                                        multiline
                                                        onChange={onChange}
                                                        error={!!errors.fechaPago}
                                                        helperText={errors.fechaPago?.message}
                                                        required
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={0} item sm={12} xs={12}>
                                        <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                            <Controller
                                                name="codigoCuentaBanco"
                                                control={control}
                                                rules={ rules.codigoCuentaBanco }
                                                render={({ field: { value, onChange } }) => (
                                                    <MaestroCuenta
                                                        id={value || null}
                                                        onSelectionChange={(selected) => onChange(selected?.codigoCuentaBanco || null)}
                                                        error={errors.codigoCuentaBanco?.message}
                                                        required
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="Titulo"
                                                    control={control}
                                                    rules={ rules.Titulo }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="text"
                                                            fullWidth
                                                            label="Título"
                                                            placeholder="Título"
                                                            value={value || ''}
                                                            multiline
                                                            onChange={(e) => {
                                                                const textUpperCase = e.target.value.toUpperCase()
                                                                onChange(textUpperCase)
                                                            }}
                                                            error={!!errors.Titulo}
                                                            helperText={errors.Titulo?.message}
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
                                    onConfirm={handleSubmit(handleCreateMaestroCuenta)}
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
                                        onClick={handleClearMaestroCuenta}
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