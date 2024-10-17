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
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import useServices from '../../services/useServices'
import { useState } from 'react'

const AprobacionComponent = (props: any) => {
    const qc: QueryClient = useQueryClient()

    const [error, setError] = useState<string>('')
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const {
        loading,
        message,
        aprobarCompromiso
    } = useServices()

    const handleAprobacion = async () => {
        try {
            aprobarCompromiso(props.data.codigoCompromiso).then((response) => {
                if (response && response?.isValid) {
                    qc.invalidateQueries({
                        queryKey: ['tableCompromisos']
                    })
                }
            })
        } catch (error: any) {
            setError(error)
        } finally {
            setOpenConfirmDialog(false)
        }
    }

    return (
        <>
            {
            props.data.status === 'PE' ?
                <Grid item xs={12} paddingBottom={5}>
                    <Card>
                        <CardHeader title='Aprobar Compromiso' />
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
                                        Esta acción procederá a <b>APROBAR</b> el compromiso seleccionado.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={() => setOpenConfirmDialog(false)}
                                        color="primary"
                                    >
                                        No
                                    </Button>
                                    <Button
                                        onClick={handleAprobacion}
                                        color="primary"
                                        autoFocus
                                    >
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
                                {   message || error && (<FormHelperText sx={{ color: 'error.main', fontSize: 15, mt: 5 }}>{message}</FormHelperText>) }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid> : null
            }
        </>
    )
}

export default AprobacionComponent