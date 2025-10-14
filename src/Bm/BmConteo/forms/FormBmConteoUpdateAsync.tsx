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
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Third Party Imports

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
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports

import { IPersonaDto } from 'src/interfaces/rh/i-rh-persona-dto'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { IBmConteoUpdateDto } from 'src/interfaces/Bm/BmConteo/BmConteoUpdateDto'
import {
  setBmConteoSeleccionado,
  setListBmConteoDetalleResponseDto,
  setListBmConteoResponseDto,
  setVerBmConteoActive
} from 'src/store/apps/bmConteo'
import { ISelectListDescriptiva } from 'src/interfaces/rh/ISelectListDescriptiva'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { IBmConteoDeleteDto } from 'src/interfaces/Bm/BmConteo/BmConteoDeleteDto'
import { IBmConteoCerrarDto } from 'src/interfaces/Bm/BmConteo/BmConteoCerrarDto'
import { setListIcp } from 'src/store/apps/ICP'

interface FormInputs {
  codigoBmConteo: number
  titulo: string
  comentario: string
  codigoPersonaResponsable: number
  conteoId: number
  fecha: Date | null
  fechaString: string
  fechaObj: IFechaDto | null
  totalCantidad: number
}

const FormBmConteoUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch()

  const { bmConteoSeleccionado, listConteoDescriptiva } = useSelector((state: RootState) => state.bmConteo)
  const { personasDto } = useSelector((state: RootState) => state.nomina)

  const getConteo = (id: number) => {
    const result = listConteoDescriptiva?.filter((elemento: any) => {
      return elemento.id == id
    })

    return result[0]
  }

  const getPersona = (id: number) => {
    const result = personasDto?.filter((elemento: any) => {
      return elemento.codigoPersona == id
    })

    return result[0]
  }

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [openCerrarButton, setOpenCerrarButton] = useState(false)

  const [personas, setPersonas] = useState<IPersonaDto[]>([])
  const [persona, setPersona] = useState<IPersonaDto>(getPersona(bmConteoSeleccionado.codigoPersonaResponsable))
  const [conteos, setConteos] = useState<ISelectListDescriptiva[]>([])
  const [conteo, setConteo] = useState<any>(getConteo(bmConteoSeleccionado.conteoId))
  const defaultValues = {
    codigoBmConteo: bmConteoSeleccionado.codigoBmConteo,
    titulo: bmConteoSeleccionado.titulo,
    comentario: bmConteoSeleccionado.comentario,
    codigoPersonaResponsable: bmConteoSeleccionado.codigoPersonaResponsable,
    conteoId: bmConteoSeleccionado.conteoId,
    fecha: bmConteoSeleccionado.fecha,
    fechaString: bmConteoSeleccionado.fechaString,
    fechaObj: bmConteoSeleccionado.fechaObj,
    totalCantidad: bmConteoSeleccionado.totalCantidad,
    replicarComentario: false
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerConteo = async (e: any, value: any) => {
    if (value != null) {
      setValue('conteoId', value.id)
      setConteo(value)
    } else {
      setValue('conteoId', 0)
    }
  }

  const handlerFechaDesde = (desde: Date) => {
    const fechaObj: IFechaDto = fechaToFechaObj(desde)
    const conteoTmp = { ...bmConteoSeleccionado, fechaString: desde.toISOString(), fechaObj: fechaObj, fecha: desde }
    dispatch(setBmConteoSeleccionado(conteoTmp))
    setValue('fechaString', desde.toISOString())
    setValue('fecha', desde)
    setValue('fechaObj', fechaObj)
  }

  const handlerPersona = async (e: any, value: any) => {
    if (value && value.codigoPersona > 0) {
      setValue('codigoPersonaResponsable', value.codigoPersona)
      setPersona(value)

      /*const filter={codigoPersona:value.codigoPersona}
      const responseAll= await ossmmasofApi.post<IPersonaDto>('/RhPersona/GetPersona',filter);
      dispatch(setPersonaSeleccionado(responseAll.data));
      dispatch(setPersonasDtoSeleccionado(responseAll.data));*/
    } else {
      setValue('codigoPersonaResponsable', 0)
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpenCerrarButton = () => {
    setOpenCerrarButton(true)
  }

  const handleCloseCerrarButton = () => {
    setOpenCerrarButton(false)
  }

  const handleDelete = async () => {
    setOpen(false)
    setLoading(true)
    setErrorMessage('')

    const deleteConteo: IBmConteoDeleteDto = {
      codigoBmConteo: bmConteoSeleccionado.codigoBmConteo
    }
    const responseAll = await ossmmasofApi.post<any>('/BmConteo/Delete', deleteConteo)
    setErrorMessage(responseAll.data.message)
    if (responseAll.data.isValid) {
      dispatch(setVerBmConteoActive(false))
      dispatch(setBmConteoSeleccionado({}))
    }
    setErrorMessage(responseAll.data.message)
    setLoading(false)
  }

  const handleCerrar = async () => {
    setOpenCerrarButton(false)
    setLoading(true)
    setErrorMessage('')

    const deleteConteo: IBmConteoCerrarDto = {
      codigoBmConteo: bmConteoSeleccionado.codigoBmConteo,
      comentario: getValues('comentario')
    }
    const responseAll = await ossmmasofApi.post<any>('/BmConteo/CerrarConteo', deleteConteo)
    setErrorMessage(responseAll.data.message)
    if (responseAll.data.isValid) {
      dispatch(setVerBmConteoActive(false))
      dispatch(setBmConteoSeleccionado({}))
      dispatch(setListBmConteoDetalleResponseDto([]))
    }
    setErrorMessage(responseAll.data.message)
    setLoading(false)
  }

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)
    setErrorMessage('')
    const updateDto: IBmConteoUpdateDto = {
      codigoBmConteo: data.codigoBmConteo,
      titulo: data.titulo,
      comentario: data.comentario,
      codigoPersonaResponsable: data.codigoPersonaResponsable,
      conteoId: data.conteoId,
      fecha: data.fecha,
      fechaString: data.fechaString,
      fechaObj: data.fechaObj,
      listIcpSeleccionado: []
    }

    console.log('updateDto', updateDto)

    const responseAll = await ossmmasofApi.post<any>('/BmConteo/Update', updateDto)

    if (responseAll.data.isValid) {
      dispatch(setListBmConteoResponseDto(responseAll.data.data))

      dispatch(setVerBmConteoActive(false))
    }
    setErrorMessage(responseAll.data.message)
    setLoading(false)
  }
  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      console.log(popperPlacement)

      setConteos(listConteoDescriptiva)

      setPersonas(personasDto)
      const responseIcps = await ossmmasofApi.get<any>('/Bm1/GetListICP')
      dispatch(setListIcp(responseIcps.data.data))
      console.log('responseIcps.data', responseIcps.data.data)

      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader title='BM- Conteo' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoBmConteo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoBmConteo)}
                      aria-describedby='validation-async-codigoBmConteo'
                      disabled
                    />
                  )}
                />
                {errors.codigoBmConteo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoBmConteo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Titulo */}
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='titulo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Titulo'
                      onChange={onChange}
                      placeholder='Titulo'
                      error={Boolean(errors.titulo)}
                      aria-describedby='validation-async-titulo'
                    />
                  )}
                />
                {errors.titulo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-titulo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item sm={4} xs={12}>
              <DatePicker
                selected={getDateByObject(bmConteoSeleccionado.fechaObj!)}
                id='date-time-picker-desde'
                dateFormat='dd/MM/yyyy'
                popperPlacement={popperPlacement}
                onChange={(date: Date) => handlerFechaDesde(date)}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='Fecha' />}
              />
            </Grid>

            {/* status */}
            <Grid item sm={10} xs={12}>
              <Autocomplete
                options={personas}
                value={persona}
                id='autocomplete-persona'
                isOptionEqualToValue={(option, value) => option.codigoPersona === value.codigoPersona}
                getOptionLabel={option => option.cedula + ' ' + option.nombreCompleto}
                onChange={handlerPersona}
                renderInput={params => <TextField {...params} label='Responsable' />}
              />
            </Grid>

            {/* Conteos */}
            <Grid item sm={2} xs={12}>
              <Autocomplete
                options={conteos}
                value={conteo}
                id='autocomplete-conteo'
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={option => option.descripcion}
                onChange={handlerConteo}
                renderInput={params => <TextField {...params} label='Conteos' />}
              />
            </Grid>

            {/* Titulo */}
            <Grid item sm={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='comentario'
                  control={control}
                  rules={{ maxLength: 4000 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Comentario'
                      onChange={onChange}
                      placeholder='Comentario'
                      error={Boolean(errors.titulo)}
                      aria-describedby='validation-async-titulo'
                      multiline
                    />
                  )}
                />
                {errors.titulo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-titulo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* descripcionId */}
            <Grid item sm={4} xs={12}>
              <TextField
                value={bmConteoSeleccionado.totalCantidad}
                label='Total Cantidad'
                placeholder='0'
                aria-describedby='validation-async-cantidad'
                disabled
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField
                value={bmConteoSeleccionado.totalCantidadContado}
                label='Total Contado'
                placeholder='0'
                aria-describedby='validation-async-cantidad'
                disabled
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField
                value={bmConteoSeleccionado.totalDiferencia}
                label='Total Diferencia'
                placeholder='0'
                aria-describedby='validation-async-cantidad'
                disabled
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

              <Button variant='outlined' size='large' onClick={handleClickOpen} sx={{ color: 'error.main', ml: 2 }}>
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
                Eliminar
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
              >
                <DialogTitle id='alert-dialog-title'>{'Esta Seguro de Eliminar estos Datos Del Conteo?'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id='alert-dialog-description'>Se eliminaran los datos de Conteo</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>No</Button>
                  <Button onClick={handleDelete} autoFocus>
                    Si
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                variant='outlined'
                size='large'
                onClick={handleClickOpenCerrarButton}
                sx={{ color: 'secundary', ml: 2 }}
              >
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
                Cerrar Conteo
              </Button>
              <Dialog
                open={openCerrarButton}
                onClose={handleCloseCerrarButton}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
              >
                <DialogTitle id='alert-dialog-title'>{'Esta Seguro de CERRAR Conteo?'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id='alert-dialog-description'>
                    Se eliminaran los datos de Conteo y enviaran a el historico
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseCerrarButton}>No</Button>
                  <Button onClick={handleCerrar} autoFocus>
                    Si
                  </Button>
                </DialogActions>
              </Dialog>
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

export default FormBmConteoUpdateAsync
