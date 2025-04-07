import { useState } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
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
import { CuentaDto } from '../../interfaces';
import { setIsOpenDialogCreate } from 'src/store/apps/pagos/cuentas'
import getRules from './rules';

const FormCreate = () => {
    const dispatch                          = useDispatch()
    const [isFormEnabled, setIsFormEnabled] = useState<boolean>(true)
    const [open, setOpen]                   = useState<boolean>(false)
    const qc: QueryClient                   = useQueryClient()
    const rules                             = getRules()

    const {
        store,
        message,
        loading
    } = useServices()

    const defaultValues: CuentaDto = {
        codigoCuentaBanco: 0,
        codigoBanco: null,
        tipoCuentaId: null,
        noCuenta: null,
        formatoMascara: null,
        denominacionFuncionalId: null,
        codigo: null,
        principal: false,
        recaudadora: false,
        codigoMayor: 0,
        codigoAuxiliar: 0
    }

    const {
        control,
        handleSubmit,
        reset,
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

    const handleCreateMaestroCuenta = async (data: CuentaDto) => {
        setIsFormEnabled(false)
        handleClose()

        try {
            const payload: CuentaDto = {
                ...data
            }

            const response = await store(payload)

            if (response.isValid) {
                dispatch(setIsOpenDialogCreate(false))
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            setIsFormEnabled(true)
            qc.invalidateQueries({
                queryKey: ['maestroCuentaTable']
            })
        }
    }

    const handleClearMaestroBanco = () => {
        reset()
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
                                        <Grid item sm={4} xs={4} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="codigoCuentaBanco"
                                                    control={control}
                                                    rules={ rules.codigoCuentaBanco }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="number"
                                                            fullWidth
                                                            label="Código Cuenta Banco"
                                                            placeholder="Código Cuenta Banco"
                                                            value={value || 0}
                                                            multiline
                                                            onChange={onChange}
                                                            error={!!errors.codigoCuentaBanco}
                                                            helperText={errors.codigoCuentaBanco?.message}
                                                            disabled={true}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={4} xs={4} sx={{ padding: '5px' }}>
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
                                                            value={value || null}
                                                            multiline
                                                            onChange={onChange}
                                                            error={!!errors.codigoBanco}
                                                            helperText={errors.codigoBanco?.message}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={4} xs={4} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="tipoCuentaId"
                                                    control={control}
                                                    rules={ rules.tipoCuentaId }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="number"
                                                            fullWidth
                                                            label="Tipo de cuenta"
                                                            placeholder="Tipo de cuenta"
                                                            value={value || null}
                                                            multiline
                                                            onChange={onChange}
                                                            error={!!errors.tipoCuentaId}
                                                            helperText={errors.tipoCuentaId?.message}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={0} item sm={12} xs={12}>
                                        <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="noCuenta"
                                                    control={control}
                                                    rules={ rules.noCuenta }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="number"
                                                            fullWidth
                                                            label="Número de cuenta"
                                                            placeholder="Número de cuenta"
                                                            value={value || null}
                                                            multiline
                                                            onChange={onChange}
                                                            error={!!errors.noCuenta}
                                                            helperText={errors.noCuenta?.message}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="denominacionFuncionalId"
                                                    control={control}
                                                    rules={ rules.denominacionFuncionalId }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="number"
                                                            fullWidth
                                                            label="Denominación Funcional"
                                                            placeholder="Denominación Funcional"
                                                            value={value || null}
                                                            multiline
                                                            onChange={onChange}
                                                            error={!!errors.denominacionFuncionalId}
                                                            helperText={errors.denominacionFuncionalId?.message}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={0} item sm={12} xs={12}>
                                        <Grid item sm={4} xs={4} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="codigo"
                                                    control={control}
                                                    rules={ rules.codigo }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="text"
                                                            fullWidth
                                                            label="Código"
                                                            placeholder="Código"
                                                            value={value || null}
                                                            multiline
                                                            onChange={onChange}
                                                            error={!!errors.codigo}
                                                            helperText={errors.codigo?.message}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={4} xs={4} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="principal"
                                                    control={control}
                                                    rules={ rules.principal }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="number"
                                                            fullWidth
                                                            label="¿ Cuenta principal ?"
                                                            placeholder="¿ Cuenta principal ?"
                                                            value={value || null}
                                                            multiline
                                                            onChange={onChange}
                                                            error={!!errors.principal}
                                                            helperText={errors.principal?.message}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={4} xs={4} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="recaudadora"
                                                    control={control}
                                                    rules={ rules.recaudadora }
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            type="number"
                                                            fullWidth
                                                            label="¿ Cuenta recaudadora ?"
                                                            placeholder="¿ Cuenta recaudadora ?"
                                                            value={value || null}
                                                            multiline
                                                            onChange={onChange}
                                                            error={!!errors.recaudadora}
                                                            helperText={errors.recaudadora?.message}
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
                                            onClick={handleSubmit(handleCreateMaestroCuenta)}
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