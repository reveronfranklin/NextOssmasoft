import { useState, ReactNode, forwardRef } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type ButtonWithConfirmProps = {
  children: ReactNode
  onAction?: () => void | Promise<void>
  confirmTitle?: string
  confirmMessage?: string
  confirmText?: string
  cancelText?: string
  disableBackdropClick?: boolean
  showLoading?: boolean
} & ButtonProps

export const ButtonWithConfirm = forwardRef<HTMLButtonElement, ButtonWithConfirmProps>(({
  children,
  onAction,
  confirmTitle = "Confirmar acción",
  confirmMessage = "¿Estás seguro de realizar esta acción?",
  confirmText = "Sí",
  cancelText = "No",
  disableBackdropClick = false,
  showLoading = false,
  ...buttonProps
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => setOpen(true);

  const handleClose = () => {
    if (!isLoading) {
      setOpen(false)
    }
  }

  const handleConfirm = async () => {
    if (!onAction) {
      handleClose()

      return
    }

    try {
      if (showLoading) {
        setIsLoading(true)
      }

      const result = onAction()
      if (result instanceof Promise) {
        await result
      }
      handleClose()
    } catch (error) {
      console.error("Error en la acción:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button {...buttonProps} onClick={handleClick}>
        {children}
      </Button>

      <Dialog
        open={open}
        onClose={disableBackdropClick ? undefined : handleClose}
        disableEscapeKeyDown={disableBackdropClick}
      >
        <DialogTitle>{confirmTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            autoFocus
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
})