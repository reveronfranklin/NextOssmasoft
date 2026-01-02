import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useServices } from '../services';
import { ButtonWithConfirm } from 'src/views/components/buttons/ButtonsWithConfirm';
import { Contacto } from '../interfaces';
import CrudModal from 'src/views/components/modal/CrudModal';
import Formulario from '../views/Formulario';

interface ContactoProveedorListProps {
  codigoProveedor?: number;
}

const ContactoProveedorList: React.FC<ContactoProveedorListProps> = ({ codigoProveedor }) => {
  const [contactos, setContactos] = useState<Contacto[]>([]);

  const {
    getContactosByProveedor,
    createContacto,
    updateContacto,
    deleteContacto
  } = useServices();

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [contactoEdit, setContactoEdit] = useState<Contacto | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (codigoProveedor) {
      getContactosByProveedor(codigoProveedor).then(setContactos);
    } else {
      setContactos([]);
    }
  }, [codigoProveedor, getContactosByProveedor]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setContactoEdit(null);
    setFormData({
      codigoContactoProveedor: 0,
      codigoProveedor: Number(codigoProveedor),
      nombre: '',
      apellido: '',
      identificacionId: 0,
      identificacion: '',
      sexo: '',
      tipoContactoId: 0,
      principal: false
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (contacto: Contacto) => {
    setModalMode('edit');
    setContactoEdit(contacto);
    setFormData({ ...contacto });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setContactoEdit(null);
    setFormData({});
  };

  const handleFormChange = (data: { values: any; isValid: boolean }) => {
    setFormData(data.values);
    setIsValid(data.isValid);
  };

  const handleSubmit = async () => {
    if (modalMode === 'create') {
      await createContacto(formData);
    } else {
      await updateContacto(formData);
    }
    handleCloseModal();
    if (codigoProveedor) {
      getContactosByProveedor(codigoProveedor).then(setContactos);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Contactos asociados</Typography>
        <IconButton
          aria-label="añadir contacto"
          onClick={handleOpenCreate}
          size="small"
          sx={{ color: 'grey.600' }}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Stack>

      {contactos.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No hay contactos asociados a este proveedor.
        </Typography>
      ) : (
        <List>
          {contactos.map(cont => (
            <React.Fragment key={cont.codigoContactoProveedor}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      aria-label="editar"
                      onClick={() => handleOpenEdit(cont)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>

                    <ButtonWithConfirm
                      onAction={() => {
                        if (cont.codigoContactoProveedor !== undefined) {
                          deleteContacto(cont.codigoContactoProveedor);
                        }
                      }}
                      confirmMessage="¿Seguro que deseas eliminar este contacto?"
                      showLoading
                      disableBackdropClick
                      sx={{ ml: 1, color: 'grey.600' }}
                    >
                      <DeleteIcon />
                    </ButtonWithConfirm>
                  </>
                }
              >
                <ListItemText
                  primary={`${cont.nombre} ${cont.apellido}`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        ID: {cont.identificacion} | Sexo: {cont.sexo} | Tipo Contacto: {cont.tipoContactoId}
                      </Typography>
                      <Typography variant="body2">
                        {cont.principal ? 'Principal' : ''}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      <CrudModal
        open={openModal}
        title={modalMode === 'create' ? 'Añadir contacto' : 'Editar contacto'}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={
          modalMode === 'edit'
            ? async () => {
                if (contactoEdit?.codigoContactoProveedor !== undefined) {
                  await deleteContacto(contactoEdit.codigoContactoProveedor);
                }
              }
            : undefined
        }
        isEdit={modalMode === 'edit'}
        formValues={formData}
        disableSubmit={!isValid}
        confirmTitles={{
          create: '¿Crear contacto?',
          edit: '¿Actualizar contacto?',
          delete: '¿Eliminar contacto?'
        }}
        confirmTexts={{
          create: '¿Seguro que deseas crear este contacto?',
          edit: '¿Seguro que deseas actualizar este contacto?',
          delete: '¿Seguro que deseas eliminar este contacto?'
        }}
      >
        <Formulario
          initialValues={contactoEdit || formData}
          onChange={handleFormChange}
        />
      </CrudModal>
    </Box>
  );
};

export default ContactoProveedorList;
