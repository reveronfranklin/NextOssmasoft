import { Estatus } from '../../enums/Estatus.enum'
import { setFiltroEstatus } from "src/store/apps/adm"
import { useDispatch } from 'react-redux';
import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField, Skeleton } from '@mui/material'
import Box from '@mui/material/Box'
import useServices from '../../services/useServices'
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

const StatusComponent = () => {
    const {
        presupuestoSeleccionado,
    } = useServices()

    const dispatch = useDispatch()

    const isLoadingTableGeneral = useSelector((state: RootState) => state.admSolicitudCompromiso.isLoadingTableSolicitudGeneral)

    const handleChange = (event: any, newValue: string | null) => {
        let value: string = ''
        const index: keyof typeof Estatus = newValue as keyof typeof Estatus
        value = typeof index === undefined ? value : Estatus[index]

        dispatch(setFiltroEstatus(value))
    }

    return (
        <>
            {
                presupuestoSeleccionado.codigoPresupuesto ?
                <Grid item xs={12} paddingBottom={5}>
                    <Card>
                        <CardHeader title='Filtrar Estado' />
                        <CardContent>
                            <Grid container spacing={12}>
                                <Grid item xs={12}>
                                    <Box className='demo-space-x'>
                                        <div>
                                            <Autocomplete
                                                options={Object.keys(Estatus).filter((key) => key !== 'DEFAULT')}
                                                onChange={handleChange}
                                                renderInput={(params) => <TextField {...params} label="Estado" />}
                                                disabled={isLoadingTableGeneral}
                                            />
                                        </div>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid> : (
                    <Grid item xs={12} paddingBottom={5}>
                        <Skeleton
                            variant='rectangular'
                            width='100%'
                            height={160}
                            sx={{ opacity: 0.1, borderRadius: 1 }}
                        />
                    </Grid>
                )
            }
        </>
    )
}

export default StatusComponent