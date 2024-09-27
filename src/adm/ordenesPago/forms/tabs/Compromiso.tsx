import { Grid, Button } from "@mui/material"
import { useDispatch } from "react-redux"
import {
    setCompromisoSeleccionadoDetalle,
    setIsOpenDialogListCompromiso,
} from "src/store/apps/ordenPago"

const Compromiso = () => {
    const dispatch = useDispatch()

    const handleListCompromiso = () => {
        dispatch(setIsOpenDialogListCompromiso(true))
    }

    return (
        <Grid container spacing={2} padding={5}>
            <Button variant='contained' color='success' size='small' onClick={handleListCompromiso}>
                VER COMPROMISOS
            </Button>
        </Grid>
    )
}

export default Compromiso