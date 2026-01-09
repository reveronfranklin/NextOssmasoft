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
import { Actividad } from '../interfaces';
import CrudModal from 'src/views/components/modal/CrudModal';
import Formulario from '../views/Formulario';

interface ActividadProveedorListProps {
  codigoProveedor?: number;
}

const ActividadProveedorList: React.FC<ActividadProveedorListProps> = ({
  codigoProveedor
}) => {
  const [actividades, setActividades] = useState<Actividad[]>([]);

  const {
    getActividadesByProveedor,
    createActividad,
    updateActividad,
    deleteActividad
  } = useServices();

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [actividadEdit, setActividadEdit] = useState<Actividad | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (codigoProveedor) {
      getActividadesByProveedor(codigoProveedor).then(setActividades);
    } else {
      setActividades([]);
    }
  }, [codigoProveedor, getActividadesByProveedor]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setActividadEdit(null);
    setFormData({
      codigoActProveedor: 0,
      codigoProveedor: Number(codigoProveedor),
      actividadId: 0,
      fechaIni: null,
      fechaFin: null
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (actividad: Actividad) => {
    setModalMode('edit');
    setActividadEdit(actividad);
    setFormData({ ...actividad });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setActividadEdit(null);
    setFormData({});
  };

  const handleFormChange = (data: { values: any; isValid: boolean }) => {
    setFormData(data.values);
    setIsValid(data.isValid);
  };

  const handleSubmit = async () => {
    try {
      if (modalMode === 'create') {
        await createActividad(formData);
      } else {
        await updateActividad(formData);
      }

      handleCloseModal();

      if (codigoProveedor) {
        getActividadesByProveedor(codigoProveedor).then(setActividades);
      }
    } catch (error) {
      console.error('Error opening direccion modal:', error);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Actividades asociadas</Typography>
        <IconButton
          aria-label="añadir actividad"
          onClick={handleOpenCreate}
          size="small"
          sx={{ color: 'grey.600' }}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Stack>

      {actividades.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No hay actividades asociadas a este proveedor.
        </Typography>
      ) : (
        <List>
          {actividades.map(act => (
            <React.Fragment key={act.codigoActProveedor}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      aria-label="editar"
                      onClick={() => handleOpenEdit(act)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>

                    <ButtonWithConfirm
                      onAction={async () => {
                        await deleteActividad(act.codigoActProveedor);
                        setActividades(prev =>
                          prev.filter(
                            a => a.codigoActProveedor !== act.codigoActProveedor
                          )
                        );
                      }}
                      confirmMessage="¿Seguro que deseas eliminar esta actividad?"
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
                  primary={`Actividad ID: ${act.actividadId}`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        Fecha inicio: {new Date(act.fechaIni).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Fecha fin: {new Date(act.fechaFin).toLocaleDateString()}
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
        title={modalMode === 'create' ? 'Añadir actividad' : 'Editar actividad'}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        maxWidth="md"
        onDelete={
          modalMode === 'edit'
            ? async () => {
                if (actividadEdit) {
                  await deleteActividad(actividadEdit.codigoActProveedor);
                  setActividades(prev =>
                    prev.filter(
                      a =>
                        a.codigoActProveedor !==
                        actividadEdit.codigoActProveedor
                    )
                  );
                  handleCloseModal();
                }
              }
            : undefined
        }
        isEdit={modalMode === 'edit'}
        formValues={formData}
        disableSubmit={!isValid}
        confirmTitles={{
          create: '¿Crear actividad?',
          edit: '¿Actualizar actividad?',
          delete: '¿Eliminar actividad?'
        }}
        confirmTexts={{
          create: '¿Seguro que deseas crear esta actividad?',
          edit: '¿Seguro que deseas actualizar esta actividad?',
          delete: '¿Seguro que deseas eliminar esta actividad?'
        }}
      >
        <Formulario
          initialValues={actividadEdit || formData}
          onChange={handleFormChange}
        />
      </CrudModal>
    </Box>
  );
};

export default ActividadProveedorList;
