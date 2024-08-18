import { Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, Grid, IconButton, TextField, Tooltip } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { FormInputs } from "./../../interfaces/detalle/formImputs.interfaces"
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import TipoImpuesto from '../../components/Autocomplete/TipoImpuesto'
import TipoUnidades from '../../components/Autocomplete/TipoUnidades'
import useServices from "../../services/useServices";
import calculatePrice from '../../helpers/calculoTotalPrecioDetalle'
import formatPrice from '../../helpers/formateadorPrecio'
import { NumericFormat } from 'react-number-format'
import { UpdateDetalle } from '../../interfaces/detalle/update.interfaces'
import { DeleteDetalle } from '../../interfaces/detalle/delete.interfaces'
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { setVerSolicitudCompromisoDetalleActive } from "src/store/apps/adm"
import { useDispatch } from "react-redux"

import Icon from 'src/@core/components/icon'
import { setVerDialogListProductsInfoActive } from 'src/store/apps/adm'
import IndexPucSolicitudCompromiso from '../puc/formAdmSolicitudCompromisoIndexAsync'

import { Product } from './../../components/Productos/interfaces/product.interfaces'

const UpdateDetalleSolicitudCompromiso = () => {
    const { solicitudCompromisoSeleccionadoDetalle } = useSelector((state: RootState) => state.admSolicitudCompromiso)

    const [cantidad, setCantidad] = useState<number>(solicitudCompromisoSeleccionadoDetalle.cantidad)
    const [precioUnitario, setPrecioUnitario] = useState<number>(solicitudCompromisoSeleccionadoDetalle.precioUnitario)
    const [impuesto, setImpuesto] = useState<number>(solicitudCompromisoSeleccionadoDetalle.porImpuesto)
    const [codigoProducto, setCodigoProducto] = useState<number>(solicitudCompromisoSeleccionadoDetalle.codigoProducto)
    const [total, setTotal] = useState<number>(solicitudCompromisoSeleccionadoDetalle.totalMasImpuesto)

    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)

    const dispatch = useDispatch()

    const { fetchUpdateDetalleSolicitudCompromiso, fetchDeleteDetalleSolicitudCompromiso } = useServices()

    const productSeleccionado: Product = useSelector((state: RootState) => state.admSolicitudCompromiso.productSeleccionado)

    const labelProduct = productSeleccionado?.codigo ? `${productSeleccionado?.codigo} - ${productSeleccionado?.descripcion}` : `${solicitudCompromisoSeleccionadoDetalle?.codigoProducto} - ${solicitudCompromisoSeleccionadoDetalle?.descripcionProducto}`

    const defaultValues: FormInputs = solicitudCompromisoSeleccionadoDetalle
    const qc: QueryClient = useQueryClient()

    const {
        control: controlFormDetalle,
        handleSubmit: handleSubmitDetalle,
        setValue,
        formState: { errors }
    } = useForm<FormInputs>({ defaultValues })

    useEffect(() => {
        setCodigoProducto(productSeleccionado?.codigo)
    }, [productSeleccionado])

    const handleTipoImpuestoChange = (tipoImpuesto: any) => {
        setValue('tipoImpuestoId', tipoImpuesto.id)
        setImpuesto(tipoImpuesto.value)
    }

    const handleTipoUnidadChange = (tipoUnidad: number) => {
        setValue('udmId', tipoUnidad)
    }

    const handleDeleteDetalle = async () => {
        try {
            setLoadingDelete(true)
            const data: DeleteDetalle = {
                codigoDetalleSolicitud: defaultValues.codigoDetalleSolicitud,
            }
            const responseDelete = await fetchDeleteDetalleSolicitudCompromiso(data)
            if (responseDelete?.data.isValid) {
                qc.invalidateQueries({
                    queryKey: ['detalleSolicitudCompromiso', defaultValues.codigoSolicitud]
                })
                handleClose()
                handleCloseModalDetalleUpdate()
            }
            setErrorMessage(responseDelete?.data.message)
            setLoadingDelete(false)
        } catch (e: any) {
            console.log(e)
        }
    }

    const calculoTotalPrecio = () => {
        let responseCalculePrice = 0
        const typeCurrency = 'VES'

        if (cantidad < 0 || precioUnitario < 0) {
            setTotal(0)

            return
        }

        responseCalculePrice = parseFloat(formatPrice(calculatePrice(precioUnitario, cantidad, impuesto), typeCurrency))

        if (responseCalculePrice !== defaultValues.totalMasImpuesto) {
            setTotal(responseCalculePrice)

            return
        } else {
            setTotal(responseCalculePrice)
        }
    }

    useEffect(() => {
        calculoTotalPrecio()
    }, [cantidad, precioUnitario, impuesto])

    const onSubmitDetalleUpdate = async (dataForm: FormInputs) => {
        setLoading(true)
        const data: UpdateDetalle = {
            codigoDetalleSolicitud: dataForm.codigoDetalleSolicitud,
            codigoSolicitud: dataForm.codigoSolicitud,
            cantidad: cantidad === 0 ? dataForm.cantidad : cantidad,
            udmId: dataForm.udmId,
            descripcion: dataForm.descripcion,
            precioUnitario: precioUnitario === 0 ? dataForm.precioUnitario : precioUnitario,
            tipoImpuestoId: dataForm.tipoImpuestoId,
            codigoProducto: codigoProducto,
        }

        const responseUpdate = await fetchUpdateDetalleSolicitudCompromiso(data)

        if (responseUpdate?.data.isValid) {
            qc.invalidateQueries({
                queryKey: ['detalleSolicitudCompromiso', defaultValues.codigoSolicitud]
            })
            handleCloseModalDetalleUpdate()
        }
        setErrorMessage(responseUpdate?.data.message)
        setLoading(false)
    }

    const handleDialogOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleCloseModalDetalleUpdate = () => {
        setTimeout(() => {
            dispatch(setVerSolicitudCompromisoDetalleActive(false))
        }, 1500)
    }

    const viewDialogListProduct = () => {
        dispatch(setVerDialogListProductsInfoActive(true))
    }

    return (
        <Card>
            <CardHeader title='Editar detalle solicitud' />
            <CardContent>
                <form onSubmit={handleSubmitDetalle(onSubmitDetalleUpdate)}>
                    <Grid container spacing={5} paddingTop={5} justifyContent="flex-end">
                        <Grid item sm={3} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='codigoDetalleSolicitud'
                                    control={controlFormDetalle}
                                    render={({ field: { value } }) => (
                                        <TextField
                                            value={value}
                                            label="Codigo de Detalle"
                                            placeholder='Codigo de Detalle Solicitud'
                                            disabled
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={2} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='cantidad'
                                    control={controlFormDetalle}
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
                                            onFocus={(event) => {
                                                event.target.select()
                                            }}
                                            onValueChange={(values: any) => {
                                                const { value } = values
                                                setCantidad(value)
                                            }}
                                            placeholder='Cantidad'
                                            error={Boolean(errors.codigoSolicitud)}
                                            aria-describedby='validation-async-cantidad'
                                            inputProps={{
                                                type: 'text',
                                                inputMode: 'numeric',
                                                autoFocus: true
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
                                    control={controlFormDetalle}
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
                    </Grid>
                    <Grid container spacing={5} paddingTop={5}>
                        <Grid item sm={3} xs={12}>
                            <FormControl fullWidth>
                                <Controller
                                    name='precioUnitario'
                                    control={controlFormDetalle}
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
                                            onFocus={(event) => {
                                                event.target.select()
                                            }}
                                            onValueChange={(values: any) => {
                                                const { value } = values
                                                setPrecioUnitario(value)
                                            }}
                                            placeholder='Precio Unitario'
                                            error={Boolean(errors.codigoSolicitud)}
                                            aria-describedby='validation-async-cantidad'
                                            inputProps={{
                                                type: 'text',
                                                inputMode: 'numeric',
                                                autoFocus: true
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
                                value={total}
                                label="PrecioTotal"
                                placeholder='precio Total'
                                error={Boolean(errors.codigoSolicitud)}
                                aria-describedby='validation-async-cantidad-comprada'
                            />
                        </Grid>
                    </Grid>
                    <CardActions sx={{ justifyContent: 'start', paddingLeft: 0 }}>
                        <Button
                            onClick={handleSubmitDetalle(onSubmitDetalleUpdate)}
                            size='large'
                            variant='contained'
                        >
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
                            Guardar
                        </Button>
                        <Button variant='outlined' size='large' onClick={handleDialogOpen}>
                            Eliminar
                        </Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby='alert-dialog-title'
                            aria-describedby='alert-dialog-description'
                        >
                            <DialogTitle id='alert-dialog-title'>
                                {'Esta usted seguro de realizar esta acción?'}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id='alert-dialog-description'>
                                    Esta acción va a eliminar el detalle seleccionado
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>No</Button>
                                <Button variant='contained' onClick={handleDeleteDetalle}>
                                    {loadingDelete ? (
                                        <>
                                            <CircularProgress
                                                sx={{
                                                    color: 'common.white',
                                                    width: '20px !important',
                                                    height: '20px !important',
                                                    mr: theme => theme.spacing(2)
                                                }}
                                            />
                                            Eliminando...
                                        </>
                                    )
                                        : 'Sí'}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </CardActions>
                    <Box>
                        {errorMessage.length > 0 && (
                            <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{errorMessage}</FormHelperText>
                        )}
                    </Box>
                </form>
                <Grid container spacing={5} paddingTop={0}>
                    <Grid item sm={12} xs={12}>
                        <IndexPucSolicitudCompromiso
                            codigoSolicitud={defaultValues.codigoSolicitud}
                            codigoDetalleSolicitud={defaultValues.codigoDetalleSolicitud}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default UpdateDetalleSolicitudCompromiso