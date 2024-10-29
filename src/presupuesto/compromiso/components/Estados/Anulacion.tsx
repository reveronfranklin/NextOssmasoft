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
import { useDispatch } from 'react-redux'
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import {
    setVerComrpromisoActive,
} from "src/store/apps/presupuesto"
import { useState } from 'react'

const AnulacionComponent = (props: any) => {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const dispatch = useDispatch()
    const qc: QueryClient = useQueryClient()

    const {
        loading,
        message,
        anularCompromiso
    } = useServices()

    const handleAnulacion = async () => {
        try {
            anularCompromiso(props.data.codigoCompromiso).then((response) => {
                if (response && response?.isValid) {
                    qc.invalidateQueries({
                        queryKey: ['tableCompromisos']
                    })

                    handleClose()
                }
            })
        } catch (error: any) {
            console.error(error)
        } finally {
            setOpenConfirmDialog(false)
        }
    }

    const handleClose = (): void => {
        setTimeout(() => {
            dispatch(setVerComrpromisoActive(false))
        }, 2000)
    }

    return (
        <>
            {
                props.data.status === 'AP' ?
                <Grid item xs={12} paddingBottom={5}>
                    <Card>
                        <CardHeader title='Anular Compromiso' />
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
                                        Esta acción va <b>ANULAR</b> el compromiso seleccionado.
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
                                            onClick={handleAnulacion}
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
                                { message && (<FormHelperText sx={{ color: 'error.main', fontSize: 15, mt: 5 }}>{message}</FormHelperText>) }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid> : null
            }
        </>
    )
}

export default AnulacionComponent