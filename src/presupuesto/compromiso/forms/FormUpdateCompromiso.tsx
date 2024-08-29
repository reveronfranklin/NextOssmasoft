import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { useDispatch } from "react-redux"
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { ICompromiso } from '../interfaces/responseGetAll.interfaces'
import { Box, Card, CardActions, CardContent, CardHeader, CircularProgress, FormControl, FormHelperText, Grid, TextField } from "@mui/material"
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { UpdateCompromiso } from '../interfaces/updateCompromiso.interfaces';
import AnulacionComponent from '../components/Estados/Anulacion'
import AprobacionComponent from '../components/Estados/Aprobacion'
import ViewerPdf from '../components/viewerPdf/viewer'
import useServices from '../services/useServices'

import {
    setVerComrpromisoActive,
    setCompromisoSeleccionado,
} from "src/store/apps/presupuesto"

const FormUpdateCompromiso = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
    const { loading, message, actualizarCompromiso } = useServices()
    const { compromisoSeleccionado } = useSelector((state: RootState) => state.presupuesto)
    const qc: QueryClient = useQueryClient()
    const dispatch = useDispatch()

    const defaultValues: ICompromiso = compromisoSeleccionado as ICompromiso

    const {
        control: controlFormGeneral,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<ICompromiso>({ defaultValues })

    const onSubmit = async (dataForm: ICompromiso): Promise<void> => {
        const compromisoUpdate = {
            ...dataForm,
            codigoCompromiso: compromisoSeleccionado.codigoCompromiso,
            numeroCompromiso: compromisoSeleccionado.numeroCompromiso,
            fechaCompromiso: compromisoSeleccionado.fechaCompromisoString,
            fechaCompromisoObj: compromisoSeleccionado.fechaCompromisoObj,
            nombreProveedor: compromisoSeleccionado.nombreProveedor,
            descripcionStatus: compromisoSeleccionado.descripcionStatus
        }

        const filterUpdateCompromiso: UpdateCompromiso = {
            codigoCompromiso: compromisoUpdate.codigoCompromiso,
            fechaCompromiso: compromisoUpdate.fechaCompromiso,
            motivo: compromisoUpdate.motivo,
        }

        try {
            const response = await actualizarCompromiso(filterUpdateCompromiso)

            if (response?.isValid) {
                qc.invalidateQueries({
                    queryKey: ['tableCompromisos']
                })
                handleClose()
            }
        } catch (e: any) {
            console.error(e)
        }
    }

    const handleClose = (): void => {
        setTimeout(() => {
            dispatch(setVerComrpromisoActive(false))
        }, 2000)
    }

    const handleFechaSolicitudChange = (fechaCompromiso: Date): void => {
        if (dayjs(fechaCompromiso).isValid()) {
            const fechaObj: any = fechaToFechaObj(fechaCompromiso)

            const compromiso: any = {
                ...compromisoSeleccionado,
                fechaCompromiso: fechaCompromiso,
                fechaCompromisoString: fechaCompromiso.toISOString(),
                fechaCompromisoObj: fechaObj
            }

            dispatch(setCompromisoSeleccionado(compromiso))
            setValue('fechaCompromisoString', fechaCompromiso.toISOString())
        }
    }

    return (
        <>
            <AnulacionComponent data={compromisoSeleccionado} />
            <AprobacionComponent data={compromisoSeleccionado} />
            <Card>
                <CardHeader title='Presupuesto - Modificar Compromiso' />
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2} paddingTop={5}>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    label='Código Compromiso'
                                    variant='outlined'
                                    value={compromisoSeleccionado.codigoCompromiso }
                                    name='codigo compromiso'
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label='Numero Compromiso'
                                    variant='outlined'
                                    value={compromisoSeleccionado.numeroCompromiso }
                                    name='codigo compromiso'
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    fullWidth
                                    label='Estado'
                                    variant='outlined'
                                    value={compromisoSeleccionado.descripcionStatus}
                                    name='codigo compromiso'
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <DatePickerWrapper style={{ width: '100%' }}>
                                    <DatePicker
                                        selected={getDateByObject(compromisoSeleccionado.fechaCompromisoObj)}
                                        id='date-time-picker-desde'
                                        dateFormat='dd/MM/yyyy'
                                        popperPlacement={popperPlacement}
                                        onChange={(date: Date) => { handleFechaSolicitudChange(date) }}
                                        placeholderText='Click to select a date'
                                        customInput={<CustomInput label='Fecha Solicitud' />}
                                    />
                                </DatePickerWrapper>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={5}>
                        <Grid item sm={12} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='motivo'
                                    control={controlFormGeneral}
                                    rules={{
                                        required: false,
                                        maxLength: 1150,
                                    }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            helperText="Caracteres máximo 1150"
                                            value={value || ''}
                                            label="Motivo"
                                            onChange={onChange}
                                            placeholder='Motivo'
                                            error={Boolean(errors.motivo)}
                                            aria-describedby='validation-async-motivo'
                                            multiline
                                            rows={5}
                                        />
                                    )}
                                />
                                {errors.motivo && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-motivo'></FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={5}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    fullWidth
                                    label='Nombre Proveedor'
                                    variant='outlined'
                                    value={ compromisoSeleccionado.nombreProveedor }
                                    name='codigo compromiso'
                                    disabled={true}
                                />
                            </Grid>
                        </Grid>
                        <CardActions sx={{ justifyContent: 'start', paddingLeft: 0 }}>
                            <Button size='large' type='submit' variant='contained'>
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
                                        Guardando...
                                    </>
                                ) : 'Guardar'}
                            </Button>
                        </CardActions>
                        <Box>
                            {message && (
                                <FormHelperText sx={{ color: 'error.main', fontSize: 15, mt: 5 }}>{message}</FormHelperText>
                            )}
                        </Box>
                    </form>
                    <ViewerPdf data={compromisoSeleccionado} />
                </CardContent>
            </Card>
        </>
    )
}

export default FormUpdateCompromiso