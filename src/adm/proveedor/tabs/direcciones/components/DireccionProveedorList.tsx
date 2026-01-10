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
import FormHelperText from '@mui/material/FormHelperText'

interface DireccionProveedorListProps {
  codigoProveedor?: number;
  onEdit?: (direccion: Direccion) => void;
  onDelete?: (codigoDireccion: number) => void;
  onAdd?: () => void;
}

const DireccionProveedorList: React.FC<DireccionProveedorListProps> = ({
  codigoProveedor
}) => {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const { getDireccionesByProveedor, createDireccion, updateDireccion, deleteDireccion } = useServices();

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [direccionEdit, setDireccionEdit] = useState<Direccion | null>(null);
  const [formData, setFormData] = useState<Direccion | {}>({});
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
      codigoDirProveedor: direccion.codigoDirProveedor ?? 0,
      codigoProveedor: direccion.codigoProveedor ?? codigoProveedor ?? 0,
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
    try {
      if (modalMode === 'create') {
        const responseAll = await createDireccion(formData);
        setErrorMessage(responseAll.data.message)
      } else {
        const responseAll = await updateDireccion(formData);
        setErrorMessage(responseAll.data.message)
      }

      handleCloseModal();

      if (codigoProveedor) {
        getDireccionesByProveedor(codigoProveedor).then(setDirecciones);
      }
    } catch (error) {
      console.error('Error opening direccion modal:', error);
      const errorMsg = (error as any)?.message;
      setErrorMessage(errorMsg || 'Ocurrió un error al procesar la solicitud');
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
            <React.Fragment key={dir.codigoDirProveedor}>
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
                      onAction={async () =>{
                        await deleteDireccion(dir.codigoDirProveedor);

                        setDirecciones(prev =>
                          prev.filter(
                            a =>
                            a.codigoDirProveedor !==
                            dir.codigoDirProveedor
                          )
                        )
                      }}
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
                  primary={`Vivienda: ${dir.vivienda || 'No disponible'}`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        {dir.complementoDir}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        País ID: {dir.paisId} | Estado ID: {dir.estadoId} | Municipio ID: {dir.municipioId}
                      </Typography>
                      <br />

                      <Typography variant="caption" color="text.secondary">
                        Ciudad ID: {dir.ciudadId} | Parroquia ID: {dir.parroquiaId}
                      </Typography>
                      <br />

                      <Typography variant="caption" color="text.secondary">
                        Tipo Vivienda ID: {dir.tipoViviendaId} | Nivel ID: {dir.tipoNivelId} {dir.nivel}
                      </Typography>
                      <br />

                      <Typography variant="caption" color="text.secondary">
                        Tenencia ID: {dir.tenenciaId} | Código Postal: {dir.codigoPostal}
                        {dir.principal ? ' | Principal' : ''}
                      </Typography>
                      <br />

                      <Typography variant="caption" color="text.secondary">
                        Sector ID: {dir.sectorId} | Urbanización ID: {dir.urbanizacionId}
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
            await deleteDireccion(direccionEdit.codigoDirProveedor);

            setDirecciones(prev =>
              prev.filter(
                  a =>
                  a.codigoDirProveedor !==
                  direccionEdit.codigoDirProveedor
              )
            )

            handleCloseModal();
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
        <Box>
          { errorMessage && errorMessage.length > 0 && <FormHelperText sx={{ color: 'error.main' ,fontSize: 20,mt:4 }}>{ errorMessage }</FormHelperText>}
        </Box>
      </CrudModal>
    </Box>
  );
};

export default DireccionProveedorList;
