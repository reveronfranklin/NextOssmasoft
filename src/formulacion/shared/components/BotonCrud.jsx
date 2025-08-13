import React from 'react';
import { IconButton } from '@mui/material';

const BotonCrud = ({
  icon,
  onClick,
  color = 'primary',
  sx = {},
  ...props
}) => (
  <IconButton
    onClick={onClick}
    color={color}
    sx={{ borderRadius: 2, ...sx }}
    {...props}
  >
    {icon}
  </IconButton>
);

export default BotonCrud;