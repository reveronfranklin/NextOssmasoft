import { Ref, forwardRef, ReactElement, useState, useEffect } from 'react'
import Fade, { FadeProps } from '@mui/material/Fade'
import { Card, Dialog, DialogContent, Grid, Toolbar, Typography, Box } from "@mui/material"
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { useDispatch } from "react-redux"
import { setIsOpenDialogOrdenPagoDetalle, setTypeOperation, setConFactura, setCodigoOrdenPago } from "src/store/apps/ordenPago"
import FormCreateOrdenPago from '../../forms/create/FormCreateOrdenPago'
import FormUpdateOrdenPago from '../../forms/edit/FormUpdateOrdenPago'
import ListaCompromiso from '../../components/ListCompromiso/listaCompromisos'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const DialogAdmOrdenPagoDetalle = () => {
    const [isClosing, setIsClosing] = useState(false)
    const dispatch = useDispatch()

    const { isOpenDialogOrdenPagoDetalle, typeOperation } = useSelector((state: RootState) => state.admOrdenPago)

    const handleClose = () => {
        setIsClosing(true)
        dispatch(setIsOpenDialogOrdenPagoDetalle(false))

        setTimeout(() => {
            dispatch(setTypeOperation(null))
            dispatch(setConFactura(null))
            dispatch(setCodigoOrdenPago(0))
            setIsClosing(false)
        }, 300)
    }

    useEffect(() => {
        if (isOpenDialogOrdenPagoDetalle) {
            setIsClosing(false)
        }
    }, [isOpenDialogOrdenPagoDetalle])

    const setFormComponent = () => {
        return (
            <Fade in={!isClosing} timeout={500}>
                <div key={typeOperation}>
                    {typeOperation === 'update' ? <FormUpdateOrdenPago /> : <FormCreateOrdenPago />}
                </div>
            </Fade>
        )
    }

    return (
        <Card>
            <Dialog
                fullWidth
                maxWidth={typeOperation === 'update' ? false : 'lg'}
                scroll='body'
                open={isOpenDialogOrdenPagoDetalle}
                TransitionComponent={Transition}
                onClose={() => handleClose()}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                sx={{
                    '& .MuiDialog-paper': {
                        width: '100%',
                        height: '95vh',
                        margin: 0,
                        borderRadius: 0,
                        padding: 0,
                    },
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
                                Orden de pago ({typeOperation === 'update' ? 'Editar' : 'Crear'})
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
                        <ListaCompromiso />
                    </DialogContent>
                </Grid>
            </Dialog>
        </Card>
    )
}

export default DialogAdmOrdenPagoDetalle