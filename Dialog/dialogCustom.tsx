import { CircularProgress, DialogContent, Dialog, DialogActions, DialogContentText, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button'

const DialogCustom = (props: any) => {
    return (
        <>
            <Dialog
                open={props.open}
                onClose={props.onClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {props.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose}>No</Button>
                    <Button onClick={props.handle} autoFocus>
                        { props.loading ? (
                            <>
                                <CircularProgress
                                    sx={{
                                        color: 'common.white',
                                        width: '20px !important',
                                        height: '20px !important',
                                        mr: theme => theme.spacing(2)
                                    }}
                                />
                                Eliminando...
                            </>
                        )
                            : 'Sí'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogCustom