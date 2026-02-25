import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormHelperText from '@mui/material/FormHelperText'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import { useForm, Controller } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store'
import {
  setProveedorSeleccionado,
  setProveedoresDtoSeleccionado,
  setVerProveedorActive
} from 'src/store/apps/adm-proveedor'

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IProveedor } from '../interfaces/proveedor/proveedor.interfaces'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { ReactDatePickerProps } from 'react-datepicker'

type FormInputs = IProveedor

const toDateOrNull = (value: any): Date | null => {
  if (!value) return null
  const date = new Date(value)

  return isNaN(date.getTime()) ? null : date
}

const FormProveedorEditAsync = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const dispatch = useDispatch()

  const { proveedoresDtoSeleccionado } = useSelector(
    (state: RootState) => state.proveedor
  )

  const defaultValues: FormInputs = {
    codigoProveedor: proveedoresDtoSeleccionado.codigoProveedor,
    nombreProveedor: proveedoresDtoSeleccionado.nombreProveedor,
    tipoProveedorId: proveedoresDtoSeleccionado.tipoProveedorId,
    nacionalidad: proveedoresDtoSeleccionado.nacionalidad ?? null,
    cedula: proveedoresDtoSeleccionado.cedula ?? 0,
    rif: proveedoresDtoSeleccionado.rif ?? '',
    fechaRif: toDateOrNull(proveedoresDtoSeleccionado.fechaRif),
    nit: proveedoresDtoSeleccionado.nit ?? null,
    fechaNit: toDateOrNull(proveedoresDtoSeleccionado.fechaNit),
    numeroRegistroContraloria:
      proveedoresDtoSeleccionado.numeroRegistroContraloria ?? null,
    fechaRegistroContraloria: toDateOrNull(
      proveedoresDtoSeleccionado.fechaRegistroContraloria
    ),
    capitalPagado: proveedoresDtoSeleccionado.capitalPagado ?? 0,
    capitalSuscrito: proveedoresDtoSeleccionado.capitalSuscrito ?? 0,
    status: proveedoresDtoSeleccionado.status ?? 'A',
    estatusFisicoId: proveedoresDtoSeleccionado.estatusFisicoId ?? 0,
    numeroCuenta: proveedoresDtoSeleccionado.numeroCuenta ?? '',
    activo: proveedoresDtoSeleccionado.activo ?? true
  }

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const activo = watch('activo')
  const formDisabled = activo === false

  const handleEditClickClose = () => {
    dispatch(setVerProveedorActive(false))
  }

  const parseSpanishNumber = (value: any) => {
    if (!value) return 0
    if (typeof value === 'number') return value

    return Number(value.toString().replace(/\./g, '').replace(',', '.')) || 0
  }

  const getErrorMessage = (error: any) => {
    if (error?.data?.message) return error.data.message
    if (!error?.response?.data) return 'Error inesperado. Intente nuevamente.'

    const data = error.response.data

    if (data.message) return data.message

    if (data.errors && typeof data.errors === 'object') {
      return Object.values(data.errors).flat().join(' ')
    }

    if (data.title) return data.title

    return 'Error al procesar la solicitud.'
  }

  const onSubmit = async (data: FormInputs) => {
    const payload = {
      ...data,
      capitalPagado: parseSpanishNumber(data.capitalPagado),
      capitalSuscrito: parseSpanishNumber(data.capitalSuscrito),
      cedula: Number(data.cedula || 0),
      codigoProveedor: Number(data.codigoProveedor || 0),
      tipoProveedorId: Number(data.tipoProveedorId || 0),
      estatusFisicoId: Number(data.estatusFisicoId || 0)
    }

    try {
      const response = await ossmmasofApi.post(
        '/AdmProveedores/Update',
        payload
      )

      if (response.data.isValid) {
        dispatch(setProveedoresDtoSeleccionado(response.data.data))
        dispatch(setProveedorSeleccionado(response.data.data))
        toast.success('Proveedor actualizado correctamente')
        handleEditClickClose()
      } else {
        toast.error(response.data.message || 'Error al actualizar proveedor')
      }

      if (response?.data?.isValid === false) {
        setErrorMessage(getErrorMessage(response))
      }
    } catch (error: any) {
      setErrorMessage(getErrorMessage(error))
      toast.error('Ocurrió un error al procesar la solicitud')
    }
  }

  return (
    <Card>
      <CardHeader
        title={`Editar Proveedor: ${proveedoresDtoSeleccionado.nombreProveedor}`}
      />

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {/* SWITCH (SIEMPRE HABILITADO) */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Controller
                  name="activo"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label={field.value ? 'Proveedor Activo' : 'Proveedor Inactivo'}
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>

          <fieldset style={{ border: 'none', padding: 0 }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Divider>Datos Básicos</Divider>
              </Grid>

              <Grid item sm={3} xs={12}>
                <Controller
                  name="codigoProveedor"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Código" fullWidth disabled />
                  )}
                />
              </Grid>

              <Grid item sm={5} xs={12}>
                <Controller
                  name="nombreProveedor"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Nombre Proveedor" fullWidth disabled={formDisabled} />
                  )}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <Controller
                  name="cedula"
                  control={control}
                  rules={{
                    maxLength: {
                      value: 8,
                      message: 'La cédula no puede tener más de 8 dígitos'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Cédula"
                      type="number"
                      fullWidth
                      disabled={formDisabled}
                      error={!!errors.cedula}
                      helperText={errors.cedula ? errors.cedula.message : ''}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider>Información Fiscal</Divider>
              </Grid>

              <Grid item sm={8} xs={12}>
                <Controller
                  name="rif"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="RIF" fullWidth disabled={formDisabled}/>
                  )}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <Controller
                  name="fechaRif"
                  control={control}
                  render={({ field }) => (
                    <DatePickerWrapper sx={{ width: '100%' }}>
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        dateFormat="dd/MM/yyyy"
                        popperPlacement={popperPlacement}
                        disabled={formDisabled}
                        customInput={<CustomInput label="Fecha RIF" />}
                      />
                    </DatePickerWrapper>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider>Capital</Divider>
              </Grid>

              <Grid item sm={6} xs={12}>
                <Controller
                  name="capitalPagado"
                  control={control}
                  render={({ field }) => (
                    <NumericFormat
                      {...field}
                      customInput={TextField}
                      fullWidth
                      disabled={formDisabled}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      label="Capital Pagado"
                      onValueChange={(v) => field.onChange(v.value)}
                    />
                  )}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <Controller
                  name="capitalSuscrito"
                  control={control}
                  render={({ field }) => (
                    <NumericFormat
                      {...field}
                      customInput={TextField}
                      fullWidth
                      disabled={formDisabled}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      label="Capital Suscrito"
                      onValueChange={(v) => field.onChange(v.value)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="numeroCuenta"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Número de Cuenta" fullWidth disabled={formDisabled}/>
                  )}
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" size="large">
                  Guardar Cambios
                </Button>
              </Grid>
            </Grid>
          </fieldset>

          {errorMessage && (
            <FormHelperText sx={{ color: 'error.main', mt: 4 }}>
              {errorMessage}
            </FormHelperText>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default FormProveedorEditAsync
