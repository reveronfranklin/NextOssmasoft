import React, { useContext, useEffect, useState } from 'react';
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

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading]                           = useState(false);
  const [variables, setVariables]                       = useState([]);
  const [formValid, setFormValid]                       = useState(false);
  const [modoEdicion, setModoEdicion]                   = useState(false);
  const [variableSeleccionada, setVariableSeleccionada] = useState(null);
  const [alert, setAlert]                               = useState({ text: '', isValid: true });
  const [pendingCloseModal, setPendingCloseModal]       = useState(false);

  const formulaService   = useFormulaService();
  const variableService  = useVariableService();
  const plantillaService = usePlantillaService();

  const services = React.useMemo(() => ({
    formulaService,
    variableService,
    plantillaService
  }), [formulaService, variableService, plantillaService]);

  const { variables: availableVariables } = useFormulaBuilder(services);

  const {
    modalOpen,
    handleOpenModal,
    handleCloseModal,
  } = useCrudModal();

  const cargarVariables = async () => {
    setLoading(true);
    try {
      const response = await variableEntradaProcesoService.getAll({ procesoId });
      setVariables(response.isValid && response.data ? response.data : []);
    } catch (error) {
      setVariables([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (procesoId) cargarVariables();
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
  }, [alert.text, pendingCloseModal, handleCloseModal]);

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
          procesoId: form.procesoId,
          variableId: form.variableId,
          usuarioConectado: 1
        };
        response = await variableEntradaProcesoService.create(dto);
      }
      if (response?.isValid) {
        setAlert({ text: response?.message || 'Operación exitosa', isValid: true });
        setPendingCloseModal(true);
        await cargarVariables();
      } else {
        setAlert({ text: response?.message || 'Error en la operación', isValid: false });
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Error en la operación';
      setAlert({ text: errorMsg, isValid: false });
    }
  };

  const handleDelete = async () => {
    try {
      if (!variableSeleccionada?.id) return;
      const dto = {
        id: variableSeleccionada.id,
        usuarioConectado: 1
      };
      const response = await variableEntradaProcesoService.remove(dto);
      if (response.isValid) {
        setAlert({ text: response?.message || 'Operación exitosa', isValid: true });
        setPendingCloseModal(true);
        await cargarVariables();
      } else {
        setAlert({ text: response?.message || 'Error en la operación', isValid: false });
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Error en la operación';
      setAlert({ text: errorMsg, isValid: false });
    }
  };

  const handleNuevaVariable = () => {
    setVariableSeleccionada({
      procesoId,
      descripcionProceso: descripcionProceso || '',
      code: '',
      descripcionVariable: '',
      variableId: ''
    });
    setModoEdicion(false);
    handleOpenModal();
  };

  const handleSelectVariable = (event, value) => {
    if (value) {
      setVariableSeleccionada(value);
      setModoEdicion(true);
      handleOpenModal();
    }
  };

  return (
    <div>
      {variables.length === 0 ? (
        `No hay variables disponibles para el proceso Id: ${procesoId}`
      ) : (
        <>
          <Box sx={{ position: 'relative', mb: 2, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <IconButton
                color="primary"
                onClick={handleNuevaVariable}
                aria-label="Agregar variable"
                sx={{ fontSize: 28 }}
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
            maxWidth="sm"
            disableSubmit={!formValid}
            PaperProps={{ sx: { minHeight: '65vh', minWidth: '700px' } }}
            actionsEnabled={{
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
