// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import toast from 'react-hot-toast'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { setProveedorSeleccionado, setProveedoresDtoSeleccionado } from 'src/store/apps/adm-proveedor'

// ** API
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

// ** Interfaces
import { IProveedor } from '../interfaces/proveedor/proveedor.interfaces'

// ** Types
import { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

interface FormInputs extends IProveedor {}

const FormProveedorCreateAsync = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
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
    fechaRegistroContraloriaString: proveedoresDtoSeleccionado?.fechaRegistroContraloriaString ?? defaultDateString,
    fechaRegistroContraloriaObj: null,
    capitalPagado: proveedoresDtoSeleccionado?.capitalPagado ?? 0,
    capitalSuscrito: proveedoresDtoSeleccionado?.capitalSuscrito ?? 0,
    status: proveedoresDtoSeleccionado?.status ?? '',
    estatusFisicoId: proveedoresDtoSeleccionado?.estatusFisicoId ?? 0,
    numeroCuenta: proveedoresDtoSeleccionado?.numeroCuenta ?? ''
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handleFechaRif = (date: Date) => {
    setValue('fechaRif', date)
  }

  const handlerCapitalPagado = (value: string) => {
    const val = value === '' ? 0 : parseFloat(value)
    setValue('capitalPagado', val)
  }

  const handlerCapitalSuscrito = (value: string) => {
    const val = value === '' ? 0 : parseFloat(value)
    setValue('capitalSuscrito', val)
  }

  const onSubmit = async (data: FormInputs) => {
    const payload: IProveedor = { ...data }
    const response = await ossmmasofApi.post('/Proveedor/Create', payload)

    if (response.data.isValid) {
      dispatch(setProveedoresDtoSeleccionado(response.data.data))
      dispatch(setProveedorSeleccionado(response.data.data))
      toast.success('Proveedor creado correctamente')
    } else {
      toast.error(response.data.message || 'Error al crear proveedor')
    }
  }

  return (
    <Card>
      <CardHeader title='Crear Proveedor' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* Codigo Proveedor */}
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoProveedor'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label='Codigo Proveedor' disabled />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Nombre Proveedor */}
            <Grid item sm={9} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='nombreProveedor'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <TextField {...field} label='Nombre Proveedor' />}
                />
                {errors.nombreProveedor && (
                  <FormHelperText sx={{ color: 'error.main' }}>Este campo es requerido</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* RIF */}
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='rif'
                  control={control}
                  render={({ field }) => <TextField {...field} label='RIF' />}
                />
              </FormControl>
            </Grid>

            {/* Fecha RIF */}
            <Grid item sm={6} xs={12}>
              <Controller
                name='fechaRif'
                control={control}
                render={({ field }) => (
                  <DatePickerWrapper>
                    <DatePicker
                      selected={field.value}
                      onChange={handleFechaRif}
                      dateFormat='dd/MM/yyyy'
                      popperPlacement={popperPlacement}
                      placeholderText='Fecha RIF'
                      customInput={<CustomInput label='Fecha RIF' />}
                    />
                  </DatePickerWrapper>
                )}
              />
            </Grid>

            {/* Capital Pagado */}
            <Grid item sm={6} xs={12}>
              <Controller
                name='capitalPagado'
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    customInput={TextField}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    label='Capital Pagado'
                    onValueChange={(values: any) => handlerCapitalPagado(values.value)}
                  />
                )}
              />
            </Grid>

            {/* Capital Suscrito */}
            <Grid item sm={6} xs={12}>
              <Controller
                name='capitalSuscrito'
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    customInput={TextField}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    label='Capital Suscrito'
                    onValueChange={(values: any) => handlerCapitalSuscrito(values.value)}
                  />
                )}
              />
            </Grid>

            {/* Status */}
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='status'
                  control={control}
                  render={({ field }) => <TextField {...field} label='Status' />}
                />
              </FormControl>
            </Grid>

            {/* Numero Cuenta */}
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='numeroCuenta'
                  control={control}
                  render={({ field }) => <TextField {...field} label='Numero Cuenta' />}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained' size='large'>
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormProveedorCreateAsync
