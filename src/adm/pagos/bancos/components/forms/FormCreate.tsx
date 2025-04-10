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
import { SisBancoCreateDto } from '../../interfaces';
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

    const defaultValues: SisBancoCreateDto = {
        codigoBanco: 0,
        nombre: '',
        codigoInterbancario: ''
    }

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<SisBancoCreateDto>({
        defaultValues,
        mode: 'onChange'
    })

    const handleOpenDialog = () => {
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
    }

    const handleClearMaestroBanco = () => {
        reset(defaultValues)
    }

    const handleCreateMaestroBanco = async (dataFormMaestroBanco: SisBancoCreateDto) => {
        setIsFormEnabled(false)
        handleCloseDialog()

        try {
            const payload: SisBancoCreateDto = {
                codigoBanco: 0,
                nombre: dataFormMaestroBanco.nombre,
                codigoInterbancario: dataFormMaestroBanco.codigoInterbancario
            }

            const response = await store(payload)

            if (response?.isValid) {
                handleClearMaestroBanco()
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            setIsFormEnabled(true)
            qc.invalidateQueries({
                queryKey: ['maestroBancoTable']
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
                                                    name="codigoInterbancario"
                                                    control={control}
                                                    rules={ rules.codigoInterbancario }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="number"
                                                            fullWidth
                                                            label="Código Interbancario"
                                                            placeholder="Código Interbancario"
                                                            value={value || ''}
                                                            multiline
                                                            onChange={onChange}
                                                            error={!!errors.codigoInterbancario}
                                                            helperText={errors.codigoInterbancario?.message}
                                                            required
                                                            autoFocus
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="nombre"
                                                    control={control}
                                                    rules={ rules.nombre }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="text"
                                                            fullWidth
                                                            label="Nombre del Banco"
                                                            placeholder="Nombre del Banco"
                                                            value={value || ''}
                                                            multiline
                                                            onChange={(e) => {
                                                                const textUpperCase = e.target.value.toUpperCase()
                                                                onChange(textUpperCase)
                                                            }}
                                                            error={!!errors.nombre}
                                                            helperText={errors.nombre?.message}
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
                                    onConfirm={handleSubmit(handleCreateMaestroBanco)}
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
                                        onClick={handleClearMaestroBanco}
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