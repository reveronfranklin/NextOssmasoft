import { Box, Collapse, Alert, IconButton, AlertProps } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import { useState, useEffect } from "react"

interface AlertMessageProps {
  message: string
  severity?: AlertProps['severity']
  duration?: number
  onClose?: () => void
  show?: boolean
}

const AlertMessage = ({
  message,
  severity = 'info',
  duration = 30000,
  onClose,
  show = true
}: AlertMessageProps) => {
  const [showAlert, setShowAlert] = useState(show)

  useEffect(() => {
    setShowAlert(show)
  }, [show])

  useEffect(() => {
    if (duration && showAlert) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [showAlert, duration])

  const handleClose = () => {
    setShowAlert(false)
    onClose?.()
  }

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 80,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1,
      width: '80%',
      maxWidth: '600px'
    }}>
      <Collapse in={showAlert}>
        <Alert
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ boxShadow: 3 }}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  )
}

export default AlertMessage