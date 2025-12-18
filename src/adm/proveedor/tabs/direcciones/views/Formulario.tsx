import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, TextField, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import PaisList from '../components/PaisList';
import EstadoList from '../components/EstadoList';
import MunicipioList from '../components/MunicipioList';
import CiudadList from '../components/CiudadList';
import ParroquiaList from '../components/ParroquiaList';
import TituloList from '../components/TituloList';

export interface DireccionFormValues {
  paisId?: number | null;
  estadoId?: number | null;
  municipioId?: number | null;
  ciudadId?: number | null;
  parroquiaId?: number | null;
  direccion?: string;
  pais?: string;
  estado?: string;
  municipio?: string;
  ciudad?: string;
  parroquia?: string;
  sector?: string;
  urbanizacion?: string;
  tipoVivienda?: string;
  vivienda?: string;
  tipoNivel?: string;
  nivel?: string;
  nroVivienda?: string;
  complementoDir?: string;
  tenencia?: string;
  codigoPostal?: string | number;
  principal?: boolean;
  direccionId?: number;
}

export interface FormularioChangeData {
  values: DireccionFormValues;
  isValid: boolean;
}

interface FormularioProps {
  initialValues?: DireccionFormValues;
  onChange?: (data: FormularioChangeData) => void;
}

const requiredFields: (keyof DireccionFormValues)[] = [
  'paisId',
  'estadoId',
  'municipioId',
  'ciudadId',
];

const Formulario: React.FC<FormularioProps> = ({ initialValues = {}, onChange }) => {
  const { control, setValue, watch } = useForm<DireccionFormValues>({
    defaultValues: initialValues,
    mode: 'onChange'
  });

  React.useEffect(() => {
    const subscription = watch((values) => {
      const isValid = requiredFields.every(field => {
        const value = values[field];

        return value !== undefined && value !== null && value !== '';
      });
      onChange && onChange({ values, isValid });
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const handlePaisSelect = (pais: any) => {
    setValue('paisId', pais?.id ?? null);
    setValue('estadoId', null);
    setValue('municipioId', null);
    setValue('ciudadId', null);
    setValue('parroquiaId', null);
  };

  const handleEstadoSelect = (estado: any) => {
    setValue('estadoId', estado?.id ?? null);
    setValue('municipioId', null);
    setValue('ciudadId', null);
    setValue('parroquiaId', null);
  };

  const handleMunicipioSelect = (municipio: any) => {
    setValue('municipioId', municipio?.id ?? null);
    setValue('ciudadId', null);
    setValue('parroquiaId', null);
  };

  const handleCiudadSelect = (ciudad: any) => {
    setValue('ciudadId', ciudad?.id ?? null);
    setValue('parroquiaId', null);
  };

  const handleParroquiaSelect = (parroquia: any) => {
    setValue('parroquiaId', parroquia?.id ?? null);
  };

  const paisId = watch('paisId');
  const estadoId = watch('estadoId');
  const municipioId = watch('municipioId');
  const ciudadId = watch('ciudadId');
  const parroquiaId = watch('parroquiaId');
  const tituloId = watch('direccionId');

  return (
    <form>
      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Selección de Direcciones
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <PaisList
              onPaisSelect={handlePaisSelect}
              selectedPaisId={paisId}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <EstadoList
              paisId={paisId}
              onEstadoSelect={handleEstadoSelect}
              selectedEstadoId={estadoId}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MunicipioList
              codigoPais={paisId}
              codigoEstado={estadoId}
              onMunicipioSelect={handleMunicipioSelect}
              selectedMunicipioId={municipioId}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CiudadList
              codigoPais={paisId}
              codigoEstado={estadoId}
              codigoMunicipio={municipioId}
              onCiudadSelect={handleCiudadSelect}
              selectedCiudadId={ciudadId}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ParroquiaList
              codigoPais={paisId}
              codigoEstado={estadoId}
              codigoMunicipio={municipioId}
              codigoCiudad={ciudadId}
              onParroquiaSelect={handleParroquiaSelect}
              selectedParroquiaId={parroquiaId}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Datos de la Dirección
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Controller
              name="complementoDir"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Complemento"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="sector"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Sector"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="urbanizacion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Urbanización"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="tipoVivienda"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tipo de Vivienda"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="vivienda"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Vivienda"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="tipoNivel"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tipo de Nivel"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="nivel"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nivel"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="nroVivienda"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nro Vivienda"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="tenencia"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tenencia"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="codigoPostal"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Código Postal"
                  type="number"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box mt={2} mb={1}>
              <TituloList
                onTituloSelect={(value) => {
                  setValue('direccionId', value?.id ?? null);
                }}
                selectedTituloId={tituloId}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="principal"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={!!field.value}
                    />
                  }
                  label="Principal"
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default Formulario;
export { requiredFields };