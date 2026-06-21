import { Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, FormControl, FormHelperText, Grid, TextField } from "@mui/material"
import { Controller, useForm } from 'react-hook-form'
import { FormInputs } from './../../interfaces/formImputs.interfaces'
import { useSelector } from "react-redux"
import { RootState } from "src/store"
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { Create } from '../../interfaces/create.interfaces'
import { useState, useRef } from "react"
import { IFechaDto } from "src/interfaces/fecha-dto";
import { useDispatch } from "react-redux"
import {
    setVerSolicitudCompromisosActive,
    setOperacionCrudAdmSolCompromiso,
    setSolicitudCompromisoSeleccionado
} from 'src/store/apps/adm'
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import TipoSolicitud from '../../components/Autocomplete/TipoSolicitud'
import CodigoProveedor from '../../components/Autocomplete/CodigoProveedor'
import UnidadSolicitante from '../../components/Autocomplete/UnidadSolicitante'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import dayjs from 'dayjs'
import useServices from '../../services/useServices'
import { CrudOperation } from '../../enums/CrudOperations.enum'
import AudioDictateButton from '../../components/AudioDictateButton'

const FormCreateSolCompromiso = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [motivoAudioState, setMotivoAudioState] = useState<'idle' | 'recording' | 'transcribing'>('idle')
    const [notaAudioState, setNotaAudioState] = useState<'idle' | 'recording' | 'transcribing'>('idle')
    const [motivoConfidence, setMotivoConfidence] = useState<number | null>(null)
    const [notaConfidence, setNotaConfidence] = useState<number | null>(null)
    const [fecha, setFecha] = useState<IFechaDto>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
    })

    const motivoInputRef = useRef<HTMLInputElement>(null)
    const notaInputRef = useRef<HTMLInputElement>(null)

    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    const dispatch = useDispatch()
    const { crearSolicitudCompromiso } = useServices()
    const qc: QueryClient = useQueryClient()

    const defaultValues: FormInputs = {
        codigoSolicitud: 0,
        numeroSolicitud: '',
        fechaSolicitud: new Date(),
        codigoSolicitante: 0,
        tipoSolicitudId: 0,
        codigoProveedor: 0,
        motivo: '',
        nota: '',
        status: '',
        codigoPresupuesto: 0,
        fechaSolicitudString: '',
        descripcionStatus: 'Pendiente',
        descripcionTipoSolicitud: ''
    }

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({ defaultValues })

    const handleCodigoSolicitanteChange = (codigoSolicitante: number) => {
        setValue('codigoSolicitante', codigoSolicitante)
    }

    const handleTipoSolicitudChange = (tipoSolicitudId: number) => {
        setValue('tipoSolicitudId', tipoSolicitudId)
    }

    const handleCodigoProveedorChange = (codigoProveedor: number) => {
        setValue('codigoProveedor', codigoProveedor)
    }

    const handleFechaSolicitudChange: any = (fechaSolicitud: Date) => {
        const dateIsValid = dayjs(fechaSolicitud).isValid()

        const fechaFormat = dayjs(fechaSolicitud).format('YYYY-MM-DDTHH:mm:ss')
        const fechaSolicitudDate = new Date(fechaFormat)

        if (dateIsValid) {
            const fechaObj: any = fechaToFechaObj(fechaSolicitud)
            setFecha(fechaObj)
            setValue('fechaSolicitud', fechaSolicitudDate)
            setValue('fechaSolicitudString', fechaSolicitud.toISOString())
        }
    }

    const onSubmit = async (dataForm: FormInputs) => {
        setLoading(true)
        try {
            const solicitudCompromisoCreate: Create = {
                codigoSolicitud: dataForm.codigoSolicitud,
                numeroSolicitud: dataForm.numeroSolicitud,
                fechaSolicitud: dataForm.fechaSolicitud,
                codigoSolicitante: dataForm.codigoSolicitante,
                tipoSolicitudId: dataForm.tipoSolicitudId,
                codigoProveedor: dataForm.codigoProveedor,
                motivo: dataForm.motivo,
                nota: dataForm.nota,
                status: dataForm.status,
                codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto
            }

            const responseCreate = await crearSolicitudCompromiso(solicitudCompromisoCreate)

            if (responseCreate?.data.isValid) {
                setTimeout(() => {
                    dispatch(setVerSolicitudCompromisosActive(false))

                    dispatch(setSolicitudCompromisoSeleccionado(responseCreate?.data?.data))
                    dispatch(setOperacionCrudAdmSolCompromiso(CrudOperation.EDIT))
                    dispatch(setVerSolicitudCompromisosActive(true))
                }, 1000)
            }
            setErrorMessage(responseCreate?.data.message)
        } catch (e) {
            console.log(e)
        } finally {
            qc.invalidateQueries({
                queryKey: ['solicitudCompromiso']
            })
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader title='Crear Solicitud Compromiso' />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={3} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='codigoSolicitud'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            type='number'
                                            value={value || ''}
                                            label="Codigo de Solicitud"
                                            onChange={onChange}
                                            placeholder='Codigo de Solicitud'
                                            error={Boolean(errors.codigoSolicitud)}
                                            aria-describedby='validation-async-codigoSolicitud'
                                            inputProps={{ min: 0 }}
                                            disabled
                                        />
                                    )}
                                />
                                {errors.codigoSolicitud && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoSolicitud'>
                                        This field is required
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='descripcionStatus'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Estado de la Solicitud"
                                            onChange={onChange}
                                            placeholder='Estado de la Solicitud'
                                            disabled
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <DatePickerWrapper>
                                <DatePicker
                                    selected={getDateByObject(fecha)}
                                    id='date-time-picker-desde'
                                    dateFormat='dd/MM/yyyy'
                                    popperPlacement={popperPlacement}
                                    onChange={(date: Date) => { handleFechaSolicitudChange(date) }}
                                    placeholderText='Click to select a date'
                                    customInput={<CustomInput label='Fecha Solicitud' />}
                                />
                            </DatePickerWrapper>
                        </Grid>
                        <Grid item sm={5} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='numeroSolicitud'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Numero de Solicitud"
                                            onChange={onChange}
                                            placeholder='Numero de Solicitud'
                                            disabled
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={7} xs={12}>
                            <TipoSolicitud
                                data={0}
                                onSelectionChange={handleTipoSolicitudChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={5} xs={12}>
                            <UnidadSolicitante
                                id={0}
                                onSelectionChange={handleCodigoSolicitanteChange}
                            />
                        </Grid>
                        <Grid item sm={7} xs={12}>
                            <CodigoProveedor
                                data={0}
                                onSelectionChange={handleCodigoProveedorChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={12} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='motivo'
                                    control={control}
                                    rules={{
                                        required: false,
                                        maxLength: 1150,
                                    }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            helperText={
                                                motivoAudioState === 'recording'
                                                    ? "🔴 Grabando audio... Hable ahora."
                                                    : motivoAudioState === 'transcribing'
                                                    ? "⏳ Transcribiendo con Deepgram Nova-3..."
                                                    : motivoConfidence !== null && motivoConfidence < 0.85
                                                    ? `⚠️ Revisa esta parte, no estoy seguro de haber escuchado bien (Confianza: ${(motivoConfidence * 100).toFixed(0)}%)`
                                                    : "Caracteres máximo 1150"
                                            }
                                            FormHelperTextProps={{
                                                sx: { color: motivoConfidence !== null && motivoConfidence < 0.85 ? 'warning.main' : 'text.secondary' }
                                            }}
                                            value={value || ''}
                                            label="Motivo"
                                            inputRef={motivoInputRef}
                                            onChange={(e) => {
                                                onChange(e)
                                                setMotivoConfidence(null)
                                            }}
                                            placeholder='Motivo'
                                            multiline
                                            rows={4}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: motivoConfidence !== null && motivoConfidence < 0.85 ? 'rgba(255, 235, 59, 0.12)' : undefined,
                                                    borderColor: motivoAudioState === 'recording' ? 'red !important' : motivoAudioState === 'transcribing' ? '#9c27b0 !important' : undefined,
                                                    boxShadow: motivoAudioState === 'recording' ? '0 0 8px rgba(255, 0, 0, 0.5)' : motivoAudioState === 'transcribing' ? '0 0 8px rgba(156, 39, 176, 0.5)' : 'none',
                                                    transition: 'all 0.3s ease-in-out',
                                                    '& fieldset': {
                                                        borderColor: motivoAudioState === 'recording' ? 'red !important' : motivoAudioState === 'transcribing' ? '#9c27b0 !important' : undefined,
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: motivoAudioState === 'recording' ? 'red !important' : motivoAudioState === 'transcribing' ? '#9c27b0 !important' : undefined,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: motivoAudioState === 'recording' ? 'red !important' : motivoAudioState === 'transcribing' ? '#9c27b0 !important' : undefined,
                                                    }
                                                }
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <AudioDictateButton
                                                        textValue={value}
                                                        onStateChange={setMotivoAudioState}
                                                        inputRef={motivoInputRef}
                                                        onClear={() => {
                                                            onChange('')
                                                            setMotivoConfidence(null)
                                                        }}
                                                        onTranscriptReceived={(text, confidence) => {
                                                            const currentVal = value || '';
                                                            const start = motivoInputRef.current?.selectionStart ?? currentVal.length;
                                                            const end = motivoInputRef.current?.selectionEnd ?? currentVal.length;
                                                            const before = currentVal.substring(0, start);
                                                            const after = currentVal.substring(end);
                                                            const spaceBefore = before.endsWith(' ') || before.length === 0 ? '' : ' ';
                                                            const spaceAfter = after.startsWith(' ') || after.length === 0 ? '' : ' ';
                                                            const newText = before + spaceBefore + text + spaceAfter + after;
                                                            onChange(newText.toUpperCase().slice(0, 1150));
                                                            if (confidence !== undefined) {
                                                                setMotivoConfidence(confidence);
                                                            }
                                                        }}
                                                    />
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='nota'
                                    control={control}
                                    rules={{
                                        required: false,
                                        maxLength: 1000,
                                    }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            helperText={
                                                notaAudioState === 'recording'
                                                    ? "🔴 Grabando audio... Hable ahora."
                                                    : notaAudioState === 'transcribing'
                                                    ? "⏳ Transcribiendo con Deepgram Nova-3..."
                                                    : notaConfidence !== null && notaConfidence < 0.85
                                                    ? `⚠️ Revisa esta parte, no estoy seguro de haber escuchado bien (Confianza: ${(notaConfidence * 100).toFixed(0)}%)`
                                                    : "Caracteres máximo 1000"
                                            }
                                            FormHelperTextProps={{
                                                sx: { color: notaConfidence !== null && notaConfidence < 0.85 ? 'warning.main' : 'text.secondary' }
                                            }}
                                            value={value || ''}
                                            label="Nota"
                                            inputRef={notaInputRef}
                                            onChange={(e) => {
                                                onChange(e)
                                                setNotaConfidence(null)
                                            }}
                                            placeholder='Nota'
                                            multiline
                                            rows={4}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: notaConfidence !== null && notaConfidence < 0.85 ? 'rgba(255, 235, 59, 0.12)' : undefined,
                                                    borderColor: notaAudioState === 'recording' ? 'red !important' : notaAudioState === 'transcribing' ? '#9c27b0 !important' : undefined,
                                                    boxShadow: notaAudioState === 'recording' ? '0 0 8px rgba(255, 0, 0, 0.5)' : notaAudioState === 'transcribing' ? '0 0 8px rgba(156, 39, 176, 0.5)' : 'none',
                                                    transition: 'all 0.3s ease-in-out',
                                                    '& fieldset': {
                                                        borderColor: notaAudioState === 'recording' ? 'red !important' : notaAudioState === 'transcribing' ? '#9c27b0 !important' : undefined,
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: notaAudioState === 'recording' ? 'red !important' : notaAudioState === 'transcribing' ? '#9c27b0 !important' : undefined,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: notaAudioState === 'recording' ? 'red !important' : notaAudioState === 'transcribing' ? '#9c27b0 !important' : undefined,
                                                    }
                                                }
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <AudioDictateButton
                                                        textValue={value}
                                                        onStateChange={setNotaAudioState}
                                                        inputRef={notaInputRef}
                                                        onClear={() => {
                                                            onChange('')
                                                            setNotaConfidence(null)
                                                        }}
                                                        onTranscriptReceived={(text, confidence) => {
                                                            const currentVal = value || '';
                                                            const start = notaInputRef.current?.selectionStart ?? currentVal.length;
                                                            const end = notaInputRef.current?.selectionEnd ?? currentVal.length;
                                                            const before = currentVal.substring(0, start);
                                                            const after = currentVal.substring(end);
                                                            const spaceBefore = before.endsWith(' ') || before.length === 0 ? '' : ' ';
                                                            const spaceAfter = after.startsWith(' ') || after.length === 0 ? '' : ' ';
                                                            const newText = before + spaceBefore + text + spaceAfter + after;
                                                            onChange(newText.toUpperCase().slice(0, 1000));
                                                            if (confidence !== undefined) {
                                                                setNotaConfidence(confidence);
                                                            }
                                                        }}
                                                    />
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <CardActions sx={{ justifyContent: 'start', paddingLeft: 0 }}>
                        <Button
                            size='large'
                            type='submit'
                            variant='contained'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress
                                        sx={{
                                            color: 'common.white',
                                            width: '20px !important',
                                            height: '20px !important',
                                            mr: theme => theme.spacing(2)
                                        }}
                                    />
                                    Guardando...
                                </>
                            ) : 'Guardar'}
                        </Button>
                    </CardActions>
                    <Box>
                        {errorMessage && (
                            <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{errorMessage}</FormHelperText>
                        )}
                    </Box>
                </form>
            </CardContent>
        </Card>
    )
}

export default FormCreateSolCompromiso