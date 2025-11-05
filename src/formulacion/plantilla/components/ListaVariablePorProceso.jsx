import React, { useContext, useEffect, useState } from 'react'
import { FormulaContext } from 'src/formulacion/context/FormulaContext';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CrudModal from 'src/formulacion/views/CrudModal';
import useCrudModal from 'src/formulacion/shared/hooks/useCrudModal';

import FormularioVariableEntradaProceso from '../../views/VariableEntradaProceso/Formulario';
import Box from '@mui/material/Box';

import FormulaProvider from '../../context/FormulaProvider';
import useFormulaBuilder from './../../formulas/hooks/useFormulaBuilder';

import useFormulaService from '../../services/formula/UseFormulaService';
import useVariableService from '../../services/variable/UseVariableService';
import usePlantillaService from '../../services/plantilla/UsePlantillaService';

const ListaVariablePorProceso = ({ procesoId }) => {
  const { variableEntradaProcesoService } = useContext(FormulaContext);

  const [variableSeleccionada, setVariableSeleccionada] = useState(null);
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const formulaServiceFromHook = useFormulaService();
  const variableServiceFromHook = useVariableService();
  const plantillaServiceFromHook = usePlantillaService();

  const formulaService   = formulaServiceFromHook;
  const variableService  = variableServiceFromHook;
  const plantillaService = plantillaServiceFromHook;

  const services = React.useMemo(() => ({
    formulaService,
    variableService,
    plantillaService
  }), [formulaService, variableService, plantillaService]);

  const { variables: availableVariables } = useFormulaBuilder(services)

  const {
    modalOpen,
    handleOpenModal,
    handleCloseModal,
  } = useCrudModal();

  const handleSubmit = async (form, action) => {
    try {
      let response;
      if (action === 'edit' && form) {
        const dto = {
          id: form.id,
          procesoId: form.procesoId,
          variableId: form.variableId,
          usuarioConectado: 1
        };
        response = await variableEntradaProcesoService.update(dto);
      } else if (action === 'create' && form) {
        const dto = {
          procesoId: variableSeleccionada.procesoId,
          variableId: variableSeleccionada.variableId,
          usuarioConectado: 1
        };
        response = await variableEntradaProcesoService.create(dto);
      }
      if (response?.isValid) {
        handleCloseModal(); // Cierra el modal si la operación fue exitosa
        await actualizarListaVariables();
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  }

  const handleDelete = async () => {
    try {
      const dto = {
        id: variableSeleccionada.id,
        usuarioConectado: 1
      };
      const response = await variableEntradaProcesoService.remove(dto);
      if (response.isValid) {
        handleCloseModal();
        await actualizarListaVariables();
        console.log('Elemento eliminado:', variableSeleccionada);
      }
    } catch (error) {
      console.error('Error al eliminar el elemento:', error);
    }
  }

  const actualizarListaVariables = async () => {
    setLoading(true);
    const response = await variableEntradaProcesoService.getAll({ procesoId });
    if (response.isValid && response.data) {
      setVariables(response.data);
    } else {
      setVariables([]);
    }
    setLoading(false);
  };

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

  // Manejar la selección de una variable existente desde el autoselect del padre
  const handleSelectVariable = (event, value) => {
    setVariableSeleccionada(value);
    setModoEdicion(true);
    handleOpenModal();
  };

  return (
    <div>
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
            disableSubmit={!formValid}
            PaperProps = {
              {
                sx: {
                  minHeight: '75vh', // Más alto
                  minWidth: '600px' // Más ancho
                }
              }
            }
          >
            <FormulaProvider>
              <FormularioVariableEntradaProceso
                initialValues={variableSeleccionada}
                onChange={setVariableSeleccionada}
                availableVariables={availableVariables}
                onValidationChange={setFormValid}
              />
            </FormulaProvider>
          </CrudModal>
        </>
      )}
    </div>
  );
};

export default ListaVariablePorProceso;
