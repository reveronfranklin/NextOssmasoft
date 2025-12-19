import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Box, Divider, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDireccionesService } from '../services/direccionesService';
import { ButtonWithConfirm } from "src/views/components/buttons/ButtonsWithConfirm";
import CrudModal from "src/views/components/modal/CrudModal";
import Formulario from '../views/Formulario';

interface DireccionPersona {
  codigoDireccion: number;
  codigoPersona: number;
  direccionId: number;
  direccion: string;
  paisId: number;
  pais: string;
  estadoId: number;
  estado: string;
  municipioId: number;
  municipio: string;
  ciudadId: number;
  ciudad: string;
  parroquiaId: number;
  parroquia: string;
  sectorId: number;
  sector: string;
  urbanizacionId: number;
  urbanizacion: string;
  tipoViviendaId: number;
  tipoVivienda: string;
  vivienda: string;
  tipoNivelId: number;
  tipoNivel: string;
  nivel: string;
  nroVivienda: string;
  complementoDir: string;
  tenenciaId: number;
  tenencia: string;
  codigoPostal: number;
  principal: boolean;
}

interface DireccionesPersonaListProps {
  codigoPersona?: number;
  onEdit?: (direccion: DireccionPersona) => void;
  onDelete?: (codigoDireccion: number) => void;
  onAdd?: () => void;
}

const DireccionesPersonaList: React.FC<DireccionesPersonaListProps> = ({ codigoPersona }) => {
  const [direcciones, setDirecciones] = useState<DireccionPersona[]>([]);
  const { getDireccionesByPersona, createDireccion, updateDireccion, deleteDireccion } = useDireccionesService();

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [direccionEdit, setDireccionEdit] = useState<DireccionPersona | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (codigoPersona) {
      getDireccionesByPersona(codigoPersona).then(setDirecciones);
    } else {
      setDirecciones([]);
    }
  }, [codigoPersona, getDireccionesByPersona]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setDireccionEdit(null);
    setFormData({});
    setOpenModal(true);
  };

  const handleOpenEdit = (direccion: DireccionPersona) => {
    setModalMode('edit');
    setDireccionEdit(direccion);
    setFormData(direccion);
    setOpenModal(true);
  };

  const handleCloseModal: any = () => {
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
      await createDireccion({
        ...formData,
        codigoDireccion: 0,
        codigoPersona: codigoPersona
      });
    } else {
      await updateDireccion(formData);
    }
    handleCloseModal();
    if (codigoPersona) {
      getDireccionesByPersona(codigoPersona).then(setDirecciones);
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
          No hay direcciones asociadas a esta persona.
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
                      onAction={async () => {
                        await deleteDireccion(dir.codigoDireccion);
                        if (codigoPersona) {
                          getDireccionesByPersona(codigoPersona).then(setDirecciones);
                        }
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
                  primary={`${dir.direccion} (${dir.tipoVivienda})`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        {dir.complementoDir}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        País: {dir.pais} | Estado: {dir.estado} | Municipio: {dir.municipio} | Ciudad: {dir.ciudad}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Parroquia: {dir.parroquia} | Sector: {dir.sector} | Urbanizacion: {dir.urbanizacion}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Nivel: {dir.tipoNivel} {dir.nivel} | Nro Vivienda: {dir.nroVivienda} | Tenencia: {dir.tenencia} | Vivienda: {dir.vivienda}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Código Postal: {dir.codigoPostal} {dir.principal ? ' | Principal' : ''}
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
            handleCloseModal();
            if (codigoPersona) {
              getDireccionesByPersona(codigoPersona).then(setDirecciones);
            }
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
        <Formulario initialValues={direccionEdit || {}} onChange={handleFormChange} />
      </CrudModal>
    </Box>
  );
};

export default DireccionesPersonaList;