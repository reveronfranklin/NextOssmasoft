import { Ref, forwardRef, ReactElement } from 'react'
import Fade, { FadeProps } from '@mui/material/Fade'

import { AppBar, Card, Dialog, DialogContent, Grid, Toolbar, Typography } from "@mui/material"
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'

import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { useDispatch } from "react-redux"

import OrdenPagoComponent from '../../forms/OrdenPagoComponent'
import { setIsOpenDialogOrdenPagoDetalle } from "src/store/apps/ordenPago"

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const DialogAdmOrdenPagoDetalle = () => {
    const dispatch = useDispatch()

    const { isOpenDialogOrdenPagoDetalle, typeOperation } = useSelector((state: RootState) => state.admOrdenPago )

    const handleClose = () => {
        dispatch(setIsOpenDialogOrdenPagoDetalle(false))
    }

    return (
        <Card>
            <Dialog
                fullWidth
                maxWidth={false}
                scroll='body'
                open={isOpenDialogOrdenPagoDetalle}
                TransitionComponent={Transition}
                onClose={() => handleClose()}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                sx={{
                    '& .MuiDialog-paper': {
                        width: '100%',
                        height: '90vh',
                        margin: 0,
                        borderRadius: 0,
                        padding: 0,
                    },
                }}
            >
                <Grid spacing={0} >
                    <AppBar position="static" sx={{ boxShadow: 'none' }}>
                        <Toolbar sx={{ justifyContent: 'space-between', padding: 0, backgroundColor: 'white' }}>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                                Orden de Pago { typeOperation }
                            </Typography>
                            <IconButton
                                size='small'
                                onClick={() => handleClose()}
                                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                            >
                                <Icon icon='mdi:close' />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        { typeOperation === 'update' ? <OrdenPagoComponent /> : <></> }
                    </DialogContent>
                </Grid>
            </Dialog>
        </Card>
    )
}

export default DialogAdmOrdenPagoDetalle