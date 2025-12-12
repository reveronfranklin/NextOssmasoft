import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography, Box, Divider, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ButtonWithConfirm } from "src/views/components/buttons/ButtonsWithConfirm";
import CrudModal from "src/views/components/modal/CrudModal";
import { ExperienciaLaboralDTO } from '../interfaces/experiencia-laboral.dto';
import {
  useExperienciaLaboralByPersona,
  useCreateExperienciaLaboral,
  useUpdateExperienciaLaboral,
  useDeleteExperienciaLaboral
} from '../hooks/useExperienciaLaboralData';
import Formulario, { defaultValues } from '../views/Formulario';
import FormatNumber from 'src/utilities/format-numbers';

interface ExperienciaPersonaListProps {
  codigoPersona?: number;
}

const ExperienciaPersonaList: React.FC<ExperienciaPersonaListProps> = ({ codigoPersona }) => {

  const { data: experiencias = [], isLoading } = useExperienciaLaboralByPersona(codigoPersona ?? 0, !!codigoPersona);

  const createMutation = useCreateExperienciaLaboral();
  const updateMutation = useUpdateExperienciaLaboral();
  const deleteMutation = useDeleteExperienciaLaboral();

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [experienciaEdit, setExperienciaEdit] = useState<ExperienciaLaboralDTO | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleOpenCreate = () => {
    setModalMode('create');
    setExperienciaEdit(null);
    setFormData({ ...defaultValues, codigoPersona });
    setOpenModal(true);
  };

  const handleOpenEdit = (exp: ExperienciaLaboralDTO) => {
    setModalMode('edit');
    setExperienciaEdit(exp);
    setFormData(exp);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setExperienciaEdit(null);
    setFormData({});
  };

  const handleFormChange = (data: { values: any; isValid: boolean }) => {
    setFormData(data.values);
  };

  const handleSubmit = async () => {
    if (!codigoPersona) return;
    if (modalMode === 'create') {
      await createMutation.mutateAsync({ ...formData, codigoPersona });
    } else if (modalMode === 'edit' && experienciaEdit) {
      await updateMutation.mutateAsync({ ...formData, codigoPersona });
    }
    handleCloseModal();
  };

  const handleDelete = async (exp: ExperienciaLaboralDTO) => {
    if (!exp.codigoExpLaboral || !codigoPersona) return;
    await deleteMutation.mutateAsync({ id: exp.codigoExpLaboral });
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Experiencia Laboral</Typography>
        <IconButton
          aria-label="añadir experiencia"
          onClick={handleOpenCreate}
          size="small"
          sx={{ color: 'grey.600' }}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Stack>
      {isLoading ? (
        <Typography variant="body2" color="text.secondary">Cargando...</Typography>
      ) : experiencias.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No hay experiencia laboral asociada a esta persona.
        </Typography>
      ) : (
        <List>
          {experiencias.map(exp => (
            <React.Fragment key={exp.codigoExpLaboral}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      aria-label="editar"
                      onClick={() => handleOpenEdit(exp)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <ButtonWithConfirm
                      onAction={() => handleDelete(exp)}
                      confirmMessage="¿Seguro que deseas eliminar esta experiencia laboral?"
                      showLoading={deleteMutation.status === 'pending'}
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
                  primary={`${exp.nombreEmpresa} - ${exp.cargo}`}
                  secondary={
                    <>
                      <Typography variant="body2">
                        {exp.descripcion}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Desde: {exp.fechaDesdeString} | Hasta: {exp.fechaHastaString}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Último sueldo: {FormatNumber(exp.ultimoSueldo ?? 0)} | Supervisor: {exp.supervisor ?? "-"}
                      </Typography><br />
                      <Typography variant="caption" color="text.secondary">
                        Cargo Supervisor: {exp.cargoSupervisor ?? "-"} | Teléfono: {exp.telefono ?? "-"}
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
        title={modalMode === 'create' ? 'Añadir experiencia laboral' : 'Editar experiencia laboral'}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={modalMode === 'edit' ? async () => {
          if (experienciaEdit) {
            await handleDelete(experienciaEdit);
            handleCloseModal();
          }
        } : undefined}
        isEdit={modalMode === 'edit'}
        formValues={formData}
        PaperProps={{ sx: { minHeight: '60vh', minWidth: '700px' } }}
        confirmTitles={{
          create: "¿Crear experiencia?",
          edit: "¿Actualizar experiencia?",
          delete: "¿Eliminar experiencia?"
        }}
        confirmTexts={{
          create: "¿Seguro que deseas crear esta experiencia laboral?",
          edit: "¿Seguro que deseas actualizar esta experiencia laboral?",
          delete: "¿Seguro que deseas eliminar esta experiencia laboral?"
        }}
      >
        <Formulario
          initialValues={experienciaEdit ? experienciaEdit : { ...defaultValues, codigoPersona }}
          onChange={handleFormChange}
          open={openModal}
        />
      </CrudModal>
    </Box>
  );
};

export default ExperienciaPersonaList;