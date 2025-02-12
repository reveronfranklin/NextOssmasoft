import {Box, Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, CircularProgress } from "@mui/material"
import React from 'react';
import { useRef } from 'react';
import { CleaningServices } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import EditIcon from '@mui/icons-material/Edit'
import { useDispatch } from "react-redux"

interface ButtonConfig<T> {
  label: string
  onClick: (filters?: any) => T
  show: boolean
  variant?: 'contained' | 'outlined'
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  size?: 'small' | 'medium' | 'large'
  sx?: React.CSSProperties
  confirm?: boolean
  disabled?: boolean
}

const CustomButtonDialog = ({
  saveButtonConfig,
  updateButtonConfig,
  deleteButtonConfig,
  clearButtonConfig,
  loading,
  isOpenDialog,
  setIsOpenDialog,
  isFormValid
} : {
  saveButtonConfig?: ButtonConfig<Promise<void>>,
  updateButtonConfig?: ButtonConfig<Promise<void>>,
  deleteButtonConfig?: ButtonConfig<Promise<void>>,
  clearButtonConfig?: ButtonConfig<Promise<void>>,
  loading?: boolean,
  isOpenDialog?: boolean,
  setIsOpenDialog?: (open: boolean) => any,
  isFormValid: boolean;
}) => {
  const dynamicFunctionRef = useRef<((filters?: any) => any) | null>(null)
  const dispatch = useDispatch();

  const handle = async (config: ButtonConfig<Promise<void>>) => {
    dynamicFunctionRef.current = config.onClick

    if (config.confirm) {
      dispatch(setIsOpenDialog?.(true))

      return
    }

    try {
      await config.onClick()
    } catch (error) {
      console.error(error)
    } finally {
      handleClose()
    }
  }

  const handleClose = () => {
    dispatch(setIsOpenDialog?.(false))
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 2
      }}>
        <Box sx={{ flexBasis: 'auto', marginRight: 2 }}>
          {saveButtonConfig?.show && (
            <Button
              variant={saveButtonConfig.variant}
              color={saveButtonConfig.color}
              size={saveButtonConfig.size}
              sx={{ ...saveButtonConfig.sx, marginRight: 2 }}
              onClick={() => handle(saveButtonConfig)}
              disabled={saveButtonConfig.disabled}
            >
              <SaveIcon sx={{ marginRight: 1 }} />
              {saveButtonConfig?.label}
            </Button>
          )}
        </Box>
        <Box sx={{ flexBasis: 'auto', marginRight: 2 }}>
          {updateButtonConfig?.show && (
            <Button
              variant={updateButtonConfig.variant}
              color={updateButtonConfig.color}
              size={updateButtonConfig.size}
              sx={{ ...updateButtonConfig.sx, marginRight: 2 }}
              onClick={() => handle(updateButtonConfig)}
              disabled={updateButtonConfig.disabled || !isFormValid}
            >
              <EditIcon sx={{ marginRight: 1 }} />
              {updateButtonConfig?.label}
            </Button>
          )}
        </Box>
        <Box sx={{ flexBasis: 'auto', marginRight: 2 }}>
          {deleteButtonConfig?.show && (
            <Button
              variant={deleteButtonConfig.variant}
              color={deleteButtonConfig.color}
              size={deleteButtonConfig.size}
              sx={{ ...deleteButtonConfig.sx, marginRight: 2 }}
              onClick={() => handle(deleteButtonConfig)}
              disabled={deleteButtonConfig.disabled || !isFormValid}
            >
              <DeleteIcon sx={{ marginRight: 1 }} />
              {deleteButtonConfig?.label}
            </Button>
          )}
        </Box>
        <Box sx={{ flexBasis: 'auto', marginRight: 2 }}>
          {clearButtonConfig?.show && (
            <Button
              variant={clearButtonConfig.variant}
              color={clearButtonConfig.color}
              size={clearButtonConfig.size}
              sx={{ ...clearButtonConfig.sx, marginRight: 2 }}
              onClick={() => handle(clearButtonConfig)}
              disabled={clearButtonConfig.disabled || !isFormValid}
            >
              <CleaningServices />
              {clearButtonConfig?.label}
            </Button>
          )}
        </Box>
      </Box>
      <Dialog
        open={isOpenDialog ?? false}
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
            onClick={() => dynamicFunctionRef.current?.()}
            disabled={loading}
          >
            { loading ? (
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