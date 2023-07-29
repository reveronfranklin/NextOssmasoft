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
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Types

import { IFechaDto } from 'src/interfaces/fecha-dto'
import { fechaToFechaObj } from 'src/utlities/fecha-to-fecha-object'
import { useDispatch } from 'react-redux'
import { setOnlyPresupuestos, setPresupuesto, setVerPresupuestoActive } from 'src/store/apps/presupuesto'
import { getDateByObject } from 'src/utlities/ge-date-by-object'
import { IUpdatePrePresupuesto } from 'src/interfaces/Presupuesto/i-update-pre-presupuesto.dto'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useState } from 'react'
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { IDeletePrePresupuestoDto } from 'src/interfaces/Presupuesto/i-delete-pre-presupuesto'


interface FormInputs {
  codigoPresupuesto:number
  denominacion:string
  descripcion:string
  año:number
  numeroOrdenanza:string
  extra1:string
  extra2:string
  extra3:string

}



const FormPresupuestoUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();
  const {presupuestoSeleccionado} = useSelector((state: RootState) => state.presupuesto)

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);


  const defaultValues = {
    codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
    denominacion:(presupuestoSeleccionado.denominacion === null || presupuestoSeleccionado.denominacion === 'undefined') ? '' : presupuestoSeleccionado.denominacion,
    descripcion:(presupuestoSeleccionado.descripcion === null || presupuestoSeleccionado.descripcion === 'undefined') ? '' : presupuestoSeleccionado.descripcion,
    año:presupuestoSeleccionado.ano,
    numeroOrdenanza:presupuestoSeleccionado.numeroOrdenanza,
    extra1:presupuestoSeleccionado.extra1,
    extra2:presupuestoSeleccionado.extra2,
    extra3:presupuestoSeleccionado.extra3,

  }

  // ** Hook
  const {
    control,
    handleSubmit,

    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })


  const handlerDesde=(desde:Date)=>{


    const fechaObj:IFechaDto =fechaToFechaObj(desde);
    const presupuestoTmp= {...presupuestoSeleccionado,fechaDesde:desde.toISOString(),fechaDesdeObj:fechaObj};
    dispatch(setPresupuesto(presupuestoTmp))

  }
  const handlerHasta=(hasta:Date)=>{


    const fechaObj:IFechaDto =fechaToFechaObj(hasta);

    const presupuestoTmp= {...presupuestoSeleccionado,fechaHasta:hasta.toISOString(),fechaHastaObj:fechaObj};
    dispatch(setPresupuesto(presupuestoTmp))

  }

  const handlerFechaAprobacion=(aprobacion:Date)=>{


    const fechaObj:IFechaDto =fechaToFechaObj(aprobacion);

    const presupuestoTmp= {...presupuestoSeleccionado,fechaAprobacion:aprobacion.toISOString(),fechaAprobacionObj:fechaObj};
    dispatch(setPresupuesto(presupuestoTmp))

  }
  const handlerFechaOrdenanza=(fechaOrdenanza:Date)=>{


    const fechaObj:IFechaDto =fechaToFechaObj(fechaOrdenanza);

    const presupuestoTmp= {...presupuestoSeleccionado,fechaOrdenanza:fechaOrdenanza.toISOString(),fechaOrdenanzaObj:fechaObj};
    dispatch(setPresupuesto(presupuestoTmp))

  }

  const getPresupuestos = async () => {


    const responseAll= await ossmmasofApi.get<any>('/PrePresupuesto/GetList');
    setErrorMessage(responseAll.data.message)
    const data = responseAll.data;
    dispatch(setOnlyPresupuestos(data));


  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async  () => {


    const deletePresupuesto : IDeletePrePresupuestoDto={
      codigoPresupuesto:presupuestoSeleccionado.codigoPresupuesto
    }
    const responseAll= await ossmmasofApi.post<any>('/PrePresupuesto/Delete',deletePresupuesto);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerPresupuestoActive(false))
      dispatch(setPresupuesto({}))
      setOpen(false);
    }


  };
  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updatePresupuesto:IUpdatePrePresupuesto= {
      codigoEmpresa:13,
      codigoPresupuesto:presupuestoSeleccionado.codigoPresupuesto,
      denominacion:data.denominacion,
      descripcion:data.descripcion,
      ano:Number(data.año),
      fechaDesde:presupuestoSeleccionado.fechaDesde,
      fechaHasta:presupuestoSeleccionado.fechaHasta,
      fechaAprobacion:presupuestoSeleccionado.fechaAprobacion,
      numeroOrdenanza:(data.numeroOrdenanza === null || data.numeroOrdenanza === 'undefined') ? '' : data.numeroOrdenanza,
      fechaOrdenanza:presupuestoSeleccionado.fechaOrdenanza,
      extra1:(data.extra1 === null || data.extra1 === 'undefined') ? '' : data.extra1,
      extra2:(data.extra2 === null || data.extra2 === 'undefined') ? '' : data.extra2,
      extra3:(data.extra3 === null || data.extra3 === 'undefined') ? '' : data.extra3,
    };

    const responseAll= await ossmmasofApi.post<any>('/PrePresupuesto/Update',updatePresupuesto);

    dispatch(setPresupuesto(responseAll.data.data))
    await getPresupuestos();
    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
  }

  return (
    <Card>
      <CardHeader title='Modificar Presupuesto' />
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


            <Grid item  sm={3} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='año'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Año'
                      onChange={onChange}
                      placeholder='Año'
                      error={Boolean(errors.año)}
                      aria-describedby='validation-async-año'
                    />
                  )}
                />
                {errors.año && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-año'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item  sm={3} xs={12}>
                <DatePicker
                  selected={ getDateByObject(presupuestoSeleccionado.fechaDesdeObj)}
                  id='date-time-picker-desde'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerDesde(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Desde' />}
                />
            </Grid>
            <Grid item  sm={3} xs={12}>
                <DatePicker
                  selected={ getDateByObject(presupuestoSeleccionado.fechaHastaObj)}
                  id='date-time-picker-hasta'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerHasta(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Hasta' />}
                />
            </Grid>
            <Grid item  sm={3} xs={12}>
                <DatePicker
                  selected={ getDateByObject(presupuestoSeleccionado.fechaAprobacionObj)}
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

            <Grid item  sm={3} xs={12}>
                <DatePicker
                  selected={ getDateByObject(presupuestoSeleccionado.fechaOrdenanzaObj)}
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
              <Button variant="outlined"  size='large' onClick={handleClickOpen} sx={{ color: 'error.main' ,ml:2}} >
                Eliminar
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Esta Seguro de Eliminar este Presupuesto?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminara el presupuesto solo si no tiene movimiento asociado
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>No</Button>
                  <Button onClick={handleDelete} autoFocus>
                    Si
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>

          </Grid>
          <Box>
          {errorMessage.length>0 && <FormHelperText sx={{ color: 'error.main' ,fontSize: 20,mt:4 }}>{errorMessage}</FormHelperText>}
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormPresupuestoUpdateAsync
