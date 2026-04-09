import { useDispatch } from 'react-redux';
import {
    Box,
    Grid,
    TextField,
    Autocomplete,
    Button
} from '@mui/material';
import { setIsOpenSearchCriteriaDialog, setSearchCustomText } from 'src/store/apps/rh-variaciones_masivas';

const FormSearchCriteria = () => {
  const dispatch = useDispatch()

  const handleSearch = () => {
    dispatch(setSearchCustomText('SUELDO > 400'))
    dispatch(setIsOpenSearchCriteriaDialog(false))
  }

  const handleAdd = (value: string) => {
    // Aquí puedes manejar la lógica para agregar el criterio de búsqueda
    console.log('Agregar criterio:', value);
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={5}>
          <Autocomplete
            options={['SUELDO > 400', 'SUELDO < 300', 'EDAD > 30']}
            renderInput={(params) => <TextField {...params} label="Item" />}
          />
        </Grid>
        <Grid item xs={2}>
          <Autocomplete
            options={['SUELDO > 400', 'SUELDO < 300', 'EDAD > 30']}
            renderInput={(params) => <TextField {...params} label="Condición" />}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField label="Valor" fullWidth />
        </Grid>
        {/* Botones con indicadores de arrastre */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button variant="contained" size="small" onClick={() => handleAdd('')} sx={{ textTransform: 'none', px: 3 }}>+ AGREGAR</Button>
                <Button variant="outlined" size="small" onClick={() => handleAdd('AND')} sx={{ color: 'text.primary', borderColor: '#ccc' }}>
                  AND
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleAdd('OR')} sx={{ color: 'text.primary', borderColor: '#ccc' }}>
                  OR
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleAdd('(')} sx={{ color: 'text.primary', borderColor: '#ccc' }}>
                  (
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleAdd(')')} sx={{ color: 'text.primary', borderColor: '#ccc' }}>
                  )
                </Button>
              </Box>
            </Grid>
        <Grid item sm={12} xs={12}>
          <TextField
            disabled
            aria-readonly
            multiline
            rows={3}
            label="Consultas"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} spacing={3}>
          <Button variant="contained" onClick={handleSearch}>
            limpiar
          </Button>
          <Button variant="contained" onClick={handleSearch}>
            cancelar
          </Button>
          <Button variant="contained" onClick={handleSearch}>
            acpetar
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default FormSearchCriteria;