import { Card, CardActions, Button, CardContent, CardHeader, FormControl, FormHelperText, Grid, TextField, CircularProgress, Box } from "@mui/material"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { FormInputs } from './../../interfaces/detalle/formImputs.interfaces'
import { CreateDetalle } from '../../interfaces/detalle/create.interfaces'
import useServices from './../../services/useServices';
import TipoImpuesto from '../../components/autocomplete/TipoImpuesto'
import TipoUnidades from '../../components/autocomplete/TipoUnidades'
import ListProducts from '../../components/autocomplete/ListProductos'
import calculatePrice from '../../helpers/calculoTotalPrecioDetalle'
import formatPrice from '../../helpers/formateadorPrecio'
import { NumericFormat } from 'react-number-format'
import { useQueryClient, QueryClient } from '@tanstack/react-query';

const CreateDetalleSolicitudCompromiso = () => {
    const [cantidad, setCantidad] = useState<number>(0)
    const [precioUnitario, setPrecioUnitario] = useState<number>(0)
    const [impuesto, setImpuesto] = useState<number>(0)
    const [total, setTotal] = useState<any>(0)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const { codigoSolicitud } = useSelector((state: RootState) => state.admSolicitudCompromiso.solicitudCompromisoSeleccionado)
    const { fetchCreateDetalleSolicitudCompromiso } = useServices()
    const qc: QueryClient = useQueryClient()

    const defaultValues: any = {
        codigoDetalleSolicitud: 0,
        codigoSolicitud,
        cantidad: 0,
        udmId: 0,
        descripcion: '',
        precioUnitario: 0,
        tipoImpuestoId: 0,
        codigoProducto: 0,
    }

    const {
        control,
        handleSubmit: handleSubmitCreateDetalle,
        setValue,
        reset,
        formState: { errors }
    } = useForm<FormInputs>({ defaultValues })

    const handleTipoImpuestoChange = (tipoImpuesto: any) => {
        setValue('tipoImpuestoId', tipoImpuesto.id)
        setImpuesto(tipoImpuesto.value)
        setErrorMessage('')
    }

    const handleTipoUnidadChange = (tipoUnidad: number) => {
        setValue('udmId', tipoUnidad)
        setErrorMessage('')
    }

    const handleProductChange = (producto: number) =>{
        setValue('codigoProducto', producto)
        setErrorMessage('')
    }

    const calculoTotalPrecio = () => {
        const typeCurrency = 'VES'

        if (cantidad < 0 || precioUnitario < 0) {
            setTotal(0)

            return
        }

        setTotal(formatPrice(calculatePrice(precioUnitario, cantidad, impuesto), typeCurrency))
    }

    useEffect(() => {
        calculoTotalPrecio()
        setErrorMessage('')
    }, [cantidad, precioUnitario, impuesto])


    const resetForm = () => {
        setCantidad(0)
        setPrecioUnitario(0)
        reset()
    }

    const onSubmitCreateDetalle = async (dataForm: FormInputs) => {
        setLoading(true)
        const nuevoDetalle: CreateDetalle = {
            codigoDetalleSolicitud: dataForm.codigoDetalleSolicitud,
            codigoSolicitud: dataForm.codigoSolicitud,
            cantidad: cantidad,
            udmId: dataForm.udmId,
            descripcion: dataForm.descripcion,
            precioUnitario: precioUnitario,
            tipoImpuestoId: dataForm.tipoImpuestoId,
            codigoProducto: dataForm.codigoProducto,
        }

        if (dataForm.descripcion === null || dataForm.descripcion == '') {
            nuevoDetalle.descripcion = 'Sin descripción'
        }
console.log('nuevoDetalle',nuevoDetalle)
        try {
            const responseCreateDetalle = await fetchCreateDetalleSolicitudCompromiso(nuevoDetalle)

            if (responseCreateDetalle?.data.isValid) {
                qc.invalidateQueries({
                    queryKey: ['detalleSolicitudCompromiso', codigoSolicitud]
                })
            }

            setErrorMessage(responseCreateDetalle?.data.message)

        }   catch (error) {
            setErrorMessage('Error al crear el detalle')
        }
        setLoading(false)
    }

    return (
        <Card sx={{
            border: 0,
            boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.1)',
            marginBottom: 5,
            backgroundColor: '#fff',
        }}>
            <CardHeader title='Crear detalle' />
            <CardContent>
                <form onSubmit={handleSubmitCreateDetalle(onSubmitCreateDetalle)}>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={2} xs={12}>
                            <NumericFormat
                                value={cantidad}
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
                                    setErrorMessage('')
                                }}
                                placeholder='Cantidad'
                                error={Boolean(errors.codigoSolicitud)}
                                aria-describedby='validation-async-cantidad'
                                inputProps={{
                                    type: 'text',
                                }}
                            />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <TipoUnidades
                                id={defaultValues.udmId}
                                onSelectionChange={handleTipoUnidadChange}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <ListProducts
                                id={defaultValues.codigoProducto}
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
                            <NumericFormat
                                value={precioUnitario}
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
                            onClick={handleSubmitCreateDetalle(onSubmitCreateDetalle)}
                            size='small'
                            variant='contained'
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
    )
}

export default CreateDetalleSolicitudCompromiso