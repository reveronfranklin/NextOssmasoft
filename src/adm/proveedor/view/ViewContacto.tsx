import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

import ContactoProveedorList from 'src/adm/proveedor/tabs/contactos/components/ContactoProveedorList';

const ViewContacto = () => {
  const { proveedorSeleccionado } = useSelector(
    (state: RootState) => state.proveedor
  );

  if (!proveedorSeleccionado?.codigoProveedor) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Selecciona un proveedor para ver los contactos.
        </Typography>
      </Box>
    );
  }

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <ContactoProveedorList
          codigoProveedor={proveedorSeleccionado.codigoProveedor}
        />
      </Box>
    </Card>
  );
};

export default ViewContacto;
