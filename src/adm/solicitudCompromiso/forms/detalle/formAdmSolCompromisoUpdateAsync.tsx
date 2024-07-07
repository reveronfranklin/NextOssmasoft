import { Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, Grid, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { FormInputs } from "./../../interfaces/detalle/formImputs.interfaces"

import { useEffect, useState } from "react"

import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { useDispatch } from "react-redux"

import TipoImpuesto from '../../components/autocomplete/TipoImpuesto'
import TipoUnidades from '../../components/autocomplete/TipoUnidades'
import useServices from "../../services/useServices";

import toast from 'react-hot-toast'

import calculatePrice from '../../helpers/calculoTotalPrecioDetalle'
import formatPrice from '../../helpers/formateadorPrecio'
import { NumericFormat } from 'react-number-format'

import ListProducts from '../../components/autocomplete/ListProductos'

const updateDetalleSolicitudCompromiso = () => {
    const [cantidad, setCantidad] = useState<any>('')
    const [precioUnitario, setPrecioUnitario] = useState<any>('')
    const [impuesto, setImpuesto] = useState<number>(0)
    const [total, setTotal] = useState<any>(0)

    const { updateDetalleSolicitudCompromiso, deleteDetalleSolicitudCompromiso } = useServices()

    const { solicitudCompromisoSeleccionadoDetalle } = useSelector((state: RootState) => state.admSolicitudCompromiso)
    const defaultValues: FormInputs = solicitudCompromisoSeleccionadoDetalle

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({ defaultValues })

    const handleTipoImpuestoChange = (tipoImpuesto: any) => {
        setValue('tipoImpuestoId', tipoImpuesto.id)
        setImpuesto(tipoImpuesto.value)
    }

    const handleProductChange = (udmId: number) => {
        setValue('udmId', udmId)
    }

    const handleTipoUnidadChange = (tipoUnidad: number) => {
        setValue('udmId', tipoUnidad)
    }

    const calculoTotalPrecio = () => {
        const typeCurrency = 'VES'
        const cantidadInt = cantidad === '' ? 0 : parseFloat(cantidad)
        const precioUnitarioInt = precioUnitario === '' ? 0 : parseFloat(precioUnitario)

        if (cantidadInt < 0 || precioUnitarioInt < 0) {
            setTotal(0)
            return
        }

        setTotal(formatPrice(calculatePrice(precioUnitarioInt, cantidadInt, impuesto), typeCurrency))
    }

    useEffect(() => {
        calculoTotalPrecio()
    }, [cantidad, precioUnitario, impuesto])

    const onSubmitDetalle = async (dataForm: FormInputs) => {
        alert('Form Submitted detalle')
        // const responseUpdate = await updateDetalleSolicitudCompromiso(dataForm)

        // if (responseUpdate) {
        //     toast.success('Form Submitted')
        // }
    }

    return (
        <Card>
            <CardHeader title='Editar detalle solicitud' />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmitDetalle)}>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={2} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='codigoDetalleSolicitud'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Codigo de Detalle"
                                            onChange={onChange}
                                            placeholder='Codigo de Detalle Solicitud'
                                            error={Boolean(errors.codigoSolicitud)}
                                            aria-describedby='validation-async-codigoDetalle'
                                            disabled
                                        />
                                    )}
                                />
                                {errors.codigoSolicitud && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoDetalle'>
                                        This field is required
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='cantidad'
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <NumericFormat
                                            value={value}
                                            customInput={TextField}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            allowNegative={false}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            label="cantidad"
                                            onValueChange={(values: any) => {
                                                const { value } = values
                                                setCantidad(value)
                                            }}
                                            placeholder='Cantidad'
                                            error={Boolean(errors.codigoSolicitud)}
                                            aria-describedby='validation-async-cantidad'
                                            inputProps={{
                                                type: 'text',
                                            }}
                                        />
                                    )}
                                />
                                {errors.codigoSolicitud && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-cantidad'>
                                        This field is required
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='precioUnitario'
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <NumericFormat
                                            value={value}
                                            customInput={TextField}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            allowNegative={false}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            label="Precio Unitario"
                                            onValueChange={(values: any) => {
                                                const { value } = values
                                                setPrecioUnitario(value)
                                            }}
                                            placeholder='Precio Unitario'
                                            error={Boolean(errors.codigoSolicitud)}
                                            aria-describedby='validation-async-cantidad'
                                            inputProps={{
                                                type: 'text',
                                            }}
                                        />
                                    )}
                                />
                                {errors.codigoSolicitud && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-cantidad-comprada'>
                                        This field is required
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <ListProducts
                                id={defaultValues.udmId}
                                onSelectionChange={handleProductChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5} >
                        <Grid item sm={6} xs={12}>
                            <TipoUnidades
                                id={defaultValues.udmId}
                                onSelectionChange={handleTipoUnidadChange}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TipoImpuesto
                                id={defaultValues.tipoImpuestoId}
                                onSelectionChange={handleTipoImpuestoChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5} >
                        <Grid item sm={12} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='descripcion'
                                    control={control}
                                    rules={{
                                        required: false,
                                    }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value || ''}
                                            label="Descripcion"
                                            onChange={onChange}
                                            placeholder='Descripcion'
                                            error={Boolean(errors.descripcion)}
                                            aria-describedby='validation-async-descripcion'
                                            multiline
                                            rows={5}
                                        />
                                    )}
                                />
                                {errors.descripcion && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-descripcion'></FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <TextField
                                value={total || 0}
                                label="PrecioTotal"
                                placeholder='precio unitario'
                                error={Boolean(errors.codigoSolicitud)}
                                aria-describedby='validation-async-cantidad-comprada'
                            />
                        </Grid>
                    </Grid>
                    <CardActions sx={{ justifyContent: 'start', paddingLeft: 0 }}>
                        <Button size='large' type='submit' variant='contained'>
                            {false ? (
                                <CircularProgress
                                    sx={{
                                        color: 'common.white',
                                        width: '20px !important',
                                        height: '20px !important',
                                        mr: theme => theme.spacing(2)
                                    }}
                                />
                            ) : null}
                            Guardar
                        </Button>
                        <Button variant='outlined' size='large' onClick={() => {}}>
                            Eliminar
                        </Button>
                        <Dialog
                            open={false}
                            onClose={() => {}}
                            aria-labelledby='alert-dialog-title'
                            aria-describedby='alert-dialog-description'
                        >
                            <DialogTitle id='alert-dialog-title'>
                                {'Esta Seguro de Eliminar esta solicitud de Compromiso?'}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id='alert-dialog-description'>
                                    Se eliminaran los datos de esta solicitud de compromiso
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button>No</Button>
                                <Button autoFocus>
                                    Si
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </CardActions>
                </form>
            </CardContent>
        </Card>
    )
}

export default updateDetalleSolicitudCompromiso