// ** React Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'

import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'

import FormHelperText from '@mui/material/FormHelperText'

import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '../../../views/forms/form-elements/pickers/PickersCustomInput'

// ** Types

import { useDispatch } from 'react-redux'
import { setOnlyPresupuestos, setPresupuesto, setVerPresupuestoActive } from 'src/store/apps/presupuesto'

import { IUpdatePrePresupuesto } from 'src/interfaces/Presupuesto/i-update-pre-presupuesto.dto'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useState } from 'react'
import { Box } from '@mui/material'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { monthByIndex } from 'src/utilities/ge-date-by-object'

interface FormInputs {
  codigoPresupuesto: number
  denominacion: string
  descripcion: string
  ano: number
  numeroOrdenanza: string
  extra1: string
  extra2: string
  extra3: string
  fechaDesde: Date
  fechaDesdeString: string
  fechaDesdeObj: IFechaDto
  fechaHasta: Date
  fechaHastaString: string
  fechaHastaObj: IFechaDto
  fechaOrdenanza: Date
  fechaOrdenanzaString: string
  fechaOrdenanzaObj: IFechaDto
  fechaAprobacion: Date
  fechaAprobacionString: string
  fechaAprobacionObj: IFechaDto
}

const FormPresupuestoCreateAsync = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  // ** States
  const dispatch = useDispatch()
  const { presupuestoSeleccionado } = useSelector((state: RootState) => state.presupuesto)
  const fechaActual = new Date()

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const currentMonthString = '00' + monthByIndex(currentMonth).toString()

  const currentDay = new Date().getDate()
  const currentDayString = '00' + currentDay.toString()
  const defaultDate: IFechaDto = {
    year: currentYear.toString(),
    month: currentMonthString.slice(-2),
    day: currentDayString.slice(-2)
  }
  const defaultDateString = fechaActual.toISOString()

  // const {presupuestoSeleccionado} = useSelector((state: RootState) => state.presupuesto)

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)

  const [errorMessage, setErrorMessage] = useState<string>('')

  const defaultValues = {
    codigoPresupuesto: 0,
    denominacion: '',
    descripcion: '',
    ano: 0,
    numeroOrdenanza: '',
    extra1: '',
    extra2: '',
    extra3: '',
    fechaDesde: fechaActual,
    fechaDesdeString: defaultDateString,
    fechaDesdeObj: defaultDate,
    fechaHasta: fechaActual,
    fechaHastaString: defaultDateString,
    fechaHastaObj: defaultDate,
    fechaOrdenanza: fechaActual,
    fechaOrdenanzaString: defaultDateString,
    fechaOrdenanzaObj: defaultDate,
    fechaAprobacion: fechaActual,
    fechaAprobacionString: defaultDateString,
    fechaAprobacionObj: defaultDate
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerDesde = (desde: Date) => {
    const fechaObj: IFechaDto = fechaToFechaObj(desde)
    const presupuestoTmp = {
      ...presupuestoSeleccionado,
      fechaDesde: desde,
      fechaDesdeString: desde.toISOString(),
      fechaDesdeObj: fechaObj
    }
    setValue('fechaDesdeString', desde.toISOString())
    setValue('fechaDesde', desde)
    setValue('fechaDesdeObj', fechaObj)
    dispatch(setPresupuesto(presupuestoTmp))
  }

  const handlerHasta = (hasta: Date) => {
    const fechaObj: IFechaDto = fechaToFechaObj(hasta)
    const presupuestoTmp = {
      ...presupuestoSeleccionado,
      fechaHasta: hasta,
      fechaHastaString: hasta.toISOString(),
      fechaHastaObj: fechaObj
    }
    setValue('fechaHastaString', hasta.toISOString())
    setValue('fechaHasta', hasta)
    setValue('fechaHastaObj', fechaObj)
    dispatch(setPresupuesto(presupuestoTmp))
  }

  const handlerFechaAprobacion = (aprobacion: Date) => {
    const fechaObj: IFechaDto = fechaToFechaObj(aprobacion)
    const presupuestoTmp = {
      ...presupuestoSeleccionado,
      fechaAprobacion: aprobacion,
      fechaAprobacionString: aprobacion.toISOString(),
      fechaAprobacionObj: fechaObj
    }
    setValue('fechaAprobacionString', aprobacion.toISOString())
    setValue('fechaAprobacion', aprobacion)
    setValue('fechaAprobacionObj', fechaObj)
    dispatch(setPresupuesto(presupuestoTmp))
  }
  const handlerFechaOrdenanza = (fechaOrdenanza: Date) => {
    const fechaObj: IFechaDto = fechaToFechaObj(fechaOrdenanza)
    const presupuestoTmp = {
      ...presupuestoSeleccionado,
      fechaOrdenanza: fechaOrdenanza,
      fechaOrdenanzaString: fechaOrdenanza.toISOString(),
      fechaOrdenanzaObj: fechaObj
    }
    setValue('fechaOrdenanzaString', fechaOrdenanza.toISOString())
    setValue('fechaOrdenanza', fechaOrdenanza)
    setValue('fechaAprobacionObj', fechaObj)
    dispatch(setPresupuesto(presupuestoTmp))
  }

  const getPresupuestos = async () => {
    const responseAll = await ossmmasofApi.get<any>('/PrePresupuesto/GetList')
    const data = responseAll.data
    dispatch(setOnlyPresupuestos(data))
  }

  const onSubmit = async (data: FormInputs) => {
    setErrorMessage('')
    if (data.fechaDesdeString.length < 10) {
      setErrorMessage('Indique la fecha desde del presupuesto')

      return
    }
    if (data.fechaHastaString.length < 10) {
      setErrorMessage('Indique la fecha hasta del presupuesto')

      return
    }

    setLoading(true)

    const updatePresupuesto: IUpdatePrePresupuesto = {
      codigoEmpresa: 13,
      codigoPresupuesto: data.codigoPresupuesto,
      denominacion: data.denominacion,
      descripcion: data.descripcion,
      ano: Number(data.ano),
      fechaDesde: data.fechaDesdeString,
      fechaHasta: data.fechaHastaString,
      fechaAprobacion: data.fechaAprobacionString,
      numeroOrdenanza:
        data.numeroOrdenanza === null || data.numeroOrdenanza === 'undefined' ? '' : data.numeroOrdenanza,
      fechaOrdenanza: data.fechaOrdenanzaString,
      extra1: data.extra1 === null || data.extra1 === 'undefined' ? '' : data.extra1,
      extra2: data.extra2 === null || data.extra2 === 'undefined' ? '' : data.extra2,
      extra3: data.extra3 === null || data.extra3 === 'undefined' ? '' : data.extra3
    }

    const responseAll = await ossmmasofApi.post<any>('/PrePresupuesto/Create', updatePresupuesto)

    if (responseAll.data.isValid == false) {
      setErrorMessage(responseAll.data.message)
      dispatch(setPresupuesto(defaultValues))
    } else {
      dispatch(setPresupuesto(responseAll.data.data))
      dispatch(setVerPresupuestoActive(false))
    }
    await getPresupuestos()

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)

    toast.success('Form Submitted')
  }

  return (
    <Card>
      <CardHeader title='Crear Presupuesto' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoPresupuesto'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Codigo'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoPresupuesto)}
                      aria-describedby='validation-async-codigo-presupuesto'
                      disabled
                    />
                  )}
                />
                {errors.codigoPresupuesto && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigo-presupuesto'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={10}>
              <FormControl fullWidth>
                <Controller
                  name='denominacion'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Denominacion'
                      onChange={onChange}
                      placeholder='Denominacion'
                      error={Boolean(errors.denominacion)}
                      aria-describedby='validation-async-denominacion'
                    />
                  )}
                />
                {errors.denominacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-denominacion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='descripcion'
                  control={control}
                  rules={{ maxLength: 1000 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Descripcion'
                      onChange={onChange}
                      placeholder='Descripcion'
                      error={Boolean(errors.descripcion)}
                      aria-describedby='validation-async-descripcion'
                    />
                  )}
                />
                {errors.descripcion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-descripcion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='ano'
                  control={control}
                  rules={{ min: 2000 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      value={value || 0}
                      label='Año'
                      onChange={onChange}
                      placeholder='Año'
                      error={Boolean(errors.ano)}
                      aria-describedby='validation-async-ano'
                    />
                  )}
                />
                {errors.ano && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-ano'>
                    El Año del presupuesto es obligatorio(4 digitos)
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
              <DatePicker
                selected={getDateByObject(presupuestoSeleccionado.fechaDesdeObj!)}
                id='date-time-picker-desde'
                dateFormat='dd/MM/yyyy'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => handlerDesde(date)}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='Desde' />}
              />
            </Grid>

            <Grid item sm={3} xs={12}>
              <DatePicker
                selected={getDateByObject(presupuestoSeleccionado.fechaHastaObj!)}
                id='date-time-picker-hasta'
                dateFormat='dd/MM/yyyy'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => handlerHasta(date)}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='Hasta' />}
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <DatePicker
                selected={getDateByObject(presupuestoSeleccionado.fechaAprobacionObj!)}
                id='date-time-picker-aprobacion'
                dateFormat='dd/MM/yyyy'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => handlerFechaAprobacion(date)}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='Aprobacion' />}
              />
            </Grid>

            <Grid item sm={9} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='numeroOrdenanza'
                  control={control}
                  rules={{ maxLength: 20 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Numero Ordenanza'
                      onChange={onChange}
                      placeholder='Numero Ordenanza'
                      error={Boolean(errors.numeroOrdenanza)}
                      aria-describedby='validation-async-numeroOrdenanza'
                    />
                  )}
                />
                {errors.numeroOrdenanza && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-numeroOrdenanza'>
                    Maxima longitud 20 digitos
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item sm={3} xs={12}>
              <DatePicker
                selected={getDateByObject(presupuestoSeleccionado.fechaOrdenanzaObj!)}
                id='date-time-picker-ordenanza'
                dateFormat='dd/MM/yyyy'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => handlerFechaOrdenanza(date)}
                customInput={<CustomInput label='Fecha Ordenanza' />}
                placeholderText='Click to select a date'
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='extra1'
                  control={control}
                  rules={{ maxLength: 100 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Extra 1'
                      onChange={onChange}
                      placeholder='Extra 1'
                      error={Boolean(errors.extra1)}
                      aria-describedby='validation-async-extra1'
                    />
                  )}
                />
                {errors.extra1 && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-extra1'>
                    Maxima Longitud 100 Caracteres
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='extra2'
                  control={control}
                  rules={{ maxLength: 100 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Extra 2'
                      onChange={onChange}
                      placeholder='Extra 2'
                      error={Boolean(errors.extra2)}
                      aria-describedby='validation-async-extra2'
                    />
                  )}
                />
                {errors.extra2 && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-extra2'>
                    Maxima Longitud 100 Caracteres
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='extra3'
                  control={control}
                  rules={{ maxLength: 100 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Extra 3'
                      onChange={onChange}
                      placeholder='Extra 3'
                      error={Boolean(errors.extra3)}
                      aria-describedby='validation-async-extra3'
                    />
                  )}
                />
                {errors.extra3 && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-extra2'>
                    Maxima Longitud 100 Caracteres
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button size='large' type='submit' variant='contained'>
                {loading ? (
                  <CircularProgress
                    sx={{
                      color: 'common.white',
                      width: '20px !important',
                      height: '20px !important',
                      mr: theme => theme.spacing(2)
                    }}
                  />
                ) : null}
                Guardar
              </Button>
            </Grid>
          </Grid>
          <Box>
            {errorMessage.length > 0 && (
              <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{errorMessage}</FormHelperText>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormPresupuestoCreateAsync
