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
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'



import { ISelectListDescriptiva } from 'src/interfaces/rh/ISelectListDescriptiva'

import { getDateByObject } from 'src/utilities/ge-date-by-object'


// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { IRhFamiliarResponseDto } from 'src/interfaces/rh/RhFamiliarResponseDto'
import { setRhFamiliaresSeleccionado, setVerRhFamiliaresActive } from 'src/store/apps/rh-familiares'
import { IRhFamiliarDeleteDto } from 'src/interfaces/rh/RhFamiliarDeleteDto'
import { IRhFamiliarUpdateDto } from 'src/interfaces/rh/RhFamiliarUpdateDto'

interface FormInputs {

  codigoPersona:number,
  codigoFamiliar:number,
  cedulaFamiliar:number;
  nacionalidad :string;
  nombre :string;
  apellido :string;
  edad :string;
  fechaNacimientoString:string;
  parienteId:number;
  nivelEducativo:number;
  sexo :string;
  grado:number;

}



const FormRhFamiliaresUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();


  const {rhFamiliaresSeleccionado,listRhNivelEducativo,listRhPariente} = useSelector((state: RootState) => state.rhFamiliares)


  const  getNivelEducativo=(id:number)=>{

    const result = listRhNivelEducativo?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getPariente=(id:number)=>{

    const result = listRhPariente?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getNacionalidad=(id:string)=>{

    const result = listNacionalidad?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getSexo=(id:string)=>{

    const result = listSexo?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);

  const [pariente,setPariente] = useState<ISelectListDescriptiva>(getPariente(rhFamiliaresSeleccionado.parienteId))
  const [nivelEducativo,setNivelEducativo] = useState<ISelectListDescriptiva>(getNivelEducativo(rhFamiliaresSeleccionado.nivelEducativo))
  const listNacionalidad =[{id:'V',descripcion:'Venezolado'},{id:'E',descripcion:'Extranjero'}]
  const listSexo =[{id:'M',descripcion:'Masculino'},{id:'F',descripcion:'Femenino'}]
  const [nacionalidad,setNacionalidad] = useState<any>(getNacionalidad(rhFamiliaresSeleccionado.nacionalidad));
  const [sexo,setSexo] = useState<any>(getSexo(rhFamiliaresSeleccionado.sexo))
  const defaultValues:IRhFamiliarResponseDto = {
    codigoFamiliar :rhFamiliaresSeleccionado.codigoFamiliar,
    codigoPersona :rhFamiliaresSeleccionado.codigoPersona,
    cedulaFamiliar:rhFamiliaresSeleccionado.cedulaFamiliar,
    nombre:rhFamiliaresSeleccionado.nombre,
    apellido:rhFamiliaresSeleccionado.apellido,
    edad:rhFamiliaresSeleccionado.edad,
    nacionalidad:rhFamiliaresSeleccionado.nacionalidad,
    parienteId:rhFamiliaresSeleccionado.parienteId,
    parienteDescripcion:rhFamiliaresSeleccionado.parienteDescripcion,
    sexo:rhFamiliaresSeleccionado.sexo,
    nivelEducativo:rhFamiliaresSeleccionado.nivelEducativo,
    grado:rhFamiliaresSeleccionado.grado,
    fechaNacimiento:rhFamiliaresSeleccionado.fechaNacimiento,
    fechaNacimientoString:rhFamiliaresSeleccionado.fechaNacimientoString,
    fechaNacimientoObj:rhFamiliaresSeleccionado.fechaNacimientoObj,

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })



  const handlerPariente=async (e: any,value:any)=>{

    if(value!=null){
      setValue('parienteId',value.id);
      setPariente(value);

    }else{
      setValue('parienteId',0);

    }
  }
  const handlerNivelEducativo=async (e: any,value:any)=>{

    if(value!=null){
      setValue('nivelEducativo',value.id);
      setNivelEducativo(value);
    }else{
      setValue('nivelEducativo',0);

    }
  }


  const handlerNacionalidad=async (e: any,value:any)=>{

    if(value!=null){
      setValue('nacionalidad',value.id);
      setNacionalidad(value);

    }else{
      setValue('nacionalidad','');

    }
  }

  const handlerSexo=async (e: any,value:any)=>{

    if(value!=null){
      setValue('sexo',value.id);
      setSexo(value);

    }else{
      setValue('sexo','');

    }
  }


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setVerRhFamiliaresActive(false))
    dispatch(setRhFamiliaresSeleccionado({}))
  };

  const handlerFechaDesde=(desde:Date)=>{
    const fechaObj:IFechaDto =fechaToFechaObj(desde);
    const familiaresTmp= {...rhFamiliaresSeleccionado,fechaNacimientoString:desde.toISOString(),fechaNacimientoObj:fechaObj};
    dispatch(setRhFamiliaresSeleccionado(familiaresTmp))
    setValue('fechaNacimientoString',desde.toISOString());
  }


  const handleDelete = async  () => {

    setOpen(false);
    const deleteFamiliar : IRhFamiliarDeleteDto={
      codigoFamiliar:rhFamiliaresSeleccionado.codigoFamiliar
    }
    const responseAll= await ossmmasofApi.post<any>('/RhFamiliares/Delete',deleteFamiliar);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerRhFamiliaresActive(false))
      dispatch(setRhFamiliaresSeleccionado({}))
    }


  };

  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updateFamiliar:IRhFamiliarUpdateDto ={
      codigoPersona :rhFamiliaresSeleccionado.codigoPersona,
      codigoFamiliar :rhFamiliaresSeleccionado.codigoFamiliar,
      cedulaFamiliar:data.cedulaFamiliar,
      nacionalidad :data.nacionalidad,
      nombre :data.nombre,
      apellido :data.apellido,
      fechaNacimientoString:data.fechaNacimientoString,
      edad :data.edad,
      parienteId:data.parienteId,
      sexo :data.sexo,
      nivelEducativo:data.nivelEducativo,
      grado:data.grado
    };
    console.log('updateFamiliar',updateFamiliar)
    const responseAll= await ossmmasofApi.post<any>('/RhFamiliares/Update',updateFamiliar);

    if(responseAll.data.isValid){
      dispatch(setRhFamiliaresSeleccionado(responseAll.data.data))
      dispatch(setVerRhFamiliaresActive(false))
      toast.success('Form Submitted')
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)

  }
  useEffect(() => {

    const getData = async () => {
      setLoading(true);

      /*const filterBanco={descripcionId:0,tituloId:18}
      const responseBanco= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterBanco);
      dispatch(setListRhBancos(responseBanco.data))

      const filterTipoCuenta={descripcionId:0,tituloId:19}
      const responseTipoCuenta= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterTipoCuenta);
      dispatch(setListRhTipoCuenta(responseTipoCuenta.data))*/

      setLoading(false);
    };




    getData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='RH - Modificar Familiar' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoFamiliar'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoFamiliar)}
                      aria-describedby='validation-async-codigoFamiliar'
                      disabled
                    />
                  )}
                />
                {errors.codigoFamiliar && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoFamiliar'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
              {/* Nacionalidad */}
              <Grid item sm={4} xs={12}>

                <Autocomplete

                      options={listNacionalidad}
                      value={nacionalidad}
                      id='autocomplete-nacionalidad'
                      isOptionEqualToValue={(option, value) => option.id=== value.id}
                      getOptionLabel={option => option.id + '-' + option.descripcion }
                      onChange={handlerNacionalidad}
                      renderInput={params => <TextField {...params} label='Nacionalidad' />}
                    />

              </Grid>
             {/* cedula*/}
             <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='cedulaFamiliar'
                    control={control}
                    rules={{ minLength:5}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Cedula'
                        onChange={onChange}
                        placeholder='cedula'
                        error={Boolean(errors.cedulaFamiliar)}
                        aria-describedby='validation-async-cedula'
                      />
                    )}
                  />
                  {errors.cedulaFamiliar && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-cedula'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>
             {/* nombre*/}
             <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='nombre'
                    control={control}
                    rules={{ minLength:5}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Nombre'
                        onChange={onChange}
                        placeholder='nombre'
                        error={Boolean(errors.nombre)}
                        aria-describedby='validation-async-nombre'
                      />
                    )}
                  />
                  {errors.nombre && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-nombre'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>
             {/* apellido*/}
             <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='apellido'
                    control={control}
                    rules={{ minLength:5}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Apellido'
                        onChange={onChange}
                        placeholder='Nombre'
                        error={Boolean(errors.apellido)}
                        aria-describedby='validation-async-apellido'
                      />
                    )}
                  />
                  {errors.apellido && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-apellido'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>


            {/* Sexo */}
            <Grid item sm={6} xs={12}>

            <Autocomplete

              options={listSexo}
              value={sexo}
              id='autocomplete-sexo'
              isOptionEqualToValue={(option, value) => option.id=== value.id}
              getOptionLabel={option => option.id + '-' + option.descripcion }
              onChange={handlerSexo}
              renderInput={params => <TextField {...params} label='Sexo' />}
            />

            </Grid>


          <Grid item  sm={6} xs={12}>
                <DatePicker

                  selected={ getDateByObject(rhFamiliaresSeleccionado.fechaNacimientoObj!)}
                  id='date-time-picker-desde'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerFechaDesde(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Fecha Nacimiento' />}
                />
            </Grid>

            {/* Pariente */}
            <Grid item sm={6} xs={12}>
              <Autocomplete

                options={listRhPariente}
                value={pariente}
                id='autocomplete-pariente'
                isOptionEqualToValue={(option, value) => option.id=== value.id}
                getOptionLabel={option => option.id + '-' + option.descripcion }
                onChange={handlerPariente}
                renderInput={params => <TextField {...params} label='Pariente' />}
              />
            </Grid>
              {/* Nivel Educativo */}
              <Grid item sm={6} xs={12}>
              <Autocomplete

                options={listRhNivelEducativo}
                value={nivelEducativo}
                id='autocomplete-nivel'
                isOptionEqualToValue={(option, value) => option.id=== value.id}
                getOptionLabel={option => option.id + '-' + option.descripcion }
                onChange={handlerNivelEducativo}
                renderInput={params => <TextField {...params} label='Nivel Educativo' />}
              />
            </Grid>


            {/* descripcion*/}
            <Grid item sm={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='grado'
                  control={control}
                  rules={{ maxLength:20,minLength:20}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Grado'
                      onChange={onChange}
                      placeholder='Grado'
                      error={Boolean(errors.grado)}
                      aria-describedby='validation-async-noCuenta'
                    />
                  )}
                />
                {errors.grado && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-noCuenta'>
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
                  {"Esta Seguro de Eliminar estos Datos de Familiar?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminaran los datos de Familiar
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

export default FormRhFamiliaresUpdateAsync
