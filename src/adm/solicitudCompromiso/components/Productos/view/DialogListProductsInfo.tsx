import { Typography, Card, Dialog, DialogContent, IconButton } from "@mui/material"
import { Ref, forwardRef, ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { setVerDialogListProductsInfoActive  } from 'src/store/apps/adm'
import FormIndexProducts from '../forms/formIndexProducts'
import Icon from 'src/@core/components/icon'
import Fade, { FadeProps } from '@mui/material/Fade'

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
            </Dialog>
        </Card>
    )
}

export default DialogListProductsInfo