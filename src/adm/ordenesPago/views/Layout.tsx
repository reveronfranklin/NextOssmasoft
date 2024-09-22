import { Card, CardContent, Grid, Typography } from "@mui/material"
import DialogAdmOrdenPagoDetalle from './Dialog/AdmOrdenPagoDetalle'
import LayoutOrdenPago from '../forms/LayoutOrdenPago'

const LayoutComponent = () => {
    return (
        <>
            <LayoutOrdenPago />
            <DialogAdmOrdenPagoDetalle />
        </>
    )
}

export default LayoutComponent