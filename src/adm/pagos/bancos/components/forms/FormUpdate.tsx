import { useState, useEffect } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import {
    Box,
    Grid,
    TextField,
    FormControl,
    Button
} from '@mui/material';

import { RootState } from 'src/store';
import { SisBancoCreateDto, SisBancoDeleteDto } from '../../interfaces';
import { setIsOpenDialogMaestroBancoDetalle, resetMaestroBancoSeleccionadoDetalle } from 'src/store/apps/pagos/bancos'
import { useServices } from '../../services';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import getRules from './rules';

const FormUpdate = () => {
    const dispatch = useDispatch()
    const [isFormEnabled, setIsFormEnabled]         = useState<boolean>(true)
    const [dialogOpen, setDialogOpen]               = useState<boolean>(false)
    const [dialogDeleteOpen, setDialogDeleteOpen]   = useState<boolean>(false)

    const { maestroBanco }  = useSelector((state: RootState) => state.admMaestroBanco )
    const qc: QueryClient   = useQueryClient()
    const rules             = getRules()

    const {
        update,
        remove,
        message,
        loading
    } = useServices()

    const defaultValues: SisBancoCreateDto = {
        codigoBanco: maestroBanco.codigoBanco,
        nombre: maestroBanco.nombre,
        codigoInterbancario: maestroBanco.codigoInterbancario
    }

    const {
        control,
        handleSubmit,
        reset,
        setValue,
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
        dispatch(resetMaestroBancoSeleccionadoDetalle())
        reset(defaultValues)
    }

    const handleUpdateMaestroBanco = async (dataFormMaestroBanco: SisBancoCreateDto) => {
        setIsFormEnabled(false)
        handleCloseDialog()

        try {
            const payload: SisBancoCreateDto = {
                codigoBanco: dataFormMaestroBanco.codigoBanco,
                nombre: dataFormMaestroBanco.nombre,
                codigoInterbancario: dataFormMaestroBanco.codigoInterbancario
            }

            await update(payload)
        } catch (e: any) {
            console.error(e)
        } finally {
            setIsFormEnabled(true)
            qc.invalidateQueries({
                queryKey: ['maestroBancoTable']
            })
        }
    }

    const handleOpenDialogDelete = () => {
        setDialogDeleteOpen(true)
    }

    const handleCloseDialogDelete = () => {
        setDialogDeleteOpen(false)
    }

    const handleDelete = async () => {
        try {
            const payload: SisBancoDeleteDto = {
                codigoBanco: maestroBanco.codigoBanco
            }

            const response = await remove(payload)

            if (response?.isValid) {
                dispatch(setIsOpenDialogMaestroBancoDetalle(false))
                handleClearMaestroBanco()
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            qc.invalidateQueries({
                queryKey: ['maestroBancoTable']
            })
        }
    }

    useEffect(() => {
        if (Object.keys(maestroBanco).length === 0) {
            setValue('codigoInterbancario', '')
            setValue('nombre', '')
        }
    }, [ maestroBanco ])

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
                                                    name="codigoBanco"
                                                    control={control}
                                                    rules={ rules.codigoBanco }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="number"
                                                            fullWidth
                                                            label="Código Banco"
                                                            placeholder="Código Banco"
                                                            value={value || 0}
                                                            multiline
                                                            onChange={onChange}
                                                            error={!!errors.codigoBanco}
                                                            helperText={errors.codigoBanco?.message}
                                                            disabled={true}
                                                            required
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
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
                                    </Grid>

                                    <Grid container spacing={0} item sm={12} xs={12}>
                                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
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
                                    onConfirm={handleSubmit(handleUpdateMaestroBanco)}
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

export default FormUpdate