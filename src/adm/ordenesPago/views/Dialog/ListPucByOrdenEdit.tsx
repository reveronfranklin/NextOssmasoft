import { Ref, forwardRef, ReactElement } from 'react'
import Fade, { FadeProps } from '@mui/material/Fade'
import { Card, Dialog, DialogContent, Grid, Toolbar, Typography, Box } from "@mui/material"
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { useDispatch } from "react-redux"
import { setIsOpenDialogListPucOrdenPagoEdit } from "src/store/apps/ordenPago"
import FormPucByOrdenPagoEdit from '../../forms/listPuc/FormPucByOrdenPagoEdit'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const DialogListPucByOrdenPagoEdit = () => {
    const dispatch = useDispatch()
    const { isOpenDialogListPucOrdenPagoEdit } = useSelector((state: RootState) => state.admOrdenPago)

    const handleClose = () => {
        dispatch(setIsOpenDialogListPucOrdenPagoEdit(false))
    }

    return (
        <Card>
            <Dialog
                fullWidth
                maxWidth={'sm'}
                scroll='body'
                open={isOpenDialogListPucOrdenPagoEdit}
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
                <Grid>
                    <Box position="static" sx={{ boxShadow: 'none' }}>
                        <Toolbar sx={{ justifyContent: 'space-between', padding: 0 }}>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                                Editar PUC
                            </Typography>
                            <IconButton
                                size='small'
                                onClick={() => handleClose()}
                                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                            >
                                <Icon icon='mdi:close' />
                            </IconButton>
                        </Toolbar>
                    </Box>
                    <DialogContent>
                        <FormPucByOrdenPagoEdit />
                    </DialogContent>
                </Grid>
            </Dialog>
        </Card>
    )
}

export default DialogListPucByOrdenPagoEdit