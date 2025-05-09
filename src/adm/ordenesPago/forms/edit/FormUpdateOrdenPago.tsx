import { Grid, Box } from "@mui/material";
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { IUpdateOrdenPago } from '../../interfaces/updateOrdenPago.interfaces'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import {
    setIsOpenDialogOrdenPagoDetalle,
    setCompromisoSeleccionadoDetalle,
    setIsOpenViewerPdf
} from "src/store/apps/ordenPago"
import TabsComponent from '../../components/Tabs'
import FormOrdenPago from '../../forms/FormOrdenPago'
import useServices from '../../services/useServices'
import { useServicesRetenciones, useGestionOrdenPago } from '../../services/index'
import AlertMessage from 'src/views/components/alerts/AlertMessage'
import { IAlertMessageDto } from 'src/interfaces/alert-message-dto'

interface GestionConfig {
    handle: () => Promise<any> | void;
    message: string;
    nameButton: string;
    status?: string;
    showButton: boolean;
}

const FormUpdateOrdenPago = () => {
    const [gestionConfig, setGestionConfig] = useState<GestionConfig | null>(null)
    const [showMessage, setShowMessage] = useState(false)
    const [currentMessage, setCurrentMessage] = useState<IAlertMessageDto>()

    const qc: QueryClient = useQueryClient()
    const dispatch = useDispatch()

    const { data } = useQuery({
        queryKey: ['retencionesTable'],
        queryFn: () => getRetenciones(),
        staleTime: 60 * 1000,
        retry: 3,
    }, qc)

    console.log(data) // eslint-disable-line @typescript-eslint/no-unused-vars, no-unused-vars

    const { getRetenciones } = useServicesRetenciones()
    const { message: gestionMessage, anularOrdenPago, aprobarOrdenPago } = useGestionOrdenPago()
    const { message: serviceMessage, updateOrden, loading} = useServices()

    const { compromisoSeleccionadoListaDetalle, codigoIdentificador } = useSelector((state: RootState) => state.admOrdenPago)

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
                motivo,
                frecuenciaPagoId,
                tipoPagoId,
                cantidadPago,
                conFactura,
            } = dataFormOrder

            const payload: IUpdateOrdenPago = {
                codigoOrdenPago,
                codigoPresupuesto,
                codigoCompromiso: codigoIdentificador,
                fechaOrdenPago,
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

            if (response.isValid) {
                dispatch(setCompromisoSeleccionadoDetalle(response.data))
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            qc.invalidateQueries({
                queryKey: ['ordenesPagoTable']
            })
        }
    }

    const handleClearCompromiso = () => {
        setShowMessage(false)
    }

    const handleGestionOrdenPago = () => {
        const { status, codigoOrdenPago } = compromisoSeleccionadoListaDetalle
        const filter = { codigoOrdenPago }
        setShowMessage(false)

        const actionConfigs: any = {
            PE: {
                action: aprobarOrdenPago,
                message: `¿Está usted seguro de APROBAR la orden (${codigoOrdenPago})?`,
                nameButton: 'Aprobar',
                newStatus: 'AP',
                showButton: true
            },
            AP: {
                action: anularOrdenPago,
                message: `¿Está usted seguro de ANULAR la orden (${codigoOrdenPago})?`,
                nameButton: 'Anular',
                newStatus: 'AN',
                showButton: true
            }
        }

        const config = actionConfigs[status as keyof typeof actionConfigs] || {
            action: () => console.log('No disponible'),
            message: 'Orden de pago no disponible para gestionar',
            nameButton: 'Gestionar',
            newStatus: status,
            showButton: false
        }

        const handleAction = (actionFn: typeof aprobarOrdenPago) => {
            return () => actionFn(filter, () => {
                qc.invalidateQueries({ queryKey: ['ordenesPagoTable'] });
                qc.invalidateQueries({ queryKey: ['retencionesTable'] });

                setTimeout(() => {
                    dispatch(setIsOpenDialogOrdenPagoDetalle(false))
                }, 5000)
            })
        }

        return {
            handle: handleAction(config.action),
            message: config.message,
            nameButton: config.nameButton,
            status: config.newStatus,
            showButton: config.showButton !== false
        }
    }

    useEffect(() => {
        if (gestionMessage?.text) {
            setCurrentMessage(gestionMessage)
            setShowMessage(true)
        }
        else if (serviceMessage?.text) {
            setCurrentMessage(serviceMessage)
            setShowMessage(true)
        }
    }, [gestionMessage, serviceMessage])

    useEffect(() => {
        setGestionConfig(handleGestionOrdenPago())
    }, [compromisoSeleccionadoListaDetalle])

    return (
        <>
            <Grid container spacing={0} paddingLeft={0} paddingBottom={0}>
                <Grid item sm={12} xs={12}>
                    <Box display="flex" gap={2} ml="1.5rem">
                    </Box>
                </Grid>
                <Grid item sm={6} xs={12} sx={{
                    overflow: 'auto',
                    padding: '10px',
                    paddingBottom: '0px',
                    borderRight: '1px solid #e0e0e0',
                    position: 'relative',
                }}>
                    <FormOrdenPago
                        orden={compromisoSeleccionadoListaDetalle}
                        onFormData={handleUpdateOrden}
                        onFormClear={handleClearCompromiso}
                        handleGestionOrdenPago={gestionConfig || {}}
                        onViewerPdf={() => dispatch(setIsOpenViewerPdf(true))}
                        titleButton={'Actualizar'}
                        message={currentMessage}
                        loading={loading}
                    />
                    <AlertMessage
                        message={currentMessage?.text ?? ''}
                        severity={currentMessage?.isValid ? 'success' : 'error'}
                        duration={8000}
                        show={showMessage}
                    />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <TabsComponent />
                </Grid>
            </Grid>
        </>
    )
}

export default FormUpdateOrdenPago