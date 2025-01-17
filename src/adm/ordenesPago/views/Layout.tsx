import DialogAdmOrdenPagoDetalle from './Dialog/AdmOrdenPagoDetalle'
import ViewerPdf from './Dialog/ViewerPdf'
import LayoutOrdenPago from '../forms/LayoutOrdenPago'

const LayoutComponent = () => {
    return (
        <>
            <LayoutOrdenPago />
            <DialogAdmOrdenPagoDetalle />
            <ViewerPdf />
        </>
    )
}

export default LayoutComponent