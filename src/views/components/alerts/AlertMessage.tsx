import { Box, Collapse, Alert, IconButton, AlertProps, alpha, Theme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from "react";

type AlertPosition = 'top-right' | 'top-center' | 'top-left' |
  'bottom-right' | 'bottom-center' | 'bottom-left' |
  'center';

interface AlertMessageProps {
  message: string | React.ReactNode;
  severity?: AlertProps['severity'];
  duration?: number;
  onClose?: () => void;
  show?: boolean;
  position?: AlertPosition;
  width?: string | number;
  maxWidth?: string | number;
  elevation?: number;
  persistent?: boolean;
  border?: boolean;
}

const AlertMessage = ({
  message,
  severity = 'info',
  duration = 30000,
  onClose,
  show = true,
  position = 'bottom-center',
  width = '80%',
  maxWidth = '600px',
  elevation = 6,
  persistent = false,
  border = true
}: AlertMessageProps) => {
  const [showAlert, setShowAlert] = useState(show);

  useEffect(() => {
    setShowAlert(show);
  }, [show]);

  useEffect(() => {
    if (!persistent && duration && showAlert) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [showAlert, duration, persistent]);

  const handleClose = () => {
    setShowAlert(false);
    onClose?.();
  };

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 2147483647,
      width,
      maxWidth,
      pointerEvents: 'auto' as const
    };

    switch (position) {
      case 'top-right': return { ...baseStyles, top: 24, right: 24 };
      case 'top-center': return { ...baseStyles, top: 24, left: '50%', transform: 'translateX(-50%)' };
      case 'top-left': return { ...baseStyles, top: 24, left: 24 };
      case 'bottom-right': return { ...baseStyles, bottom: 24, right: 24 };
      case 'bottom-left': return { ...baseStyles, bottom: 24, left: 24 };
      case 'center': return { ...baseStyles, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      default: return { ...baseStyles, bottom: 24, left: '50%', transform: 'translateX(-50%)' };
    }
  };

  const getAlertStyle = (theme: Theme) => ({
    boxShadow: theme.shadows[elevation],
    border: border ? '2px solid' : 'none',
    borderColor: alpha(theme.palette[severity || 'info'].main, 0.5),
    backdropFilter: 'blur(4px)',
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    width: '100%',
    '& .MuiAlert-message': {
      width: '100%',
      fontWeight: 500
    }
  });

  return (
    <Box sx={{
      ...getPositionStyles(),
      '&': { zIndex: 2147483647 }
    }}>
      <Collapse in={showAlert} timeout={300}>
        <Alert
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
              sx={(theme: Theme) => ({
                '&:hover': {
                  backgroundColor: alpha(theme.palette[severity || 'info'].main, 0.2)
                }
              })}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={(theme: Theme) => getAlertStyle(theme)}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default AlertMessage