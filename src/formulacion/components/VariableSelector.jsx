import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import ButtonCrud from './ui/BotonCrud';
import CrudModal from '../views/CrudModal';
import { useFormulaContext } from '../context/FormulaContext';
import useCrudModal from 'src/formulacion/hooks/useCrudModal';
import FormularioVariable from 'src/formulacion/views/Variables/Formulario';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const VariableSelector = React.memo(({
  variables,
  setVariables,
  onVariableSelect,
  setEditingItem,
  editingItem,
}) => {
  const [autoValue, setAutoValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [autoKey, setAutoKey] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const [favoritas, setFavoritas] = React.useState([]);

  const autocompleteTextFieldRef = React.useRef(null);

  const options = React.useMemo(() => {
    const favs = variables.filter(v => favoritas.includes(v.code));
    const rest = variables.filter(v => !favoritas.includes(v.code));
    const mapVar = v => ({
      label: v.descripcion,
      value: v.code,
      tipo: v.TipoVariable,
      codigoEmpresa: v.codigoEmpresa,
      id: v.id,
      ...v
    });
    
return [...favs.map(mapVar), ...rest.map(mapVar)]
      .sort((a, b) => a.tipo.localeCompare(b.tipo));
  }, [variables, favoritas]);

  const {
    modalOpen,
    handleOpenModal,
    handleCloseModal,
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

  const handleSubmit = async(form, action) => {
    if (!form.code || !form.descripcion || !form.tipo) {
      console.error('Faltan campos requeridos');

      return;
    }

    const payload = {
      id: form.id || null,
      code: form.code,
      descripcion: form.descripcion,
      tipoVariable: form.tipo,
      codigoEmpresa: form.codigoEmpresa
    }

    try {
      if (action === 'edit' && form) {
        console.log('form', form);

        payload.usuarioUpdate = form.usuarioUpdate;
        console.log('payload', payload);

        const updated = await updateVariable(payload);
        console.log('Variable actualizada:', updated);

        if (updated.isValid === false) {
          console.error('Error al actualizar la variable');

          return;
        } else {
          setVariables(prev =>
            prev.map(v => v.code === updated.data.code ? { ...v, ...updated.data } : v)
          );

          setTimeout(() => {
            handleCloseModal();
          }, 3000);
        }

        // console.log('Variable actualizada:', updated);
      } else if (action === 'create') {
        payload.usuarioInsert = form.usuarioInsert;
        console.log('payload', payload);

        const created = await createVariable(payload);
        console.log('Variable creada:', created);

        if (created.isValid === false) {
          console.error('Error al crear la variable');

          return;
        } else {
          setVariables(prev => [...prev, created.data]);
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error al guardar la variable:', error);
    }
  };

  const handleDelete = async (form, action) => {
    if (!form.value || !form.label || !form.tipo) {
      console.error('Faltan campos requeridos');
      console.error('tipo', action);

      return;
    }

    try {
      await deleteVariable(editingItem.code);

      // handleCloseModal();
    } catch (error) {
      console.error('Error al eliminar la variable:', error);
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <h4 style={{ flex: 1, margin: 0 }}>Lista de variables:</h4>
        <ButtonCrud
          icon={<AddIcon />}
          onClick={() => {
            setEditingItem(null);
            handleOpenModal();
          }}
          color="primary"
        />
      </Box>
      { variables.length > 0 ? (
        <Autocomplete
          key={autoKey}
          disablePortal
          options={options}
          groupBy={(option) => option.tipo}
          getOptionLabel={(option) => option.label}
          sx={{ width: '100%', mb: 2 }}
          value={autoValue}
          inputValue={inputValue}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue ?? '');
          }}
          disableCloseOnSelect
          isOptionEqualToValue={(option, value) => option.value === value?.value}
          onChange={(event, newValue) => {
            if (newValue) {
              onVariableSelect(`[${newValue.value}]`, 'variable');
              setAutoValue(null);
              setInputValue('');
              setAutoKey(k => k + 1);
              setTimeout(() => {
                setOpen(true);
                if (autocompleteTextFieldRef.current) {
                  autocompleteTextFieldRef.current.value = '';

                  const inputEvent = new Event('input', { bubbles: true });
                  autocompleteTextFieldRef.current.dispatchEvent(inputEvent);

                  autocompleteTextFieldRef.current.focus();
                }
              }, 100);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecciona una opción"
              variant="outlined"
              inputRef={autocompleteTextFieldRef}
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
              <span style={{ flex: 1, cursor: 'pointer' }}>
                {option.label}
              </span>
              <IconButton
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  setFavoritas(favs =>
                    favs.includes(option.value)
                      ? favs.filter(f => f !== option.value)
                      : [...favs, option.value]
                  );
                }}
                sx={{ ml: 1 }}
                aria-label="Fijar"
              >
                {favoritas.includes(option.value) ? (
                  <StarIcon fontSize="small" color="warning" />
                ) : (
                  <StarBorderIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setAutoValue(null);
                  setEditingItem({
                    code: option.value,
                    descripcion: option.label,
                    tipo: option.tipo,
                    ...option
                  });
                  handleOpenModal();
                }}
                sx={{ ml: 1 }}
                aria-label="Editar"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        />
      ) : (
        <p>No hay variables definidas.</p>
      )}

      <CrudModal
        open={modalOpen}
        title={editingItem ? 'Editar Variable' : 'Agregar Variable'}
        initialValues={editingItem || { code: '', descripcion: '', tipo: '' }}
        fields={fields}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isEdit={!!editingItem}
        formValues={editingItem}
      >
        <FormularioVariable
          initialValues={editingItem || { code: '', descripcion: '', tipo: '', id: '' }}
          onChange={setEditingItem}
        />
      </CrudModal>
    </div>
  );
});

export default VariableSelector;