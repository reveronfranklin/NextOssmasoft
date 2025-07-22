import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';

const CrudModal = ({
  open,
  title,
  onClose,
  onSubmit,
  onDelete,
  isEdit = false,
  isCreate = false,
  isDelete = false,
  children,
}) => {
  const handleSubmit = (e) => {
    onSubmit && onSubmit(e);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          {isEdit && onDelete && (
            <Button color="error" onClick={() => onDelete(formValues)}>
              Eliminar
            </Button>
          )}
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CrudModal;