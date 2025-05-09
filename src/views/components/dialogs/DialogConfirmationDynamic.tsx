import React from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    CircularProgress,
    type Theme
} from '@mui/material';
import { DialogConfirmationProps } from '../../../interfaces/dialog/dialog-confirmation-props.interface';

const DialogConfirmation = ({
    open,
    onClose,
    title = '¿Está usted seguro de realizar esta acción?',
    content,
    confirmButtonText = 'Sí',
    cancelButtonText = 'No',
    onConfirm,
    loading = false,
    loadingText = 'Espere un momento...',
    maxWidth = 'xs',
    fullWidth = true
}: DialogConfirmationProps) => {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            maxWidth={maxWidth}
            fullWidth={fullWidth}
        >
            <DialogTitle id='alert-dialog-title'>
                {title}
            </DialogTitle>

            {content && (
                <DialogContent>
                    {typeof content === 'string' ? (
                        <DialogContentText id='alert-dialog-description'>
                            {content}
                        </DialogContentText>
                    ) : (
                        content
                    )}
                </DialogContent>
            )}

            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    color="inherit"
                >
                    {cancelButtonText}
                </Button>

                <Button
                    variant='contained'
                    color='primary'
                    size='small'
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <CircularProgress
                                sx={{
                                    color: 'common.white',
                                    width: '20px !important',
                                    height: '20px !important',
                                    mr: (theme: Theme) => theme.spacing(2)
                                }}
                                size="small"
                            />
                            {loadingText}
                        </>
                    ) : confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogConfirmation