import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import ButtonCrud from '../../shared/components/BotonCrud';
import CrudModal from '../../views/CrudModal';
import useCrudModal from '../../shared/hooks/useCrudModal';
import FormularioPlantilla from '../../views/Plantillas/Formulario';

import { useFormulaContext } from '../../context/FormulaContext';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const PlantillaSelector = React.memo(({
  plantillas,
  onPlantillaSelect,
  setEditingItem,
  editingItem
}) => {
  const [autoValue, setAutoValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [autoKey, setAutoKey] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const [favoritas, setFavoritas] = React.useState([]);

  const autocompleteTextFieldRef = React.useRef(null);

  const options = React.useMemo(() => {
    const favs = plantillas.filter(v => favoritas.includes(v.code));
    const rest = plantillas.filter(v => !favoritas.includes(v.code));
    const mapVar = v => ({
      label: v.descripcion,
      value: v.code,
      tipo: v.TipoVariable,
      codigoEmpresa: v.codigoEmpresa,
      id: v.id,
      ...v
    });

    return [...favs.map(mapVar), ...rest.map(mapVar)]
      // .sort((a, b) => a.tipo.localeCompare(b.tipo));
  }, [plantillas, favoritas]);

  //control del modal de edición
  const { modalOpen, handleOpenModal, handleCloseModal } = useCrudModal();

  //campos del formulario
  const fields = [{
      name: 'plantilla',
      label: 'Plantilla',
      required: true,
      disabled: !!editingItem
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      required: true
    }
  ];

  //contexto para operaciones crud de plantillas
  const { plantillaService } = useFormulaContext();
  const { createPlantilla, updatePlantilla, deletePlantilla } = plantillaService;

  const handleSubmit = async (form, action) => {
    switch (action) {
      case 'create':
        await createPlantilla(form);
        break;
      case 'update':
        await updatePlantilla(form);
        break;
      case 'delete':
        await deletePlantilla(form.id);
        break;
      default:
        break;
    }
  };

  const handleDelete = (item) => {
    if (window.confirm(`¿Está seguro de eliminar la plantilla ${item.codigo}?`)) {
      deletePlantilla(item.id);
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <h4 style={{ flex: 1, margin: 0 }}>Lista de plantillas:</h4>
        <ButtonCrud
          icon={<AddIcon />}
          onClick={() => {
            setEditingItem(null);
            handleOpenModal();
          }}
          color="primary"
        />
      </Box>
      { plantillas.length > 0 ? (
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
        <p>No hay plantillas definidas</p>
      )}
      <CrudModal
        open={modalOpen}
        title={editingItem ? 'Editar Plantilla' : 'Agregar Plantilla'}
        initialValues={editingItem || { code: '', descripcion: '', tipo: '' }}
        fields={fields}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isEdit={!!editingItem}
        formValues={editingItem}
      >
        <FormularioPlantilla
          initialValues={editingItem || { code: '', descripcion: '', tipo: '', id: '' }}
          onChange={setEditingItem}
        />
      </CrudModal>
    </div>
  );
});

export default PlantillaSelector;