import { Card, CardContent, CardHeader, Grid, CircularProgress, FormHelperText } from '@mui/material'
import useServices from '../../services/useServices'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setVerSolicitudCompromisosActive } from "src/store/apps/adm"
import { useQueryClient, QueryClient } from '@tanstack/react-query'

const AnulacionComponent = (props: any) => {
    const [error, setError] = useState<string>('')

    const { loading, anularSolicitud } = useServices()
    const dispatch = useDispatch()
    const qc: QueryClient = useQueryClient()

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