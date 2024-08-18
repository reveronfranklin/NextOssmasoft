import { Card, CardContent, CardHeader, Grid, CircularProgress, FormHelperText } from '@mui/material'
import useServices from '../../services/useServices'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setVerSolicitudCompromisosActive } from "src/store/apps/adm"

const AprobacionComponent = (props: any) => {
    const [error, setError] = useState<string>('')

    const dispatch = useDispatch()
    const { loading, aprobarSolicitud } = useServices()

    const handleAprobacion = async () => {
        try {
            const response = await aprobarSolicitud(props.data.codigoSolicitud)

            if (response?.data?.isValid) {
                handleClose()
            }

            setError(response?.data?.message)
        } catch (error: any) {
            setError(error)
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
                props.data.status === 'PE' ?
                <Grid item xs={12} paddingBottom={5}>
                    <Card>
                        <CardHeader title='Adm - Aprobar Solicitud Compromiso' />
                        <CardContent>
                            <Grid container spacing={12}>
                                <Grid item xs={12}>
                                    <Box className='demo-space-x'>
                                            <Button variant='contained' size='large' onClick={handleAprobacion} autoFocus>
                                                {loading ? (
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