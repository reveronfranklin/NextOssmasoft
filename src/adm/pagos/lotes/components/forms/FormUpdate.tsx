import { useEffect, useState } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import DatePicker from 'react-datepicker';
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput';
import {
    Box,
    Grid,
    TextField,
    FormControl,
    Button
} from '@mui/material';

import { RootState } from 'src/store';
import { useServices } from '../../services';
import { setIsOpenDialogLote, resetLoteShow } from 'src/store/apps/pagos/lotes'
import { LoteDto, FechaPagoDto, LoteDeleteDto } from '../../interfaces';
import { TipoPago, MaestroCuenta } from '../autoComplete';
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import dayjs from 'dayjs';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import getRules from './rules';

const FormUpdate = () => {
    const [isFormEnabled, setIsFormEnabled]         = useState<boolean>(true)
    const [dialogOpen, setDialogOpen]               = useState<boolean>(false)
    const [dialogDeleteOpen, setDialogDeleteOpen]   = useState<boolean>(false)

    const [fechaPagoLote, setFechaPagoLote] = useState<FechaPagoDto>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
    })

    const dispatch          = useDispatch()
    const qc: QueryClient   = useQueryClient()
    const { lote }          = useSelector((state: RootState) => state.admLote )
    const rules             = getRules()

    const {
        update,
        remove,
        message,
        loading
    } = useServices()

    const defaultValues: LoteDto = {
        codigoLotePago: lote.codigoLotePago,
        tipoPagoId: lote.tipoPagoId,
        fechaPago: lote.fechaPago,
        codigoCuentaBanco: lote.codigoCuentaBanco,
        codigoPresupuesto: lote.codigoPresupuesto ?? 19,
        titulo: lote.titulo
    }

    useEffect(() => {
        setFechaPagoLote(lote.fechaPagoDto)
    }, [lote])

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid }
    } = useForm<LoteDto>({
        defaultValues,
        mode: 'onChange'
    })

    const handleOpenDialog = () => {
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
    }

    const clearDefaultValues = () => {
        setValue('tipoPagoId', null)
        setValue('fechaPago', null)
        setValue('codigoCuentaBanco', null)
        setValue('codigoPresupuesto', 19)
        setValue('titulo', null)
    }

    const handleClearPagoLote = () => {
        dispatch(resetLoteShow())
        reset(defaultValues)
        clearDefaultValues()

        console.log(defaultValues)
    }

    const handleUpdatePagoLote = async (lote: LoteDto) => {
        setIsFormEnabled(false)
        handleCloseDialog()

        try {
            const payload: LoteDto = {
                ...lote
            }

            await update(payload)
        } catch (e: any) {
            console.error('handleUpdatePagoLote', e)
        } finally {
            setIsFormEnabled(true)
            qc.invalidateQueries({
                queryKey: ['lotesTable']
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
        setIsFormEnabled(false)
        handleCloseDialogDelete()

        try {
            const payload: LoteDeleteDto = {
                codigoLotePago: lote.codigoLotePago
            }

            const response = await remove(payload)

            if (response?.isValid) {
                dispatch(setIsOpenDialogLote(false))
                handleClearPagoLote()
            }
        } catch (e: any) {
            console.error('handleDelete', e)
        } finally {
            setIsFormEnabled(true)
            qc.invalidateQueries({
                queryKey: ['lotesTable']
            })
        }
    }

    const handleFechaLotePagoChange = (date: Date | null) => {
        if (date && dayjs(date).isValid()) {
            const fechaPagoLotePagoObj  = fechaToFechaObj(date)
            const fechaPagoLote         = dayjs(date).format('YYYY-MM-DDTHH:mm:ss')

            setValue('fechaPago', fechaPagoLote)
            setFechaPagoLote(fechaPagoLotePagoObj)
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
                                        <Grid item sm={9} xs={9} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <Controller
                                                    name="titulo"
                                                    control={control}
                                                    rules={ rules.titulo }
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
                                                            error={!!errors.titulo}
                                                            helperText={errors.titulo?.message}
                                                            required
                                                            autoFocus
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={3} xs={3} sx={{ padding: '5px' }}>
                                            <FormControl fullWidth>
                                                <DatePickerWrapper>
                                                    <DatePicker
                                                        selected={fechaPagoLote ? getDateByObject(fechaPagoLote) : null}
                                                        id='date-time-picker-desde'
                                                        dateFormat='dd/MM/yyyy'
                                                        onChange={(date: Date) => { handleFechaLotePagoChange(date) }}
                                                        placeholderText='Fecha de pago'
                                                        customInput={<CustomInput label='Fecha Orden Pago' />}
                                                        required
                                                    />
                                                </DatePickerWrapper>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

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
                                                    />
                                                )}
                                            />
                                        </Grid>
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
                                    </Grid>
                                </Grid>

                                <DialogConfirmation
                                    open={dialogOpen}
                                    onClose={handleCloseDialog}
                                    onConfirm={handleSubmit(handleUpdatePagoLote)}
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

                                <Box sx={{ paddingTop: 6, marginTop: 55}}>
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
                                        onClick={handleClearPagoLote}
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