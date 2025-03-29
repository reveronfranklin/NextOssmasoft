import LayoutBancos from '../forms/LayoutBancos'
import DialogAdmMaestroBancoDetalle from './Dialog/AdmMaestroBancoDetalle'
import DialogAdmMaestroBancoDelete from './Dialog/AdmMaestroBancoDelete'

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