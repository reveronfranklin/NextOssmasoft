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

interface FormInputs {
  codigoPresupuesto:number
  denominacion:string
  descripcion:string
  ano:number
  numeroOrdenanza:string
  extra1:string
  extra2:string
  extra3:string
  fechaDesde:string
  fechaHasta:string

}



const FormPresupuestoCreateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();

 // const {presupuestoSeleccionado} = useSelector((state: RootState) => state.presupuesto)

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [fechaDesde, setFechaDesde] = useState<string>('')
  const [fechaDesdeDate, setFechaDesdeDate] = useState<Date>()

  const [fechaHasta, setFechaHasta] = useState<string>('')
  const [fechaHastaDate, setFechaHastaDate] = useState<Date>()

  const [fechaAprobacion, setFechaAprobacion] = useState<string>('')
  const [fechaAprobacionDate, setFechaAprobacionDate] = useState<Date>()

  const [fechaOrdenanza, setFechaOrdenanza] = useState<string>('')
  const [fechaOrdenanzaDate, setFechaOrdenanzaDate] = useState<Date>()

  const [errorMessage, setErrorMessage] = useState<string>('')

  const defaultValues = {
    codigoPresupuesto: 0,
    denominacion:'',
    descripcion:'',
    ano:0,
    numeroOrdenanza:'',
    extra1:'',
    extra2:'',
    extra3:'',
    fechaDesde:fechaDesde,
    fechaHasta:fechaHasta


  }


  // ** Hook
  const {
    control,
    handleSubmit,
    setValue ,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })


  const handlerDesde=(desde:Date)=>{

   // const fechaObj:IFechaDto =fechaToFechaObj(desde);

   setFechaDesde(desde.toISOString())
   setFechaDesdeDate(desde);
   setValue('fechaDesde', desde.toISOString());
   setErrorMessage('')

   // const presupuestoTmp= {...presupuestoSeleccionado,fechaDesde:desde.toISOString(),fechaDesdeObj:fechaObj};
   // dispatch(setPresupuesto(presupuestoTmp))

  }
  const handlerHasta=(hasta:Date)=>{

    setFechaHasta(hasta.toISOString());
    setFechaHastaDate(hasta)
    setValue('fechaHasta', hasta.toISOString());
    setErrorMessage('')

    //const fechaObj:IFechaDto =fechaToFechaObj(hasta);

    //const presupuestoTmp= {...presupuestoSeleccionado,fechaHasta:hasta.toISOString(),fechaHastaObj:fechaObj};
    //dispatch(setPresupuesto(presupuestoTmp))

  }

  const handlerFechaAprobacion=(aprobacion:Date)=>{

    setFechaAprobacion(aprobacion.toISOString())
    setFechaAprobacionDate(aprobacion)

  }

  const handlerFechaOrdenanza=(fechaOrdenanza:Date)=>{

    setFechaOrdenanza(fechaOrdenanza.toISOString())
    setFechaOrdenanzaDate(fechaOrdenanza)

  }

  const getPresupuestos = async () => {
    const responseAll= await ossmmasofApi.get<any>('/PrePresupuesto/GetList');
    const data = responseAll.data;
    dispatch(setOnlyPresupuestos(data));
  };

  const onSubmit = async (data:FormInputs) => {
    setErrorMessage('')
    if(fechaDesde.length<10){
      setErrorMessage('Indique la fecha desde del presupuesto')

      return;
    }
    if(fechaHasta.length<10){
      setErrorMessage('Indique la fecha hasta del presupuesto')

      return;
    }

    setLoading(true)

    const updatePresupuesto:IUpdatePrePresupuesto= {
      codigoEmpresa:13,
      codigoPresupuesto:data.codigoPresupuesto,
      denominacion:data.denominacion,
      descripcion:data.descripcion,
      ano:Number(data.ano),
      fechaDesde:fechaDesde,
      fechaHasta:fechaHasta,
      fechaAprobacion:fechaAprobacion,
      numeroOrdenanza:(data.numeroOrdenanza === null || data.numeroOrdenanza === 'undefined') ? '' : data.numeroOrdenanza,
      fechaOrdenanza:fechaOrdenanza,
      extra1:(data.extra1 === null || data.extra1 === 'undefined') ? '' : data.extra1,
      extra2:(data.extra2 === null || data.extra2 === 'undefined') ? '' : data.extra2,
      extra3:(data.extra3 === null || data.extra3 === 'undefined') ? '' : data.extra3,
    };


    const responseAll= await ossmmasofApi.post<any>('/PrePresupuesto/Create',updatePresupuesto);

    dispatch(setPresupuesto(responseAll.data.data))
    await getPresupuestos();
    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)
    dispatch(setVerPresupuestoActive(false))
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


            <Grid item  sm={3} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='ano'
                  control={control}
                  rules={{ min:2000 }}
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
            <Grid item  sm={3} xs={12}>
                <DatePicker
                   selected={fechaDesdeDate}
                  id='date-time-picker-desde'
                  dateFormat="MM-DD-YYYY"
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerDesde(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Desde' />}

                />
            </Grid>


            <Grid item  sm={3} xs={12}>
                <DatePicker
                  selected={ fechaHastaDate}
                  id='date-time-picker-hasta'
                  dateFormat="MM-DD-YYYY"
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerHasta(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Hasta' />}
                />
            </Grid>
            <Grid item  sm={3} xs={12}>
                <DatePicker

                  selected={ fechaAprobacionDate}
                  id='date-time-picker-aprobacion'
                  dateFormat="MM-DD-YYYY"
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
                  selected={ fechaOrdenanzaDate}
                  id='date-time-picker-ordenanza'
                  dateFormat="MM-DD-YYYY"
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

          {errorMessage.length>0 && <FormHelperText sx={{ color: 'error.main' ,fontSize: 20,mt:4 }}>{errorMessage}</FormHelperText>}
          </Box>


        </form>
      </CardContent>
    </Card>
  )
}

export default FormPresupuestoCreateAsync
