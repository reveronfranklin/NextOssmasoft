import { Ref, forwardRef, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Dialog, DialogContent, Grid, Toolbar, Typography, Box } from '@mui/material';
import Fade, { FadeProps } from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';
import { RootState } from 'src/store';
import { setIsOpenDialogPreOrdenPago, setTypeOperation } from 'src/store/apps/preOrdenPago';
import FormCreate from '../froms/preOrdenPago/FormCreate';
import FormUpdate from '../froms/preOrdenPago/FromUpdate';

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const DialogPreOrdenPago = () => {
    const dispatch = useDispatch()
    const { typeOperation, isOpenDialogPreOrdenPago } = useSelector((state: RootState) => state.admPreOrdenPago )

    const handleClose = () => {
        dispatch(setIsOpenDialogPreOrdenPago(false))
        dispatch(setTypeOperation(null))
    }

    const setFormComponent = () => {
        return (
            <Fade in={true} timeout={500}>
                <div key={typeOperation}>
                    {typeOperation === 'update' ? <FormUpdate /> : <FormCreate /> }
                </div>
            </Fade>
        )
    }

    return (
        <Card>
            <Dialog
                fullWidth
                maxWidth={ typeOperation === 'create' ? 'xs' : 'lg' }
                scroll='body'
                open={isOpenDialogPreOrdenPago}
                TransitionComponent={Transition}
                onClose={() => handleClose()}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                sx={{
                    '& .MuiDialog-paper': {
                        width: '100%',
                        height: '70vh',
                        margin: 0,
                        borderRadius: 0,
                        padding: 0
                    }
                }}
            >
                <Grid>
                    <Box position="static" sx={{ boxShadow: 'none' }}>
                        <Toolbar sx={{
                                justifyContent: 'space-between',
                                padding: 0,
                            }}
                        >
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                                Pre Orden de Pago ({ typeOperation === 'update' ? 'Editar' : 'Crear' })
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
                        {setFormComponent()}
                    </DialogContent>
                </Grid>
            </Dialog>
        </Card>
    )
}

export default DialogPreOrdenPago