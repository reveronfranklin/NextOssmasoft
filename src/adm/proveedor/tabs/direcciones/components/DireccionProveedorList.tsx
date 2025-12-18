import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Box, Divider, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useServices } from '../services';
import { ButtonWithConfirm } from "src/views/components/buttons/ButtonsWithConfirm";
import { Direccion } from '../interfaces';
import CrudModal from "src/views/components/modal/CrudModal";
import Formulario from '../views/Formulario';

interface DireccionProveedorListProps {
  codigoProveedor?: number;
  onEdit?: (direccion: Direccion) => void;
  onDelete?: (codigoDireccion: number) => void;
  onAdd?: () => void;
}

const DireccionProveedorList: React.FC<DireccionProveedorListProps> = ({
  codigoProveedor,
  onDelete
}) => {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const { getDireccionesByProveedor, createDireccion, updateDireccion, deleteDireccion } = useServices();

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [direccionEdit, setDireccionEdit] = useState<Direccion | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (codigoProveedor) {
      getDireccionesByProveedor(codigoProveedor).then(setDirecciones);
    } else {
      setDirecciones([]);
    }
  }, [codigoProveedor, getDireccionesByProveedor]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setDireccionEdit(null);
    setFormData({
      codigoDirProveedor: 0,
      codigoProveedor: Number(codigoProveedor),
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (direccion: Direccion) => {
    setModalMode('edit');
    setDireccionEdit(direccion);
    setFormData({
      ...direccion,
      codigoDirProveedor: (direccion as any).codigoDirProveedor ?? 0,
      codigoProveedor: (direccion as any).codigoProveedor ?? codigoProveedor ?? 0,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDireccionEdit(null);
    setFormData({});
  };

  const handleFormChange = (data: { values: any; isValid: boolean }) => {
    setFormData(data.values);
    setIsValid(data.isValid);
  };

  const handleSubmit = async () => {
    if (modalMode === 'create') {
      await createDireccion(formData);
    } else {
      await updateDireccion(formData);
    }
    handleCloseModal();
    if (codigoProveedor) {
      getDireccionesByProveedor(codigoProveedor).then(setDirecciones);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Direcciones asociadas</Typography>
        <IconButton
          aria-label="añadir dirección"
          onClick={handleOpenCreate}
          size="small"
          sx={{ color: 'grey.600' }}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Stack>
      {direcciones.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No hay direcciones asociadas a este proveedor.
        </Typography>
      ) : (
        <List>
          {direcciones.map(dir => (
            <React.Fragment key={dir.codigoDireccion}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      aria-label="editar"
                      onClick={() => handleOpenEdit(dir)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <ButtonWithConfirm
                      onAction={() => onDelete && onDelete(dir.codigoDireccion)}
                      confirmMessage="¿Seguro que deseas eliminar esta dirección?"
                      showLoading={true}
                      disableBackdropClick={true}
                      sx={{
                        edge: "end",
                        size: "small",
                        sx: { ml: 1, color: 'grey.600' },
                        'aria-label': 'eliminar'
                      }}>
                      <DeleteIcon />
                    </ButtonWithConfirm>
                  </>
                }
              >
                <ListItemText
                  primary={`${dir.direccion ?? 'No disponible' } (${dir.tipoVivienda ?? 'No disponible'})`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        {dir.complementoDir}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        País: {dir.pais} | Estado: {dir.estado} | Municipio: {dir.municipio} | Ciudad: {dir.ciudad} | Parroquia: {dir.parroquia}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Nivel: {dir.tipoNivel} {dir.nivel} | Nro Vivienda: {dir.nroVivienda} | Tenencia: {dir.tenencia} | Vivienda: {dir.vivienda}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Código Postal: {dir.codigoPostal} {dir.principal ? ' | Principal' : ''} | sector: {dir.sector} | urbanización: {dir.urbanizacion}
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
        title={modalMode === 'create' ? 'Añadir dirección' : 'Editar dirección'}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={modalMode === 'edit' ? async () => {
          if (direccionEdit) {
            await deleteDireccion(direccionEdit.codigoDireccion);
          }
        } : undefined}
        isEdit={modalMode === 'edit'}
        formValues={formData}
        PaperProps={{ sx: { minHeight: '70vh', minWidth: '1000px' } }}
        disableSubmit={!isValid}
        confirmTitles={{
          create: "¿Crear dirección?",
          edit: "¿Actualizar dirección?",
          delete: "¿Eliminar dirección?"
        }}
        confirmTexts={{
          create: "¿Seguro que deseas crear esta dirección?",
          edit: "¿Seguro que deseas actualizar esta dirección?",
          delete: "¿Seguro que deseas eliminar esta dirección?"
        }}
      >
        <Formulario initialValues={direccionEdit || formData} onChange={handleFormChange} />
      </CrudModal>
    </Box>
  );
};

export default DireccionProveedorList;
