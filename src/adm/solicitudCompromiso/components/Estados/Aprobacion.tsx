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
    DialogActions } from '@mui/material'
import useServices from '../../services/useServices'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useQueryClient, QueryClient } from '@tanstack/react-query'

const AprobacionComponent = (props: any) => {
    const [error, setError] = useState<string>('')
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const qc: QueryClient = useQueryClient()
    const { loading, aprobarSolicitud } = useServices()

    const handleAprobacion = async () => {
        try {
            const response = await aprobarSolicitud(props.data.codigoSolicitud)

            if (response?.data?.isValid) {
                qc.invalidateQueries({
                    queryKey: ['solicitudCompromiso']
                })
            }

            setError(response?.data?.message)
        } catch (error: any) {
            setError(error)
        } finally {
            setOpenConfirmDialog(false)
        }
    }

    return (
        <> {
            props.data.status === 'PE' ?
                <Grid item xs={12} paddingBottom={5}>
                    <Card>
                        <CardHeader title='Aprobar Solicitud Compromiso' />
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
                                            Aprobar
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
                                        Esta acción procederá a <b>APROBAR</b> el presupuesto seleccionado.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                                        No
                                    </Button>
                                    <Button onClick={handleAprobacion} color="primary">
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

export default AprobacionComponent;