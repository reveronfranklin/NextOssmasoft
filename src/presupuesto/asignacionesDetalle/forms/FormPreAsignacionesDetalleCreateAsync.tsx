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
//import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports

//import { useDispatch } from 'react-redux'

import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

// ** Third Party Imports
//import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
//import CustomInput from '../../form-elements/pickers/PickersCustomInput'

// ** Types

import { useDispatch } from 'react-redux'

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'

import { getDateByObject } from 'src/utilities/ge-date-by-object'

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import dayjs from 'dayjs'
import { setPreAsignacionesDetalleSeleccionado, setTotalMonto } from 'src/store/apps/pre-asignaciones-detalle'
import { IPreAsignacionesDetalleUpdateDto } from 'src/interfaces/Presupuesto/PreAsignacionesDetalle/PreAsignacionesDetalleUpdateDto'
import { NumericFormat } from 'react-number-format'

interface FormInputs {
  codigoAsignacionDetalle: number
  codigoAsignacion: number
  fechaDesembolsoString: string
  monto: number
  notas: string
  searchText: string
}

const FormPreAsignacionesDetalleCreateAsync = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  // ** States
  const dispatch = useDispatch()

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  const { preAsignacionesDetalleSeleccionado, totalMonto } = useSelector(
    (state: RootState) => state.preAsignacionesDetalle
  )
  const { preAsignacionesSeleccionado } = useSelector((state: RootState) => state.preAsignaciones)
  const defaultValues = {
    codigoAsignacionDetalle: 0,
    codigoAsignacion: preAsignacionesSeleccionado.codigoAsignacion,
    monto: preAsignacionesDetalleSeleccionado.monto,
    notas: preAsignacionesDetalleSeleccionado.notas,
    fechaDesembolsoString: preAsignacionesDetalleSeleccionado.fechaDesembolsoString
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerFechaDesde = (desde: Date) => {
    const dateIsValid = dayjs(desde).isValid()
    if (dateIsValid) {
      const fechaObj: IFechaDto = fechaToFechaObj(desde)
      const presupuestoTmp = {
        ...setPreAsignacionesDetalleSeleccionado,
        fechaDesembolsoString: desde.toISOString(),
        fechaDesembolsoObj: fechaObj
      }
      dispatch(setPreAsignacionesDetalleSeleccionado(presupuestoTmp))
      setValue('fechaDesembolsoString', desde.toISOString())
    }
  }

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const handlerMonto = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)

    setValue('monto', valueInt)
  }

  const onSubmit = async (data: FormInputs) => {
    //const  now = dayjs();
    //const fechaIngreso=dayjs(data.fechaDesembolsoString)

    //const fechaPosterior = dayjs(fechaIngreso).isAfter(now );

    /*if(fechaPosterior==true){
      setErrorMessage('Fecha de Ingreso Invalida')

      return;
    }*/

    setLoading(true)

    const update: IPreAsignacionesDetalleUpdateDto = {
      codigoAsignacionDetalle: 0,
      codigoAsignacion: preAsignacionesSeleccionado.codigoAsignacion,
      monto: data.monto,
      notas: data.notas,
      fechaDesembolsoString: preAsignacionesDetalleSeleccionado.fechaDesembolsoString
    }
    console.log('update', update)
    const responseAll = await ossmmasofApi.post<any>('/PreAsignacionesDetalle/Create', update)

    if (responseAll.data.isValid) {
      dispatch(setTotalMonto(+data.monto + +totalMonto))
      setSuccessMessage('Desembolso actualizado satisfactoriamente')
      await delay(1500)
      setSuccessMessage('')

      //dispatch(setPreAsignacionesDetalleSeleccionado(responseAll.data.data))

      //dispatch(setVerPreAsignacionesDetalleActive(false));
    }

    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
  }
  useEffect(() => {
    const getData = async () => {
      setLoading(true)

      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader title='Pre - Crear Desembolso' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoAsignacionDetalle'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoAsignacionDetalle)}
                      aria-describedby='validation-async-codigoAdministrativo'
                      disabled
                    />
                  )}
                />
                {errors.codigoAsignacionDetalle && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoAsignacionDetalle'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item sm={3} xs={12}>
              <DatePicker
                selected={getDateByObject(preAsignacionesDetalleSeleccionado.fechaDesembolsoObj!)}
                id='date-time-picker-desde'
                dateFormat='dd/MM/yyyy'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => handlerFechaDesde(date)}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='Fecha Desembolso' />}
              />
            </Grid>

            {/* Presupuestado*/}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='monto'
                  control={control}
                  rules={{
                    required: false,
                    min: 0.001
                  }}
                  render={({ field: { value } }) => (
                    <NumericFormat
                      value={value}
                      customInput={TextField}
                      thousandSeparator='.'
                      decimalSeparator=','
                      allowNegative={false}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      label='Monto'
                      onValueChange={(values: any) => {
                        const { value } = values
                        handlerMonto(value)
                      }}
                      placeholder='Fides'
                      error={Boolean(errors.monto)}
                      aria-describedby='validation-async-monto'
                      inputProps={{
                        type: 'text'
                      }}
                    />
                  )}
                />
                {errors.monto && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-monto'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* descripcion*/}
            <Grid item sm={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='notas'
                  control={control}
                  rules={{ minLength: 5 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Notas'
                      onChange={onChange}
                      placeholder='noCuenta'
                      error={Boolean(errors.notas)}
                      aria-describedby='validation-async-noCuenta'
                    />
                  )}
                />
                {errors.notas && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-notas'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <NumericFormat
                sx={{ ml: 2, typography: 'body1' }}
                label='Total Desembolso:'
                disabled
                customInput={TextField}
                value={totalMonto}
                decimalSeparator=','
                decimalScale={2}
                thousandSeparator='.'
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <NumericFormat
                sx={{ ml: 2, typography: 'body1' }}
                label='Presupuestado:'
                disabled
                customInput={TextField}
                value={preAsignacionesSeleccionado.presupuestado}
                decimalSeparator=','
                decimalScale={2}
                thousandSeparator='.'
              />
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
          <Box>
            {successMessage.length > 0 && (
              <FormHelperText sx={{ color: 'success.main', fontSize: 20, mt: 4 }}>{successMessage}</FormHelperText>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormPreAsignacionesDetalleCreateAsync
