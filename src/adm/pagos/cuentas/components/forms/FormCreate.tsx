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
    Select,
    MenuItem,
    InputLabel
} from '@mui/material';

import { useServices } from '../../services';
import { CuentaDto } from '../../interfaces';
import { setIsOpenDialogCreate } from 'src/store/apps/pagos/cuentas'
import { MaestroBanco, TipoCuenta, DenominacionFuncional } from '../autoComplete';
import getRules from './rules';

const FormCreate = () => {
    const dispatch                          = useDispatch()
    const rules                             = getRules()
    const qc: QueryClient                   = useQueryClient()
    const [isFormEnabled, setIsFormEnabled] = useState<boolean>(true)
    const [open, setOpen]                   = useState<boolean>(false)

    const [codigoBanco, setCodigoBanco]                             = useState<number>(0)
    const [tipoCuenta, setTipoCuenta]                               = useState<number>(0)
    const [denominacionFuncional, setDenominacionFuncional]         = useState<number>(0)


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

    const changeToBoolean = (value: any) : boolean => {
        return (value == 'true')
    }

    const handleClearMaestroCuenta = () => {
        setCodigoBanco(0)
        setTipoCuenta(0)
        setDenominacionFuncional(0)
        reset(defaultValues)
    }

    /* Selectors - AutoComplete start */
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
    /* Selectors - AutoComplete end */

    const handleCreateMaestroCuenta = async (data: CuentaDto) => {
        setIsFormEnabled(false)
        handleClose()

        try {
            const payload: CuentaDto = {
                ...data,
                codigoCuentaBanco: 0,
                codigoBanco: codigoBanco,
                principal: changeToBoolean(data.principal),
                recaudadora: changeToBoolean(data.recaudadora)
            }

            console.log('handleCreateMaestroCuenta', payload)

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

export default FormCreate