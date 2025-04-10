import { useState } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material';
import {
    Box,
    Grid,
    TextField,
    FormControl,
    Button,
    FormHelperText,
    Select,
    MenuItem,
    InputLabel
} from '@mui/material';

import { useServices } from '../../services';
import { CuentaDto } from '../../interfaces';
import { MaestroBanco, TipoCuenta, DenominacionFuncional } from '../autoComplete';
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

    const handleOpenDialog = () => {
        setDialogOpen(true);
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    const changeToBoolean = (value: any) : boolean => {
        return (value == 'true' || value == true)
    }

    const handleClearMaestroCuenta = () => {
        reset(defaultValues)
    }

    const handleCreateMaestroCuenta = async (formValues: CuentaDto) => {
        setIsFormEnabled(false)
        handleCloseDialog()

        try {
            const payload: CuentaDto = {
                ...formValues,
                codigoCuentaBanco: 0,
                principal: changeToBoolean(formValues.principal),
                recaudadora: changeToBoolean(formValues.recaudadora)
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
                                                name="codigoBanco"
                                                control={control}
                                                rules={ rules.codigoBanco }
                                                render={({ field: { value, onChange } }) => (
                                                    <MaestroBanco
                                                        id={value || null}
                                                        onSelectionChange={(selected) => onChange(selected?.codigoBanco || null)}
                                                        error={errors.codigoBanco?.message}
                                                        required
                                                        autoFocus
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                            <Controller
                                                name="tipoCuentaId"
                                                control={control}
                                                rules={ rules.tipoCuentaId }
                                                render={({ field: { value, onChange } }) => (
                                                    <TipoCuenta
                                                        id={value}
                                                        onSelectionChange={(selected) => onChange(selected?.descripcionId || null)}
                                                        error={errors.tipoCuentaId?.message}
                                                        required
                                                    />
                                                )}
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
                                                            required
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                                            <Controller
                                                name="denominacionFuncionalId"
                                                control={control}
                                                rules={ rules.denominacionFuncionalId }
                                                render={({ field: { value, onChange } }) => (
                                                    <DenominacionFuncional
                                                        id={value}
                                                        onSelectionChange={(selected) => onChange(selected?.descripcionId || null)}
                                                        error={errors.denominacionFuncionalId?.message}
                                                        required
                                                    />
                                                )}
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
                                                            onChange={(e) => {
                                                                const textUpperCase = e.target.value.toUpperCase()
                                                                onChange(textUpperCase)
                                                            }}
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
                                                    defaultValue={false}
                                                    render={({ field: { onChange, value, ...rest } }) => (
                                                        <Select
                                                            labelId="principal-label"
                                                            label="¿Cuenta principal?"
                                                            fullWidth
                                                            value={value || false}
                                                            onChange={onChange}
                                                            { ...rest }
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
                                                    defaultValue={false}
                                                    render={({ field: { onChange, value, ...rest } }) => (
                                                        <Select
                                                            labelId="recaudadora-label"
                                                            label="¿Cuenta recaudadora?"
                                                            fullWidth
                                                            value={value || false}
                                                            onChange={onChange}
                                                            { ...rest }
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