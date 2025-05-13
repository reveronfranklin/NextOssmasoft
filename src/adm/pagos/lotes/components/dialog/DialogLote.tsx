import { Ref, forwardRef, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Dialog, DialogContent, Grid, Toolbar, Typography, Box } from '@mui/material';
import Fade, { FadeProps } from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';
import { RootState } from 'src/store';
import { setIsOpenDialogLote, setTypeOperation } from 'src/store/apps/pagos/lotes';
import TwoColumnLayout from '../../../../shared/views/twoColumnLayout';
import TabsComponent from '../../../../shared/components/Tabs';
import { tabs } from '../dataGrid/tabs/config'
import FormCreate from '../forms/FormCreate';
import FormUpdate from '../forms/FormUpdate';

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const DialogLote = () => {
    const dispatch = useDispatch()
    const { typeOperation, isOpenDialogLote } = useSelector((state: RootState) => state.admLote )

    const handleClose = () => {
        dispatch(setIsOpenDialogLote(false))
        dispatch(setTypeOperation(null))
    }

    const setFormComponent = () => {
        return (
            <Fade in={true} timeout={500}>
                <div key={typeOperation}>
                    {
                        typeOperation === 'create'
                        ? <FormCreate />
                        : (
                            <TwoColumnLayout
                                leftContent={
                                    <FormUpdate />
                                }
                                rightContent={
                                    <TabsComponent
                                        tabs={tabs}
                                    />
                                }
                            />
                        )
                    }
                </div>
            </Fade>
        )
    }

    return (
        <Card>
            <Dialog
                fullWidth
                maxWidth={ typeOperation === 'create' ? 'md' : 'xl' }
                scroll='body'
                open={isOpenDialogLote}
                TransitionComponent={Transition}
                onClose={() => handleClose()}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                sx={{
                    '& .MuiDialog-paper': {
                        width: '100%',
                        height: (typeOperation === 'create' ? '50vh' : '80vh' ),
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
                                Lotes de pago ({ typeOperation === 'update' ? 'Editar' : 'Crear' })
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