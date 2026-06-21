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
  actionsEnabled = { update: true, delete: true, create: true },
  confirmTitles = {
    create: "¿Crear registro?",
    edit: "¿Actualizar registro?",
    delete: "¿Eliminar registro?"
  },
  confirmTexts = {
    create: "¿Estás seguro de que deseas crear este registro?",
    edit: "¿Estás seguro de que deseas actualizar este registro?",
    delete: "¿Estás seguro de que deseas eliminar este registro?"
  }
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
              confirmTitle={confirmTitles.delete}
              confirmText={confirmTexts.delete}
              onAction={() => handleSubmit('delete')}
            >
              Eliminar
            </ButtonWithConfirm>
          )}
          {isEdit && actionsEnabled.update && (
            <ButtonWithConfirm
              variant="contained"
              color="primary"
              confirmTitle={confirmTitles.edit}
              confirmText={confirmTexts.edit}
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
              confirmTitle={confirmTitles.create}
              confirmText={confirmTexts.create}
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