import { Grid, Button, Box } from "@mui/material"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { ICreateOrdenPago } from '../../interfaces/createOrdenPago.interfaces'
import FormOrdenPago from '../../forms/FormOrdenPago'
import useServices from '../../services/useServices'
import {
    setIsOpenDialogListCompromiso,
    resetCompromisoSeleccionadoDetalle,
    setCompromisoSeleccionadoDetalle,
    setTypeOperation,
} from "src/store/apps/ordenPago"

const FormCreateOrdenPago = () => {
    const dispatch = useDispatch()

    const { compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)
    const { createOrden, message, loading } = useServices()

    const handleListCompromiso = () => {
        dispatch(setIsOpenDialogListCompromiso(true))
    }

    const handleCreateOrden = async (dataFormOrder: any) => {
        try {
            const { codigoCompromiso, codigoPresupuesto, origenId, fechaCompromiso } = compromisoSeleccionadoListaDetalle
            const { motivo, frecuenciaPago, formaPago, cantidadPago } = dataFormOrder

            const cantidadPagoNumber = Number(cantidadPago)

            const payload: ICreateOrdenPago = {
                codigoOrdenPago: 0,
                codigoPresupuesto,
                codigoCompromiso,
                fechaOrdenPago: fechaCompromiso,
                tipoOrdenPagoId: origenId,
                cantidadPago: cantidadPagoNumber,
                frecuenciaPagoId: frecuenciaPago,
                tipoPagoId: formaPago,
                motivo,
                fechaComprobante: null,
                numeroComprobante: null,
                numeroComprobante2: null,
                numeroComprobante3: null,
                numeroComprobante4: null,
            }

            const response = await createOrden(payload)
            if (response) {
                dispatch(setCompromisoSeleccionadoDetalle(response.data))
                changeViewToEdit()
            }
        } catch (e: any) {
            console.error(e)
        }
    }

    const changeViewToEdit = () => {
        setTimeout(() => {
            dispatch(setTypeOperation('update'))
        }, 1000)
    }

    const handleClearCompromiso = () => {
        dispatch(resetCompromisoSeleccionadoDetalle())
    }

    useEffect(() => {
        dispatch(resetCompromisoSeleccionadoDetalle())
    }, [])

    return (
        <>
            <Grid container spacing={5} paddingTop={1}>
                <Grid sm={12} xs={12}>
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
                <Grid sm={12} xs={12} sx={{
                    overflow: 'auto',
                    padding: '0 1rem',
                }}>
                    <FormOrdenPago
                        orden={compromisoSeleccionadoListaDetalle}
                        onFormData={handleCreateOrden}
                        onFormClear={handleClearCompromiso}
                        titleButton = {'Crear'}
                        message = {message}
                        loading = {loading}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default FormCreateOrdenPago