import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormHelperText
} from '@mui/material';
import { RootState } from 'src/store';
import { setIsOpenDialogMaestroBancoDelete } from 'src/store/apps/pagos/bancos';
import { SisBancoDeleteDto } from 'src/interfaces/adm/SisBanco/SisBancoDeleteDto';
import useServices from '../../services/useServices';

const AdmMaestroBancoDelete = () => {
    const dispatch = useDispatch()
    const qc: QueryClient = useQueryClient()
    const { isOpenDialogMaestroBancoDelete, codigoBanco } = useSelector((state: RootState) => state.admMaestroBanco )

    const {
        deleteMaestroBanco,
        setMessage,
        message,
        loading
    } = useServices()

    const handleClose = () => {
        setMessage('')
        dispatch(setIsOpenDialogMaestroBancoDelete(false))
    }

    const handleDelete = async () => {
        try {
            const payload: SisBancoDeleteDto = {
                codigoBanco
            }

            const response = await deleteMaestroBanco(payload)

            if (response?.isValid) {
                dispatch(setIsOpenDialogMaestroBancoDelete(false))
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            qc.invalidateQueries({
                queryKey: ['maestroBancoTable']
            })
        }
    }

    return (
        <Box>
            <Card>
                <Dialog
                    open={isOpenDialogMaestroBancoDelete}
                    onClose={handleClose}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title'>
                        {'Esta usted seguro de realizar esta acción?'}
                    </DialogTitle>
                    {   message &&
                        <DialogContent>
                            <DialogContentText id='alert-dialog-description'>
                                <FormHelperText
                                sx={{
                                    color: 'error.main',
                                    fontSize: 20
                                }}
                                >
                                    {message}
                                </FormHelperText>
                            </DialogContentText>
                        </DialogContent>
                    }
                    <DialogActions>
                        <Button onClick={handleClose}>No</Button>
                        <Button
                            variant='contained'
                            color='primary'
                            size='small'
                            onClick={handleDelete}
                        >
                            {
                                loading
                                ? (
                                    <>
                                        <CircularProgress
                                            sx={{
                                                color: 'common.white',
                                                width: '20px !important',
                                                height: '20px !important',
                                                mr: theme => theme.spacing(2)
                                            }}
                                        />
                                        Espere un momento...
                                    </> )
                                : 'Si'
                            }
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </Box>
    )
}

export default AdmMaestroBancoDelete
