import LayoutLotes from './LayoutLotes';
import DialogLote from '../components/dialog/DialogLote';
import DialogPago from '../components/dialog/DialogPago';
import ViewerPdf from '../components/dialog/ViewerPdf'

const LayoutComponent = () => {
    return (
        <>
            <LayoutLotes />
            <DialogLote />
            <DialogPago />
            <ViewerPdf />
        </>
    )
}

export default LayoutComponent