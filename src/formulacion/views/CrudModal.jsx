import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { ButtonWithConfirm } from "src/views/components/buttons/ButtonsWithConfirm"

const CrudModal = ({
  open,
  title,
  onClose,
  onSubmit,
  onDelete,
  isEdit = false,
  formValues = {},
  maxWidth = "sm",
  children,
  disableSubmit = false,
  PaperProps = {},
  actionsEnabled = { update: true, delete: true, create: true }
}) => {
  const handleSubmit = (action) => {
    if (action === 'delete' && onDelete) {
      onDelete(formValues, action);
    } else if (onSubmit) {
      onSubmit(formValues, action);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth PaperProps={PaperProps}>
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
            ml: 2,
            position: 'absolute',
            right: 8,
            top: 8,
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          {isEdit && onDelete && actionsEnabled.delete && (
            <ButtonWithConfirm
              color="error"
              confirmTitle="¿Eliminar variable?"
              confirmText="¿Estás seguro de que deseas eliminar esta variable?"
              onAction={() => handleSubmit('delete')}
            >
              Eliminar
            </ButtonWithConfirm>
          )}
          {isEdit && actionsEnabled.update && (
            <ButtonWithConfirm
              variant="contained"
              color="primary"
              confirmTitle="¿Actualizar variable?"
              confirmText="Si"
              onAction={() => handleSubmit('edit')}
              disabled={disableSubmit}
            >
              Actualizar
            </ButtonWithConfirm>
          )}
          {!isEdit && actionsEnabled.create && (
            <ButtonWithConfirm
              variant="contained"
              color="primary"
              confirmTitle="¿Crear variable?"
              confirmText="SI"
              onAction={() => handleSubmit('create')}
              disabled={disableSubmit}
            >
              Crear
            </ButtonWithConfirm>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CrudModal;