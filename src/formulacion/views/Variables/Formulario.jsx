import React from 'react';
import {
  Box,
  Autocomplete,
  TextField,
  Modal,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton
} from '@mui/material';
import SelectorTipoVariable from 'src/formulacion/shared/components/SelectorTipoVariable';
import { TipoVariableEnum } from 'src/formulacion/enums/TipoVariable.enum';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';

const FormularioVariable = ({
  initialValues = {},
  onChange,
  availableVariables = []
}) => {
  const [values, setValues] = React.useState({
    ...initialValues,
    Parametros: initialValues.Parametros || []
  });
  const [selectedVariable, setSelectedVariable] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [draggedItem, setDraggedItem] = React.useState(null);
  const [draggedOverItem, setDraggedOverItem] = React.useState(null);
  const [showVariableSelector, setShowVariableSelector] = React.useState(false);
  const [selectedNewVariable, setSelectedNewVariable] = React.useState(null);

  // Función para extraer propiedades de parámetro
  const extractParametroProperties = (variable) => {
    return {
      id: variable.id || 0,
      variableId: variable.id || 0,
      code: variable.code || '',
      orden: variable.orden || 0,
      estado: variable.estado || 'ACTIVE'
    };
  };

  // Efecto para cargar automáticamente ParametrosVariables cuando estén disponibles
  React.useEffect(() => {
    if (initialValues.ParametrosVariables && initialValues.ParametrosVariables.length > 0) {
      // Convertir ParametrosVariables a Parametros
      const parametrosFromVariables = initialValues.ParametrosVariables.map(variable => 
        extractParametroProperties(variable)
      );
      
      // Combinar con los parámetros existentes (si los hay)
      const combinedParametros = [
        ...(values.Parametros || []),
        ...parametrosFromVariables
      ];
      
      // Eliminar duplicados
      const uniqueParametros = combinedParametros.filter((param, index, self) =>
        index === self.findIndex(p => p.variableId === param.variableId)
      );
      
      const newValues = {
        ...values,
        Parametros: uniqueParametros
      };
      
      setValues(newValues);
      onChange && onChange(newValues);
    }
  }, [initialValues.ParametrosVariables]);

  // Efecto para sincronizar con initialValues
  React.useEffect(() => {
    if (initialValues.id !== values.id) {
      setValues({
        ...initialValues,
        Parametros: initialValues.Parametros || []
      });
    }
  }, [initialValues.id]);

  const handleChipClick = (variable) => {
    setSelectedVariable(variable);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVariable(null);
  };

  const handleToggleVariableState = (variable) => {
    const nuevoEstado = variable.estado === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const updatedParametros = values.Parametros.map(param =>
      param.variableId === variable.id
        ? { ...param, estado: nuevoEstado }
        : param
    );

    const newValues = {
      ...values,
      Parametros: updatedParametros
    };

    setValues(newValues);
    onChange && onChange(newValues);
  };

  // Obtener el icono apropiado según el estado
  const getStateIcon = (estado) => {
    return estado === 'ACTIVE' ? <ToggleOnIcon /> : <ToggleOffIcon />;
  };

  // Obtener el color apropiado según el estado
  const getStateColor = (estado) => {
    return estado === 'ACTIVE' ? 'success' : 'default';
  };

  // Funciones para drag & drop
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItem === null || draggedItem === index) return;
    setDraggedOverItem(index);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedItem !== index) {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.backgroundColor = '#f0f0f0';
    }
  };

  const handleDragLeave = (e, index) => {
    e.preventDefault();
    if (draggedItem !== index) {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.backgroundColor = '';
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    // Reordenar los parámetros
    const newParametros = [...values.Parametros];
    const draggedParam = newParametros[draggedItem];
    
    newParametros.splice(draggedItem, 1);
    newParametros.splice(index, 0, draggedParam);
    
    // Actualizar el orden
    const parametrosWithOrder = newParametros.map((param, idx) => ({
      ...param,
      orden: idx
    }));
    
    const newValues = {
      ...values,
      Parametros: parametrosWithOrder
    };
    
    setValues(newValues);
    onChange && onChange(newValues);
    
    // Resetear estados y estilos
    setDraggedItem(null);
    setDraggedOverItem(null);
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.backgroundColor = '';
  };

  const handleDragEnd = (e) => {
    const items = document.querySelectorAll('.draggable-chip');
    items.forEach(item => {
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
      item.style.backgroundColor = '';
    });
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const handleAddVariable = (variable) => {
    if (!variable) return;

    const newParametro = extractParametroProperties(variable);
    const newParametros = [...values.Parametros, newParametro];

    const newValues = {
      ...values,
      Parametros: newParametros
    };

    setValues(newValues);
    onChange && onChange(newValues);
    setSelectedNewVariable(null);
    setShowVariableSelector(false);
  };

  // Obtener las variables seleccionadas completas
  const getSelectedVariables = () => {
    if (!values.Parametros || values.Parametros.length === 0) return [];
    
    return values.Parametros.map(parametro => {
      // Buscar en availableVariables primero
      const availableVar = availableVariables.find(v => v.id === parametro.variableId);
      if (availableVar) {
        return {
          ...availableVar,
          estado: parametro.estado || 'ACTIVE'
        };
      }
      
      // Si no está en availableVariables, usar los datos del parámetro
      return {
        id: parametro.variableId,
        code: parametro.code,
        descripcion: parametro.descripcion || parametro.code,
        orden: parametro.orden,
        estado: parametro.estado || 'ACTIVE'
      };
    });
  };

  const selectedVariables = getSelectedVariables();

  return (
    <>
      {/* <pre>{JSON.stringify(initialValues, null, 2)}</pre> */}
      <TextField
        name="descripcion"
        label="Descripción"
        value={values.descripcion || ''}
        onChange={(e) => {
          const newValues = { ...values, descripcion: e.target.value };
          setValues(newValues);
          onChange && onChange(newValues);
        }}
        fullWidth
        margin="dense"
        required
      />
      <TextField
        name="code"
        label="Código"
        value={values.code || ''}
        onChange={(e) => {
          const newValues = { ...values, code: e.target.value };
          setValues(newValues);
          onChange && onChange(newValues);
        }}
        fullWidth
        margin="dense"
        required
      />
      <SelectorTipoVariable
        value={values.TipoVariable || ''}
        onChange={(newType) => {
          const newValues = {
            ...values,
            tipo: newType,
            TipoVariable: newType,
            ...(newType !== 'FUNCION' && { Parametros: [] })
          };
          setValues(newValues);
          onChange && onChange(newValues);
        }}
        label="Tipo de Variable"
        enumTipo={TipoVariableEnum}
      />

      {values.TipoVariable === 'FUNCION' && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Variables asociadas
          </Typography>

          {/* Selector para agregar nuevas variables */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {showVariableSelector ? (
              <>
                <Autocomplete
                  sx={{ flexGrow: 1, mr: 1 }}
                  options={availableVariables.filter(v =>
                    !selectedVariables.some(sv => sv.id === v.id)
                  )}
                  getOptionLabel={option => option.descripcion || option.code}
                  value={selectedNewVariable}
                  onChange={(_, newValue) => setSelectedNewVariable(newValue)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Seleccionar variable"
                      size="small"
                    />
                  )}
                />
                <Button
                  variant="contained"
                  onClick={() => handleAddVariable(selectedNewVariable)}
                  disabled={!selectedNewVariable}
                >
                  Agregar
                </Button>
                <Button
                  sx={{ ml: 1 }}
                  onClick={() => setShowVariableSelector(false)}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                startIcon={<AddIcon />}
                onClick={() => setShowVariableSelector(true)}
                variant="outlined"
              >
                Agregar variable
              </Button>
            )}
          </Box>

          {/* Lista de chips con drag & drop */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              minHeight: 50,
              p: 1,
              border: '1px dashed #ccc',
              borderRadius: 1
            }}
          >
            {selectedVariables.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No hay variables seleccionadas. Agrega variables usando el botón arriba.
              </Typography>
            ) : (
              selectedVariables.map((variable, index) => (
                <Box
                  key={variable.id || index}
                  className="draggable-chip"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    opacity: draggedItem === index ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragLeave={(e) => handleDragLeave(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <DragIndicatorIcon
                    sx={{
                      cursor: 'grab',
                      color: 'text.secondary',
                      fontSize: '16px',
                      mr: 0.5
                    }}
                  />
                  <Chip
                    label={variable.descripcion || variable.code}
                    onClick={() => handleChipClick(variable)}
                    onDelete={() => handleToggleVariableState(variable)}
                    deleteIcon={getStateIcon(variable.estado)}
                    color={getStateColor(variable.estado)}
                    variant={variable.estado === 'INACTIVE' ? 'outlined' : 'filled'}
                    clickable
                    title={variable.estado === 'ACTIVE' ? 'Click para inactivar' : 'Click para activar'}
                  />
                </Box>
              ))
            )}
          </Box>

          <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
            Arrastra los elementos para cambiar su orden. Click en el icono para activar/inactivar.
          </Typography>
        </Box>
      )}

      {/* Modal de mantenimiento */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="variable-modal-title"
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedVariable && (
            <>
              <Typography id="variable-modal-title" variant="h6" component="h2">
                Parámetro seleccionado: {selectedVariable.code}
                <Chip 
                  label={selectedVariable.estado === 'ACTIVE' ? 'ACTIVO' : 'INACTIVO'} 
                  color={getStateColor(selectedVariable.estado)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>

              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Código"
                  value={selectedVariable.code}
                  margin="normal"
                  disabled
                />

                <TextField
                  fullWidth
                  label="Descripción"
                  value={selectedVariable.descripcion}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Box>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button 
                  onClick={() => handleToggleVariableState(selectedVariable)}
                  variant="outlined"
                  color={selectedVariable.estado === 'ACTIVE' ? 'warning' : 'success'}
                  startIcon={getStateIcon(selectedVariable.estado)}
                >
                  {selectedVariable.estado === 'ACTIVE' ? 'Inactivar' : 'Activar'}
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button onClick={handleCloseModal} variant="outlined">
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {}}
                    variant="contained"
                  >
                    Guardar
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Modal>
    </>
  );
};

export default FormularioVariable;