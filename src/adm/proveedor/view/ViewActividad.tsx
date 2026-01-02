import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

import ActividadProveedorList from 'src/adm/proveedor/tabs/actividades/components/ActividadProveedorList';

const ViewActividad = () => {
  const { proveedorSeleccionado } = useSelector(
    (state: RootState) => state.proveedor
  );

  if (!proveedorSeleccionado?.codigoProveedor) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Selecciona un proveedor para ver las actividades.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <ActividadProveedorList
        codigoProveedor={proveedorSeleccionado.codigoProveedor}
      />
    </Box>
  );
};

export default ViewActividad;
