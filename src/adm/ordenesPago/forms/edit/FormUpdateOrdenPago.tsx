import { Grid, Button, Box } from "@mui/material"
import TabsComponent from '../../components/Tabs'
import FormOrdenPago from '../../forms/FormOrdenPago'
import { useDispatch } from "react-redux"
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { useState } from "react"
import { resetCompromisoSeleccionadoDetalle } from "src/store/apps/ordenPago"
import useServices from '../../services/useServices'

const FormUpdateOrdenPago = () => {
    const [formData, setFormData] = useState({})
    const dispatch = useDispatch()

    const { compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)
    const { updateOrden } = useServices()

    const handleFormData = (data: any) => {
        setFormData(data)
    }

    const handleUpdateOrden = async () => {
        try {
            console.log('update', formData)
            const response = await updateOrden(formData)
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
                        <Button variant='contained' color='primary' size='small' onClick={handleUpdateOrden}>
                            Actualizar
                        </Button>
                        <Button variant='contained' color='primary' size='small' onClick={handleClearCompromiso}>
                            limpiar
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
                        onFormData={handleFormData}
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