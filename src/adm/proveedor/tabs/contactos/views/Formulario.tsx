import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  TextField,
  Typography,
  Box,
  FormControlLabel,
  Checkbox
} from '@mui/material';

import { Contacto } from '../interfaces';

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

  return (
    <form>
      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Datos del Contacto
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Nombre" fullWidth margin="dense" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="apellido"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Apellido" fullWidth margin="dense" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="identificacion"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Identificación" fullWidth margin="dense" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="sexo"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Sexo" fullWidth margin="dense" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="tipoContactoId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tipo de Contacto"
                  type="number"
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
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
