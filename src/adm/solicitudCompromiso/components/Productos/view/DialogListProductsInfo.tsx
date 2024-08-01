import { Typography, Card, Dialog, DialogActions, DialogContent, IconButton } from "@mui/material"
import { Ref, forwardRef, ReactElement } from 'react'
import Button from '@mui/material/Button'
import Fade, { FadeProps } from '@mui/material/Fade'
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { setVerDialogListProductsInfoActive  } from 'src/store/apps/adm'
import FormIndexProducts from '../forms/formIndexProducts'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const DialogListProductsInfo = () => {
    const dispatch = useDispatch()
    const { verDialogListProductsInfoActive } = useSelector((state: RootState) => state.admSolicitudCompromiso )

    const handleSetShow = (active: boolean) => {
        dispatch(setVerDialogListProductsInfoActive(active))
    }

    return (
        <Card>
            <Dialog
                fullWidth
                open={verDialogListProductsInfoActive}
                maxWidth='lg'
                scroll='body'
                onClose={() => handleSetShow(false)}
                TransitionComponent={Transition}
            >
                <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
                    <IconButton
                        size='small'
                        onClick={() => handleSetShow(false)}
                        sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                    >
                        <Icon icon='mdi:close' />
                    </IconButton>
                    <Typography variant='h6' gutterBottom>
                        Lista de Productos
                    </Typography>
                    <FormIndexProducts />
                </DialogContent>
                <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                    <Button variant='outlined' color='secondary' onClick={() => handleSetShow(false)}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default DialogListProductsInfo