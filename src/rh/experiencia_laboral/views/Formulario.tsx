import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Grid, Box, Autocomplete } from "@mui/material";
import { ExperienciaLaboralDTO } from "../interfaces/experiencia-laboral.dto";
import FormatNumber from 'src/utilities/format-numbers';
import { TipoEmpresaEnum } from "../enums/tipoEmpresa.enum";
interface Props {
  initialValues?: Partial<ExperienciaLaboralDTO>;
  onChange?: (data: { values: any; isValid: boolean }) => void;
  open?: boolean;
}

export const defaultValues: Partial<ExperienciaLaboralDTO> = {
  nombreEmpresa: "",
  tipoEmpresa: "",
  cargo: "",
  fechaDesde: "",
  fechaHasta: "",
  ultimoSueldo: 0,
  supervisor: "",
  cargoSupervisor: "",
  telefono: "",
  descripcion: "",
};

const tipoEmpresaOptions = Object.entries(TipoEmpresaEnum).map(([key, value]) => ({
  label: value,
  value: key,
}));

const Formulario: React.FC<Props> = ({ initialValues = {}, onChange, open }) => {
  const {
    control,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<ExperienciaLaboralDTO>({
    mode: "onChange",
    defaultValues,
  });

  const prevOpen = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (open && !prevOpen.current) {
      reset({ ...defaultValues, ...initialValues });
    }
    prevOpen.current = open;
  }, [open, initialValues, reset]);

  useEffect(() => {
    if (onChange) {
      onChange({ values: watch(), isValid });
    }
  }, [watch(), isValid, onChange]);

  const hoy = new Date().toISOString().substring(0, 10);

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Controller
            name="nombreEmpresa"
            control={control}
            rules={{ required: "Nombre de empresa requerido" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre de la empresa"
                fullWidth
                error={!!errors.nombreEmpresa}
                helperText={errors.nombreEmpresa?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="tipoEmpresa"
            control={control}
            rules={{ required: "Tipo de empresa requerido" }}
            render={({ field }) => (
              <Autocomplete
                options={tipoEmpresaOptions}
                getOptionLabel={option => option.label}
                value={tipoEmpresaOptions.find(opt => opt.value === field.value) || null}
                onChange={(_, newValue) => field.onChange(newValue ? newValue.value : "")}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Tipo de empresa"
                    fullWidth
                    error={!!errors.tipoEmpresa}
                    helperText={errors.tipoEmpresa?.message}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name="ultimoSueldo"
            control={control}
            rules={{
              min: { value: 0, message: "No puede ser negativo" },
              required: "Último sueldo requerido",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Solo números y hasta 2 decimales",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Último sueldo"
                type="number"
                fullWidth
                error={!!errors.ultimoSueldo}
                helperText={
                  errors.ultimoSueldo?.message
                    ? errors.ultimoSueldo?.message
                    : field.value
                      ? `Valor: ${FormatNumber(Number(field.value))}`
                      : ""
                }
                inputProps={{ step: "0.01", min: 0 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="cargo"
            control={control}
            rules={{ required: "Cargo requerido" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cargo"
                fullWidth
                error={!!errors.cargo}
                helperText={errors.cargo?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="fechaDesde"
            control={control}
            rules={{
              required: "Fecha desde requerida",
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/,
                message: "Formato: YYYY-MM-DD",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ? field.value.substring(0, 10) : ""}
                onChange={(e) => field.onChange(e.target.value)}
                label="Fecha desde"
                type="date"
                fullWidth
                error={!!errors.fechaDesde}
                helperText={errors.fechaDesde?.message}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: hoy }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="fechaHasta"
            control={control}
            rules={{
              required: "Fecha hasta requerida",
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/,
                message: "Formato: YYYY-MM-DD",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ? field.value.substring(0, 10) : ""}
                onChange={e => field.onChange(e.target.value)}
                label="Fecha hasta"
                type="date"
                fullWidth
                error={!!errors.fechaHasta}
                helperText={errors.fechaHasta?.message}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: hoy }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="supervisor"
            control={control}
            rules={{ required: "Supervisor requerido" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Supervisor"
                fullWidth
                error={!!errors.supervisor}
                helperText={errors.supervisor?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="cargoSupervisor"
            control={control}
            rules={{ required: "Cargo del supervisor requerido" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cargo del supervisor"
                fullWidth
                error={!!errors.cargoSupervisor}
                helperText={errors.cargoSupervisor?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="telefono"
            control={control}
            rules={{
              pattern: {
                value: /^[0-9\-+() ]*$/,
                message: "Solo números y símbolos válidos",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Teléfono"
                fullWidth
                error={!!errors.telefono}
                helperText={errors.telefono?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descripción"
                fullWidth
                multiline
                minRows={2}
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Formulario;