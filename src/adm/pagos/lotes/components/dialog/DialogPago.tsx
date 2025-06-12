import { Ref, forwardRef, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Dialog, DialogContent, Grid, Toolbar, Typography, Box } from '@mui/material';
import Fade, { FadeProps } from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';
import { RootState } from 'src/store';
import { setIsOpenDialogPago, setTypeOperation } from 'src/store/apps/pagos/lote-pagos';
import FromCreate from '../forms/pagos/FormCreate';
import FromCreateTow from '../forms/pagos/FormCreateTwo';
import FromUpdate from '../forms/pagos/FormUpdate';
import FromUpdateTow from '../forms/pagos/FormUpdateTwo';

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const DialogLote = () => {
    const dispatch = useDispatch()
    const { typeOperation, isOpenDialogPago }   = useSelector((state: RootState) => state.admLotePagos )
    const { withOrdenPago }                     = useSelector((state: RootState) => state.admLote )

    const handleClose = () => {
        dispatch(setIsOpenDialogPago(false))
        dispatch(setTypeOperation(null))
    }

    const handleForms = () => {
        if (withOrdenPago && typeOperation === 'create') {
            return <FromCreate />
        } else if (withOrdenPago && typeOperation === 'update') {
            return <FromUpdate />
        } else if (!withOrdenPago && typeOperation === 'create') {
            return <FromCreateTow />
        } else if (!withOrdenPago && typeOperation === 'update') {
            return <FromUpdateTow />
        }
    }

    const setFormComponent = () => {
        return (
            <Fade in={true} timeout={500}>
                <div key={typeOperation}>
                    {
                        handleForms()
                    }
                </div>
            </Fade>
        )
    }

    return (
        <Card>
            <Dialog
                fullWidth
                maxWidth='lg'
                scroll='body'
                open={isOpenDialogPago}
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
                                padding: 0
                            }}
                        >
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                                Pagos ({
                                    (typeOperation === 'update')
                                        ? `Editar ${withOrdenPago ? '' : '- Sin Orden de Pago'}`
                                        : `Crear ${withOrdenPago ? '' : '- Sin Orden de Pago'}`
                                })
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

export default DialogLote