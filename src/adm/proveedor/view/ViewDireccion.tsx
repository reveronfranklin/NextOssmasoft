import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

import DireccionProveedorList from 'src/adm/proveedor/tabs/direcciones/components/DireccionProveedorList';

const ViewDireccionProveedor = () => {
  const { proveedorSeleccionado } = useSelector((state: RootState) => state.proveedor);

  if (!proveedorSeleccionado?.codigoProveedor) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Selecciona un proveedor para ver las direcciones.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <DireccionProveedorList codigoProveedor={proveedorSeleccionado.codigoProveedor} />
    </Box>
  );
};

export default ViewDireccionProveedor;
