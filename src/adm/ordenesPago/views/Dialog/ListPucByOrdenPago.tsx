import { Ref, forwardRef, ReactElement } from 'react'
import Fade, { FadeProps } from '@mui/material/Fade'
import { Card, Dialog, DialogContent, Grid, Toolbar, Typography, Box } from "@mui/material"
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { useDispatch } from "react-redux"

import { setIsOpenDialogListPucOrdenPago } from "src/store/apps/ordenPago"
import FormListPucByOrdenPago from '../../forms/listPuc/FormListPucByOrdenPago'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const DialogListPucByOrdenPago = () => {
    const dispatch = useDispatch()
    const { isOpenDialogListPucOrdenPago } = useSelector((state: RootState) => state.admOrdenPago)

    const handleClose = () => {
        dispatch(setIsOpenDialogListPucOrdenPago(false))
    }

    return (
        <Card>
            <Dialog
                fullWidth
                maxWidth={'lg'}
                scroll='body'
                open={isOpenDialogListPucOrdenPago}
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
                    <Box position="static" sx={{ boxShadow: 'none' }}>
                        <Toolbar sx={{ justifyContent: 'space-between', padding: 0 }}>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                                Lista de compromisos presupuestario
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
                        <FormListPucByOrdenPago />
                    </DialogContent>
                </Grid>
            </Dialog>
        </Card>
    )
}

export default DialogListPucByOrdenPago