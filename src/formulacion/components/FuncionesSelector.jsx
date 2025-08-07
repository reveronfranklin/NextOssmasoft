import React from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  IconButton
} from '@mui/material';

import ButtonCrud from './ui/BotonCrud';
import CrudModal from '../views/CrudModal';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useFormulaContext } from '../context/FormulaContext';
import useCrudModal from 'src/formulacion/hooks/useCrudModal';
import FormularioFormula from 'src/formulacion/views/Formulas/Formulario';

const FuncionesSelector = ({ functions, onFunctionSelect }) => {
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState(null);

  const options = functions.map((func) => ({
    label: func.descripcion,
    value: func.formula,
    id: func.id,
    full: func
  }));

  const {
    modalOpen,
    editingItem,
    handleOpenModal,
    handleCloseModal,
    setEditingItem
  } = useCrudModal();

  const { formulaService } = useFormulaContext();
  const { createFormula, deleteFormula } = formulaService;

  const handleSubmit = async (e) => {
    console.log('handleSubmit', e);

    const payload = {
      formula: 'test',
      descripcion: e.descripcion,
      usuarioInsert: 1,
      codigoEmpresa: 13,
    }

    const responseCreate = await createFormula(payload)
    console.log('responseCreate', responseCreate);
  }

  const handleDelete = (option) => {
    console.log('handleDelete', option);
    if (editingItem) {
      deleteFormula(editingItem.id);
      handleCloseModal();
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <h4 style={{ flex: 1, margin: 0 }}>Funciones:</h4>
        <ButtonCrud
          icon={<AddIcon />}
          onClick={() => handleOpenModal()}
          color="primary"
        />
      </Box>
      {functions.length > 0 ? (
        <Autocomplete
          disablePortal
          options={options}
          sx={{ width: '100%', mb: 2 }}
          value={selectedOption}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecciona una función"
              variant="outlined"
            />
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <span
                style={{ flex: 1, cursor: 'pointer' }}
                onClick={() => onFunctionSelect(option.value)}
              >
                {option.label}
              </span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal();
                }}
                sx={{ ml: 1 }}
                aria-label="Editar"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirm(option.full);
                }}
                sx={{ ml: 1 }}
                aria-label="Eliminar"
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Box>
          )}
          onChange={(event, newValue) => {
            setSelectedOption(newValue);
            if (newValue) {
              onFunctionSelect(newValue.value);
            }
          }}
        />
      ) : (
        <p>No hay funciones definidas.</p>
      )}

      <CrudModal
        open={modalOpen}
        title={editingItem ? 'Editar Formula' : 'Agregar Formula'}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={editingItem ? handleDelete : undefined}
        isEdit={!!editingItem}
        isCreate={!editingItem}
      >
        <FormularioFormula
          initialValues={editingItem || {}}
          onChange={(values) => setEditingItem(values)}
        />
      </CrudModal>

      {deleteConfirm && (
        <CrudModal
          open={!!deleteConfirm}
          title="¿Eliminar función?"
          onClose={() => setDeleteConfirm(null)}
          onSubmit={() => handleDelete(deleteConfirm)}
          isDelete
          submitText="Eliminar"
        >
          <p>¿Estás seguro de que deseas eliminar la función <b>{deleteConfirm.descripcion}</b>?</p>
        </CrudModal>
      )}
    </Box>
  );
};

export default FuncionesSelector;