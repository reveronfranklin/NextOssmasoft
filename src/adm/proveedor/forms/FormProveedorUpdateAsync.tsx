import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
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

  const handleEditClickClose = () => {
    dispatch(setVerProveedorActive(false))
  }

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
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  if (!proveedoresDtoSeleccionado) {
    return <div>No hay proveedor seleccionado</div>
  }

  const parseSpanishNumber = (value: any) => {
    if (value === null || value === undefined || value === '') return 0
    if (typeof value === 'number') return value

    const cleanValue = value
      .toString()
      .replace(/\./g, '')
      .replace(',', '.')
    const result = parseFloat(cleanValue)

    return isNaN(result) ? 0 : result
  }

  const getErrorMessage = (error: any) => {
    if (!error?.response?.data) {
      return 'Error inesperado. Intente nuevamente.';
    }

    const data = error.response.data;

    if (data.message) {
      return data.message;
    }

    if (data.errors && typeof data.errors === 'object') {
      return Object.values(data.errors)
        .flat()
        .join(' ');
    }

    if (data.title) {
      return data.title;
    }

    return 'Error al procesar la solicitud.';
  };


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

      setErrorMessage(getErrorMessage(response.data.message))
    } catch (error: any) {
      setErrorMessage(getErrorMessage(error))
      console.error('Error en Update:', error.response?.data)
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

            {/* SWITCH EN ESQUINA SUPERIOR DERECHA */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Controller
                  name="activo"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label={
                        field.value === true
                          ? 'Proveedor Activo'
                          : 'Proveedor Inactivo'
                      }
                      control={
                        <Switch
                          checked={field.value === true}
                          onChange={(e) =>
                            field.onChange(e.target.checked ? true : false)
                          }
                          color="primary"
                        />
                      }
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider>Datos Básicos</Divider>
            </Grid>

            {/* Código */}
            <Grid item sm={3} xs={12}>
              <Controller
                name="codigoProveedor"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Código" fullWidth disabled />
                )}
              />
            </Grid>

            {/* Nombre */}
            <Grid item sm={5} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="nombreProveedor"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField {...field} label="Nombre Proveedor" fullWidth />
                  )}
                />
                {errors.nombreProveedor && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    Este campo es requerido
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Cédula */}
            <Grid item sm={4} xs={12}>
              <Controller
                name="cedula"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Cédula" type="number" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider>Información Fiscal</Divider>
            </Grid>

            {/* RIF */}
            <Grid item sm={8} xs={12}>
              <Controller
                name="rif"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="RIF" fullWidth />
                )}
              />
            </Grid>

            {/* Fecha RIF */}
            <Grid item sm={4} xs={12}>
              <Controller
                name="fechaRif"
                control={control}
                render={({ field }) => (
                  <DatePickerWrapper sx={{ width: '100%' }}>
                    <DatePicker
                      selected={field.value ?? null}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      popperPlacement={popperPlacement}
                      wrapperClassName="date-picker-full-width"
                      customInput={<CustomInput label="Fecha RIF" />}
                    />
                  </DatePickerWrapper>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider>Capital</Divider>
            </Grid>

            {/* Capital Pagado */}
            <Grid item sm={6} xs={12}>
              <Controller
                name="capitalPagado"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    customInput={TextField}
                    fullWidth
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    label="Capital Pagado"
                    onValueChange={(v) => field.onChange(v.value)}
                  />
                )}
              />
            </Grid>

            {/* Capital Suscrito */}
            <Grid item sm={6} xs={12}>
              <Controller
                name="capitalSuscrito"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    customInput={TextField}
                    fullWidth
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    label="Capital Suscrito"
                    onValueChange={(v) => field.onChange(v.value)}
                  />
                )}
              />
            </Grid>

            {/* Cuenta */}
            <Grid item sm={12} xs={12}>
              <Controller
                name="numeroCuenta"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Número de Cuenta" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" size="large">
                Guardar Cambios
              </Button>
            </Grid>
          </Grid>

          <Box>
            {errorMessage && errorMessage.length > 0 && (
              <FormHelperText
                sx={{ color: 'error.main', fontSize: 20, mt: 4 }}
              >
                {errorMessage}
              </FormHelperText>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormProveedorEditAsync
