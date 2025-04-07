import { Grid, Box } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { IUpdateOrdenPago } from '../../interfaces/updateOrdenPago.interfaces'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import {
    resetCompromisoSeleccionadoDetalle,
    setCompromisoSeleccionadoDetalle,
    setIsOpenViewerPdf
} from "src/store/apps/ordenPago"
import TabsComponent from '../../components/Tabs'
import FormOrdenPago from '../../forms/FormOrdenPago'
import useServices from '../../services/useServices'

import { useServicesRetenciones, useGestionOrdenPago } from '../../services/index'

const FormUpdateOrdenPago = () => {
    interface GestionConfig {
        handle: () => Promise<any> | void;
        message: string;
        nameButton: string;
        status?: string;
        showButton: boolean;
    }

    const [gestionConfig, setGestionConfig] = useState<GestionConfig | null>(null)

    const qc: QueryClient = useQueryClient()
    const dispatch = useDispatch()

    const { getRetenciones } = useServicesRetenciones()
    const { anularOrdenPago, aprobarOrdenPago } = useGestionOrdenPago()

    const { data } = useQuery({
        queryKey: ['retencionesTable'],
        queryFn: () => getRetenciones(),
        staleTime: 60 * 1000,
        retry: 3,
    }, qc)

    console.log('data', data)
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
                codigoCompromiso,
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
                codigoCompromiso: codigoCompromiso, //todo Revisar
                fechaOrdenPago: new Date(fechaOrdenPagoString),
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

    const handleGestionOrdenPago = () => {
        const { status, codigoOrdenPago } = compromisoSeleccionadoListaDetalle
        const filter = { codigoOrdenPago }

        if (status === 'PE') {
            return {
                handle: () => aprobarOrdenPago(filter),
                message: `¿Esta usted seguro de APROBAR la orden (${codigoOrdenPago}) ?`,
                nameButton: 'Aprobar',
                showButton: true
            }
        }

        if (status === 'AP') {
            return {
                handle: () => anularOrdenPago(filter),
                message: `¿ Esta usted seguro de ANULAR la orden (${codigoOrdenPago}) ?`,
                nameButton: 'Anular',
                status: 'AN',
                showButton: true
            }
        }

        return {
            handle: () => console.log('No disponible'),
            message: 'Orden de pago no disponible para gestionar',
            nameButton: 'Gestionar',
            showButton: false,
        }
    }

    useEffect(() => {
        setGestionConfig(handleGestionOrdenPago())
    }, [compromisoSeleccionadoListaDetalle])

    return (
        <>
            <Grid container spacing={0} paddingLeft={0} paddingBottom={0}>
                <Grid sm={12} xs={12}>
                    <Box display="flex" gap={2} ml="1.5rem">
                    </Box>
                </Grid>
                <Grid sm={6} xs={12} sx={{
                    overflow: 'auto',
                    padding: '10px',
                    paddingBottom: '0px',
                    borderRight: '1px solid #e0e0e0',
                }}>
                    <FormOrdenPago
                        orden={compromisoSeleccionadoListaDetalle}
                        onFormData={handleUpdateOrden}
                        onFormClear={handleClearCompromiso}
                        handleGestionOrdenPago={gestionConfig || {}}
                        onViewerPdf={() => dispatch(setIsOpenViewerPdf(true))}
                        titleButton={'Actualizar'}
                        message={message}
                        loading={loading}
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