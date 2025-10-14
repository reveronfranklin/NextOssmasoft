import { useContext, useEffect, useState } from 'react';
import { FormulaContext } from 'src/formulacion/context/FormulaContext';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CrudModal from 'src/formulacion/views/CrudModal';
import useCrudModal from 'src/formulacion/shared/hooks/useCrudModal';

import FormularioVariableEntradaProceso from '../../views/VariableEntradaProceso/Formulario';
import Box from '@mui/material/Box';

const ListaVariablePorProceso = ({ procesoId }) => {
  const { variableEntradaProcesoService } = useContext(FormulaContext);

  const [variableSeleccionada, setVariableSeleccionada] = useState(null);
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const {
    modalOpen,
    handleOpenModal,
    handleCloseModal,
  } = useCrudModal();

  const handleSubmit = async (form, action) => {
    try {
      if (action === 'edit' && form) {
        console.log('Editar elemento:', form);
        const response = await variableEntradaProcesoService.update(form);
        console.log('Respuesta de la actualización:', response);
      } else if (action === 'create' && form) {
        console.log('Crear elemento:', form);
        const response = await variableEntradaProcesoService.create(form);
        console.log('Respuesta de la creación:', response);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  }

  const handleDelete = async () => {
    try {
      const response = await variableEntradaProcesoService.delete(variableSeleccionada.id);
      if (response.isValid) {
        console.log('Elemento eliminado:', variableSeleccionada);
      }
    } catch (error) {
      console.error('Error al eliminar el elemento:', error);
    }
  }

  useEffect(() => {
    const fetchVariables = async () => {
      setLoading(true);
      console.log(loading);
      const response = await variableEntradaProcesoService.getAll({ procesoId });
      if (response.isValid && response.data) {
        setVariables(response.data);
      } else {
        setVariables([]);
      }
      setLoading(false);
    };

    if (procesoId) {
      fetchVariables();
    }
  }, [procesoId]);

  // Maneja el click en el botón +
  const handleNuevaVariable = () => {
    setVariableSeleccionada({
      procesoId,
      code: 0,
      descripcionVariable: '',
      descripcionProceso: '',
      variableId: 0
    });
    setModoEdicion(false);
    handleOpenModal();
  };

  // Cuando seleccionas una variable, activa modo edición
  const handleSelectVariable = (event, value) => {
    setVariableSeleccionada(value);
    setModoEdicion(true);
    handleOpenModal();
  };

  return (
    <div>
      {/* <h3>Variables asociadas al proceso {procesoId}</h3> */}
      {
        variables.length === 0 ? `No hay variables disponibles para el proceso Id: ${procesoId}` : (
        <>
          <Box sx={{ position: 'relative', mb: 2, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <IconButton
                color="primary"
                onClick={handleNuevaVariable}
                aria-label="Agregar variable"
                sx={{
                  fontSize: 28
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Autocomplete
              options={variables}
              getOptionLabel={option => option.nombre || option.code || ''}
              renderInput={params => (
                <TextField {...params} label="Variables por proceso" variant="outlined" fullWidth />
              )}
              onChange={handleSelectVariable}
              fullWidth
            />
          </Box>
          <CrudModal
            open={modalOpen}
            title={modoEdicion ? "Editar Plantilla" : "Nueva Plantilla"}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            isEdit={modoEdicion}
            formValues={variableSeleccionada || {}}
            maxWidth={variableSeleccionada ? "sm" : "sm"}
          >
            <FormularioVariableEntradaProceso
              initialValues={variableSeleccionada}
              onChange={setVariableSeleccionada}
            />
          </CrudModal>
        </>
      )}
    </div>
  );
};

export default ListaVariablePorProceso;
