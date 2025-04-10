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
    Select,
    MenuItem,
    InputLabel
} from '@mui/material';

import { RootState } from 'src/store';
import { CuentaDto, CuentaDeleteDto } from '../../interfaces';
import { setIsOpenDialogCreate, resetMaestroCuentaShow } from 'src/store/apps/pagos/cuentas'
import { useServices } from '../../services';
import { MaestroBanco, TipoCuenta, DenominacionFuncional } from '../autoComplete';
import DialogConfirmation from '../dialog/DialogConfirmation';
import getRules from './rules';

const FormUpdate = () => {
    const dispatch                                  = useDispatch()
    const qc: QueryClient                           = useQueryClient()
    const rules                                     = getRules()
    const { maestroCuenta }                         = useSelector((state: RootState) => state.admMaestroCuenta )
    const [isFormEnabled, setIsFormEnabled]         = useState<boolean>(true)
    const [dialogOpen, setDialogOpen]               = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog]   = useState<boolean>(false)

    const [codigoBanco, setCodigoBanco]                     = useState<number>(0)
    const [tipoCuenta, setTipoCuenta]                       = useState<number>(0)
    const [denominacionFuncional, setDenominacionFuncional] = useState<number>(0)

    const {
        update,
        destroy,
        message,
        loading
    } = useServices()

    const defaultValues: CuentaDto = {
        ...maestroCuenta
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

    const handleOpenDialog = () => {
        setDialogOpen(true);
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    const changeToBoolean = (value: any) : boolean => {
        return (value == 'true')
    }

    const clearDefaultValues = () => {
        setValue('codigoCuentaBanco', maestroCuenta.codigoCuentaBanco)
        setValue('codigoBanco', null)
        setValue('tipoCuentaId', null)
        setValue('noCuenta', null)
        setValue('formatoMascara', null)
        setValue('denominacionFuncionalId', null)
        setValue('codigo', null)
        setValue('principal', false)
        setValue('recaudadora', false)
        setValue('codigoMayor', 0)
        setValue('codigoAuxiliar', 0)
    }

    const handleClearMaestroCuenta = () => {
        setCodigoBanco(0)
        setTipoCuenta(0)
        setDenominacionFuncional(0)
        dispatch(resetMaestroCuentaShow())
        reset(defaultValues)
        clearDefaultValues()
    }

    const handleMaestroBanco = (maestroBanco: any) => {
        setValue('codigoBanco', maestroBanco.codigoBanco)
        setCodigoBanco(maestroBanco.codigoBanco)
    }

    const handleTipoCuenta = (tipoCuenta: any) => {
        setValue('tipoCuentaId', tipoCuenta.descripcionId)
        setTipoCuenta(tipoCuenta.descripcionId)
    }

    const handleDenominacionFuncionalId = (denominacionFuncional: any) => {
        setValue('denominacionFuncionalId', denominacionFuncional.descripcionId)
        setDenominacionFuncional(denominacionFuncional.descripcionId)
    }

    const handleUpdateMaestroCuenta = async (cuenta: CuentaDto) => {
        setIsFormEnabled(false)
        handleCloseDialog()

        try {
            const payload: CuentaDto = {
                ...cuenta,
                principal: changeToBoolean(cuenta.principal),
                recaudadora: changeToBoolean(cuenta.recaudadora)
            }

            const response = await update(payload)

            if (response?.isValid) {
                dispatch(setIsOpenDialogCreate(false))
                dispatch(resetMaestroCuentaShow())
            }
        } catch (e: any) {
            console.error('handleUpdateMaestroCuenta', e)
        } finally {
            setIsFormEnabled(true)
            qc.invalidateQueries({
                queryKey: ['maestroCuentaTable']
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
                codigoCuentaBanco: maestroCuenta.codigoCuentaBanco
            }

            const response = await destroy(payload)

            if (response?.isValid) {
                dispatch(setIsOpenDialogCreate(false))
                dispatch(resetMaestroCuentaShow())
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            qc.invalidateQueries({
                queryKey: ['maestroCuentaTable']
            })
        }
    }

    useEffect(() => {
        setCodigoBanco(Number(maestroCuenta.codigoBanco ?? 0))
        setTipoCuenta(Number(maestroCuenta.tipoCuentaId ?? 0))
        setDenominacionFuncional(Number(maestroCuenta.denominacionFuncionalId ?? 0))
    }, [ maestroCuenta ])

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
                                            <MaestroBanco
                                                id={codigoBanco}
                                                onSelectionChange={handleMaestroBanco}
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                            <TipoCuenta
                                                id={tipoCuenta}
                                                onSelectionChange={handleTipoCuenta}
                                            />
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
                                                            value={value || ''}
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
                                            <DenominacionFuncional
                                                id={denominacionFuncional}
                                                onSelectionChange={handleDenominacionFuncionalId}
                                            />
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
                                                            value={value || ''}
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
                                                <InputLabel id="principal-label">¿Cuenta principal?</InputLabel>
                                                <Controller
                                                    name="principal"
                                                    control={control}
                                                    rules={rules.principal}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            labelId="principal-label"
                                                            label="¿Cuenta principal?"
                                                            fullWidth
                                                            value={value || false}
                                                            onChange={onChange}
                                                        >
                                                            <MenuItem value="true">Sí</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.principal && (
                                                    <FormHelperText error>{errors.principal.message}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={4} xs={4} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="recaudadora-label">¿Cuenta recaudadora?</InputLabel>
                                                <Controller
                                                    name="recaudadora"
                                                    control={control}
                                                    rules={rules.recaudadora}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            labelId="recaudadora-label"
                                                            label="¿Cuenta recaudadora?"
                                                            fullWidth
                                                            value={value || false}
                                                            onChange={onChange}
                                                        >
                                                            <MenuItem value="true">Sí</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.recaudadora && (
                                                    <FormHelperText error>{errors.recaudadora.message}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <DialogConfirmation
                                    open={dialogOpen}
                                    onClose={handleCloseDialog}
                                    onConfirm={handleSubmit(handleUpdateMaestroCuenta)}
                                    loading={loading}
                                    title="Actualizar registro"
                                    content="¿Desea continuar con la actualización de este registro?"
                                />

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
                                        onClick={handleOpenDialog}
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
                                        onClick={handleClearMaestroCuenta}
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