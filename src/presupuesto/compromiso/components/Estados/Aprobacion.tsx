import { Card, CardContent, CardHeader, Grid, CircularProgress, FormHelperText } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import useServices from '../../services/useServices'
import {
    setVerComrpromisoActive,
} from "src/store/apps/presupuesto"

const AprobacionComponent = (props: any) => {
    const dispatch = useDispatch()
    const qc: QueryClient = useQueryClient()

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
                props.data.status === 'PE' ?
                <Grid item xs={12} paddingBottom={5}>
                    <Card>
                        <CardHeader title='Adm - Aprobar Solicitud Compromiso' />
                        <CardContent>
                            <Grid container spacing={12}>
                                <Grid item xs={12}>
                                    <Box className='demo-space-x'>
                                        <Button variant='contained' size='large' onClick={handleAprobacion} autoFocus>
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
                                                : 'Aprobar'
                                            }
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box>
                                {   message && (
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

export default AprobacionComponent