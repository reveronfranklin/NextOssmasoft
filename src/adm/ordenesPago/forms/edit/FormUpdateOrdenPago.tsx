import { Grid, Box } from "@mui/material"
import { useDispatch } from "react-redux"
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { IUpdateOrdenPago } from '../../interfaces/updateOrdenPago.interfaces'
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import {
    resetCompromisoSeleccionadoDetalle,
    setCompromisoSeleccionadoDetalle
} from "src/store/apps/ordenPago"
import TabsComponent from '../../components/Tabs'
import FormOrdenPago from '../../forms/FormOrdenPago'
import useServices from '../../services/useServices'

const FormUpdateOrdenPago = () => {
    const qc: QueryClient = useQueryClient()
    const dispatch = useDispatch()

    const { compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)

    const {
        updateOrden,
        loading,
        message
    } = useServices()

    const handleUpdateOrden = async (dataFormOrder: any) => {
        try {
            const {
                codigoOrdenPago,
                codigoPresupuesto,
                tipoOrdenPagoId,
                fechaComprobante,
                fechaOrdenPago,
            } = compromisoSeleccionadoListaDetalle

            const {
                fechaOrdenPagoString,
                motivo,
                frecuenciaPagoId,
                tipoPagoId,
                cantidadPago,
                conFactura,
            } = dataFormOrder

            const payload: IUpdateOrdenPago = {
                codigoOrdenPago,
                codigoPresupuesto,
                codigoCompromiso: 15,
                fechaOrdenPago: fechaOrdenPagoString,
                tipoOrdenPagoId,
                cantidadPago,
                frecuenciaPagoId,
                tipoPagoId,
                motivo,
                fechaComprobante,
                numeroComprobante: null,
                numeroComprobante2: null,
                numeroComprobante3: null,
                numeroComprobante4: null,
                conFactura
            }

            console.log('payload', payload)
            const response = await updateOrden(payload)

            dispatch(setCompromisoSeleccionadoDetalle(response.data))
        } catch (e: any) {
            console.error(e)
        } finally {
            qc.invalidateQueries({
                queryKey: ['ordenesPagoTable']
            })
        }
    }

    const handleClearCompromiso = () => {
        dispatch(resetCompromisoSeleccionadoDetalle())
    }

    return (
        <>
            <Grid container spacing={5} paddingTop={1}>
                <Grid sm={12} xs={12}>
                    <Box display="flex" gap={2} ml="1.5rem">
                    </Box>
                </Grid>
                <Grid sm={6} xs={12} sx={{
                    overflow: 'auto',
                    padding: '0 1rem',
                    borderRight: '1px solid #e0e0e0',
                }}>
                    <FormOrdenPago
                        orden={compromisoSeleccionadoListaDetalle}
                        onFormData={handleUpdateOrden}
                        onFormClear={handleClearCompromiso}
                        titleButton={'Actualizar'}
                        message={message}
                        loading={loading}
                    />
                </Grid>
                <Grid sm={6} xs={12}>
                    <TabsComponent
                        orden={compromisoSeleccionadoListaDetalle}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default FormUpdateOrdenPago