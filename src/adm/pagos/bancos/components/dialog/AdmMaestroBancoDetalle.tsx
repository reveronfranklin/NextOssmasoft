import { Ref, forwardRef, ReactElement } from 'react';
import Fade, { FadeProps } from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import { Card, Dialog, DialogContent, Grid, Toolbar, Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'src/@core/components/icon';
import { RootState } from 'src/store';
import { setIsOpenDialogMaestroBancoDetalle, setTypeOperation } from 'src/store/apps/pagos/bancos';
import FormCreate from '../forms/FormCreate';
import FormUpdate from '../forms/FormUpdate';

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const DialogAdmMaestroBancoDetalle = () => {
    const dispatch = useDispatch()

    const { typeOperation, isOpenDialogMaestroBancoDetalle } = useSelector((state: RootState) => state.admMaestroBanco )

    const handleClose = () => {
        dispatch(setIsOpenDialogMaestroBancoDetalle(false))
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
                scroll='body'
                open={isOpenDialogMaestroBancoDetalle}
                TransitionComponent={Transition}
                onClose={() => handleClose()}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                disableEnforceFocus
                sx={{
                    '& .MuiDialog-paper': {
                        width: '100%',
                        height: '45vh',
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
                                Maestro Banco ({ typeOperation === 'update' ? 'Editar' : 'Crear' })
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

export default DialogAdmMaestroBancoDetalle