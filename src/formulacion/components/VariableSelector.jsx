import React, { useState } from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';

import ButtonCrud from './ui/BotonCrud';
import CrudModal from '../views/CrudModal';
import AddIcon from '@mui/icons-material/Add';

import { useFormulaContext } from '../context/FormulaContext';
import useCrudModal from 'src/formulacion/hooks/useCrudModal';
import FormularioVariable from 'src/formulacion/views/Variables/Formulario';

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const VariableSelector = ({ variables, onVariableSelect }) => {
  const options = variables.map((variable) => ({
    label: variable.descripcion,
    value: variable.code,
    tipo: variable.TipoVariable
  }));

  const {
    modalOpen,
    editingItem,
    handleOpenModal,
    handleCloseModal,
    setEditingItem
  } = useCrudModal();

  const fields = [{
      name: 'code',
      label: 'Código',
      required: true,
      disabled: !!editingItem
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      required: true
    }
  ];

  const { variableService } = useFormulaContext();
  const {
    createVariable,
    updateVariable,
    deleteVariable
  } = variableService;

const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const code = form.code.value;
    const descripcion = form.descripcion.value;

    if (editingItem) {
      updateVariable(editingItem.code, {
        code,
        descripcion
      });
    } else {
      createVariable({
        code,
        descripcion
      });
    }
    handleCloseModal();
  };

  const handleDelete = () => {
    if (editingItem) {
      deleteVariable(editingItem.code);
    }
    handleCloseModal();
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <h4 style={{ flex: 1, margin: 0 }}>Lista de variables:</h4>
        <ButtonCrud
          icon={<AddIcon />}
          onClick={() => handleOpenModal()}
          color="primary"
        />
      </Box>
      { variables.length > 0 ? (
        <Autocomplete
          disablePortal
          options={options}
          groupBy={(option) => option.tipo}
          getOptionLabel={(option) => option.label}
          sx={{ width: '100%', mb: 2 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecciona una opción"
              variant="outlined"
            />
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              onVariableSelect(`[${newValue.value}]`);
            }
          }}
          value={null}
        />
      ) : (
        <p>No hay variables definidas.</p>
      )}

      <CrudModal
        open={modalOpen}
        title={editingItem ? 'Editar Variable' : 'Agregar Variable'}
        initialValues={editingItem || { code: '', descripcion: '' }}
        fields={fields}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={editingItem ? handleDelete : undefined}
        isEdit={!!editingItem}
      >
        <FormularioVariable
          initialValues={editingItem || {}}
          onChange={(values) => setEditingItem(values)}
        />
      </CrudModal>
    </div>
  );
};

export default VariableSelector;