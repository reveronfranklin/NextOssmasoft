import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CrudModal = ({
  open,
  title,
  onClose,
  onSubmit,
  onDelete,
  isEdit = false,
  children,
  formValues = {},
}) => {
  const handleSubmit = (e, action) => {
    e.preventDefault();
    if (action === 'delete' && onDelete) {
      onDelete(formValues, action);
    } else if (onSubmit) {
      onSubmit(formValues, action);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
            <Button color="error" onClick={(e) => handleSubmit(e, 'delete')}>
              Eliminar
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => handleSubmit(e, isEdit ? 'edit' : 'create')}
          >
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CrudModal;