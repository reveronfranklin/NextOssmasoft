import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material"
import React, { useState } from 'react';
import { CleaningServices } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'

interface ButtonConfig<T> {
  label: string
  onClick: (filters?: any) => T
  show: boolean
  variant?: 'contained' | 'outlined'
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  size?: 'small' | 'medium' | 'large'
  sx?: React.CSSProperties
}

const CustomButtonDialog = ({
  saveButtonConfig,
  updateButtonConfig,
  deleteButtonConfig,
  clearButtonConfig,
  handleSubmit,
  onSubmit,
  loading
}: {
  saveButtonConfig?: ButtonConfig<Promise<void>>,
  updateButtonConfig?: ButtonConfig<Promise<void>>,
  deleteButtonConfig?: ButtonConfig<Promise<void>>,
  clearButtonConfig?: ButtonConfig<Promise<void>>,
  handleSubmit?: any,
  onSubmit?: any,
  loading?: boolean
}) => {

  const [open, setOpen] = useState(false);

  const handle = (onClick?: any) => {
    setOpen(true)
    // onSubmit(onClick)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Box sx={{ paddingTop: 6 }}>
        {saveButtonConfig?.show && (
          <Button
            variant={saveButtonConfig?.variant}
            color={saveButtonConfig?.color}
            size={saveButtonConfig?.size}
            sx={{ ...saveButtonConfig?.sx, marginRight: 2 }}
            onClick={() => handle(saveButtonConfig?.onClick)}
          >
            <SaveIcon sx={{ marginRight: 1 }} />
            {saveButtonConfig?.label}
          </Button>
        )}
        {updateButtonConfig?.show && (
          <Button
            variant={updateButtonConfig?.variant}
            color={updateButtonConfig?.color}
            size={updateButtonConfig?.size}
            sx={{ ...updateButtonConfig?.sx, marginRight: 2 }}
            onClick={() => handle(updateButtonConfig?.onClick)}
          >
            <SaveIcon sx={{ marginRight: 1 }} />
            {updateButtonConfig?.label}
          </Button>
        )}
        {deleteButtonConfig?.show && (
          <Button
            variant={deleteButtonConfig?.variant}
            color={deleteButtonConfig?.color}
            size={deleteButtonConfig?.size}
            sx={{ ...deleteButtonConfig?.sx, marginRight: 2 }}
            onClick={() => handle(deleteButtonConfig?.onClick)}
          >
            <DeleteIcon sx={{ marginRight: 1 }} />
            {deleteButtonConfig?.label}
          </Button>
        )}
        {clearButtonConfig?.show && (
          <Button
            variant={clearButtonConfig?.variant}
            color={clearButtonConfig?.color}
            size={clearButtonConfig?.size}
            sx={{ ...clearButtonConfig?.sx, marginRight: 2 }}
            // onClick={() => handleButtonClick(clearButtonConfig?.onClick)}
          >
            <CleaningServices />
            {clearButtonConfig?.label}
          </Button>
        )}
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Esta usted seguro de realizar esta acción?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button
            variant='contained'
            color='primary'
            size='small'
            // onClick={handleSubmit(onSubmit)}
          >
            { false ? (
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
              </>
              ) : 'Si' }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CustomButtonDialog