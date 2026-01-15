import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Divider from '@mui/material/Divider'
import { useForm, Controller } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { RootState } from 'src/store'
import { setProveedorSeleccionado, setProveedoresDtoSeleccionado, setVerProveedorActive } from 'src/store/apps/adm-proveedor'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IProveedor } from '../interfaces/proveedor/proveedor.interfaces'
import { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

type FormInputs = IProveedor

const FormProveedorCreateAsync = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const dispatch = useDispatch()
  const { proveedoresDtoSeleccionado } = useSelector((state: RootState) => state.proveedor)

  const fechaActual = new Date()
  const defaultDateString = fechaActual.toISOString()

  const defaultValues: FormInputs = {
    codigoProveedor: proveedoresDtoSeleccionado?.codigoProveedor ?? 0,
    nombreProveedor: proveedoresDtoSeleccionado?.nombreProveedor ?? '',
    tipoProveedorId: proveedoresDtoSeleccionado?.tipoProveedorId ?? 0,
    nacionalidad: null,
    cedula: proveedoresDtoSeleccionado?.cedula ?? 0,
    rif: proveedoresDtoSeleccionado?.rif ?? '',
    fechaRif: proveedoresDtoSeleccionado?.fechaRif ?? fechaActual,
    nit: null,
    fechaNit: null,
    numeroRegistroContraloria: null,
    fechaRegistroContraloria: null,
    fechaRegistroContraloriaString:
      proveedoresDtoSeleccionado?.fechaRegistroContraloriaString ?? defaultDateString,
    fechaRegistroContraloriaObj: null,
    capitalPagado: proveedoresDtoSeleccionado?.capitalPagado ?? 0,
    capitalSuscrito: proveedoresDtoSeleccionado?.capitalSuscrito ?? 0,
    status: proveedoresDtoSeleccionado?.status ?? 'A',
    estatusFisicoId: proveedoresDtoSeleccionado?.estatusFisicoId ?? 0,
    numeroCuenta: proveedoresDtoSeleccionado?.numeroCuenta ?? '',
    activo: proveedoresDtoSeleccionado.activo ?? true
  }

  const handleCreateClickClose = () => {
    dispatch(setVerProveedorActive(false))
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handleFechaRif = (date: Date) => setValue('fechaRif', date)
  const handlerCapitalPagado = (value: string) =>
    setValue('capitalPagado', value === '' ? 0 : parseFloat(value))
  const handlerCapitalSuscrito = (value: string) =>
    setValue('capitalSuscrito', value === '' ? 0 : parseFloat(value))

  const parseSpanishNumber = (value: any) => {
    if (value === null || value === undefined || value === '') return 0

    if (typeof value === 'number') return value

    const cleanValue = value.toString().trim().replace(/\./g, '').replace(',', '.')
    const result = parseFloat(cleanValue)

    return isNaN(result) ? 0 : result
  }

  const onSubmit = async (data: FormInputs) => {
    const payload: IProveedor = {
      ...data,
      capitalPagado: parseSpanishNumber(data.capitalPagado),
      capitalSuscrito: parseSpanishNumber(data.capitalSuscrito),
      cedula: Number(data.cedula || 0),
      codigoProveedor: Number(data.codigoProveedor || 0),
      tipoProveedorId: Number(data.tipoProveedorId || 0),
      estatusFisicoId: Number(data.estatusFisicoId || 0)
    }

    try {
      const response = await ossmmasofApi.post('/AdmProveedores/Create', payload)

      if (response.data.isValid) {
        dispatch(setProveedoresDtoSeleccionado(response.data.data))
        dispatch(setProveedorSeleccionado(response.data.data))
        toast.success('Proveedor creado correctamente')
        handleCreateClickClose()
      } else {
        toast.error(response.data.message || 'Error al crear proveedor')
      }

      setErrorMessage(response.data.message)
    } catch {
      toast.error('Error al conectar con el servidor')
    }
  }

  return (
    <Card>
      <CardHeader title='Crear Proveedor' subheader='Información general del proveedor' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12}><Divider>Datos Básicos</Divider></Grid>

            <Grid item sm={3} xs={12}>
              <Controller
                name='codigoProveedor'
                control={control}
                render={({ field }) => (
                  <TextField {...field} label='Código' fullWidth disabled />
                )}
              />
            </Grid>

            <Grid item sm={5} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='nombreProveedor'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField {...field} label='Nombre del Proveedor' fullWidth />
                  )}
                />
                {errors.nombreProveedor && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    Este campo es requerido
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item sm={4} xs={12}>
              <Controller
                name='cedula'
                control={control}
                render={({ field }) => (
                  <TextField {...field} label='Cédula' type='number' fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12}><Divider>Información Fiscal</Divider></Grid>

            <Grid item sm={8} xs={12}>
              <Controller
                name='rif'
                control={control}
                render={({ field }) => <TextField {...field} label='RIF' fullWidth />}
              />
            </Grid>

            <Grid item sm={4} xs={12}>
              <Controller
                name='fechaRif'
                control={control}
                render={({ field }) => (
                  <DatePickerWrapper sx={{ width: '100%' }}>
                    <DatePicker
                      selected={field.value}
                      onChange={handleFechaRif}
                      dateFormat='dd/MM/yyyy'
                      popperPlacement={popperPlacement}
                      wrapperClassName='date-picker-full-width'
                      customInput={<CustomInput label='Fecha RIF' />}
                    />
                  </DatePickerWrapper>
                )}
              />
            </Grid>

            <Grid item xs={12}><Divider>Capital</Divider></Grid>

            <Grid item sm={6} xs={12}>
              <Controller
                name='capitalPagado'
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    customInput={TextField}
                    fullWidth
                    thousandSeparator='.'
                    decimalSeparator=','
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    label='Capital Pagado'
                    onValueChange={(v: any) => handlerCapitalPagado(v.value)}
                  />
                )}
              />
            </Grid>

            <Grid item sm={6} xs={12}>
              <Controller
                name='capitalSuscrito'
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    customInput={TextField}
                    fullWidth
                    thousandSeparator='.'
                    decimalSeparator=','
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    label='Capital Suscrito'
                    onValueChange={(v: any) => handlerCapitalSuscrito(v.value)}
                  />
                )}
              />
            </Grid>

            <Grid item sm={12} xs={12}>
              <Controller
                name='numeroCuenta'
                control={control}
                render={({ field }) => (
                  <TextField {...field} label='Número de Cuenta' fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained'>Guardar</Button>
            </Grid>
          </Grid>
          <Box>
            {errorMessage && errorMessage.length > 0 && <FormHelperText sx={{ color: 'error.main' ,fontSize: 20,mt:4 }}>{ errorMessage }</FormHelperText>}
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormProveedorCreateAsync
