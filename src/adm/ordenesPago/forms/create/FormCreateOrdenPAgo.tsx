import { Grid, Button, Box } from "@mui/material"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { ICreateOrdenPago } from '../../interfaces/createOrdenPago.interfaces'
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import {
    setIsOpenDialogListCompromiso,
    resetCompromisoSeleccionadoDetalle,
    setCompromisoSeleccionadoDetalle,
    setTypeOperation,
    setConFactura,
    setCodigoOrdenPago,
} from "src/store/apps/ordenPago"
import useServices from '../../services/useServices'
import FormOrdenPago from '../FormOrdenPago'

const FormCreateOrdenPago = () => {
    const qc: QueryClient = useQueryClient()
    const dispatch = useDispatch()

    const { compromisoSeleccionadoListaDetalle, typeOperation } = useSelector((state: RootState) => state.admOrdenPago)

    const {
        createOrden,
        message,
        loading
    } = useServices()

    const handleListCompromiso = () => {
        dispatch(setIsOpenDialogListCompromiso(true))
    }

    const handleCreateOrden = async (dataFormOrder: any) => {
        try {
            const {
                codigoCompromiso,
                codigoPresupuesto,
                fechaCompromiso
            } = compromisoSeleccionadoListaDetalle

            const {
                motivo,
                frecuenciaPagoId,
                tipoPagoId,
                cantidadPago,
                tipoOrdenId,
                conFactura
            } = dataFormOrder

            const cantidadPagoNumber = Number(cantidadPago)

            const payload: ICreateOrdenPago = {
                codigoOrdenPago: 0,
                codigoPresupuesto,
                codigoCompromiso,
                fechaOrdenPago: fechaCompromiso,
                tipoOrdenPagoId: tipoOrdenId,
                cantidadPago: cantidadPagoNumber,
                frecuenciaPagoId,
                tipoPagoId,
                motivo,
                fechaComprobante: null,
                numeroComprobante: null,
                numeroComprobante2: null,
                numeroComprobante3: null,
                numeroComprobante4: null,
                conFactura
            }

            const response = await createOrden(payload)

            const { data } = response

            if (data) {
                dispatch(setCompromisoSeleccionadoDetalle(data))

                dispatch(setConFactura(data[0]?.conFactura))
                dispatch(setCodigoOrdenPago(data[0]?.codigoOrdenPago))

                setTimeout(() => {
                    changeViewToEdit()
                }, 500);
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            qc.invalidateQueries({
                queryKey: ['ordenesPagoTable, listCompromisoByOrdenPago']
            })
        }
    }

    const changeViewToEdit = () => {
        setTimeout(() => {
            dispatch(setTypeOperation('update'))
        }, 1000)
    }

    const handleClearCompromiso = () => {
        if (typeOperation === 'create') {
            dispatch(resetCompromisoSeleccionadoDetalle())
        }
    }

    useEffect(() => {
        if (typeOperation === 'create') {
            dispatch(resetCompromisoSeleccionadoDetalle())
        }
    }, [])

    return (
        <>
            <Grid container spacing={5} paddingTop={1}>
                <Grid item sm={12} xs={12}>
                    <Box display="flex" gap={2} ml="1.5rem">
                        <Button
                            variant='contained'
                            color='success'
                            size='small'
                            onClick={handleListCompromiso}
                        >
                            VER COMPROMISOS
                        </Button>
                    </Box>
                </Grid>
                <Grid item sm={12} xs={12} sx={{
                    overflow: 'auto',
                    padding: '0 1rem',
                }}>
                    <FormOrdenPago
                        orden={compromisoSeleccionadoListaDetalle}
                        onFormData={handleCreateOrden}
                        onFormClear={handleClearCompromiso}
                        titleButton={'Crear'}
                        message={message}
                        loading={loading}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default FormCreateOrdenPago