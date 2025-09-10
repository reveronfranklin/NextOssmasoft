import React from 'react';

// import { TextField, Box, Autocomplete } from '@mui/material';
import {
  Box,
  Autocomplete,
  TextField,
  Modal,
  Paper,
  Typography,
  Button,
  Chip
} from '@mui/material';
import SelectorTipoVariable from 'src/formulacion/shared/components/SelectorTipoVariable';
import { TipoVariableEnum } from 'src/formulacion/enums/TipoVariable.enum';

const FormularioVariable = ({
  initialValues = {},
  onChange,
  availableVariables = []
}) => {
  const [values, setValues] = React.useState(initialValues);
  const [selectedVariable, setSelectedVariable] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleChipClick = (variable) => {
    setSelectedVariable(variable);
    setModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVariable(null);
  };

  // Render personalizado para los Chips con funcionalidad de clic
  const renderChips = (selected, getTagProps) =>
    selected.map((variable, index) => (
      <Chip
        {...getTagProps({ index })}
        key={variable.id}
        label={variable.descripcion || variable.code}
        onClick={() => handleChipClick(variable)}
        clickable
        style={{ cursor: 'pointer' }}
      />
    ));



  React.useEffect(() => {
    console.log('Initial values changed:', initialValues);
    setValues(initialValues || {});
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    onChange && onChange(newValues);
  };

  const handleTipoVariableChange = (NewType) => {
    const newValues = { ...values, tipo: NewType, TipoVariable: NewType };
    setValues(newValues);
    onChange && onChange(newValues);
  };

  const handleVariablesAsociadasChange = (_, newValue) => {
    const newValues = { ...values, ParametrosVariables: newValue };
    setValues(newValues);
    onChange && onChange(newValues);
  };

  return (
    <>
      <pre>{JSON.stringify(initialValues, null, 2)}</pre>
      {/* <pre>{JSON.stringify(values.TipoVariable, null, 2)}</pre> */}
      <TextField
        name="descripcion"
        label="Descripción"
        value={values.descripcion || ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      />
      <TextField
        name="code"
        label="Código"
        value={values.code || ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
        required
      />
      <SelectorTipoVariable
        value={values.TipoVariable || ''}
        onChange={handleTipoVariableChange}
        label="Tipo de Variable"
        enumTipo={TipoVariableEnum}
      />
      {values.TipoVariable === 'FUNCION' && (
        <Box sx={{ mt: 2 }}>
          <Autocomplete
            multiple
            options={availableVariables}
            getOptionLabel={option => option.descripcion || option.code}
            value={values.ParametrosVariables || []}
            onChange={handleVariablesAsociadasChange}
            renderInput={params => (
              <TextField
                {...params}
                label="Variables asociadas"
                placeholder="Selecciona variables"
              />
            )}
            renderTags={renderChips}
          />
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
                Parametro seleccionado: {selectedVariable.code}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {/* Aquí irían los campos del formulario para editar la variable */}
                <TextField
                  fullWidth
                  label="Código"
                  value={selectedVariable.code}
                  margin="normal"
                  // onChange handler para actualizar el código
                />
                
                <TextField
                  fullWidth
                  label="Descripción"
                  value={selectedVariable.descripcion}
                  margin="normal"
                  multiline
                  rows={3}
                  // onChange handler para actualizar la descripción
                />
                
                {/* Agrega más campos según necesites */}
              </Box>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={handleCloseModal} variant="outlined">
                  Cancelar
                </Button>
                <Button 
                  onClick={() => handleSaveVariable(selectedVariable)}
                  variant="contained"
                >
                  Guardar
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Modal>
    </>
  );
};

export default FormularioVariable;