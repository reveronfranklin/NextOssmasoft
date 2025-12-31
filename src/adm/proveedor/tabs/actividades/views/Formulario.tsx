import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Grid, Typography, Box } from '@mui/material'
import DatePicker from 'react-datepicker'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import ActividadList from '../components/ActividadList'

export interface ActividadFormValues {
  actividadId?: number | null
  fechaIni?: Date | null
  fechaFin?: Date | null
}

export interface FormularioActividadChangeData {
  values: ActividadFormValues
  isValid: boolean
}

interface FormularioActividadProps {
  initialValues?: ActividadFormValues
  onChange?: (data: FormularioActividadChangeData) => void
  popperPlacement?: 'auto' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
}

const requiredFields: (keyof ActividadFormValues)[] = [
  'actividadId',
  'fechaIni',
  'fechaFin'
]

const FormularioActividad: React.FC<FormularioActividadProps> = ({
  initialValues = {},
  onChange,
  popperPlacement = 'auto'
}) => {
  const { control, watch, setValue } = useForm<ActividadFormValues>({
    defaultValues: initialValues,
    mode: 'onChange'
  })

  const isFilled = (value: unknown): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim() !== ''
    return true
  }

  React.useEffect(() => {
    const subscription = watch((values) => {
      const fieldsValid = requiredFields.every(field => isFilled(values[field]))
      const fechasValidas =
        values.fechaIni &&
        values.fechaFin &&
        new Date(values.fechaFin) >= new Date(values.fechaIni)

      onChange?.({
        values,
        isValid: fieldsValid && !!fechasValidas
      })
    })

    return () => subscription.unsubscribe()
  }, [watch, onChange])

  const actividadId = watch('actividadId')

  const handleFechaIni = (date: Date | null) => setValue('fechaIni', date)
  const handleFechaFin = (date: Date | null) => setValue('fechaFin', date)

  return (
    <form>
      <Box mb={20}>
        <Typography variant="subtitle1" gutterBottom>
          Datos de la Actividad
        </Typography>

        <Grid container spacing={2} alignItems="center">
          {/* Actividad */}
          <Grid item xs={12} md={6}>
            <ActividadList
              selectedActividadId={actividadId}
              onActividadSelect={(actividad: any) => {
                ;(control as any)._formValues.actividadId = actividad?.id ?? null
              }}
            />
          </Grid>

          {/* Fecha Inicio */}
          <Grid item xs={12} md={3}>
            <Controller
              name="fechaIni"
              control={control}
              render={({ field }) => (
                <DatePickerWrapper sx={{ width: '100%' }}>
                  <DatePicker
                    selected={field.value}
                    onChange={handleFechaIni}
                    dateFormat="dd/MM/yyyy"
                    popperPlacement={popperPlacement}
                    wrapperClassName="date-picker-full-width"
                    customInput={<CustomInput label="Fecha Inicio" />}
                  />
                </DatePickerWrapper>
              )}
            />
          </Grid>

          {/* Fecha Fin */}
          <Grid item xs={12} md={3}>
            <Controller
              name="fechaFin"
              control={control}
              render={({ field }) => (
                <DatePickerWrapper sx={{ width: '100%' }}>
                  <DatePicker
                    selected={field.value}
                    onChange={handleFechaFin}
                    minDate={watch('fechaIni') ?? undefined}
                    dateFormat="dd/MM/yyyy"
                    popperPlacement={popperPlacement}
                    wrapperClassName="date-picker-full-width"
                    customInput={<CustomInput label="Fecha Fin" />}
                  />
                </DatePickerWrapper>
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </form>
  )
}

export default FormularioActividad
export { requiredFields }
