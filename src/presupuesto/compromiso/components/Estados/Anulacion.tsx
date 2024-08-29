import { Card, CardContent, CardHeader, Grid, CircularProgress, FormHelperText } from '@mui/material'
import useServices from '../../services/useServices'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useDispatch } from 'react-redux'
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import {
    setVerComrpromisoActive,
} from "src/store/apps/presupuesto"

const AnulacionComponent = (props: any) => {
    const {
        loading,
        message,
        anularCompromiso
    } = useServices()

    const dispatch = useDispatch()
    const qc: QueryClient = useQueryClient()

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
        } catch (e: any) {
            console.error(e)
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
                        <CardHeader title='Adm - Anulación Solicitud Compromiso' />
                        <CardContent>
                            <Grid container spacing={12}>
                                <Grid item xs={12}>
                                    <Box className='demo-space-x'>
                                        <Button variant='contained' size='large' onClick={handleAnulacion} autoFocus>
                                            { loading ? (
                                                <>
                                                    <CircularProgress
                                                        sx={{
                                                            color: 'common.white',
                                                            width: '20px !important',
                                                            height: '20px !important',
                                                        }}
                                                    />
                                                    Por favor espere...
                                                </>
                                            )
                                                : 'Anular'
                                            }
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box>
                                { message && (
                                    <FormHelperText sx={{ color: 'error.main', fontSize: 15, mt: 5 }}>{message}</FormHelperText>
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