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

import { setListRhBancos, setListRhTipoCuenta, setRhAdministrativoSeleccionado, setVerRhAdministrativasActive } from 'src/store/apps/rh-administrativos'
import { IRhAdministrativosUpdateDto } from 'src/interfaces/rh/i-rh-administrativos-update-dto'


import { getDateByObject, monthByIndex } from 'src/utilities/ge-date-by-object'


// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { IPersonaDto } from 'src/interfaces/rh/i-rh-persona-dto'
import { setPersonaSeleccionado, setPersonasDtoSeleccionado } from 'src/store/apps/rh'
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas'

interface FormInputs {
  codigoAdministrativo:number,
  fechaIngreso:string,
  tipoPago :string,
  bancoId :number,
  tipoCuentaId :number,
  noCuenta :string,

}



const FormRhPersonaCreateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();


  const {rhAdministrativoSeleccionado,listRhBancos,listRhTipoCuenta} = useSelector((state: RootState) => state.rhAdministrativos)

  const listTipoPago =[{id:'D',descripcion:'Deposito'},{id:'E',descripcion:'Efectivo'}]
  const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}
  const defaultDateString = fechaActual.toISOString();

  const  getTipoPago=(id:string)=>{

    const result = listTipoPago?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getBanco=(id:number)=>{

    const result = listRhBancos?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getTipoCuenta=(id:number)=>{

    const result = listRhTipoCuenta?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [banco,setBanco] = useState<ISelectListDescriptiva>(getBanco(rhAdministrativoSeleccionado.bancoId))
  const [tipoCuenta,setTipoCuenta] = useState<ISelectListDescriptiva>(getTipoCuenta(rhAdministrativoSeleccionado.tipoCuentaId))
  const [tipoPago,setTipoPago] = useState<any>(getTipoPago(rhAdministrativoSeleccionado.tipoPago))

  const defaultValues = {
      codigoAdministrativo:rhAdministrativoSeleccionado.codigoAdministrativo,
      fechaIngreso:rhAdministrativoSeleccionado.fechaIngreso,
      tipoPago :rhAdministrativoSeleccionado.tipoPago,
      bancoId :rhAdministrativoSeleccionado.bancoId,
      tipoCuentaId :rhAdministrativoSeleccionado.tipoCuentaId,
      noCuenta :rhAdministrativoSeleccionado.noCuenta,


  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })



  const handlerBanco=async (e: any,value:any)=>{

    if(value!=null){
      setErrorMessage('');
      setValue('bancoId',value.id);
      setBanco(value);

    }else{
      setValue('bancoId',0);

    }
  }
  const handlerTipoCuenta=async (e: any,value:any)=>{

    if(value!=null){
      setErrorMessage('');
      setValue('tipoCuentaId',value.id);
      setTipoCuenta(value);
    }else{
      setValue('tipoCuentaId',0);

    }
  }


  const handlerTipoPago=async (e: any,value:any)=>{

    if(value!=null){
      setErrorMessage('');
      setValue('tipoPago',value.id);
      setTipoPago(value);
    }else{
      setValue('tipoPago','');

    }
  }




  const handlerFechaDesde=(desde:Date)=>{


    const fechaObj:IFechaDto =fechaToFechaObj(desde);
    const presupuestoTmp= {...rhAdministrativoSeleccionado,fechaIngreso:desde.toISOString(),fechaIngresoObj:fechaObj};
    dispatch(setRhAdministrativoSeleccionado(presupuestoTmp))
    setValue('fechaIngreso',desde.toISOString());
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

    }



  }


  const onSubmit = async (data:FormInputs) => {


    if(data.bancoId<=0){
      setErrorMessage('Banco Invalido');

      return;
    }
    if(data.tipoCuentaId<=0){
      setErrorMessage('Tipo de Cuenta Invalida');

      return;
    }
    const tipo =['D','E'];
    if(!tipo.includes(data.tipoPago)){

      setErrorMessage('Tipo de Pago Invalido');

      return;
    }
    if(data.noCuenta.length!=20){
      setErrorMessage('Cuenta Invalida(20 Digitos)');

      return;
    }

    setLoading(true)

    const updateAdministrativo:IRhAdministrativosUpdateDto= {
      codigoAdministrativo :rhAdministrativoSeleccionado.codigoAdministrativo,
      codigoPersona:rhAdministrativoSeleccionado.codigoPersona,
      bancoId :data.bancoId,
      tipoCuentaId:data.tipoCuentaId,
      tipoPago :data.tipoPago,
      noCuenta :data.noCuenta,
      fechaIngreso :data.fechaIngreso,


    };
    console.log('updateAdministrativo',updateAdministrativo)
    const responseAll= await ossmmasofApi.post<any>('/RhAdministrativos/Create',updateAdministrativo);

    if(responseAll.data.isValid){
      dispatch(setRhAdministrativoSeleccionado(responseAll.data.data))
      dispatch(setVerRhAdministrativasActive(false))
      handlerPersona(responseAll.data.data)
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
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
      <CardHeader title='RH - Modificar Banco' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoAdministrativo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoAdministrativo)}
                      aria-describedby='validation-async-codigoAdministrativo'
                      disabled
                    />
                  )}
                />
                {errors.codigoAdministrativo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoAdministrativo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
           {/* Tipo de Pago */}
           <Grid item sm={10} xs={12}>

              <Autocomplete

                    options={listTipoPago}
                    value={tipoPago}
                    id='autocomplete-padre'
                    isOptionEqualToValue={(option, value) => option.id=== value.id}
                    getOptionLabel={option => option.id + '-' + option.descripcion }
                    onChange={handlerTipoPago}
                    renderInput={params => <TextField {...params} label='Tipo Pago' />}
                  />

          </Grid>

          {/* Banco */}
          <Grid item sm={12} xs={12}>


          <Autocomplete

              options={listRhBancos}
              value={banco}
              id='autocomplete-bancos'
              isOptionEqualToValue={(option, value) => option.id=== value.id}
              getOptionLabel={option => option.id + '-' + option.descripcion }
              onChange={handlerBanco}
              renderInput={params => <TextField {...params} label='Bancos' />}
            />


          </Grid>



          {/* Tipo Cuenta */}

          <Grid item sm={12} xs={12}>

            <Autocomplete

                  options={listRhTipoCuenta}
                  value={tipoCuenta}
                  id='autocomplete-padre'
                  isOptionEqualToValue={(option, value) => option.id=== value.id}
                  getOptionLabel={option => option.id + '-' + option.descripcion }
                  onChange={handlerTipoCuenta}
                  renderInput={params => <TextField {...params} label='Tipo Cuenta' />}
                />

          </Grid>
          <Grid item  sm={3} xs={12}>
                <DatePicker

                  selected={ getDateByObject(rhAdministrativoSeleccionado.fechaIngresoObj!)}
                  id='date-time-picker-desde'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerFechaDesde(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Fecha Ingreso' />}
                />
            </Grid>



            {/* descripcion*/}
            <Grid item sm={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='noCuenta'
                  control={control}
                  rules={{ maxLength:20,minLength:20}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='noCuenta'
                      onChange={onChange}
                      placeholder='noCuenta'
                      error={Boolean(errors.noCuenta)}
                      aria-describedby='validation-async-noCuenta'
                    />
                  )}
                />
                {errors.noCuenta && (
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

export default FormRhPersonaCreateAsync
