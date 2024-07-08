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
import { Autocomplete, Box } from '@mui/material'

// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports

import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'
import {
  setListpresupuestoDtoSeleccionado,
  setPreMtrDenominacionPucSeleccionado,
  setPreMtrUnidadEjecutoraSeleccionado
} from 'src/store/apps/presupuesto'
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'
import { fetchDataPreMtrDenominacionPuc, fetchDataPreMtrUnidadEjecutora } from 'src/store/apps/presupuesto/thunks'
import { FilterByPresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto'
import { IPreAsignacionesUpdateDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesUpdateDto'
import TableServerSideCreate from '../views/TableServerSideCreate'
import { setListPreAsignacionesCreate } from 'src/store/apps/pre-asignaciones'
import { NumericFormat } from 'react-number-format'

interface FormInputs {
  codigoAsignacion: number
  codigoPresupuesto: number
  codigoIcp: number
  codigoPuc: number
  presupuestado: number
  ordinario: number
  coordinado: number
  laee: number
  fides: number
}

const FormPreAsignacionesCreateAsync = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  // ** States
  const dispatch = useDispatch()

  const { listpresupuestoDto, preMtrUnidadEjecutora, preMtrDenominacionPuc, listpresupuestoDtoSeleccionado } =
    useSelector((state: RootState) => state.presupuesto)
  const { preAsignacionesSeleccionado, listPreAsignacionesCreate } = useSelector(
    (state: RootState) => state.preAsignaciones
  )

  const getPresupuesto = (id: number) => {
    const result = listpresupuestoDto?.filter(elemento => {
      return elemento.codigoPresupuesto == id
    })

    return result[0]
  }

  const getIcp = (id: number) => {
    const result = preMtrUnidadEjecutora?.filter(elemento => {
      return elemento.codigoIcp == id
    })

    return result[0]
  }
  const getPuc = (id: number) => {
    const result = preMtrDenominacionPuc?.filter(elemento => {
      return elemento.codigoPuc == id
    })

    return result[0]
  }

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [presupuesto, setPresupuesto] = useState<IListPresupuestoDto>(
    getPresupuesto(preAsignacionesSeleccionado.codigoPresupuesto)
  )
  const [icp, setIcp] = useState<IListPreMtrUnidadEjecutora>(getIcp(preAsignacionesSeleccionado.codigoIcp))
  const [puc, setPuc] = useState<IListPreMtrDenominacionPuc>(getPuc(preAsignacionesSeleccionado.codigoPuc))

  const defaultValues = {
    codigoAsignacion: preAsignacionesSeleccionado.codigoAsignacion,
    codigoPresupuesto: preAsignacionesSeleccionado.codigoPresupuesto,
    codigoIcp: preAsignacionesSeleccionado.codigoIcp,
    codigoPuc: preAsignacionesSeleccionado.codigoPuc,
    presupuestado: preAsignacionesSeleccionado.presupuestado,
    ordinario: preAsignacionesSeleccionado.ordinario,
    coordinado: preAsignacionesSeleccionado.coordinado,
    laee: preAsignacionesSeleccionado.laee,
    fides: preAsignacionesSeleccionado.fides
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })



  const handlerPresupuestado = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)

    setValue('presupuestado', valueInt)
  }
  const handlerOrdinario = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)

    setValue('ordinario', valueInt)
  }

  const handlerCoordinado = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)

    setValue('coordinado', valueInt)
  }

  const handlerLaee = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)

    setValue('laee', valueInt)
  }
  const handlerFides = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)

    setValue('fides', valueInt)
  }

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)
    setErrorMessage('')
    const updateAsignacion: IPreAsignacionesUpdateDto = {
      codigoAsignacion: preAsignacionesSeleccionado.codigoAsignacion,
      codigoPresupuesto: data.codigoPresupuesto,
      codigoIcp: data.codigoIcp,
      codigoPuc: data.codigoPuc,
      presupuestado: data.presupuestado,
      ordinario: data.ordinario,
      coordinado: data.coordinado,
      laee: data.laee,
      fides: data.fides
    }

    console.log('updateConceptoAcumulado', updateAsignacion)
    const responseAll = await ossmmasofApi.post<any>('/PreAsignaciones/Create', updateAsignacion)
    if (responseAll.data.isValid) {
      console.log('registro agregado', responseAll.data.data)

      const copyAsignaciones = [...listPreAsignacionesCreate]
      copyAsignaciones.push(responseAll.data.data)
      dispatch(setListPreAsignacionesCreate(copyAsignaciones))
    }
    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Actualizado')
  }

  const handlePresupuestos = async (e: any, value: any) => {
    if (value) {
      dispatch(setListpresupuestoDtoSeleccionado(value))
      setValue('codigoPresupuesto', value.codigoPresupuesto)
      setPresupuesto(value)
      const filter: FilterByPresupuestoDto = {
        codigoPresupuesto: value.codigoPresupuesto
      }

      await fetchDataPreMtrDenominacionPuc(dispatch, filter)
      await fetchDataPreMtrUnidadEjecutora(dispatch, filter)
    } else {
      const presupuesto: IListPresupuestoDto = {
        ano: 0,
        codigoPresupuesto: 0,
        descripcion: '',
        preFinanciadoDto: [],
        presupuestoEnEjecucion: false
      }

      dispatch(setListpresupuestoDtoSeleccionado(presupuesto))
    }
  }

  const handlerDenominacionPuc = (e: any, value: any) => {
    if (value) {
      dispatch(setPreMtrDenominacionPucSeleccionado(value))
      setValue('codigoPuc', value.codigoPuc)
      setPuc(value)
    } else {
      const denominacionPuc: IListPreMtrDenominacionPuc = {
        id: 0,
        codigoPuc: 0,
        codigoPucConcat: '',
        denominacionPuc: '',
        dercripcion: ''
      }

      dispatch(setPreMtrDenominacionPucSeleccionado(denominacionPuc))
    }
  }

  const handlerUnidadEjecutora = (e: any, value: any) => {
    if (value) {
      dispatch(setPreMtrUnidadEjecutoraSeleccionado(value))
      setValue('codigoIcp', value.codigoIcp)
      setIcp(value)
    } else {
      const unidadEjecutora: IListPreMtrUnidadEjecutora = {
        id: 0,

        codigoIcp: 0,

        codigoIcpConcat: '',

        unidadEjecutora: '',

        dercripcion: ''
      }

      dispatch(setPreMtrUnidadEjecutoraSeleccionado(unidadEjecutora))
    }
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true)

      const filter: FilterByPresupuestoDto = {
        codigoPresupuesto: listpresupuestoDtoSeleccionado.codigoPresupuesto
      }

      //await fetchDataListPresupuestoDto(dispatch);

      await fetchDataPreMtrDenominacionPuc(dispatch, filter)
      await fetchDataPreMtrUnidadEjecutora(dispatch, filter)

      setLoading(false)
    }

    console.log(popperPlacement)

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader title='PRE - Crear Credito Presupuestario' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* codigoConceptoAcumula */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoAsignacion'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoAsignacion)}
                      aria-describedby='validation-async-codigoAsignacion'
                      disabled
                    />
                  )}
                />
                {errors.codigoAsignacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoAsignacion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Concepto Presupuesto */}
            <Grid item sm={10} xs={12}>
              <Autocomplete
                options={listpresupuestoDto}
                value={presupuesto}
                id='autocomplete-concepto'
                isOptionEqualToValue={(option, value) => option.codigoPresupuesto === value.codigoPresupuesto}
                getOptionLabel={option => option.codigoPresupuesto + '-' + option.descripcion}
                onChange={handlePresupuestos}
                renderInput={params => <TextField {...params} label='Presupuesto' />}
              />
            </Grid>

            {/* ICP */}
            <Grid item sm={12} xs={12}>
              <Autocomplete
                options={preMtrUnidadEjecutora}
                value={icp}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                id='autocomplete-concepto'
                getOptionLabel={option => option.dercripcion + '-' + option.id}
                onChange={handlerUnidadEjecutora}
                renderInput={params => <TextField {...params} label='Unidad Ejecutora' />}
              />
            </Grid>

            {/* PUC */}
            <Grid item sm={12} xs={12}>
              <Autocomplete
                value={puc}
                options={preMtrDenominacionPuc}
                id='autocomplete-preMtrDenominacionPuc'
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={option => option.dercripcion + '-' + option.id + '' + option.codigoPuc}
                onChange={handlerDenominacionPuc}
                renderInput={params => <TextField {...params} label='Puc' />}
              />
            </Grid>
              {/* Presupuestado*/}
              <Grid item sm={2} xs={12}>
            <FormControl fullWidth>
                                  <Controller
                                      name='presupuestado'
                                      control={control}
                                      rules={{
                                          required: false,
                                          min: 0.001,
                                      }}
                                      render={({ field: { value } }) => (
                                          <NumericFormat
                                              value={value}
                                              customInput={TextField}
                                              thousandSeparator="."
                                              decimalSeparator=","
                                              allowNegative={false}
                                              decimalScale={2}
                                              fixedDecimalScale={true}
                                              label="Presupuestado"
                                              onValueChange={(values: any) => {
                                                  const { value } = values
                                                  handlerPresupuestado(value)
                                              }}
                                              placeholder='Presupuestado'
                                              error={Boolean(errors.presupuestado)}
                                              aria-describedby='validation-async-presupuestado'
                                              inputProps={{
                                                  type: 'text',
                                              }}
                                          />
                                      )}
                                  />
                                  {errors.presupuestado && (
                                      <FormHelperText sx={{ color: 'error.main' }} id='validation-async-presupuestado'>
                                          This field is required
                                      </FormHelperText>
                                  )}
              </FormControl>
            </Grid>
            {/* Ordinario*/}
            <Grid item sm={2} xs={12}>
            <FormControl fullWidth>
                                  <Controller
                                      name='ordinario'
                                      control={control}
                                      rules={{
                                          required: false,
                                          min: 0.001,
                                      }}
                                      render={({ field: { value } }) => (
                                          <NumericFormat
                                              value={value}
                                              customInput={TextField}
                                              thousandSeparator="."
                                              decimalSeparator=","
                                              allowNegative={false}
                                              decimalScale={2}
                                              fixedDecimalScale={true}
                                              label="Ordinario"
                                              onValueChange={(values: any) => {
                                                  const { value } = values
                                                  handlerOrdinario(value)
                                              }}
                                              placeholder='ordinario'
                                              error={Boolean(errors.ordinario)}
                                              aria-describedby='validation-async-ordinario'
                                              inputProps={{
                                                  type: 'text',
                                              }}
                                          />
                                      )}
                                  />
                                  {errors.ordinario && (
                                      <FormHelperText sx={{ color: 'error.main' }} id='validation-async-ordinario'>
                                          This field is required
                                      </FormHelperText>
                                  )}
              </FormControl>
            </Grid>
            {/* coordinado*/}
            <Grid item sm={2} xs={12}>
            <FormControl fullWidth>
                                  <Controller
                                      name='coordinado'
                                      control={control}
                                      rules={{
                                          required: false,
                                          min: 0.001,
                                      }}
                                      render={({ field: { value } }) => (
                                          <NumericFormat
                                              value={value}
                                              customInput={TextField}
                                              thousandSeparator="."
                                              decimalSeparator=","
                                              allowNegative={false}
                                              decimalScale={2}
                                              fixedDecimalScale={true}
                                              label="Coordinado"
                                              onValueChange={(values: any) => {
                                                  const { value } = values
                                                  handlerCoordinado(value)
                                              }}
                                              placeholder='Coordinado'
                                              error={Boolean(errors.coordinado)}
                                              aria-describedby='validation-async-coordinado'
                                              inputProps={{
                                                  type: 'text',
                                              }}
                                          />
                                      )}
                                  />
                                  {errors.coordinado && (
                                      <FormHelperText sx={{ color: 'error.main' }} id='validation-async-coordinado'>
                                          This field is required
                                      </FormHelperText>
                                  )}
              </FormControl>
            </Grid>
            {/* LAEE*/}
            <Grid item sm={2} xs={12}>
            <FormControl fullWidth>
                                  <Controller
                                      name='laee'
                                      control={control}
                                      rules={{
                                          required: false,
                                          min: 0.001,
                                      }}
                                      render={({ field: { value } }) => (
                                          <NumericFormat
                                              value={value}
                                              customInput={TextField}
                                              thousandSeparator="."
                                              decimalSeparator=","
                                              allowNegative={false}
                                              decimalScale={2}
                                              fixedDecimalScale={true}
                                              label="Laee"
                                              onValueChange={(values: any) => {
                                                  const { value } = values
                                                  handlerLaee(value)
                                              }}
                                              placeholder='Laee'
                                              error={Boolean(errors.laee)}
                                              aria-describedby='validation-async-laee'
                                              inputProps={{
                                                  type: 'text',
                                              }}
                                          />
                                      )}
                                  />
                                  {errors.laee && (
                                      <FormHelperText sx={{ color: 'error.main' }} id='validation-async-laee'>
                                          This field is required
                                      </FormHelperText>
                                  )}
              </FormControl>
            </Grid>
            {/* fides*/}
            <Grid item sm={2} xs={12}>
            <FormControl fullWidth>
                                  <Controller
                                      name='fides'
                                      control={control}
                                      rules={{
                                          required: false,
                                          min: 0.001,
                                      }}
                                      render={({ field: { value } }) => (
                                          <NumericFormat
                                              value={value}
                                              customInput={TextField}
                                              thousandSeparator="."
                                              decimalSeparator=","
                                              allowNegative={false}
                                              decimalScale={2}
                                              fixedDecimalScale={true}
                                              label="Fides"
                                              onValueChange={(values: any) => {
                                                  const { value } = values
                                                  handlerFides(value)
                                              }}
                                              placeholder='Fides'
                                              error={Boolean(errors.laee)}
                                              aria-describedby='validation-async-fides'
                                              inputProps={{
                                                  type: 'text',
                                              }}
                                          />
                                      )}
                                  />
                                  {errors.fides && (
                                      <FormHelperText sx={{ color: 'error.main' }} id='validation-async-fides'>
                                          This field is required
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

      <TableServerSideCreate></TableServerSideCreate>
    </Card>
  )
}

export default FormPreAsignacionesCreateAsync
