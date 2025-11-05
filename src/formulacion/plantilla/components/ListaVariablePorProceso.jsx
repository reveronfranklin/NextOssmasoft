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

import AlertMessage from 'src/views/components/alerts/AlertMessage';

const ListaVariablePorProceso = ({ procesoId, descripcionProceso }) => {
  const { variableEntradaProcesoService } = useContext(FormulaContext);

  const [loading, setLoading]                           = useState(false);
  const [variables, setVariables]                       = useState([]);
  const [formValid, setFormValid]                       = useState(false);
  const [modoEdicion, setModoEdicion]                   = useState(false);
  const [variableSeleccionada, setVariableSeleccionada] = useState(null);
  const [alert, setAlert]                               = useState({ text: '', isValid: true });
  const [pendingCloseModal, setPendingCloseModal]       = useState(false); // Estado para controlar cierre pendiente del modal

  const formulaServiceFromHook   = useFormulaService();
  const variableServiceFromHook  = useVariableService();
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
        }

        response = await variableEntradaProcesoService.create(dto);
      }

      console.log('Response del submit:', response);
      if (response?.isValid) {
        setAlert({
          text: response?.message || 'Operación exitosa',
          isValid: true
        })
        setPendingCloseModal(true); // Marca que debe cerrar el modal después del alert
        await actualizarListaVariables();
      } else {
        setAlert({ text: response?.message || 'Error en la operación', isValid: false });
      }
    } catch (error) {
      setAlert({ text: 'Error en la operación', isValid: false });
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
        setAlert({
          text: response?.message || 'Operación exitosa',
          isValid: true
        });
        setPendingCloseModal(true)
        await actualizarListaVariables()
      }
    } catch (error) {
      setAlert({ text: 'Error en la operación', isValid: false });
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

  useEffect(() => {
    if (alert.text) {
      const timer = setTimeout(() => {
        setAlert({ text: '', isValid: alert.isValid });
        if (pendingCloseModal) {
          handleCloseModal();
          setPendingCloseModal(false);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert.text, pendingCloseModal]);

  const handleNuevaVariable = () => {
    setVariableSeleccionada({
      procesoId,
      descripcionProceso: descripcionProceso || '',
      code: 0,
      descripcionVariable: '',
      variableId: 0
    });
    setModoEdicion(false);
    handleOpenModal();
  };

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
            title={modoEdicion ? "Eliminar Variable" : "Nueva Variable"}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            isEdit={modoEdicion}
            formValues={variableSeleccionada || {}}
            maxWidth={variableSeleccionada ? "sm" : "sm"}
            disableSubmit={!formValid}
            PaperProps = {{ sx: { minHeight: '70vh', minWidth: '750px' } }}
            actionsEnabled = {{
              update: false,
              delete: true,
              create: true,
            }}
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
          <AlertMessage
            message={alert.text}
            severity={alert.isValid ? 'success' : 'error'}
            duration={2000}
            show={!!alert.text}
          />
        </>
      )}
    </div>
  );
};

export default ListaVariablePorProceso;
