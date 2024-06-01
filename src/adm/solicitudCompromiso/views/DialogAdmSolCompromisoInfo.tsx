import { Ref, forwardRef, ReactElement } from 'react'
import { Card, Dialog, DialogActions, DialogContent } from "@mui/material"
import Fade, { FadeProps } from '@mui/material/Fade'
import { setVerSolicitudCompromisosActive, setOperacionCrudAdmSolCompromiso } from 'src/store/apps/adm'

import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { useDispatch } from "react-redux"

import FormCreateSolCompromiso from "./../forms/general/formAdmSolCompromisoCreateAsync"
import FormUpdateSolCompromiso from "./../forms/general/formAdmSolCompromisoUpdateAsync"
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import { CrudOperation } from './../enums/CrudOperations.enum'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const handleClose = (dispatch: any) => {
    dispatch(setVerSolicitudCompromisosActive(false))
    dispatch(setOperacionCrudAdmSolCompromiso(CrudOperation.DEFAULT))
}

const DialogAdmSolCompromisoInfo = () => {
    const dispatch = useDispatch()
    const { verSolicitudCompromisosActive, operacionCrudAdmSolCompromiso } = useSelector((state: RootState) => state.admSolicitudCompromiso)

    return (
        <Card>
            <Dialog
                fullWidth
                maxWidth='md'
                scroll='body'
                open={verSolicitudCompromisosActive}
                TransitionComponent={Transition}
                onClose={() => handleClose(dispatch)}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                    <DatePickerWrapper>
                        {
                            operacionCrudAdmSolCompromiso === CrudOperation.CREATE ? <FormCreateSolCompromiso popperPlacement={undefined} /> : <FormUpdateSolCompromiso popperPlacement={undefined} />
                        }
                    </DatePickerWrapper>
                </DialogContent>
                <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'start' }}>
                    {/* <Button variant='outlined' color='secondary' onClick={() => handleClose(dispatch)}>
                        Cerrar
                    </Button> */}
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default DialogAdmSolCompromisoInfo