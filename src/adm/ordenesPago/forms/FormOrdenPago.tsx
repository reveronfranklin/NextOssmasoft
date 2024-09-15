import { Box, Grid, TextField, Typography } from "@mui/material"

const FormOrdenPago = () => {
    return (
        <>
            <Box>
                <Grid container spacing={0} paddingTop={5} justifyContent="flex">
                    <Grid container sm={6} xs={12}>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <TextField
                                fullWidth
                                label="Estatus"
                                rows={4}
                                multiline
                            >
                                <Typography variant='subtitle2' gutterBottom>
                                    {'pucSeleccionado.icpConcat'}
                                </Typography>
                            </TextField>
                        </Grid>
                        <Grid container justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                            </Grid>
                            <Grid item sm={4} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="IVA"
                                    placeholder=""
                                >
                                    <Typography variant='subtitle2' gutterBottom>
                                        {'pucSeleccionado.icpConcat'}
                                    </Typography>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="N° Orden de Pago"
                                    placeholder="0"
                                >
                                    <Typography variant='subtitle2' gutterBottom>
                                        {'pucSeleccionado.icpConcat'}
                                    </Typography>
                                </TextField>
                            </Grid>
                            <Grid item sm={4} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="ISLR"
                                    placeholder=""
                                >
                                    <Typography variant='subtitle2' gutterBottom>
                                        {'pucSeleccionado.icpConcat'}
                                    </Typography>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="space-between" direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="Fecha de la orden"
                                    placeholder=""
                                >
                                    <Typography variant='subtitle2' gutterBottom>
                                        {'pucSeleccionado.icpConcat'}
                                    </Typography>
                                </TextField>
                            </Grid>
                            <Grid item sm={4} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="TF"
                                    placeholder=""
                                >
                                    <Typography variant='subtitle2' gutterBottom>
                                        {'pucSeleccionado.icpConcat'}
                                    </Typography>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container sm={6} xs={12}>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <TextField
                                fullWidth
                                label="Tipo de Orden"
                            >
                                <Typography variant='subtitle2' gutterBottom>
                                    { 'pucSeleccionado.icpConcat' }
                                </Typography>
                            </TextField>
                        </Grid>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <TextField
                                fullWidth
                                label="Forma de Pago"
                            >
                                <Typography variant='subtitle2' gutterBottom>
                                    {'pucSeleccionado.icpConcat'}
                                </Typography>
                            </TextField>
                        </Grid>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <TextField
                                fullWidth
                                label="Frecuencia de Pago"
                            >
                                <Typography variant='subtitle2' gutterBottom>
                                    {'pucSeleccionado.icpConcat'}
                                </Typography>
                            </TextField>
                        </Grid>
                        <Grid container direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="Cantidad de Pago"
                                    placeholder="0"
                                >
                                    <Typography variant='subtitle2' gutterBottom>
                                        {'pucSeleccionado.icpConcat'}
                                    </Typography>
                                </TextField>
                            </Grid>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="N°"
                                    placeholder="0"
                                >
                                    <Typography variant='subtitle2' gutterBottom>
                                        {'pucSeleccionado.icpConcat'}
                                    </Typography>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" sm={12} xs={12} sx={{ padding: '5px' }}>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="Plazo de Pago Desde"
                                >
                                    <Typography variant='subtitle2' gutterBottom>
                                        {'pucSeleccionado.icpConcat'}
                                    </Typography>
                                </TextField>
                            </Grid>
                            <Grid item sm={6} xs={12} sx={{ padding: '5px' }}>
                                <TextField
                                    fullWidth
                                    label="Hasta"
                                >
                                    <Typography variant='subtitle2' gutterBottom>
                                        {'pucSeleccionado.icpConcat'}
                                    </Typography>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container sm={12} xs={12}>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <TextField
                                fullWidth
                                label="Proveedor"
                            >
                                <Typography variant='subtitle2' gutterBottom>
                                    {'pucSeleccionado.icpConcat'}
                                </Typography>
                            </TextField>
                        </Grid>
                        <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
                            <TextField
                                fullWidth
                                label="Motivo"
                                multiline
                                rows={5}
                            >
                                <Typography variant='subtitle2' gutterBottom>
                                    {'pucSeleccionado.icpConcat'}
                                </Typography>
                            </TextField>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default FormOrdenPago