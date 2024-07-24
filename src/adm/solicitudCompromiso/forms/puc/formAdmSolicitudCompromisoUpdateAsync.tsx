import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormHelperText, Grid } from "@mui/material"
import { useState } from 'react';
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import useServices from "../../services/useServices";
import { useDispatch } from "react-redux";

import { setVerSolicitudCompromisoPucActive } from "src/store/apps/adm"

const UpdatePuc = () => {
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)

    const { pucSeleccionado } = useSelector((state: RootState) => state.admSolicitudCompromiso)

    const { fetchPucDelete  } = useServices()
    const qc: QueryClient = useQueryClient()

    const dispatch = useDispatch()

    const handleDeleteDetalle = async () => {
        try {
            setLoadingDelete(true)
            const responseDelete = await fetchPucDelete({ CodigoPucSolicitud: pucSeleccionado.codigoPucSolicitud })
            if (responseDelete?.data.isValid) {
                qc.invalidateQueries({
                    // ['pucDetalleSolicitud']
                })
                handleClose()
                handleCloseModalPuc()
            }
            setErrorMessage(responseDelete?.data.message)
            setLoadingDelete(false)
        } catch (e: any) {
            console.log(e)
        }
    }

    const handleCloseModalPuc = () => {
        setTimeout(() => {
            dispatch(setVerSolicitudCompromisoPucActive(false))
        }, 1500)
    }

    const handleDialogOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <Card>
                <CardHeader title='Editar o Eliminar PUC' />
                <CardContent>
                    <Grid container spacing={5} paddingTop={5} justifyContent="flex">
                        <Grid item sm={5} xs={12}>
                            {  true && (
                                <>
                                    <small>ICP:</small>
                                    <Grid item sm={12} xs={12} sx={{ marginTop: '10px' }}>
                                        <Typography variant='subtitle2' gutterBottom>
                                            { pucSeleccionado.icpConcat }
                                        </Typography>
                                        <Typography variant='subtitle2' gutterBottom>
                                            { }
                                        </Typography>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Grid item sm={5} xs={12}>
                            {  (
                                <>
                                    <small>PUC:</small>
                                    <Grid item sm={12} xs={12} sx={{ marginTop: '10px' }}>
                                        <Typography variant='subtitle2' gutterBottom>
                                            { pucSeleccionado.pucConcat }
                                        </Typography>
                                        <Typography variant='subtitle2' gutterBottom>
                                            {}
                                        </Typography>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Grid item sm={2} xs={12}>
                            { (
                                <>
                                    <small>Financiado:</small>
                                    <Grid item sm={12} xs={12} sx={{ marginTop: '10px' }}>
                                        <Typography variant='subtitle2' gutterBottom>
                                            {pucSeleccionado.descripcionFinanciado }
                                        </Typography>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Grid item sm={5} xs={12} justifyContent="flex-end" sx={{ width: '100%' }}>
                            <Grid item sm={5} xs={12}>
                                {(
                                    <>
                                        <small>Monto:</small>
                                        <Grid item sm={12} xs={12} sx={{ marginTop: '10px' }}>
                                            <Typography variant='subtitle2' gutterBottom>
                                                {pucSeleccionado.monto}
                                            </Typography>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                        <Grid item sm={5} xs={12}>
                            {(
                                <>
                                    <small>Comprometido:</small>
                                    <Grid item sm={12} xs={12} sx={{ marginTop: '10px' }}>
                                        <Typography variant='subtitle2' gutterBottom>
                                            { pucSeleccionado.montoComprometido }
                                        </Typography>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Grid item sm={2} xs={12}>
                            {(
                                <>
                                    <small>Anulado:</small>
                                    <Grid item sm={12} xs={12} sx={{ marginTop: '10px' }}>
                                        <Typography variant='subtitle2' gutterBottom>
                                            {pucSeleccionado.montoAnulado }
                                        </Typography>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <CardActions sx={{ justifyContent: 'start', paddingLeft: 0, marginTop: 1 }}>
                        <Button variant='outlined' size='small' onClick={handleDialogOpen}>
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
                                    Esta acción va a eliminar el PUC seleccionado
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>No</Button>
                                <Button variant='contained' onClick={handleDeleteDetalle}>
                                    { loadingDelete ? (
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
                        {errorMessage && errorMessage.length > 0 && (
                            <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>
                                {errorMessage}
                            </FormHelperText>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </>
    )
}

export default UpdatePuc