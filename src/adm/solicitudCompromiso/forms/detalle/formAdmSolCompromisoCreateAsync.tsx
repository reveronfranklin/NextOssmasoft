import { Card, CardActions, Button, CardContent, CardHeader, FormControl, FormHelperText, Grid, TextField, CircularProgress, Box, Tooltip, IconButton } from "@mui/material"
import { useEffect, useState, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { FormInputs } from './../../interfaces/detalle/formImputs.interfaces'
import { CreateDetalle } from '../../interfaces/detalle/create.interfaces'
import { NumericFormat } from 'react-number-format'
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { useDispatch } from "react-redux";
import { Product } from './../../components/Productos/interfaces/product.interfaces'
import useServices from './../../services/useServices';
import TipoImpuesto from '../../components/Autocomplete/TipoImpuesto'
import TipoUnidades from '../../components/Autocomplete/TipoUnidades'
import calculatePrice from '../../helpers/calculoTotalPrecioDetalle'
import formatPrice from '../../helpers/formateadorPrecio'
import DialogListProductsInfo from './../../components/Productos/view/DialogListProductsInfo'
import Icon from 'src/@core/components/icon'
import { setProductSeleccionado, setVerDialogListProductsInfoActive } from 'src/store/apps/adm'

const CreateDetalleSolicitudCompromiso = () => {
    const [cantidad, setCantidad] = useState<any>(0)
    const [precioUnitario, setPrecioUnitario] = useState<any>(0)
    const [total, setTotal] = useState<any>(0)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [udmId, setUdmId] = useState<number>(0)
    const [impuesto, setImpuesto] = useState<number>(0)
    

    const { codigoSolicitud } = useSelector((state: RootState) => state.admSolicitudCompromiso.solicitudCompromisoSeleccionado)

    const productSeleccionado: Product = useSelector((state: RootState) => state.admSolicitudCompromiso.productSeleccionado)
    const labelProduct = productSeleccionado?.codigoConcat + ' - ' + productSeleccionado?.descripcion

    const { fetchCreateDetalleSolicitudCompromiso } = useServices()
    const qc: QueryClient = useQueryClient()
    const dispatch = useDispatch()

    const autocompleteRef = useRef()

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

    useEffect(() => {
        dispatch(setProductSeleccionado(null))
    }, [])

    useEffect(() => {
        if (productSeleccionado) {
            setValue('codigoProducto', productSeleccionado?.codigo)
        }
    }, [productSeleccionado])

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
        setUdmId(tipoUnidad)
        setValue('udmId', tipoUnidad)
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
        dispatch(setProductSeleccionado(null))
        setCantidad(0)
        setPrecioUnitario(0)
        setLoading(false)
        reset()
        setUdmId(0)
        setImpuesto(0)
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

        try {
            const responseCreateDetalle = await fetchCreateDetalleSolicitudCompromiso(nuevoDetalle)

            if (responseCreateDetalle?.data.isValid) {
                qc.invalidateQueries({
                    queryKey: ['detalleSolicitudCompromiso', dataForm.codigoSolicitud]
                })
            }

            setErrorMessage(responseCreateDetalle?.data.message)

        } catch (error) {
            console.error(error)
            setErrorMessage('Error al crear el detalle')
        }

        setLoading(false)
    }

    const viewDialogListProduct = () => {
        dispatch(setVerDialogListProductsInfoActive(true))
    }

    return (
        <>
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
                                    onFocus={(event) => {
                                        event.target.select()
                                    }}
                                    onValueChange={(values: any) => {
                                        const { value } = values
                                        setCantidad(value)
                                    }}
                                    placeholder='0,00'
                                    error={Boolean(errors.codigoSolicitud)}
                                    aria-describedby='validation-async-cantidad'
                                    inputProps={{
                                        type: 'text',
                                        inputMode: 'numeric',
                                        autoFocus: true
                                    }}
                                />
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                <TipoUnidades
                                    id={udmId}
                                    onSelectionChange={handleTipoUnidadChange}
                                    autocompleteRef={autocompleteRef}
                                />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        variant="outlined"
                                        style={{ flex: 1, border: 'none', borderRight: 'none', marginRight: '10px' }}
                                        value={labelProduct}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="large"
                                        onClick={viewDialogListProduct}
                                        style={{ height: '100%', borderRadius: '10', padding: '13px' }}
                                    >
                                        <Tooltip title='ver Productos'>
                                            <IconButton size='small'>
                                                <Icon icon='mdi:search' color="white" fontSize={20} />
                                            </IconButton>
                                        </Tooltip>
                                    </Button>
                                </Box>
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
                                    onFocus={(event) => {
                                        event.target.select()
                                    }}
                                    onValueChange={(values: any) => {
                                        const { value } = values
                                        setPrecioUnitario(value)
                                    }}
                                    placeholder='0,00'
                                    error={Boolean(errors.codigoSolicitud)}
                                    aria-describedby='validation-async-cantidad'
                                    inputProps={{
                                        type: 'text',
                                        inputMode: 'numeric',
                                        autoFocus: true,
                                    }}
                                />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TipoImpuesto
                                    id={impuesto}
                                    onSelectionChange={handleTipoImpuestoChange}
                                    autocompleteRef={autocompleteRef}
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
                                    {errorMessage}
                                </FormHelperText>
                            )}
                        </Box>
                    </form>
                </CardContent>
            </Card>
            <DialogListProductsInfo />
        </>
    )
}

export default CreateDetalleSolicitudCompromiso