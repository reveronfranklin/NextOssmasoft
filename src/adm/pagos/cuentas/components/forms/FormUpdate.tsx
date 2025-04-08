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
    Button,
    FormHelperText,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';

import { RootState } from 'src/store';
import { CuentaDto, CuentaDeleteDto } from '../../interfaces';
import { setMaestroCuentaShow, resetMaestroCuentaShow } from 'src/store/apps/pagos/cuentas'
import { useServices } from '../../services';
import getRules from './rules';

const FormUpdate = () => {
    const dispatch = useDispatch()
    const { maestroBanco }                          = useSelector((state: RootState) => state.admMaestroBanco )
    const [isFormEnabled, setIsFormEnabled]         = useState<boolean>(true)
    const [open, setOpen]                           = useState<boolean>(false)
    const [openDeleteDialog, setOpenDeleteDialog]   = useState<boolean>(false)
    const qc: QueryClient                           = useQueryClient()
    const rules                                     = getRules()

    const {
        update,
        destroy,
        message,
        loading
    } = useServices()

    const defaultValues: CuentaDto = {
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
    } = useForm<CuentaDto>({
        defaultValues,
        mode: 'onChange'
    })

    const handleDialogOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleUpdateMaestroBanco = async (dataFormMaestroBanco: CuentaDto) => {
        setIsFormEnabled(false)
        handleClose()

        try {
            const payload: CuentaDto = {
                codigoBanco: dataFormMaestroBanco.codigoBanco,
                nombre: dataFormMaestroBanco.nombre,
                codigoInterbancario: dataFormMaestroBanco.codigoInterbancario
            }

            const response = await update(payload)

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

    const handleDeleteDialogOpen = () => {
        setOpenDeleteDialog(true)
    }

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false)
    }

    const handleDelete = async () => {
        try {
            const payload: CuentaDeleteDto = {
                codigoCuentaBanco: maestroBanco.codigoBanco
            }

            const response = await destroy(payload)

            if (response?.isValid) {
                dispatch(setMaestroCuentaShow(false))
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            qc.invalidateQueries({
                queryKey: ['maestroBancoTable']
            })
        }
    }

    const handleClearMaestroBanco = () => {
        dispatch(resetMaestroCuentaShow())
        reset()
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
                                                            onChange={onChange}
                                                            error={!!errors.nombre}
                                                            helperText={errors.nombre?.message}
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
                                            onClick={handleSubmit(handleUpdateMaestroBanco)}
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

                                <Dialog
                                    open={openDeleteDialog}
                                    onClose={handleDeleteDialogClose}
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
                                        <Button onClick={handleDeleteDialogClose}>No</Button>
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            size='small'
                                            onClick={handleSubmit(handleDelete)}
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
                                                    Eliminando el registro, un momento...
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
                                        disabled={!isValid && loading}
                                    >
                                        Actualizar
                                    </Button>
                                    <Button
                                        sx={{ mx: 4 }}
                                        variant='outlined'
                                        size='small'
                                        onClick={handleDeleteDialogOpen}
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

export default FormUpdate