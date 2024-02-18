// ** React Imports
// ** React Imports
import {  ElementType,ChangeEvent} from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import Button, { ButtonProps } from '@mui/material/Button'
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
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from '@mui/material'



import { ISelectListDescriptiva } from 'src/interfaces/rh/ISelectListDescriptiva'

import { setListRhBancos, setListRhTipoCuenta } from 'src/store/apps/rh-administrativos'


import { getDateByObject, monthByIndex } from 'src/utilities/ge-date-by-object'


// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { setPersonaSeleccionado, setPersonasDtoSeleccionado, setVerRhPersonasActive } from 'src/store/apps/rh'
import { RhPersonaDeleteDto } from 'src/interfaces/rh/RhPersonaDeleteDto'
import { IRhPersonaUpdateDto } from 'src/interfaces/rh/RhPersonaUpdateDto'

import { styled } from '@mui/material/styles'
import { IPersonaDto } from 'src/interfaces/rh/i-rh-persona-dto'
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas'

interface FormInputs {
  codigoPersona :number;
  cedula :number;
  nombre:string;
  apellido:string;
  nacionalidad:string;
  sexo:string;
  edad:number;
  fechaNacimiento:Date;
  fechaNacimientoString:string;
  fechaNacimientoObj:IFechaDto;
  paisNacimientoId:number;
  estadoNacimientoId:number;
  numeroGacetaNacional:string;
  fechaGacetaNacional:string;
  estadoCivilId:number;
  estatura:number;
  peso:number;
  manoHabil :string;
  status :string;
  identificacionId :number;
  numeroIdentificacion :number;

}



const FormRhPersonaUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();


  const {personasDtoSeleccionado,listEstados,listPaises,listTipoIdentificacion,listEstadoCivil} = useSelector((state: RootState) => state.nomina)


  const listNacionalidad =[{id:'V',descripcion:'Venezolado'},{id:'E',descripcion:'Extranjero'}]
  const listSexo =[{id:'M',descripcion:'Masculino'},{id:'F',descripcion:'Femenino'}]
  const listManoHabil =[{id:'D',descripcion:'Derecha'},{id:'I',descripcion:'Izquierda'}]
  const listStatus =[{id:'A',descripcion:'Activo'},{id:'E',descripcion:'Egresado'},{id:'S',descripcion:'Suspendido'}]

  const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}
  const defaultDateString = fechaActual.toISOString();
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
  const  getManoHabil=(id:string)=>{

    console.log('listManoHabil',listManoHabil)
    console.log('id mano habil',id)
    if(id==='' || id ===null || id==='undefined'){
      id='D'

    };
    const result = listManoHabil?.filter((elemento)=>{

      return elemento.id==id;

    });


    return result[0];
  }

  const  getStatus=(id:string)=>{

    const result = listStatus?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }
  const  getEstado=(id:number)=>{

    const result = listEstados?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }
  const  getPais=(id:number)=>{

    const result = listEstados?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getTipoIdentificacion=(id:number)=>{

    const result = listTipoIdentificacion?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }


  const  getEstadoCivil=(id:number)=>{

    const result = listEstadoCivil?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }


  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);

  const [nacionalidad,setNacionalidad] = useState<any>(getNacionalidad(personasDtoSeleccionado.nacionalidad));
  const [sexo,setSexo] = useState<any>(getSexo(personasDtoSeleccionado.sexo))
  const [manoHabil,setManoHabil] = useState<any>(getManoHabil(personasDtoSeleccionado.manoHabil))
  const [status,setStatus] = useState<any>(getStatus(personasDtoSeleccionado.status))
  const [estado,setEstado] = useState<any>(getEstado(personasDtoSeleccionado.estadoNacimientoId))
  const [pais,setPais] = useState<any>(getPais(personasDtoSeleccionado.paisNacimientoId))
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [base64String, setBase64String] = useState<any>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [rowData, setRowData] = useState<ArrayBuffer>()
  const [tipoIdentificacion,setTipoIdentificacion] = useState<any>(getTipoIdentificacion(personasDtoSeleccionado.identificacionId))
  const [estadoCivil,setEstadoCivil] = useState<any>(getEstadoCivil(personasDtoSeleccionado.estadoCivilId))


  const defaultValues = {

    codigoPersona :personasDtoSeleccionado.codigoPersona,
    cedula :personasDtoSeleccionado.cedula,
    nombre:personasDtoSeleccionado.nombre,
    apellido:personasDtoSeleccionado.apellido,
    nacionalidad:personasDtoSeleccionado.nacionalidad,
    sexo:personasDtoSeleccionado.sexo,
    edad:personasDtoSeleccionado.edad,
    fechaNacimiento:personasDtoSeleccionado.fechaNacimiento,
    fechaNacimientoString:personasDtoSeleccionado.fechaNacimientoString,
    fechaNacimientoObj:personasDtoSeleccionado.fechaNacimientoObj,
    paisNacimientoId:personasDtoSeleccionado.paisNacimientoId,
    estadoNacimientoId:personasDtoSeleccionado.estadoNacimientoId,
    numeroGacetaNacional:personasDtoSeleccionado.numeroGacetaNacional,
    fechaGacetaNacional:personasDtoSeleccionado.fechaGacetaNacional,
    estadoCivilId:personasDtoSeleccionado.estadoCivilId,
    estatura:personasDtoSeleccionado.estatura,
    peso:personasDtoSeleccionado.peso,
    manoHabil :personasDtoSeleccionado.manoHabil,
    status :personasDtoSeleccionado.status,
    identificacionId :personasDtoSeleccionado.identificacionId,
    numeroIdentificacion :personasDtoSeleccionado.numeroIdentificacion


  }

  const ImgStyled = styled('img')(({ theme }) => ({
    width: 120,
    height: 120,
    borderRadius: 4,
    marginRight: theme.spacing(5)
  }))

  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: 0,
      textAlign: 'center',
      marginTop: theme.spacing(4)
    }
  }))


  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })



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

  const handlerManoHabil=async (e: any,value:any)=>{
   console.log(value)
    if(value!=null){
      setValue('manoHabil',value.id);
      setManoHabil(value);

    }else{
      setValue('manoHabil','');

    }
  }
  const handlerStatus=async (e: any,value:any)=>{

    if(value!=null){
      setValue('status',value.id);
      setStatus(value);

    }else{
      setValue('status','');

    }
  }
  const handlerEstado=async (e: any,value:any)=>{

    if(value!=null){
      setValue('estadoNacimientoId',value.id);
      setEstado(value);

    }else{
      setValue('estadoNacimientoId',0);

    }
  }
  const handlerPais=async (e: any,value:any)=>{

    if(value!=null){
      setValue('paisNacimientoId',value.id);
      setPais(value);

    }else{
      setValue('paisNacimientoId',0);

    }
  }


  const handlerEstadoCivil=async (e: any,value:any)=>{

    if(value!=null){
      setValue('estadoCivilId',value.id);
      setEstadoCivil(value);

    }else{
      setValue('estadoCivilId',0);

    }
  }



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setVerRhPersonasActive(false))

   // dispatch(setPersonasDtoSeleccionado({}))
  };

  const handlerFechaNacimiento=(desde:Date)=>{


    const fechaObj:IFechaDto =fechaToFechaObj(desde);
    const presupuestoTmp= {...personasDtoSeleccionado,fechaNacimientoString:desde.toISOString(),fechaNacimientoObj:fechaObj,fechaNacimiento:desde};
    dispatch(setPersonasDtoSeleccionado(presupuestoTmp))
    setValue('fechaNacimiento',desde);
    setValue('fechaNacimientoString',desde.toISOString());
    setValue('fechaNacimientoObj',fechaObj);
  }
  const handlerTipoIdentificacion=async (e: any,value:any)=>{

    if(value!=null){
      setValue('identificacionId',value.id);
      setTipoIdentificacion(value);

    }else{
      setValue('identificacionId',0);

    }
  }


  const handleInputImageChange = async  (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {

      reader.onload = () => {

          setInputValue(reader.result as string)
          setImgSrc(reader.result as string);
          const base64 = imgSrc.split(',').pop();
          //setBase64String(base64);
          setBase64String(reader.result as string);
          const rawTempData = reader.result as ArrayBuffer;
          setRowData(rawTempData);


          /*const base64String = imgSrc
                .replace('data:', '')
                .replace(/^.+,/, '');*/


                console.log('>>>>>>files[0]',files[0]);



      }
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)

      }
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/1.png')
  }
  const handleInputImageSend = () => {
   console.log(base64String)
  }

  const handleDelete = async  () => {

    setOpen(false);
    const deletePersona : RhPersonaDeleteDto={
      codigoPersona:personasDtoSeleccionado.codigoPersona
    }
    const responseAll= await ossmmasofApi.post<any>('/RhPersona/Delete',deletePersona);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerRhPersonasActive(false))
      dispatch(setPersonasDtoSeleccionado({}))
    }


  };

  const onSubmit = async (data:FormInputs) => {
    setLoading(true)



    const updatePersona:IRhPersonaUpdateDto= {
      codigoPersona :personasDtoSeleccionado.codigoPersona,
      cedula :data.cedula,
      nombre:data.nombre,
      apellido:data.apellido,
      nacionalidad:data.nacionalidad,
      sexo:data.sexo,
      edad:data.edad,
      fechaNacimiento:personasDtoSeleccionado.fechaNacimientoString!,
      paisNacimientoId:data.paisNacimientoId,
      estadoNacimientoId:data.estadoNacimientoId,
      numeroGacetaNacional:data.numeroGacetaNacional,
      fechaGacetaNacional:data.fechaGacetaNacional,
      estadoCivilId:data.estadoCivilId,
      estatura:data.estatura,
      peso:data.peso,
      manoHabil :data.manoHabil,
      status :data.status,
      identificacionId :data.identificacionId,
      numeroIdentificacion :data.numeroIdentificacion,
      data:base64String,
      nombreArchivo:inputValue

    };
    console.log('updatePersona',updatePersona)
    const responseAll= await ossmmasofApi.post<any>('/RhPersona/Update',updatePersona);

    if(responseAll.data.isValid){
      dispatch(setPersonasDtoSeleccionado(responseAll.data.data))
      dispatch(setVerRhPersonasActive(false))
      handlerPersona(responseAll.data.data);
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
  }


  const handlerPersona= async (value:any)=>{

    if(value && value.codigoPersona>0){

      const filter={codigoPersona:value.codigoPersona}
      const responseAll= await ossmmasofApi.post<IPersonaDto>('/RhPersona/GetPersona',filter);
      console.log('handlerPersona',responseAll.data)
      dispatch(setPersonaSeleccionado(responseAll.data));
      dispatch(setPersonasDtoSeleccionado(responseAll.data));
    }else{

      const personaDefault:IListSimplePersonaDto ={
        apellido:'',
        cedula:0,
        codigoPersona:0,
        nombre:'',
        nombreCompleto:'',
        avatar:'',
        descripcionStatus:'',
        nacionalidad:'',
        sexo:'',
        fechaNacimiento:fechaActual,
        fechaNacimientoString:defaultDateString,
        fechaNacimientoObj:defaultDate,
        email:'',
        paisNacimiento:'',
        edad:0,
        descripcionEstadoCivil:'',
        paisNacimientoId:0,
        estadoNacimientoId:0,
        manoHabil:'',
        status:'',
        fechaGacetaNacional:'',
        estadoCivilId:0,
        estatura:0,
        peso:0,
        identificacionId:0,
        numeroIdentificacion:0,
        numeroGacetaNacional:0,

      };

      dispatch(setPersonaSeleccionado(personaDefault));
      dispatch(setPersonasDtoSeleccionado(personaDefault));

    }



  }


  useEffect(() => {

    const getData = async () => {
      setLoading(true);

      const filterBanco={descripcionId:0,tituloId:18}
      const responseBanco= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterBanco);
      dispatch(setListRhBancos(responseBanco.data))

      const filterTipoCuenta={descripcionId:0,tituloId:19}
      const responseTipoCuenta= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterTipoCuenta);
      dispatch(setListRhTipoCuenta(responseTipoCuenta.data))

      setLoading(false);
    };




    getData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='RH - Modificar Persona' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item sm={12} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <div>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Cargar Nueva Foto
                    <input
                      hidden
                      type='file'
                      value={inputValue}
                      accept='image/jpg'
                      onChange={handleInputImageChange}
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputImageReset}>
                    Reset
                  </ResetButtonStyled>
                  <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputImageSend}>
                    Send
                  </ResetButtonStyled>
                  <Typography variant='caption' sx={{ mt: 4, display: 'block', color: 'text.disabled' }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </div>
              </Box>
            </Grid>
            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoPersona'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoPersona)}
                      aria-describedby='validation-async-codigoPersona'
                      disabled
                    />
                  )}
                />
                {errors.codigoPersona && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoPersona'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
              {/* cedula*/}
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='cedula'
                    control={control}
                    rules={{ minLength:5}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Cedula'
                        onChange={onChange}
                        placeholder='noCuenta'
                        error={Boolean(errors.cedula)}
                        aria-describedby='validation-async-cedula'
                      />
                    )}
                  />
                  {errors.cedula && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-cedula'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>
               {/* Tipo Identificacion */}
               <Grid item sm={2} xs={12}>
              <Autocomplete

                options={listTipoIdentificacion}
                value={tipoIdentificacion}
                id='autocomplete-tipoIdentificacion'
                isOptionEqualToValue={(option, value) => option.id=== value.id}
                getOptionLabel={option =>  option.descripcion }
                onChange={handlerTipoIdentificacion}
                renderInput={params => <TextField {...params} label='Identificacion' />}
              />
            </Grid>
              {/* numeroIdentificacion*/}
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='numeroIdentificacion'
                    control={control}
                    rules={{ minLength:6}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Rif'
                        onChange={onChange}
                        placeholder='Rif'
                        error={Boolean(errors.numeroIdentificacion)}
                        aria-describedby='validation-async-numeroIdentificacion'
                      />
                    )}
                  />
                  {errors.numeroIdentificacion && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-numeroIdentificacion'>
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
                        error={Boolean(errors.cedula)}
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
                        label='apellido'
                        onChange={onChange}
                        placeholder='nombre'
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
          {/* Sexo */}
          <Grid item sm={4} xs={12}>

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
            {/* Estado Civil */}
            <Grid item sm={4} xs={12}>

              <Autocomplete

              options={listEstadoCivil}
              value={estadoCivil}
              id='autocomplete-estadoCivil'
              isOptionEqualToValue={(option, value) => option.id=== value.id}
              getOptionLabel={option => option.id + '-' + option.descripcion }
              onChange={handlerEstadoCivil}
              renderInput={params => <TextField {...params} label='Estado Civil' />}
              />

            </Grid>
           {/* Fecha Nacimiento */}
          <Grid item  sm={4} xs={12}>
                <DatePicker

                  selected={ getDateByObject(personasDtoSeleccionado.fechaNacimientoObj!)}
                  id='date-time-picker-nacimiento'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerFechaNacimiento(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Fecha Nacimiento' />}
                />
            </Grid>


          {/* Pais */}
          <Grid item sm={8} xs={12}>


          <Autocomplete

              options={listPaises}
              value={pais}
              id='autocomplete-pais'
              isOptionEqualToValue={(option, value) => option.id=== value.id}
              getOptionLabel={option => option.id + '-' + option.descripcion }
              onChange={handlerPais}
              renderInput={params => <TextField {...params} label='Pais' />}
            />


          </Grid>



          {/* Estado */}

          <Grid item sm={4} xs={12}>

            <Autocomplete

                  options={listEstados}
                  value={estado}
                  id='autocomplete-estado'
                  isOptionEqualToValue={(option, value) => option.id=== value.id}
                  getOptionLabel={option => option.id + '-' + option.descripcion }
                  onChange={handlerEstado}
                  renderInput={params => <TextField {...params} label='Estado' />}
                />

          </Grid>



            {/* estatura*/}
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='estatura'
                  control={control}
                  rules={{ min:1}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='estatura'
                      onChange={onChange}
                      placeholder='estatura'
                      error={Boolean(errors.estatura)}
                      aria-describedby='validation-async-estatura'
                    />
                  )}
                />
                {errors.estatura && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-estatura'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* peso*/}
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='peso'
                  control={control}
                  rules={{ min:10}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='peso'
                      onChange={onChange}
                      placeholder='peso'
                      error={Boolean(errors.estatura)}
                      aria-describedby='validation-async-peso'
                    />
                  )}
                />
                {errors.peso && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-peso'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Mano Habil */}
            <Grid item sm={4} xs={12}>


            <Autocomplete

                options={listManoHabil}
                value={manoHabil}
                id='autocomplete-manoHabil'
                isOptionEqualToValue={(option, value) => option.id=== value.id}
                getOptionLabel={option => option.id + '-' + option.descripcion }
                onChange={handlerManoHabil}
                renderInput={params => <TextField {...params} label='Mano Habil' />}
              />


            </Grid>

            {/* Estatus */}
            <Grid item sm={8} xs={12}>


            <Autocomplete

                options={listStatus}
                value={status}
                id='autocomplete-status'
                isOptionEqualToValue={(option, value) => option.id=== value.id}
                getOptionLabel={option => option.id + '-' + option.descripcion }
                onChange={handlerStatus}
                renderInput={params => <TextField {...params} label='Estatus' />}
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
              <Button disabled variant="outlined"  size='large' onClick={handleClickOpen} sx={{ color: 'error.main' ,ml:2}} >
                Eliminar
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Esta Seguro de Eliminar estos Datos de Persona?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminaran los datos Persona solo si no tienen Movimiento historic
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

export default FormRhPersonaUpdateAsync
