import { Card, CardActions, Button, CardContent, CardHeader, FormControl, FormHelperText, Grid, TextField, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { FormInputs } from "./../../interfaces/detalle/formImputs.interfaces"
import useServices from './../../services/useServices';

import TipoImpuesto from '../../components/autocomplete/TipoImpuesto'
import TipoUnidades from '../../components/autocomplete/TipoUnidades'
import ListProducts from '../../components/autocomplete/ListProductos'

import calculatePrice from '../../helpers/calculoTotalPrecioDetalle'
import formatPrice from '../../helpers/formateadorPrecio'
import { NumericFormat } from 'react-number-format'

const createDetalleSolicitudCompromiso = () => {
    const [cantidad, setCantidad] = useState<any>('')
    const [precioUnitario, setPrecioUnitario] = useState<any>('')
    const [impuesto, setImpuesto] = useState<number>(0)
    const [total, setTotal] = useState<any>(0)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const { createDetalleSolicitudCompromiso } = useServices()

    const defaultValues: any = {
        codigoDetalleSolicitud: '',
        cantidad: 0,
        precioUnitario: 0,
        udmId: 0,
        tipoImpuestoId: 0,
        descripcionUnidad: '',
        descripcion: '',
    }

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({ defaultValues })

    const handleTipoImpuestoChange = (tipoImpuesto: any) => {
        setValue('tipoImpuestoId', tipoImpuesto.id)
        setImpuesto(tipoImpuesto.value)
    }

    const handleTipoUnidadChange = (tipoUnidad: number) => {
        setValue('udmId', tipoUnidad)
    }

    const handleProductChange = (udmId: number) =>{
        setValue('udmId', udmId)
    }

    useEffect(() => {
        calculoTotalPrecio()
    }, [cantidad, precioUnitario, impuesto])

    const onSubmit = async (dataForm: FormInputs) => {
        const nuevoDetalle: any = {
            cantidad: dataForm.cantidad,
            precioUnitario: dataForm.precioUnitario,
            udmId: dataForm.udmId,
            tipoImpuestoId: dataForm.tipoImpuestoId,
            descripcionUnidad: dataForm.descripcionUnidad,
            descripcion: dataForm.descripcion,
        }

        console.log(nuevoDetalle)
        //const responseCreateDetalle = await createDetalleSolicitudCompromiso(nuevoDetalle)

        //if (responseCreateDetalle?.data?.isValid) {
            //todo tiene que hacerse unas tareas como actualizar la tabla con el nuevo detalle creado
        //}
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

    return (
        <Card sx={{
            border: 0,
            boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.1)',
            marginBottom: 5,
            backgroundColor: '#fff',
        }}>
            <CardHeader title='Crear un nuevo detalle' />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={2} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='cantidad'
                                    control={control}
                                    rules={{
                                        required: false,
                                        min: 0,
                                    }}
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
                        <Grid item sm={4} xs={12}>
                            <TipoUnidades
                                id={defaultValues.udmId}
                                onSelectionChange={handleTipoUnidadChange}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <ListProducts
                                id={defaultValues.udmId}
                                onSelectionChange={handleProductChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
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
                                            helperText="Caracteres máximo 1000"
                                            value={value || ''}
                                            label="Descripcion"
                                            onChange={onChange}
                                            placeholder='Descripcion'
                                            error={Boolean(errors.descripcion)}
                                            aria-describedby='validation-async-descripcion'
                                            multiline
                                            rows={4}
                                        />
                                    )}
                                />
                                {errors.descripcion && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-descripcion'></FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
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
                        <Grid item sm={6} xs={12}>
                            <TipoImpuesto
                                id={defaultValues.tipoImpuestoId}
                                onSelectionChange={handleTipoImpuestoChange}
                            />
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
                        <Button
                            onClick={() => onSubmit(defaultValues)}
                            size='small'
                            type='button'
                            variant='contained'>
                            {loading ? (
                                <CircularProgress
                                    sx={{
                                        color: 'common.white',
                                        width: '20px !important',
                                        height: '20px !important',
                                        mr: theme => theme.spacing(2)
                                    }}
                                />
                            ) : null}
                            + Añadir
                        </Button>
                    </CardActions>
                </form>
            </CardContent>
        </Card>
    )
}

export default createDetalleSolicitudCompromiso