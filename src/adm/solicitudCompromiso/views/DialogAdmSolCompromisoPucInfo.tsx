import { Ref, forwardRef, ReactElement } from 'react'
import Fade, { FadeProps } from '@mui/material/Fade'

import { Card, Dialog, DialogContent } from "@mui/material"
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker"

import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { useDispatch } from "react-redux"

import { setVerSolicitudCompromisoPucActive } from "src/store/apps/adm"
import UpdatePuc from './../forms/puc/formAdmSolicitudCompromisoUpdateAsync'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const handleClose = (dispatch: any) => {
    dispatch(setVerSolicitudCompromisoPucActive(false))
}

const DialogAdmSolCompromisoPucInfo = () => {
    const dispatch = useDispatch()
    const { verSolicitudCompromisoPucActive } = useSelector((state: RootState) => state.admSolicitudCompromiso)

    return (
        <Card>
            <Dialog
                fullWidth
                maxWidth='lg'
                scroll='body'
                open={verSolicitudCompromisoPucActive}
                TransitionComponent={Transition}
                onClose={() => handleClose(dispatch)}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                    <IconButton
                        size='small'
                        onClick={() => handleClose(dispatch)}
                        sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                    >
                        <Icon icon='mdi:close' />
                    </IconButton>
                    <DatePickerWrapper>
                        <UpdatePuc />
                    </DatePickerWrapper>
                </DialogContent>
            </Dialog>
        </Card>
    )

}

export default DialogAdmSolCompromisoPucInfo