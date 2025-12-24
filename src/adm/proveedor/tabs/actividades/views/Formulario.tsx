import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  TextField,
  Typography,
  Box
} from '@mui/material';

import ActividadList from '../components/ActividadList';

export interface ActividadFormValues {
  actividadId?: number | null;
  fechaIni?: Date | null;
  fechaFin?: Date | null;
}

export interface FormularioActividadChangeData {
  values: ActividadFormValues;
  isValid: boolean;
}

interface FormularioActividadProps {
  initialValues?: ActividadFormValues;
  onChange?: (data: FormularioActividadChangeData) => void;
}

const requiredFields: (keyof ActividadFormValues)[] = [
  'actividadId',
  'fechaIni',
  'fechaFin'
];

const FormularioActividad: React.FC<FormularioActividadProps> = ({
  initialValues = {},
  onChange
}) => {
  const { control, watch } = useForm<ActividadFormValues>({
    defaultValues: initialValues,
    mode: 'onChange'
  });

  // helper tipado para validar campos requeridos
  const isFilled = (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';

    return true; // number | Date
  };

  React.useEffect(() => {
    const subscription = watch((values) => {
      const fieldsValid = requiredFields.every(
        field => isFilled(values[field])
      );

      const fechasValidas =
        values.fechaIni &&
        values.fechaFin &&
        new Date(values.fechaFin) >= new Date(values.fechaIni);

      onChange?.({
        values,
        isValid: fieldsValid && !!fechasValidas
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const actividadId = watch('actividadId');

  return (
    <form>
      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Datos de la Actividad
        </Typography>

        <Grid container spacing={2}>
          {/* Actividad */}
          <Grid item xs={12} md={6}>
            <ActividadList
              selectedActividadId={actividadId}
              onActividadSelect={(actividad: any) => {
                // se asume actividad.id
                // react-hook-form toma el valor automáticamente
                (control as any)._formValues.actividadId = actividad?.id ?? null;
              }}
            />
          </Grid>

          {/* Fecha Inicio */}
          <Grid item xs={12} md={3}>
            <Controller
              name="fechaIni"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Fecha Inicio"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>

          {/* Fecha Fin */}
          <Grid item xs={12} md={3}>
            <Controller
              name="fechaFin"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Fecha Fin"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default FormularioActividad;
export { requiredFields };
