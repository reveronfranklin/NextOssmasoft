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
import { IBmPlacaCuarentenaDeleteDto } from 'src/interfaces/Bm/BmPlacasCuarentena/BmPlacaCuarentenaDeleteDto'
import { setBmPlacaCuarentenaSeleccionado, setVerBmPlacaCuarentenaActive } from 'src/store/apps/bmPlacaCuarentena'
import { IBmPlacaCuarentenaUpdateDto } from 'src/interfaces/Bm/BmPlacasCuarentena/BmPlacaCuarentenaUpdateDto'

interface FormInputs {
  codigoPlacaCuarentena: number
  numeroPlaca: string
}

const FormBmPlacaCuarentenaUpdateAsync = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  // ** States
  const dispatch = useDispatch()

  const { bmPlacaCuarentenaSeleccionado } = useSelector((state: RootState) => state.bmPlacaCuarentena)

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [openCerrarButton, setOpenCerrarButton] = useState(false)

  const defaultValues = {
    codigoPlacaCuarentena: bmPlacaCuarentenaSeleccionado.codigoPlacaCuarentena,
    numeroPlaca: bmPlacaCuarentenaSeleccionado.numeroPlaca,
    articulo: bmPlacaCuarentenaSeleccionado.articulo
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

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

    const deleteConteo: IBmPlacaCuarentenaDeleteDto = {
      codigoPlacaCuarentena: bmPlacaCuarentenaSeleccionado.codigoPlacaCuarentena
    }
    const responseAll = await ossmmasofApi.post<any>('/BmPlacaCuarentena/Delete', deleteConteo)
    setErrorMessage(responseAll.data.message)
    if (responseAll.data.isValid) {
      dispatch(setVerBmPlacaCuarentenaActive(false))
      dispatch(setBmPlacaCuarentenaSeleccionado({}))
    }
    setErrorMessage(responseAll.data.message)
    setLoading(false)
  }

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)
    setErrorMessage('')
    const updateDto: IBmPlacaCuarentenaUpdateDto = {
      codigoPlacaCuarentena: data.codigoPlacaCuarentena,
      numeroPlaca: data.numeroPlaca
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

      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader title='BM- Modificar Placa Cuarentena' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoPlacaCuarentena'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoPlacaCuarentena)}
                      aria-describedby='validation-async-codigoBmConteo'
                      disabled
                    />
                  )}
                />
                {errors.codigoPlacaCuarentena && (
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
                  name='numeroPlaca'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='numeroPlaca'
                      onChange={onChange}
                      placeholder='Titulo'
                      error={Boolean(errors.numeroPlaca)}
                      aria-describedby='validation-async-titulo'
                    />
                  )}
                />
                {errors.numeroPlaca && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-titulo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              {/*  <Button size='large' type='submit' variant='contained'>
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
              </Button> */}

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
                <DialogTitle id='alert-dialog-title'>
                  {'Esta Seguro de Eliminar estos Datos De Placa en Cuarentena?'}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id='alert-dialog-description'>
                    Se eliminaran los datos de Cuarentena
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>No</Button>
                  <Button onClick={handleDelete} autoFocus>
                    Si
                  </Button>
                </DialogActions>
              </Dialog>

              {/*   <Button
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
 */}
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

export default FormBmPlacaCuarentenaUpdateAsync
