import { useState } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import DatePicker from 'react-datepicker';
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput';
import moment from 'moment';
import {
    Box,
    Grid,
    TextField,
    FormControl,
    Button
} from '@mui/material';

import { useServices } from '../../services';
import { LoteDto, FechaPagoDto } from '../../interfaces';
import { TipoPago, MaestroCuenta } from '../autoComplete';
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import dayjs from 'dayjs';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import getRules from './rules';

const FormCreate = () => {
    const [isFormEnabled, setIsFormEnabled] = useState<boolean>(true)
    const [dialogOpen, setDialogOpen]       = useState(false)

    const [fechaPagoLote, setFechaPagoLote] = useState<FechaPagoDto>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
    })

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
        fechaPago: moment().format('YYYY-MM-DDTHH:mm:ss'),
        codigoCuentaBanco: null,
        codigoPresupuesto: 19,
        titulo: null
    }

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
        setDialogOpen(true);
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    const handleClearPagoLote = () => {
        const currentDate       = moment()
        const fechaPagoLote     = fechaToFechaObj(currentDate.toDate())

        setFechaPagoLote(fechaPagoLote)
        reset(defaultValues)
    }

    const handleCreateLotePago = async (formValues: LoteDto) => {
        setIsFormEnabled(false)
        handleCloseDialog()

        try {
            const payload: LoteDto = {
                ...formValues
            }

            const response = await store(payload)

            if (response?.isValid) {
                handleClearPagoLote()
            }
        } catch (e: any) {
            console.error('handleCreateLotePago', e)
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
            const fechaOrdenPagoLote    = dayjs(date).format('YYYY-MM-DDTHH:mm:ss')

            setValue('fechaPago', fechaOrdenPagoLote)
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
                                            <DatePickerWrapper>
                                                <DatePicker
                                                    selected={fechaPagoLote ? getDateByObject(fechaPagoLote) : null}
                                                    id='date-time-picker-desde'
                                                    dateFormat='dd/MM/yyyy'
                                                    onChange={(date: Date) => { handleFechaLotePagoChange(date) }}
                                                    placeholderText='Fecha pago lote'
                                                    customInput={<CustomInput label='Fecha pago lote' />}
                                                    required
                                                />
                                            </DatePickerWrapper>
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
                                    onConfirm={handleSubmit(handleCreateLotePago)}
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

export default FormCreate