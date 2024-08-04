import { Card, CardActions, CardContent, Button, CardHeader, CircularProgress, FormControl, Grid, TextField, FormHelperText } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { FormInputs } from './../interfaces/formImputs.interfaces'
import { useState } from "react"
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { Product } from '../interfaces/product.interfaces'
import { setVerDialogUpdateProductsInfoActive } from "src/store/apps/adm"
import { useDispatch } from 'react-redux'
import useServices from "src/adm/solicitudCompromiso/services/useServices"


const FormUpdateProducts = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const productSeleccionado: Product = useSelector((state: RootState) => state.admSolicitudCompromiso.productSeleccionado)
    const { fetchUpdateProducts } = useServices()

    const dispatch = useDispatch()

    const defaultValues: FormInputs = {
        codigoProducto: productSeleccionado.codigo,
        codigoReal: productSeleccionado.codigoReal,
        descripcionReal: productSeleccionado.descripcionReal,
        codigoConcat: productSeleccionado.codigoConcat,
        descripcion: productSeleccionado.descripcion
    }

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormInputs>({ defaultValues })

    const onSubmit = async (data: FormInputs) => {
        setLoading(true)
        const updateProduct: any = {
            codigoProducto: defaultValues.codigoProducto,
            codigoReal: data.codigoReal,
            descripcionReal: data.descripcionReal
        }

        try {
            await fetchUpdateProducts(updateProduct)
            handleCloseModalProduct()
        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }

    const handleCloseModalProduct = () => {
        setTimeout(() => {
            dispatch(setVerDialogUpdateProductsInfoActive(false))
        }, 1500)
    }

    return (
        <>
            <Card>
                <CardHeader title='Editar producto' />
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={5} paddingTop={5} justifyContent="flex-end">
                            <Grid item sm={6} xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='codigoProducto'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <TextField
                                                value={value}
                                                label="Codigo Producto"
                                                placeholder='Codigo de Producto'
                                                disabled
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='codigoConcat'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <TextField
                                                value={value}
                                                label="Codigo Concatenado"
                                                placeholder='Codigo Concatenado'
                                                disabled
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='descripcion'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <TextField
                                                value={value}
                                                label="Descripcion"
                                                placeholder='descripcion'
                                                rows={4}
                                                multiline
                                                disabled
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={5} paddingTop={5} justifyContent="flex-end">
                            <Grid item sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='codigoReal'
                                        control={control}
                                        rules={{
                                            required: true,
                                            maxLength: 15,
                                        }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                helperText="Caracteres máximo 15"
                                                value={value}
                                                onChange={onChange}
                                                label="Codigo Real"
                                                placeholder='Codigo Real'
                                                error={Boolean(errors.codigoReal)}
                                                aria-describedby='validation-async-codigoReal'
                                            />
                                        )}
                                    />
                                    { errors.codigoReal && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoReal'>
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='descripcionReal'
                                        control={control}
                                        rules={{
                                            required: true,
                                            maxLength: 500,
                                        }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                helperText="Caracteres máximo 500"
                                                value={value}
                                                onChange={onChange}
                                                label="Descripcion Real"
                                                placeholder='Descripcion Real'
                                                error={Boolean(errors.codigoReal)}
                                                aria-describedby='validation-async-desReal'
                                                multiline
                                                rows={4}
                                            />
                                        )}
                                    />
                                    {errors.codigoReal && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-async-desReal'>
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                    <CardActions sx={{ justifyContent: 'start', paddingLeft: 0 }}>
                        <Button
                            onClick={handleSubmit(onSubmit)}
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
                            ) : 'Guardar'}
                        </Button>
                    </CardActions>
                </CardContent>
            </Card>
        </>
    )
}

export default FormUpdateProducts