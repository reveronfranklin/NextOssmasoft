import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    CircularProgress,
    FormHelperText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material'
import useServices from '../../services/useServices'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setVerSolicitudCompromisosActive } from "src/store/apps/adm"
import { useQueryClient, QueryClient } from '@tanstack/react-query'

const AnulacionComponent = (props: any) => {
    const [error, setError] = useState<string>('')
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const dispatch = useDispatch()
    const qc: QueryClient = useQueryClient()

    const {
        loading,
        anularSolicitud
    } = useServices()

    const handleAnulacion = async () => {
        try {
            const response = await anularSolicitud(props.data.codigoSolicitud)

            if (response?.data?.isValid) {
                qc.invalidateQueries({
                    queryKey: ['solicitudCompromiso']
                })
                handleClose()
            }

            setError(response?.data?.message)
        } catch (error: any) {
            setError(error)
        } finally {
            setOpenConfirmDialog(false)
        }
    }

    const handleClose = () => {
        setTimeout(() => {
            dispatch(setVerSolicitudCompromisosActive(false))
        }, 2000)
    }

    return (
        <>
            {
                props.data.status === 'AP' ?
                    <Grid item xs={12} paddingBottom={5}>
                        <Card>
                            <CardHeader title='Anulación Solicitud Compromiso' />
                            <CardContent>
                                <Grid container spacing={12}>
                                    <Grid item xs={12}>
                                        <Box className='demo-space-x'>
                                            <Button
                                                variant='contained'
                                                size='large'
                                                onClick={() => setOpenConfirmDialog(true)}
                                                autoFocus
                                            >
                                                Anular
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Dialog
                                    open={openConfirmDialog}
                                    onClose={() => setOpenConfirmDialog(false)}
                                >
                                    <DialogTitle id='alert-dialog-title'>
                                        {'Esta usted seguro de realizar esta acción?'}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Esta acción va <b>ANULAR</b> el presupuesto seleccionado.
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                                            No
                                        </Button>
                                        <Button onClick={handleAnulacion} color="primary">
                                            { loading ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CircularProgress
                                                        sx={{
                                                            color: '#8A2BE2',
                                                            width: '20px !important',
                                                            height: '20px !important',
                                                            marginRight: '8px',
                                                        }}
                                                    />
                                                    Por favor espere...
                                                </Box>
                                            )
                                                : 'Si'
                                            }
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Box>
                                    {error && (
                                        <FormHelperText sx={{ color: 'error.main', fontSize: 15, mt: 5 }}>{error}</FormHelperText>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid> : null
            }
        </>
    )
}

export default AnulacionComponent