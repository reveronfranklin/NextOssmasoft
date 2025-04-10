import { useState } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import {
    Box,
    Grid,
    TextField,
    FormControl,
    Button,
    FormHelperText,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';

import { useServices } from '../../services';
import { SisBancoCreateDto } from '../../interfaces';
import { setIsOpenDialogMaestroBancoDetalle } from 'src/store/apps/pagos/bancos'

const FormCreate = () => {
    const dispatch = useDispatch()
    const [isFormEnabled, setIsFormEnabled] = useState<boolean>(true)
    const [open, setOpen] = useState<boolean>(false)
    const qc: QueryClient = useQueryClient()

    const {
        createMaestroBanco,
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

    const handleDialogOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleCreateMaestroBanco = async (dataFormMaestroBanco: SisBancoCreateDto) => {
        setIsFormEnabled(false)
        handleClose()

        try {
            const payload: SisBancoCreateDto = {
                codigoBanco: 0,
                nombre: dataFormMaestroBanco.nombre,
                codigoInterbancario: dataFormMaestroBanco.codigoInterbancario
            }

            const response = await createMaestroBanco(payload)

            if (response.isValid) {
                dispatch(setIsOpenDialogMaestroBancoDetalle(false))
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

    const handleClearMaestroBanco = () => {
        reset()
    }

    const rules =  {
        codigoInterbancario: {
            required: 'Este campo es requerido',
            pattern:{
                value: /^[0-9]+$/,
                message: 'Solo se admiten numeros'
            },
            min: {
                value: 1,
                message: 'Mínimo 1 digitos'
            },
            maxLength: {
                value: 5,
                message: 'Máximo 5 digitos'
            }
        },
        nombre: {
            required: 'Este campo es requerido',
            minLength: {
                value: 1,
                message: 'Mínimo 1 caracter'
            },
            maxLength: {
                value: 200,
                message: 'Máximo 200 caracter'
            }
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
                                                            onChange={onChange}
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
                                            onClick={handleSubmit(handleCreateMaestroBanco)}
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
                                        { 'Crear' }
                                    </Button>
                                    <Button
                                        color='primary'
                                        size='small'
                                        onClick={handleClearMaestroBanco}
                                    >
                                        <CleaningServices /> Limpiar
                                    </Button>
                                    <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{message}</FormHelperText>
                                </Box>
                            </form>
                            : null
                        }
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default FormCreate