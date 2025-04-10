import LayoutBancos from './LayoutBancos'
import DialogAdmMaestroBancoDetalle from '../components/dialog/AdmMaestroBancoDetalle'
import DialogAdmMaestroBancoDelete from '../components/dialog/AdmMaestroBancoDelete'

const LayoutComponent = () => {
    return (
        <>
            <LayoutBancos />
            <DialogAdmMaestroBancoDetalle />
            <DialogAdmMaestroBancoDelete />
        </>
    )
}

export default LayoutComponent