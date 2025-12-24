import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
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
import { RootState } from 'src/store'
import { setProveedorSeleccionado, setProveedoresDtoSeleccionado } from 'src/store/apps/adm-proveedor'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IProveedor } from '../interfaces/proveedor/proveedor.interfaces'
import { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

type FormInputs = IProveedor

const FormProveedorEditAsync = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  const dispatch = useDispatch()
  const { proveedoresDtoSeleccionado } = useSelector((state: RootState) => state.proveedor)

  const fechaActual = new Date()
  const defaultDateString = fechaActual.toISOString()

  const defaultValues: FormInputs = {
    codigoProveedor: proveedoresDtoSeleccionado.codigoProveedor,
    nombreProveedor: proveedoresDtoSeleccionado.nombreProveedor,
    tipoProveedorId: proveedoresDtoSeleccionado.tipoProveedorId,
    nacionalidad: proveedoresDtoSeleccionado.nacionalidad ?? null,
    cedula: proveedoresDtoSeleccionado.cedula ?? 0,
    rif: proveedoresDtoSeleccionado.rif ?? '',
    fechaRif: proveedoresDtoSeleccionado.fechaRif ?? fechaActual,
    nit: proveedoresDtoSeleccionado.nit ?? null,
    fechaNit: proveedoresDtoSeleccionado.fechaNit ?? null,
    numeroRegistroContraloria: proveedoresDtoSeleccionado.numeroRegistroContraloria ?? null,
    fechaRegistroContraloria: proveedoresDtoSeleccionado.fechaRegistroContraloria ?? null,
    fechaRegistroContraloriaString: proveedoresDtoSeleccionado.fechaRegistroContraloriaString ?? defaultDateString,
    fechaRegistroContraloriaObj: proveedoresDtoSeleccionado.fechaRegistroContraloriaObj ?? null,
    capitalPagado: proveedoresDtoSeleccionado.capitalPagado ?? 0,
    capitalSuscrito: proveedoresDtoSeleccionado.capitalSuscrito ?? 0,
    status: proveedoresDtoSeleccionado.status ?? '',
    estatusFisicoId: proveedoresDtoSeleccionado.estatusFisicoId ?? 0,
    numeroCuenta: proveedoresDtoSeleccionado.numeroCuenta ?? ''
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handleFechaRif = (date: Date) => setValue('fechaRif', date)
  const handlerCapitalPagado = (value: string) => setValue('capitalPagado', value === '' ? 0 : parseFloat(value))
  const handlerCapitalSuscrito = (value: string) => setValue('capitalSuscrito', value === '' ? 0 : parseFloat(value))

  const onSubmit = async (data: FormInputs) => {
    const response = await ossmmasofApi.put(`/Proveedor/Update/${data.codigoProveedor}`, data)
    if (response.data.isValid) {
      dispatch(setProveedoresDtoSeleccionado(response.data.data))
      dispatch(setProveedorSeleccionado(response.data.data))
      toast.success('Proveedor actualizado correctamente')
    } else {
      toast.error(response.data.message || 'Error al actualizar proveedor')
    }
  }

  if (!proveedoresDtoSeleccionado) {
    return <div>No hay proveedor seleccionado</div>
  }

  return (
    <Card>
      <CardHeader title={`Editar Proveedor: ${proveedoresDtoSeleccionado.nombreProveedor}`} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Divider>Datos Básicos</Divider>
            </Grid>

            {/* Código */}
            <Grid item sm={3} xs={12}>
              <Controller
                name='codigoProveedor'
                control={control}
                render={({ field }) => <TextField {...field} label='Código' fullWidth disabled />}
              />
            </Grid>

            {/* Nombre */}
            <Grid item sm={9} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='nombreProveedor'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <TextField {...field} label='Nombre Proveedor' fullWidth />}
                />
                {errors.nombreProveedor && (
                  <FormHelperText sx={{ color: 'error.main' }}>Este campo es requerido</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider>Información Fiscal</Divider>
            </Grid>

            {/* RIF desplazado 2 columnas */}
            <Grid item sm={8} xs={12}>
              <Controller
                name='rif'
                control={control}
                render={({ field }) => <TextField {...field} label='RIF' fullWidth />}
              />
            </Grid>

            {/* Fecha RIF */}
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

            <Grid item xs={12}>
              <Divider>Capital</Divider>
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
                    fullWidth
                    thousandSeparator='.'
                    decimalSeparator=','
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
                    fullWidth
                    thousandSeparator='.'
                    decimalSeparator=','
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
              <Controller
                name='status'
                control={control}
                render={({ field }) => <TextField {...field} label='Status' fullWidth />}
              />
            </Grid>

            {/* Número de Cuenta */}
            <Grid item sm={6} xs={12}>
              <Controller
                name='numeroCuenta'
                control={control}
                render={({ field }) => <TextField {...field} label='Número de Cuenta' fullWidth />}
              />
            </Grid>

            {/* Botón */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' size='large'>
                Guardar Cambios
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormProveedorEditAsync
