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
import { Autocomplete, Box} from '@mui/material'



import { ISelectListDescriptiva } from 'src/interfaces/rh/ISelectListDescriptiva'

import { getDateByObject } from 'src/utilities/ge-date-by-object'


// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { IRhEducacionResponseDto } from 'src/interfaces/rh/RhEducacionResponseDto'
import { setRhEducacionSeleccionado, setVerRhEducacionActive } from 'src/store/apps/rh-educacion'
import { IRhEducacionUpdateDto } from 'src/interfaces/rh/RhEducacionUpdateDto'

interface FormInputs {

  codigoEducacion :number;
  codigoPersona :number;
  nivelId:number;
  nombreInstituto :string;
  localidadInstituto :string;
  profesionID:number;
  fechaIni :Date;
  fechaIniString :string;
  fechaFin :Date;
  fechaFinString :string;
  fechaIniObj:IFechaDto;
  fechaFinObj:IFechaDto;
  ultimoAñoAprobado:number
  graduado :string;
  tituloId :number;
  mencionEspecialidadId:number;

}



const FormRhEducacionCreateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();

  const listGraduado=[{id:'S',descripcion:'Si'},{id:'N',descripcion:'No'}]
  const {rhEducacionSeleccionado,listRhNivel,listRhProfesion,listRhTitulo,listRhMencionEspecialidad} = useSelector((state: RootState) => state.rhEducacion)


  const  getGraduado=(id:string)=>{

    const result = listGraduado?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }
  const  getNivel=(id:number)=>{

    const result = listRhNivel?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getProfesion=(id:number)=>{

    const result = listRhProfesion?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getTitulo=(id:number)=>{

    const result = listRhTitulo?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getMencionEspecialidad=(id:number)=>{

    const result = listRhMencionEspecialidad?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }


  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [nivel,setNivel] = useState<ISelectListDescriptiva>(getNivel(rhEducacionSeleccionado.nivelId));
  const [profesion,setProfesion] = useState<ISelectListDescriptiva>(getProfesion(rhEducacionSeleccionado.profesionID));
  const [titulo,setTitulo] = useState<ISelectListDescriptiva>(getTitulo(rhEducacionSeleccionado.tituloId));
  const [mencion,setMencion] = useState<ISelectListDescriptiva>(getMencionEspecialidad(rhEducacionSeleccionado.mencionEspecialidadId));
  const [graduado,setGraduado] = useState<any>(getGraduado(rhEducacionSeleccionado.graduado))

  const defaultValues:IRhEducacionResponseDto = {

    codigoEducacion :0,
    codigoPersona :rhEducacionSeleccionado.codigoPersona,
    nivelId:rhEducacionSeleccionado.nivelId,
    descripcionNivel:rhEducacionSeleccionado.descripcionNivel,
    nombreInstituto :rhEducacionSeleccionado.nombreInstituto,
    localidadInstituto :rhEducacionSeleccionado.localidadInstituto,
    profesionID:rhEducacionSeleccionado.profesionID,
    fechaIni :rhEducacionSeleccionado.fechaIni,
    fechaIniString :rhEducacionSeleccionado.fechaIniString,
    fechaFin :rhEducacionSeleccionado.fechaFin,
    fechaFinString :rhEducacionSeleccionado.fechaFinString,
    fechaIniObj:rhEducacionSeleccionado.fechaIniObj,
    fechaFinObj:rhEducacionSeleccionado.fechaFinObj,
    ultimoAñoAprobado:rhEducacionSeleccionado.ultimoAñoAprobado,
    graduado :rhEducacionSeleccionado.graduado,
    tituloId :rhEducacionSeleccionado.tituloId,
    mencionEspecialidadId:rhEducacionSeleccionado.mencionEspecialidadId


  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })



  const handlerNivel=async (e: any,value:any)=>{

    if(value!=null){
      setValue('nivelId',value.id);
      setNivel(value);

    }else{
      setValue('nivelId',0);

    }
  }
  const handlerProfesion=async (e: any,value:any)=>{

    if(value!=null){
      setValue('profesionID',value.id);
      setProfesion(value);
    }else{
      setValue('profesionID',0);

    }
  }


  const handlerTitulo=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tituloId',value.id);
      setTitulo(value);

    }else{
      setValue('tituloId',0);

    }
  }

  const handlerMencion=async (e: any,value:any)=>{

    if(value!=null){
      setValue('mencionEspecialidadId',value.id);
      setMencion(value);

    }else{
      setValue('mencionEspecialidadId',0);

    }
  }

  const handlerGraduado=async (e: any,value:any)=>{

    if(value!=null){
      setValue('graduado',value.id);
      setGraduado(value);

    }else{
      setValue('graduado','');

    }
  }



  const handlerFechaIni=(desde:Date)=>{
    const fechaObj:IFechaDto =fechaToFechaObj(desde);
    const familiaresTmp= {...rhEducacionSeleccionado,fechaIniString:desde.toISOString(),fechaInitObj:fechaObj};
    dispatch(setRhEducacionSeleccionado(familiaresTmp))
    setValue('fechaIniString',desde.toISOString());
  }
  const handlerFechaFin=(desde:Date)=>{
    const fechaObj:IFechaDto =fechaToFechaObj(desde);
    const educacionTmp= {...rhEducacionSeleccionado,fechaFinString:desde.toISOString(),fechaFintObj:fechaObj};
    dispatch(setRhEducacionSeleccionado(educacionTmp))
    setValue('fechaIniString',desde.toISOString());
  }



  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updateEducacion:IRhEducacionUpdateDto ={
      codigoPersona :rhEducacionSeleccionado.codigoPersona,
      codigoEducacion :0,
      nivelId:data.nivelId,
      nombreInstituto :data.nombreInstituto,
      localidadInstituto :data.localidadInstituto,
      profesionID:data.profesionID,
      fechaIni :data.fechaIni,
      fechaIniString :data.fechaIniString,
      fechaFin :data.fechaFin,
      fechaFinString :data.fechaFinString,
      ultimoAñoAprobado:data.ultimoAñoAprobado,
      graduado :data.graduado,
      tituloId :data.tituloId,
      mencionEspecialidadId:data.mencionEspecialidadId

    };
    console.log('updateEducacion',updateEducacion)
    const responseAll= await ossmmasofApi.post<any>('/RhEducacion/Create',updateEducacion);

    if(responseAll.data.isValid){
      dispatch(setRhEducacionSeleccionado(responseAll.data.data))
      dispatch(setVerRhEducacionActive(false))
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
      <CardHeader title='RH - Modificar Educación' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoEducacion'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoEducacion)}
                      aria-describedby='validation-async-codigoEducacion'
                      disabled
                    />
                  )}
                />
                {errors.codigoEducacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoEducacion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
              {/* nombreInstituto*/}
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='nombreInstituto'
                    control={control}
                    rules={{ minLength:5}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Instituto'
                        onChange={onChange}
                        placeholder='Instituto'
                        error={Boolean(errors.nombreInstituto)}
                        aria-describedby='validation-async-instituto'
                      />
                    )}
                  />
                  {errors.nombreInstituto && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-nombreInstituto'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>
             {/* nombre*/}
             <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='localidadInstituto'
                    control={control}
                    rules={{ minLength:5}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Localidad'
                        onChange={onChange}
                        placeholder='Localidad Instituto'
                        error={Boolean(errors.localidadInstituto)}
                        aria-describedby='validation-async-nombre'
                      />
                    )}
                  />
                  {errors.localidadInstituto && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-localidadInstituto'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>
              {/* Nivel */}
              <Grid item sm={4} xs={12}>

                <Autocomplete

                      options={listRhNivel}
                      value={nivel}
                      id='autocomplete-nivel'
                      isOptionEqualToValue={(option, value) => option.id=== value.id}
                      getOptionLabel={option => option.id + '-' + option.descripcion }
                      onChange={handlerNivel}
                      renderInput={params => <TextField {...params} label='Nivel' />}
                    />

              </Grid>
                {/* Profesion */}
                <Grid item sm={4} xs={12}>

                    <Autocomplete

                          options={listRhProfesion}
                          value={profesion}
                          id='profesion'
                          isOptionEqualToValue={(option, value) => option.id=== value.id}
                          getOptionLabel={option => option.id + '-' + option.descripcion }
                          onChange={handlerProfesion}
                          renderInput={params => <TextField {...params} label='Profesion' />}
                        />

                  </Grid>
                  {/* Titulo */}
                  <Grid item sm={4} xs={12}>

                  <Autocomplete

                        options={listRhTitulo}
                        value={titulo}
                        id='titulo'
                        isOptionEqualToValue={(option, value) => option.id=== value.id}
                        getOptionLabel={option => option.id + '-' + option.descripcion }
                        onChange={handlerTitulo}
                        renderInput={params => <TextField {...params} label='Titulo' />}
                      />

                  </Grid>
                     {/* Mencion */}
                  <Grid item sm={4} xs={12}>

                  <Autocomplete

                      options={listRhMencionEspecialidad}
                      value={mencion}
                      id='mencion'
                      isOptionEqualToValue={(option, value) => option.id=== value.id}
                      getOptionLabel={option => option.id + '-' + option.descripcion }
                      onChange={handlerMencion}
                      renderInput={params => <TextField {...params} label='Mencion' />}
                    />

                  </Grid>


             {/* ultimoAñoAprobado*/}
             <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='ultimoAñoAprobado'
                    control={control}
                    rules={{ minLength:1}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Ultimo Año Aprobado'
                        onChange={onChange}
                        placeholder='Ultimo Año Aprobado '
                        error={Boolean(errors.ultimoAñoAprobado)}
                        aria-describedby='validation-async-ultimoAñoAprobado'
                      />
                    )}
                  />
                  {errors.ultimoAñoAprobado && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-ultimoAñoAprobado'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>
            {/* Graduado */}
            <Grid item sm={4} xs={12}>

              <Autocomplete

                options={listGraduado}
                value={graduado}
                id='autocomplete-graduado'
                isOptionEqualToValue={(option, value) => option.id=== value.id}
                getOptionLabel={option => option.id + '-' + option.descripcion }
                onChange={handlerGraduado}
                renderInput={params => <TextField {...params} label='Graduado' />}
              />

            </Grid>




          <Grid item  sm={6} xs={12}>
                <DatePicker

                  selected={ getDateByObject(rhEducacionSeleccionado.fechaIniObj!)}
                  id='date-time-picker-fin'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerFechaIni(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Fecha Ini' />}
                />
            </Grid>
            <Grid item  sm={6} xs={12}>
                <DatePicker

                  selected={ getDateByObject(rhEducacionSeleccionado.fechaFinObj!)}
                  id='date-time-picker-fin'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerFechaFin(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Fecha Fin' />}
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
              {errorMessage.length>0 && <FormHelperText sx={{ color: 'error.main' ,fontSize: 20,mt:4 }}>{errorMessage}</FormHelperText>}
          </Box>
        </form>
      </CardContent>
    </Card>
  )


}

export default FormRhEducacionCreateAsync
