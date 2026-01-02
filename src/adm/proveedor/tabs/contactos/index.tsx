import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';
import ContactoList from './components/ContactoList';
import { Contacto } from './interfaces';

interface ContactosViewProps {
  codigoProveedor?: number;
}

const ContactosView: React.FC<ContactosViewProps> = ({ codigoProveedor }) => {
  const [contactoSeleccionado, setContactoSeleccionado] = useState<Contacto | null>(null);

  const limpiarSeleccion = () => setContactoSeleccionado(null);

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={limpiarSeleccion} sx={{ mb: 2 }}>
        Limpiar selección
      </Button>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <ContactoList
            codigoProveedor={codigoProveedor}
            selectedContactoId={contactoSeleccionado?.codigoContactoProveedor}
            onContactoSelect={setContactoSeleccionado}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ContactosView;
