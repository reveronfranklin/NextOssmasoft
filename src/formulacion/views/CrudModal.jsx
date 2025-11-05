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
          {isEdit && onDelete && (
            <ButtonWithConfirm
              color="error"
              confirmTitle = "¿Eliminar variable?"
              confirmText="¿Estás seguro de que deseas eliminar esta variable?"
              onAction={() => handleSubmit('delete')}
            >
              Eliminar
            </ButtonWithConfirm>
          )}
          <ButtonWithConfirm
            variant="contained"
            color="primary"
            confirmTitle={isEdit ? '¿Actualizar variable?' : '¿Crear variable?'}
            confirmText={
              isEdit
                ? 'Si'
                : 'SI'
            }
            onAction={() => handleSubmit(isEdit ? 'edit' : 'create')}
            disabled={disableSubmit}
          >
            {isEdit ? 'Actualizar' : 'Crear'}
          </ButtonWithConfirm>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CrudModal;