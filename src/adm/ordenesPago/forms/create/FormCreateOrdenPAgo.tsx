import { Grid, Button, Box } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import FormOrdenPago from '../../forms/FormOrdenPago'
import useServices from '../../services/useServices'
import {
    setCompromisoSeleccionadoDetalle,
    setIsOpenDialogListCompromiso,
    resetCompromisoSeleccionadoDetalle,
    setTypeOperation
} from "src/store/apps/ordenPago"

const FormCreateOrdenPago = () => {
    const [dataReady, setDataReady] = useState(false);
    const [formData, setFormData] = useState({
        descripcionStatus: '',
        id: '',
        fecha: '',
        proveedor: '',
        monto: '',
        tipoPago: '',
        estado: '',
        observacion: '',
    })

    const dispatch = useDispatch()
    const { compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)
    const { createOrden } = useServices()

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleListCompromiso = () => {
        dispatch(setIsOpenDialogListCompromiso(true))
    }

    const handleFormData = (data: any) => {
        setFormData(data)
    }

    const handleCreateOrden = async () => {
        try {
            console.log('Create', formData)
            const response = await createOrden(formData)

            setTimeout(() => {
                dispatch(setTypeOperation('update'))
            }, 1000);
        } catch (e: any) {
            console.error(e)
        }
    }

    const handleClearCompromiso = () => {
        console.log('limpiar')
        dispatch(resetCompromisoSeleccionadoDetalle())
    }

    useEffect(() => {
        console.log('compromisoSeleccionadoListaDetalle')
        dispatch(resetCompromisoSeleccionadoDetalle())
        setDataReady(true)
    }, [])

    return (
        <>
            <Grid container spacing={5} paddingTop={1}>
                <Grid sm={12} xs={12}>
                    <Box display="flex" gap={2} ml="1.5rem">
                        <Button variant='contained' color='primary' size='small' onClick={handleCreateOrden}>
                            Crear
                        </Button>
                        <Button variant='contained' color='success' size='small' onClick={handleListCompromiso}>
                            VER COMPROMISOS
                        </Button>
                        <Button variant='contained' color='primary' size='small' onClick={handleClearCompromiso}>
                            Limpiar
                        </Button>
                    </Box>
                </Grid>
                <Grid sm={12} xs={12} sx={{
                    overflow: 'auto',
                    padding: '0 1rem',
                }}>
                    <FormOrdenPago
                        orden={dataReady ? compromisoSeleccionadoListaDetalle : null}
                        onFormData={handleFormData}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default FormCreateOrdenPago