import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  TextField,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import { Contacto } from '../interfaces';
import TipoContactoList from '../components/ContactoList';
import TipoIdentificacionList from '../components/TipoIdentificacionList';

export interface FormularioContactoChangeData {
  values: Contacto;
  isValid: boolean;
}

interface FormularioContactoProps {
  initialValues?: Contacto;
  onChange?: (data: FormularioContactoChangeData) => void;
}

const requiredFields: (keyof Contacto)[] = [
  'nombre',
  'apellido',
  'identificacionId',
  'identificacion',
  'sexo',
  'tipoContactoId'
];

const FormularioContacto: React.FC<FormularioContactoProps> = ({
  initialValues = {},
  onChange
}) => {
  const { control, watch } = useForm<Contacto>({
    defaultValues: initialValues,
    mode: 'onChange'
  });

  const isFilled = (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  };

  React.useEffect(() => {
    const subscription = watch((values) => {
      const fieldsValid = requiredFields.every(field => isFilled(values[field]));
      onChange?.({ values, isValid: fieldsValid });
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const identificacionId = watch('identificacionId');
  const tipoContactoId = watch('tipoContactoId');

  return (
    <form>
      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Datos del Contacto
        </Typography>

        <Grid container spacing={2}>
          {/* Nombre */}
          <Grid item xs={12} md={6}>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Nombre" fullWidth margin="dense" />
              )}
            />
          </Grid>

          {/* Apellido */}
          <Grid item xs={12} md={6}>
            <Controller
              name="apellido"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Apellido" fullWidth margin="dense" />
              )}
            />
          </Grid>

          {/* Tipo Identificación (pequeño) */}
          <Grid item xs={12} md={2}>
            <TipoIdentificacionList
              selectedTipoIdentificacionId={identificacionId}
              onSelect={(item) => {
                (control as any)._formValues.identificacionId = item?.id ?? null;
              }}
            />
          </Grid>

          {/* Identificación (texto) */}
          <Grid item xs={12} md={4}>
            <Controller
              name="identificacion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Identificación"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>

          {/* Sexo */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="sexo-label">Sexo</InputLabel>
              <Controller
                name="sexo"
                control={control}
                render={({ field }) => (
                  <Select {...field} labelId="sexo-label" label="Sexo">
                    <MenuItem value="M">Masculino</MenuItem>
                    <MenuItem value="F">Femenino</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* Tipo Contacto */}
          <Grid item xs={12} md={6}>
            <TipoContactoList
              selectedTipoContactoId={tipoContactoId}
              onSelect={(item: any) => {
                (control as any)._formValues.tipoContactoId = item?.id ?? null;
              }}
            />
          </Grid>

          {/* Principal */}
          <Grid item xs={12} md={6}>
            <Controller
              name="principal"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={!!field.value} />}
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

export default FormularioContacto;
export { requiredFields };
