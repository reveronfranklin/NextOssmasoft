import { Box, Grid, TextField, FormControl } from "@mui/material"
import { Orden } from 'src/adm/ordenesPago/interfaces/responseGetOrdenes.interfaces'
import { Controller, useForm } from 'react-hook-form'

import { RootState } from "src/store"
import { useEffect, useState } from "react"

const FormOrdenPago = (props: { orden?: any, onFormData: any }) => {
    const { orden, onFormData } = props
    const { control, reset, watch , formState: { errors }} = useForm<any>({ defaultValues: orden })

    const [formData, setFormData] = useState(orden)

    useEffect(() => {
        reset(orden)
        onFormData(orden)
    }, [orden, reset])

    return (
        <>
            <Box>
                <form>
                    <Grid container spacing={0} paddingTop={5} justifyContent="flex">
                        <Grid container sm={6} xs={12}>
                            <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="descripcionStatus"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Estatus"
                                                placeholder="Estatus"
                                                value={value || ''}
                                                rows={4}
                                                multiline
                                                onChange={(e) => {
                                                    onChange(e.target.value)
                                                    onFormData({ ...formData, descripcionStatus: e.target.value })
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid container justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                                <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                </Grid>
                                <Grid item sm={4} xs={12} sx={{ padding: '5px' }}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name="iva"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    fullWidth
                                                    value={value || ''}
                                                    label="IVA"
                                                    placeholder="IVA"
                                                    onChange={(e) => {
                                                        onChange(e.target.value)
                                                        onFormData({ ...formData, iva: e.target.value })
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                                <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name="numeroOrdenPago"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    fullWidth
                                                    label="N° Orden de Pago"
                                                    placeholder="N° Orden de Pago"
                                                    value={value || ''}
                                                    onChange={(e) => {
                                                        onChange(e.target.value)
                                                        onFormData({ ...formData, numeroOrdenPago: e.target.value })
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4} xs={12} sx={{ padding: '5px' }}>
                                    <TextField
                                        fullWidth
                                        // label="ISLR"
                                        placeholder="ISLR"
                                        value={0}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                                <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name="fechaOrdenPagoString"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    fullWidth
                                                    label="Fecha de la orden"
                                                    placeholder="Fecha de la orden"
                                                    value={value || ''}
                                                    onChange={(e) => {
                                                        onChange(e.target.value)
                                                        onFormData({ ...formData, fechaOrdenPagoString: e.target.value })
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={4} xs={12} sx={{ padding: '5px' }}>
                                    <TextField
                                        fullWidth
                                        // label="TF"
                                        placeholder="TF"
                                        value={0}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container sm={6} xs={12}>
                            <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="descripcionTipoOrdenPago"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Tipo de Orden"
                                                placeholder="Tipo de Orden"
                                                value={value || ''}
                                                onChange={(e) => {
                                                    onChange(e.target.value)
                                                    onFormData({ ...formData, descripcionTipoOrdenPago: e.target.value })
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="descripcionTipoPago"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Forma de Pago"
                                                placeholder="Forma de Pago"
                                                value={value || ''}
                                                onChange={(e) => {
                                                    onChange(e.target.value)
                                                    onFormData({ ...formData, descripcionTipoPago: e.target.value })
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="descripcionFrecuencia"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Frecuencia de Pago"
                                                placeholder="Frecuencia de Pago"
                                                value={value || ''}
                                                onChange={(e) => {
                                                    onChange(e.target.value)
                                                    onFormData({ ...formData, descripcionFrecuencia: e.target.value })
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid container direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                                <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name="cantidadPago"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    fullWidth
                                                    label="Cantidad de Pagos"
                                                    placeholder="Cantidad de Pagos"
                                                    value={value || ''}
                                                    onChange={(e) => {
                                                        onChange(e.target.value)
                                                        onFormData({ ...formData, cantidadPago: e.target.value })
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name="cantidadPago"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    fullWidth
                                                    label="N°"
                                                    placeholder="N°"
                                                    value={value || ''}
                                                    onChange={(e) => {
                                                        onChange(e.target.value)
                                                        onFormData({ ...formData, cantidadPago: e.target.value })
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                                <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                    <TextField
                                        fullWidth
                                        // label="Plazo de Pago Desde"
                                        placeholder="Plazo de Pago Desde"
                                        value={0}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                    <TextField
                                        fullWidth
                                        // label="Hasta"
                                        placeholder="Hasta"
                                        value={0}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container sm={12} xs={12}>
                            <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="nombreProveedor"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Proveedor"
                                                placeholder="Proveedor"
                                                value={value || ''}
                                                disabled={true}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name="motivo"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                label="Motivo"
                                                placeholder="Motivo"
                                                value={value || ''}
                                                multiline
                                                rows={6}
                                                onChange={(e) => {
                                                    onChange(e.target.value)
                                                    onFormData({ ...formData, motivo: e.target.value })
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    )
}

export default FormOrdenPago