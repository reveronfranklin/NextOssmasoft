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

import { getDateByObject } from 'src/utilities/ge-date-by-object'

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import dayjs from 'dayjs'
import { setRhPeriodoSeleccionado, setVerRhPeriodoActive } from 'src/store/apps/rh-periodo'
import { IRhTiposNominaResponseDto } from 'src/interfaces/rh/TipoNomina/RhTiposNominaResponseDto'
import { IRhPeriodosUpdate } from 'src/interfaces/rh/Periodos/RhPeriodosUpdate'

interface FormInputs {
  codigoPeriodo: number
  descripcion: string
  codigoTipoNomina: number
  fechaNomina: Date
  fechaNominaString: string
  fechaNominaObj: IFechaDto | null
  periodo: number
  tipoNomina: string
  fechaCierreString: string
}

const FormRhPeriodoCreateAsync = ({
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
  const listPeriodo = [
    { id: 1, descripcion: '1ra. Quincena' },
    { id: 2, descripcion: '2da. Quincena' }
  ]
  const listTipoNomina = [
    { id: 'N', descripcion: 'Normal' },
    { id: 'E', descripcion: 'Especial' }
  ]

  const { rhPeriodoSeleccionado } = useSelector((state: RootState) => state.rhPeriodo)
  const { listRhTipoNomina } = useSelector((state: RootState) => state.rhTipoNomina)
  const defaultValues = {
    codigoPeriodo: rhPeriodoSeleccionado.codigoPeriodo,
    descripcion: rhPeriodoSeleccionado.descripcion,
    codigoTipoNomina: rhPeriodoSeleccionado.codigoTipoNomina,
    fechaNomina: rhPeriodoSeleccionado.fechaNomina,
    fechaNominaString: rhPeriodoSeleccionado.fechaNominaString,
    fechaNominaObj: rhPeriodoSeleccionado.fechaNominaObj,
    periodo: rhPeriodoSeleccionado.periodo,
    tipoNomina: rhPeriodoSeleccionado.tipoNomina,
    fechaCierreString: rhPeriodoSeleccionado.fechaCierreString
  }

  const getTipoNomina = (id: string) => {
    const result = listTipoNomina?.filter(elemento => {
      return elemento.id == id
    })

    return result[0]
  }
  const getPeriodo = (id: number) => {
    const result = listPeriodo?.filter(elemento => {
      return elemento.id == id
    })

    return result[0]
  }

  const getCodigoTipoNomina = (id: number) => {
    const result = listRhTipoNomina?.filter(elemento => {
      return elemento.codigoTipoNomina == id
    })

    return result[0]
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })
  const [tipoNomina, setTipoNomina] = useState<any>(getTipoNomina(rhPeriodoSeleccionado.tipoNomina))
  const [periodo, setPeriodo] = useState<any>(getPeriodo(rhPeriodoSeleccionado.periodo))
  const [codigoNomina, setCodigoTipoNomina] = useState<IRhTiposNominaResponseDto>(
    getCodigoTipoNomina(rhPeriodoSeleccionado.codigoTipoNomina)
  )

  const handlerCodigoTipoNomina = async (e: any, value: any) => {
    if (value != null) {
      setValue('codigoTipoNomina', value.codigoTipoNomina)
      setCodigoTipoNomina(value)
    } else {
      setValue('codigoTipoNomina', 0)
    }
  }

  const handlerFechaDesde = (desde: Date) => {
    const dateIsValid = dayjs(desde).isValid()
    if (dateIsValid) {
      const fechaObj: IFechaDto = fechaToFechaObj(desde)
      const presupuestoTmp = {
        ...rhPeriodoSeleccionado,
        fechaNominaString: desde.toISOString(),
        fechaNominaObj: fechaObj,
        fechaNomina: desde
      }
      dispatch(setRhPeriodoSeleccionado(presupuestoTmp))
      setValue('fechaNominaString', desde.toISOString())
      setValue('fechaNomina', desde)
      setValue('fechaNominaObj', fechaObj)
    }
  }

  const handlerPeriodo = async (e: any, value: any) => {
    if (value != null) {
      setValue('periodo', value.id)
      setPeriodo(value)
    } else {
      setValue('periodo', 0)
    }
  }
  const handlerTipoNomina = async (e: any, value: any) => {
    if (value != null) {
      setValue('tipoNomina', value.id)
      setTipoNomina(value)
    } else {
      setValue('tipoNomina', '')
    }
  }
  const onSubmit = async (data: FormInputs) => {
    setLoading(true)

    const update: IRhPeriodosUpdate = {
      codigoPeriodo: 0,
      descripcion: data.descripcion,
      codigoTipoNomina: data.codigoTipoNomina,
      fechaNomina: rhPeriodoSeleccionado.fechaNomina,
      fechaNominaString: rhPeriodoSeleccionado.fechaNominaString,
      fechaNominaObj: rhPeriodoSeleccionado.fechaNominaObj,
      periodo: data.periodo,
      tipoNomina: data.tipoNomina
    }

    const responseAll = await ossmmasofApi.post<any>('/RhPeriodosNomina/Create', update)

    if (responseAll.data.isValid) {
      // dispatch(setPreAsignacionesDetalleSeleccionado(responseAll.data.data))
      console.log(responseAll.data)
      dispatch(setVerRhPeriodoActive(false))
    }

    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
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
      <CardHeader title='Pre - Modificar Periodo' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* Id */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoPeriodo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoPeriodo)}
                      aria-describedby='validation-async-codigoPeriodo'
                      disabled
                    />
                  )}
                />
                {errors.codigoPeriodo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoPeriodo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Tipo Nomina */}
            <Grid item sm={10} xs={12}>
              <Autocomplete
                options={listRhTipoNomina}
                value={codigoNomina}
                id='autocomplete-padre'
                isOptionEqualToValue={(option, value) => option.codigoTipoNomina === value.codigoTipoNomina}
                getOptionLabel={option => option.codigoTipoNomina + '-' + option.descripcion}
                onChange={handlerCodigoTipoNomina}
                renderInput={params => <TextField {...params} label='Tipo Nomina' />}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <DatePicker
                selected={getDateByObject(rhPeriodoSeleccionado.fechaNominaObj!)}
                id='date-time-picker-fechaNomina'
                dateFormat='dd/MM/yyyy'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => handlerFechaDesde(date)}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='Fecha Nomina' />}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <DatePicker
                selected={getDateByObject(rhPeriodoSeleccionado.fechaPrenominaObj!)}
                id='date-time-picker-preNomina'
                readOnly
                dateFormat='dd/MM/yyyy'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => handlerFechaDesde(date)}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='Fecha Pre-Nomina' />}
              />
            </Grid>
            {/* Id */}
            <Grid item sm={4} xs={12}>
              <DatePicker
                selected={getDateByObject(rhPeriodoSeleccionado.fechaCierreObj!)}
                id='date-time-picker-preCierre'
                readOnly
                dateFormat='dd/MM/yyyy'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => handlerFechaDesde(date)}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='Fecha Cierre' />}
              />
            </Grid>

            {/* descripcion*/}
            <Grid item sm={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='descripcion'
                  control={control}
                  rules={{ required: true, minLength: 5 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Descripcion'
                      onChange={onChange}
                      placeholder='Descripcion'
                      error={Boolean(errors.descripcion)}
                      aria-describedby='validation-async-noCuenta'
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

            {/* Periodo */}
            <Grid item sm={4} xs={12}>
              <Autocomplete
                options={listPeriodo}
                value={periodo}
                id='autocomplete-periodo'
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={option => option.id + '-' + option.descripcion}
                onChange={handlerPeriodo}
                renderInput={params => <TextField {...params} label='Periodo' />}
              />
            </Grid>
            {/* Periodo */}
            <Grid item sm={4} xs={12}>
              <Autocomplete
                options={listTipoNomina}
                value={tipoNomina}
                id='autocomplete-tipoNomina'
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={option => option.id + '-' + option.descripcion}
                onChange={handlerTipoNomina}
                renderInput={params => <TextField {...params} label='Periodo' />}
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
        </form>
      </CardContent>
    </Card>
  )
}

export default FormRhPeriodoCreateAsync
