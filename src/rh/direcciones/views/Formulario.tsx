import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, TextField, Checkbox, FormControlLabel, Box } from '@mui/material';

import PaisList from '../components/PaisList';
import EstadoList from '../components/EstadoList';
import MunicipioList from '../components/MunicipioList';
import CiudadList from '../components/CiudadList';
import ParroquiaList from '../components/ParroquiaList';
import SectorList from '../components/SectorList';
import UrbanizacionList from '../components/UrbanizacionList';

import TituloAutoComplete from '../components/autocomplete/TituloAutoComplete';

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
  direccionId?: number | null;
  tipoViviendaId?: number | null;
  tipoNivelId?: number | null;
  tenenciaId?: number | null;
  sectorId?: number | null;
  urbanizacionId?: number | null;
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

  const handleSectorSelect = (sector: any) => {
    setValue('sectorId', sector?.id ?? null);
  }

  const handleUrbanizacionSelect = (urbanizacion: any) => {
    setValue('urbanizacionId', urbanizacion?.id ?? null);
  }

  const paisId = watch('paisId');
  const estadoId = watch('estadoId');
  const municipioId = watch('municipioId');
  const ciudadId = watch('ciudadId');
  const parroquiaId = watch('parroquiaId');
  const tituloId = watch('direccionId');
  const tipoViviendaId = watch('tipoViviendaId');
  const tipoNivelId = watch('tipoNivelId');
  const tenenciaId = watch('tenenciaId');
  const sectorId = watch('sectorId');
  const urbanizacionId = watch('urbanizacionId');

  return (
    <form>
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TituloAutoComplete
              tituloId={3}
              selectedTituloId={tituloId}
              onTituloSelect={(value) => setValue('direccionId', value?.id ?? null)}
              label="Tipo de Dirección"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PaisList
              onPaisSelect={handlePaisSelect}
              selectedPaisId={paisId}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <EstadoList
              paisId={paisId}
              onEstadoSelect={handleEstadoSelect}
              selectedEstadoId={estadoId}
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
            <SectorList
              codigoPais={paisId}
              codigoEstado={estadoId}
              codigoMunicipio={municipioId}
              codigoCiudad={ciudadId}
              codigoParroquia={parroquiaId}
              onSectorSelect={handleSectorSelect}
              selectedSectorId={sectorId}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <UrbanizacionList
              codigoPais={paisId}
              codigoEstado={estadoId}
              codigoMunicipio={municipioId}
              codigoCiudad={ciudadId}
              codigoParroquia={parroquiaId}
              codigoSector={sectorId}
              onUrbanizacionSelect={handleUrbanizacionSelect}
              selectedUrbanizacionId={urbanizacionId}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Grid container spacing={2}>
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
                  multiline
                  maxRows={4}
                  inputProps={{ maxLength: 200 }}
                  helperText={`${(field.value || '').length}/200 caracteres`}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box mt={2} mb={1}>
              <TituloAutoComplete
                tituloId={15}
                selectedTituloId={tipoViviendaId}
                onTituloSelect={(value) => setValue('tipoViviendaId', value?.id ?? null)}
                label="Tipo de Vivienda"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box mt={2} mb={1}>
              <TituloAutoComplete
                tituloId={28}
                selectedTituloId={tipoNivelId}
                onTituloSelect={(value) => setValue('tipoNivelId', value?.id ?? null)}
                label="Tipo de Nivel"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box mt={2} mb={1}>
              <TituloAutoComplete
                tituloId={14}
                selectedTituloId={tenenciaId}
                onTituloSelect={(value) => setValue('tenenciaId', value?.id ?? null)}
                label="Tenencia"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={12}>
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
          <Grid item xs={12} md={4}>
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