import { Grid, Button, Box } from "@mui/material"
import TabsComponent from '../../components/Tabs'
import FormOrdenPago from '../../forms/FormOrdenPago'
import { useDispatch } from "react-redux"
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { resetCompromisoSeleccionadoDetalle, setTypeOperation } from "src/store/apps/ordenPago"
import useServices from '../../services/useServices'
import { CleaningServices } from '@mui/icons-material'

import { IUpdateOrdenPago } from '../../interfaces/updateOrdenPago.interfaces'

const FormUpdateOrdenPago = () => {
    const dispatch = useDispatch()

    const { compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)
    const { updateOrden, loading, message } = useServices()

    const handleUpdateOrden = async (dataFormOrder: any) => {
        try {
            const { codigoOrdenPago, codigoPresupuesto, tipoOrdenPagoId, fechaOrdenPago } = compromisoSeleccionadoListaDetalle
            const { motivo, frecuenciaPago, formaPago, cantidadPago } = dataFormOrder

            const payload: IUpdateOrdenPago = {
                codigoOrdenPago,
                codigoPresupuesto,
                codigoCompromiso: 15,
                fechaOrdenPago: fechaOrdenPago,
                tipoOrdenPagoId,
                cantidadPago,
                frecuenciaPagoId: frecuenciaPago,
                tipoPagoId: formaPago,
                motivo,
                fechacomprobante: null,
                numeroComprobante: null,
                numeroComprobante2: null,
                numeroComprobante3: null,
                numeroComprobante4: null,
            }

            const response = await updateOrden(payload)

            //todo validar la respuesta
            console.log(response)
        } catch (e: any) {
            console.error(e)
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
                        <Button
                            color='primary'
                            size='small'
                            onClick={handleClearCompromiso}
                        >
                            <CleaningServices /> Limpiar
                        </Button>
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
                        titleButton={'Actualizar'}
                        message={message}
                        loading={loading}
                        type={setTypeOperation}
                    />
                </Grid>
                <Grid sm={6} xs={12}>
                    <TabsComponent />
                </Grid>
            </Grid>
        </>
    )
}

export default FormUpdateOrdenPago