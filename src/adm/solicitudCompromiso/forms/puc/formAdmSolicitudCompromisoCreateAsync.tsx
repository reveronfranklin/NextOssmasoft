import { Button, Card, CardContent, CardHeader, Grid, Typography, TextField, CircularProgress, Box, CardActions, FormHelperText } from '@mui/material'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { RootState } from 'src/store'
import { setVerPreSaldoDisponibleActive, setPreSaldoDisponibleSeleccionado } from 'src/store/apps/pre-saldo-disponible'
import { NumericFormat } from 'react-number-format'
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreatePuc } from 'src/adm/solicitudCompromiso/interfaces/puc/create.interfaces'
import { FormInputs } from 'src/adm/solicitudCompromiso/interfaces/puc/formImputs.interfaces'
import formatNumber from '../../helpers/formateadorNumeros'
import useServices from './../../services/useServices';
import DialogPreSaldoDisponibleInfo from 'src/presupuesto/preSaldoPendiente/views/DialogPreSaldoDisponibleInfo'

const CreatePucDetalleSolicitudCompromiso = (props: any) => {
    const [monto, setMonto] = useState<number>(0)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const { fetchPucCreate } = useServices()
    const qc: QueryClient = useQueryClient()

    const defaultValues: FormInputs = {
        codigoPucSolicitud: 0,
        codigoDetalleSolicitud: props.codigoDetalleSolicitud,
        codigoSolicitud: props.codigoSolicitud,
        codigoSaldo: 0,
        codigoIcp: 0,
        codigoPuc: 0,
        financiadoId: 0,
        codigoFinanciado: 0,
        monto: 0,
        montoComprometido: 0,
        montoAnulado: 0,
        codigoPresupuesto: 0,
    }

    const dispatch = useDispatch()
    const { preSaldoDisponibleSeleccionado } = useSelector((state: RootState) => state.preSaldoDisponible)

    const {
        handleSubmit: handleSubmitCreatePuc,
        reset
    } = useForm<FormInputs>({ defaultValues })

    const viewPreSaldoPendiente = () => {
        dispatch(setVerPreSaldoDisponibleActive(true))
    }

    useEffect(() => {
        if (preSaldoDisponibleSeleccionado.disponible) {
            if (monto > preSaldoDisponibleSeleccionado.disponible) {
                setErrorMessage('Por favor, verifica el monto. No puede sobrepasar la disponibilidad de la partida.')
            }
        }
    }, [monto])

    const onSubmitPuc = async () => {
        setLoading(true)

        const newPuc: CreatePuc = {
            codigoPucSolicitud: defaultValues.codigoPucSolicitud,
            codigoDetalleSolicitud: defaultValues.codigoDetalleSolicitud,
            codigoSolicitud: defaultValues.codigoSolicitud,
            codigoSaldo: preSaldoDisponibleSeleccionado?.codigoSaldo ?? defaultValues.codigoSaldo,
            codigoIcp: preSaldoDisponibleSeleccionado?.codigoIcp ?? defaultValues.codigoIcp,
            codigoPuc: preSaldoDisponibleSeleccionado?.codigoPuc ?? defaultValues.codigoPuc,
            financiadoId: preSaldoDisponibleSeleccionado?.financiadoId ?? defaultValues.financiadoId,
            codigoFinanciado: preSaldoDisponibleSeleccionado?.codigoFinanciado ?? defaultValues.codigoFinanciado,
            monto: monto,
            montoComprometido: defaultValues.montoComprometido,
            montoAnulado: defaultValues.montoAnulado,
            codigoPresupuesto: defaultValues.codigoPresupuesto,
        }
        try {
            if (monto <= 0) {
                setErrorMessage('El monto debe ser mayor a 0. Por favor, ingrese un monto válido.')
                setLoading(false)

                return
            }

            const responseCreatePuc = await fetchPucCreate(newPuc)

            if (responseCreatePuc?.data.isValid) {
                qc.invalidateQueries({
                    queryKey: ['pucDetalleSolicitud', props.codigoDetalleSolicitud]
                })
            }
            setErrorMessage(responseCreatePuc?.data.message)
        } catch (e: any) {
            console.log(e)
            setErrorMessage('Error al crear el PUC')
        }
        setLoading(false)
    }
    const resetForm = () => {
        reset(defaultValues)
        setMonto(0)
        setErrorMessage('')
        setLoading(false)
        dispatch(setPreSaldoDisponibleSeleccionado({}))
    }

    return (
        <>
            <Card>
                <CardHeader title='Crear ICP-PUC' />
                <CardContent>
                    <form onSubmit={handleSubmitCreatePuc(onSubmitPuc)}>
                        <Grid container spacing={5} paddingTop={5} justifyContent="flex">
                            <Grid item sm={5} xs={12}>
                                { preSaldoDisponibleSeleccionado && (
                                    <>
                                        <small>ICP:</small>
                                        <Grid item sm={12} xs={12} sx={{ marginTop: '10px' }}>
                                            <Typography variant='subtitle2' gutterBottom>
                                                {preSaldoDisponibleSeleccionado.codigoIcpConcat}
                                            </Typography>
                                            <Typography variant='subtitle2' gutterBottom>
                                                {preSaldoDisponibleSeleccionado.denominacionIcp}
                                            </Typography>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                            <Grid item sm={5} xs={12}>
                                { preSaldoDisponibleSeleccionado && (
                                    <>
                                        <small>PUC:</small>
                                        <Grid item sm={12} xs={12} sx={{ marginTop: '10px' }}>
                                            <Typography variant='subtitle2' gutterBottom>
                                                {preSaldoDisponibleSeleccionado.codigoPucConcat}
                                            </Typography>
                                            <Typography variant='subtitle2' gutterBottom>
                                                {preSaldoDisponibleSeleccionado.denominacionPuc}
                                            </Typography>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                            <Grid item sm={2} xs={12}>
                                {preSaldoDisponibleSeleccionado && (
                                    <>
                                        <small>Financiado:</small>
                                        <Grid item sm={12} xs={12} sx={{ marginTop: '10px' }}>
                                            <Typography variant='subtitle2' gutterBottom>
                                                {preSaldoDisponibleSeleccionado.denominacionFinanciado}
                                            </Typography>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                            <Grid item sm={5} xs={12}>
                                {preSaldoDisponibleSeleccionado && (
                                    <>
                                        <small>Disponible:</small>
                                        <Grid item sm={12} xs={12} sx={{ marginTop: '10px' }}>
                                            <Typography variant='subtitle2' gutterBottom>
                                                { formatNumber(preSaldoDisponibleSeleccionado?.disponible) }
                                            </Typography>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                            <Grid item sm={7} xs={12} justifyContent="flex-end" sx={{ width: '100%' }}>
                                <NumericFormat
                                    value={monto}
                                    customInput={TextField}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    allowNegative={false}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    label="Monto"
                                    onFocus={(event) => {
                                        event.target.select()
                                    }}
                                    onValueChange={(values: any) => {
                                        const { value } = values
                                        setMonto(parseFloat(value) || 0)
                                        setErrorMessage('')
                                    }}
                                    placeholder='Monto'
                                    inputProps={{
                                        type: 'text',
                                        autoFocus: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <CardActions sx={{ justifyContent: 'start', paddingLeft: 0, marginTop: 1 }}>
                            <Button
                                onClick={handleSubmitCreatePuc(onSubmitPuc)}
                                size='small'
                                variant='contained'
                                disabled={errorMessage.length > 0 ? true : false}
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
                                        Guardando...
                                    </>
                                ) : '+ Añadir'}
                            </Button>
                            <Button variant='contained' color='success' size='small' onClick={viewPreSaldoPendiente}>
                                VER SALDOS
                            </Button>
                            <Button
                                onClick={resetForm}
                                variant='outlined'
                                size='small'
                            >
                                Limpiar
                            </Button>
                        </CardActions>
                        <Box>
                            {errorMessage && errorMessage.length > 0 && (
                                <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>
                                    { errorMessage }
                                </FormHelperText>
                            )}
                        </Box>
                    </form>
                </CardContent>
            </Card>
            <DialogPreSaldoDisponibleInfo />
        </>
    )
}

export default CreatePucDetalleSolicitudCompromiso