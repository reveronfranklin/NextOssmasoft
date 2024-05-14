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
import { setPreSolModificacionSeleccionado, setVerPreSolModificacionActive } from 'src/store/apps/pre-sol-modificacion'
import { IPreSolModificacionUpdateDto } from 'src/interfaces/Presupuesto/PreSolicitudModificacion/PreSolModificacionUpdateDto'
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'
import { setPreMtrUnidadEjecutoraSeleccionado } from 'src/store/apps/presupuesto'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva'

interface FormInputs {
  codigoSolModificacion: number
  tipoModificacionId: number
  fechaSolicitud: Date | null
  fechaSolicitudString: string
  fechaSolicitudObj: IFechaDto | null
  numeroSolModificacion: string
  codigoOficio: string
  codigoSolicitante: number
  motivo: string
  numeroCorrelativo: number
  codigoPresupuesto: number
  statusProceso: string
}

const FormPreSolModificacionCreateAsync = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  // ** States
  const dispatch = useDispatch()

  const getIcp = (id: number) => {
    const result = preMtrUnidadEjecutora?.filter(elemento => {
      return elemento.codigoIcp == id
    })

    return result[0]
  }
  const getTipoModificacion = (id: number) => {
    const result = listTipoModificacion?.filter(elemento => {
      return elemento.id == id
    })

    return result[0]
  }

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { preSolModificacionSeleccionado, listTipoModificacion } = useSelector(
    (state: RootState) => state.preSolModificacion
  )
  const { listpresupuestoDtoSeleccionado, preMtrUnidadEjecutora } = useSelector((state: RootState) => state.presupuesto)
  const [tipoModificacion, setTipoModificacion] = useState<ISelectListDescriptiva>(
    getTipoModificacion(preSolModificacionSeleccionado.tipoModificacionId)
  )

  const [icp, setIcp] = useState<IListPreMtrUnidadEjecutora>(getIcp(preSolModificacionSeleccionado.codigoSolicitante))

  const defaultValues = {
    codigoSolModificacion: preSolModificacionSeleccionado.codigoSolModificacion,
    tipoModificacionId: preSolModificacionSeleccionado.tipoModificacionId,
    fechaSolicitud: preSolModificacionSeleccionado.fechaSolicitud,
    fechaSolicitudString: preSolModificacionSeleccionado.fechaSolicitudString,
    fechaSolicitudObj: preSolModificacionSeleccionado.fechaSolicitudObj,
    numeroSolModificacion: preSolModificacionSeleccionado.numeroSolModificacion,
    codigoOficio: preSolModificacionSeleccionado.codigoOficio,
    codigoSolicitante: preSolModificacionSeleccionado.codigoSolicitante,
    motivo: preSolModificacionSeleccionado.motivo,
    numeroCorrelativo: preSolModificacionSeleccionado.numeroCorrelativo,
    codigoPresupuesto: listpresupuestoDtoSeleccionado.codigoPresupuesto,
    statusProceso: preSolModificacionSeleccionado.statusProceso
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
      const solTmp = {
        ...preSolModificacionSeleccionado,
        fechaSolicitud: desde,
        fechaSolicitudString: desde.toISOString(),
        fechaSolicitudObj: fechaObj
      }
      dispatch(setPreSolModificacionSeleccionado(solTmp))
      setValue('fechaSolicitudString', desde.toISOString())
    }
  }

  const handlerUnidadEjecutora = (e: any, value: any) => {
    if (value) {
      dispatch(setPreMtrUnidadEjecutoraSeleccionado(value))
      setValue('codigoSolicitante', value.codigoIcp)

      const solTmp = {
        ...preSolModificacionSeleccionado,
        codigoSolicitante: value.codigoIcp
      }
      dispatch(setPreSolModificacionSeleccionado(solTmp))
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

  const handlerTipoModificacion = async (e: any, value: any) => {
    if (value != null) {
      setValue('tipoModificacionId', value.id)
      setTipoModificacion(value)
    } else {
      setValue('tipoModificacionId', 0)
    }
  }
  const onSubmit = async (data: FormInputs) => {
    const now = dayjs()
    const fechaIngreso = dayjs(data.fechaSolicitudString)
    const fechaPosterior = dayjs(fechaIngreso).isAfter(now)
    if (fechaPosterior == true) {
      setErrorMessage('Fecha Invalida')

      return
    }
    setLoading(true)

    const update: IPreSolModificacionUpdateDto = {
      codigoSolModificacion: 0,
      tipoModificacionId: data.tipoModificacionId,
      fechaSolicitud: preSolModificacionSeleccionado.fechaSolicitud,
      fechaSolicitudString: preSolModificacionSeleccionado.fechaSolicitudString,
      fechaSolicitudObj: preSolModificacionSeleccionado.fechaSolicitudObj,
      numeroSolModificacion: data.numeroSolModificacion,
      codigoSolicitante: data.codigoSolicitante,
      motivo: data.motivo,
      numeroCorrelativo: data.numeroCorrelativo,
      codigoPresupuesto: listpresupuestoDtoSeleccionado.codigoPresupuesto
    }

    const responseAll = await ossmmasofApi.post<any>('/PreSolModificacion/Create', update)

    if (responseAll.data.isValid) {
      // dispatch(setPreAsignacionesDetalleSeleccionado(responseAll.data.data))

      dispatch(setVerPreSolModificacionActive(false))
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
      <CardHeader title='Pre - Mod. Solicitud de Modificación' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoSolModificacion'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoSolModificacion)}
                      aria-describedby='validation-async-codigoAdministrativo'
                      disabled
                    />
                  )}
                />
                {errors.codigoSolModificacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoAsignacionDetalle'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* statusProceso */}
            <Grid item sm={10} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='statusProceso'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Estatus'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.statusProceso)}
                      aria-describedby='validation-async-statusProceso'
                      disabled
                    />
                  )}
                />
                {errors.statusProceso && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-statusProceso'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Banco */}
            <Grid item sm={12} xs={12}>
              <Autocomplete
                options={listTipoModificacion}
                value={tipoModificacion}
                id='autocomplete-tipo'
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={option => option.id + '-' + option.descripcion}
                onChange={handlerTipoModificacion}
                renderInput={params => <TextField {...params} label='Tipo Modificacion' />}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <DatePicker
                selected={getDateByObject(preSolModificacionSeleccionado.fechaSolicitudObj!)}
                id='date-time-picker-desde'
                dateFormat='dd/MM/yyyy'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => handlerFechaDesde(date)}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='Fecha Solicitud' />}
              />
            </Grid>
            {/* ICP */}
            <Grid item sm={8} xs={12}>
              <Autocomplete
                options={preMtrUnidadEjecutora}
                value={icp}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                id='autocomplete-concepto'
                getOptionLabel={option => option.dercripcion + '-' + option.id}
                onChange={handlerUnidadEjecutora}
                renderInput={params => <TextField {...params} label='Unidad Solicitante' />}
              />
            </Grid>
            {/* numeroSolModificacion*/}
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='numeroSolModificacion'
                  control={control}
                  rules={{ minLength: 5 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Numero Sol-Modificacion'
                      onChange={onChange}
                      placeholder='Numero Sol-Modificacion'
                      error={Boolean(errors.numeroSolModificacion)}
                      aria-describedby='validation-async-motivo'
                    />
                  )}
                />
                {errors.numeroSolModificacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-numeroSolModificacion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* codigoOficio*/}
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoOficio'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Codigo Oficio'
                      onChange={onChange}
                      placeholder='Codigo Oficio'
                      error={Boolean(errors.codigoOficio)}
                      disabled
                      aria-describedby='validation-async-codigoOficio'
                    />
                  )}
                />
                {errors.codigoOficio && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoOficio'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* numeroCorrelativo*/}
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='numeroCorrelativo'
                  control={control}
                  rules={{ minLength: 5 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Numero Correlativo'
                      onChange={onChange}
                      type='number'
                      placeholder='Numero Correlativo'
                      error={Boolean(errors.numeroCorrelativo)}
                      aria-describedby='validation-async-codigoOficio'
                    />
                  )}
                />
                {errors.numeroCorrelativo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-numeroCorrelativo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* motivo*/}
            <Grid item sm={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='motivo'
                  control={control}
                  rules={{ minLength: 5 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      multiline
                      maxRows={4}
                      label='Motivo'
                      onChange={onChange}
                      placeholder='motivo'
                      error={Boolean(errors.motivo)}
                      aria-describedby='validation-async-motivo'
                    />
                  )}
                />
                {errors.motivo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-motivo'>
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
    </Card>
  )
}

export default FormPreSolModificacionCreateAsync
