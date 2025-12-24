import React, { useEffect, useState, useCallback } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/UrlServices.enum';
import { Contacto } from '../interfaces';

interface ContactoListProps {
  selectedContactoId?: number | null;
  onContactoSelect?: (contacto: Contacto | null) => void;
  codigoProveedor?: number; // Para filtrar por proveedor
}

const ContactoList: React.FC<ContactoListProps> = ({
  selectedContactoId,
  onContactoSelect,
  codigoProveedor
}) => {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [selected, setSelected] = useState<Contacto | null>(null);

  const getContactosByProveedor = useCallback(async (codigoProveedor?: number) => {
    if (!codigoProveedor) return [];
    const response = await ossmmasofApi.post(UrlServices.GET_CONTACTOS, { CodigoProveedor: codigoProveedor });

    return response?.data?.data || [];
  }, []);

  useEffect(() => {
    if (codigoProveedor) {
      getContactosByProveedor(codigoProveedor).then(setContactos);
    }
  }, [codigoProveedor, getContactosByProveedor]);

  useEffect(() => {
    if (selectedContactoId && contactos.length > 0) {
      const found = contactos.find(c => c.codigoContactoProveedor === selectedContactoId) || null;
      setSelected(found);
    }
  }, [selectedContactoId, contactos]);

  return (
    <Autocomplete
      options={contactos}
      value={selected}
      getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
      isOptionEqualToValue={(option, value) => option.codigoContactoProveedor === value.codigoContactoProveedor}
      onChange={(_, value) => {
        setSelected(value);
        onContactoSelect?.(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Contacto"
          fullWidth
          margin="dense"
        />
      )}
    />
  );
};

export default ContactoList;
