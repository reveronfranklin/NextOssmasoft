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




import { getDateByObject } from 'src/utilities/ge-date-by-object'


// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { IRhExpLaboralResponseDto } from 'src/interfaces/rh/RhExpLaboralResponseDto'
import { setRhExperienciaSeleccionado, setVerRhExperienciaActive } from 'src/store/apps/rh-experiencia'
import { IRhExpLaboralUpdateDto } from 'src/interfaces/rh/RhExpLaboralUpdateDto'

interface FormInputs {

  codigoExpLaboral: number;
  codigoPersona :number;
  nombreEmpresa :string;
  tipoEmpresa :string;
  cargo:string;
  fechaDesde:Date;
  fechaHasta :Date;
  fechaDesdeString:string;
  fechaHastaString:string;
  fechaDesdeObj:IFechaDto;
  fechaHastaObj :IFechaDto;
  ultimoSueldo:number;
  supervisor :string;
  cargoSupervisor  :string;
  telefono: string;
  descripcion  :string;

}



const FormRhVariacionCreateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();

  const listTipoEmpresa=[{id:'G',descripcion:'Gobierno'},{id:'P',descripcion:'Privado'}]
  const {rhExperienciaSeleccionado} = useSelector((state: RootState) => state.rhExperiencia)


  const  getTipoEmpresa=(id:string)=>{

    const result = listTipoEmpresa?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }







  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [tipoEmpresa,setTipoEmpresa] = useState<any>(getTipoEmpresa(rhExperienciaSeleccionado.tipoEmpresa))

  const defaultValues:IRhExpLaboralResponseDto = {

    codigoExpLaboral:rhExperienciaSeleccionado.codigoExpLaboral,
    codigoPersona :rhExperienciaSeleccionado.codigoPersona,
    nombreEmpresa :rhExperienciaSeleccionado.nombreEmpresa,
    tipoEmpresa :rhExperienciaSeleccionado.tipoEmpresa,
    ramoId :rhExperienciaSeleccionado.ramoId,
    cargo:rhExperienciaSeleccionado.cargo,
    fechaDesde :rhExperienciaSeleccionado.fechaDesde,
    fechaDesdeString :rhExperienciaSeleccionado.fechaDesdeString,
    fechaHasta :rhExperienciaSeleccionado.fechaHasta,
    fechaHastaString :rhExperienciaSeleccionado.fechaDesdeString,
    fechaDesdeObj:rhExperienciaSeleccionado.fechaDesdeObj,
    fechaHastaObj:rhExperienciaSeleccionado.fechaHastaObj,
    ultimoSueldo:rhExperienciaSeleccionado.ultimoSueldo,
    supervisor :rhExperienciaSeleccionado.supervisor,
    cargoSupervisor  :rhExperienciaSeleccionado.cargoSupervisor,
    telefono: rhExperienciaSeleccionado.telefono,
    descripcion  :rhExperienciaSeleccionado.descripcion


}

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })





  const handlerTipoEmpresa=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tipoEmpresa',value.id);
      setTipoEmpresa(value);

    }else{
      setValue('tipoEmpresa','');

    }
  }




  const handlerFechaIni=(desde:Date)=>{
    const fechaObj:IFechaDto =fechaToFechaObj(desde);
    const familiaresTmp= {...rhExperienciaSeleccionado,fechaDesde:desde,fechaDesdeString:desde.toISOString(),fechaDesdeObj:fechaObj};
    dispatch(setRhExperienciaSeleccionado(familiaresTmp))
    setValue('fechaDesde',desde);
    setValue('fechaDesdeString',desde.toISOString());
    setValue('fechaDesdeObj',fechaObj);
  }
  const handlerFechaFin=(desde:Date)=>{
    const fechaObj:IFechaDto =fechaToFechaObj(desde);
    const educacionTmp= {...rhExperienciaSeleccionado,fechaHasta:desde,fechaDesdeString:desde.toISOString(),fechaDesdeObj:fechaObj};
    dispatch(setRhExperienciaSeleccionado(educacionTmp))
    setValue('fechaHasta',desde);
    setValue('fechaHastaString',desde.toISOString());
    setValue('fechaHastaObj',fechaObj);
  }



  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updateExperiencia:IRhExpLaboralUpdateDto ={
            codigoExpLaboral:rhExperienciaSeleccionado.codigoExpLaboral,
            codigoPersona :rhExperienciaSeleccionado.codigoPersona,
            nombreEmpresa :data.nombreEmpresa,
            tipoEmpresa :data.tipoEmpresa,
            ramoId :0,
            cargo:data.cargo,
            fechaDesde :rhExperienciaSeleccionado.fechaDesde,
            fechaDesdeString :rhExperienciaSeleccionado.fechaDesdeString,
            fechaHasta :rhExperienciaSeleccionado.fechaHasta,
            fechaHastaString :rhExperienciaSeleccionado.fechaDesdeString,
            fechaDesdeObj:rhExperienciaSeleccionado.fechaDesdeObj,
            fechaHastaObj:rhExperienciaSeleccionado.fechaHastaObj,
            ultimoSueldo:rhExperienciaSeleccionado.ultimoSueldo,
            supervisor :data.supervisor,
            cargoSupervisor  :data.cargoSupervisor,
            telefono: data.telefono,
            descripcion  :data.descripcion
    };

    console.log('updateEducacion',updateExperiencia)
    const responseAll= await ossmmasofApi.post<any>('/RhExpLaboral/Create',updateExperiencia);

    if(responseAll.data.isValid){
      dispatch(setRhExperienciaSeleccionado(responseAll.data.data))
      dispatch(setVerRhExperienciaActive(false))
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
      <CardHeader title='RH - Crear Variacion' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoExpLaboral'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoExpLaboral)}
                      aria-describedby='validation-async-codigoExpLaboral'
                      disabled
                    />
                  )}
                />
                {errors.codigoExpLaboral && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoExpLaboral'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
              {/* nombreInstituto*/}
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='nombreEmpresa'
                    control={control}
                    rules={{ minLength:5}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Instituto'
                        onChange={onChange}
                        placeholder='Instituto'
                        error={Boolean(errors.nombreEmpresa)}
                        aria-describedby='validation-async-instituto'
                      />
                    )}
                  />
                  {errors.nombreEmpresa && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-nombreEmpresa'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>
              {/* Tipo Empresa */}
              <Grid item sm={4} xs={12}>

                <Autocomplete

                  options={listTipoEmpresa}
                  value={tipoEmpresa}
                  id='autocomplete-graduado'
                  isOptionEqualToValue={(option, value) => option.id=== value.id}
                  getOptionLabel={option => option.id + '-' + option.descripcion }
                  onChange={handlerTipoEmpresa}
                  renderInput={params => <TextField {...params} label='Tipo Empresa' />}
                />

              </Grid>

             {/* nombre*/}
             <Grid item sm={8} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='cargo'
                    control={control}
                    rules={{ minLength:5}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Cargo'
                        onChange={onChange}
                        placeholder='Cargo'
                        error={Boolean(errors.cargo)}
                        aria-describedby='validation-async-cargo'
                      />
                    )}
                  />
                  {errors.cargo && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-cargo'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>




             {/* ultimoSueldo*/}
             <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='ultimoSueldo'
                    control={control}
                    rules={{ minLength:1}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Ultimo Sueldo'
                        onChange={onChange}
                        placeholder='ultimoSueldo '
                        error={Boolean(errors.ultimoSueldo)}
                        aria-describedby='validation-async-ultimoSueldo'
                      />
                    )}
                  />
                  {errors.ultimoSueldo && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-ultimoSueldo'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>
            {/* supervisor*/}
            <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='supervisor'
                    control={control}
                    rules={{ minLength:1}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Supervisor'
                        onChange={onChange}
                        placeholder='supervisor '
                        error={Boolean(errors.supervisor)}
                        aria-describedby='validation-async-supervisor'
                      />
                    )}
                  />
                  {errors.supervisor && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-supervisor'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>
               {/* supervisor*/}
               <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='cargoSupervisor'
                    control={control}
                    rules={{ minLength:1}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Cargo Supervisor'
                        onChange={onChange}
                        placeholder='Cargo Supervisor '
                        error={Boolean(errors.cargoSupervisor)}
                        aria-describedby='validation-async-supervisor'
                      />
                    )}
                  />
                  {errors.cargoSupervisor && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-cargoSupervisor'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>
            {/* telefono*/}
            <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='telefono'
                    control={control}
                    rules={{ minLength:1}}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value || ''}
                        label='Telefono'
                        onChange={onChange}
                        placeholder='Telefono'
                        error={Boolean(errors.telefono)}
                        aria-describedby='validation-async-telefono'
                      />
                    )}
                  />
                  {errors.telefono && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-telefono'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
            </Grid>
            {/* descripcion*/}
            <Grid item sm={8} xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='descripcion'
                    control={control}
                    rules={{ minLength:1}}
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


          <Grid item  sm={6} xs={12}>
                <DatePicker

                  selected={ getDateByObject(rhExperienciaSeleccionado.fechaDesdeObj!)}
                  id='date-time-picker-fin'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerFechaIni(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Fecha Desde' />}
                />
            </Grid>
            <Grid item  sm={6} xs={12}>
                <DatePicker

                  selected={ getDateByObject(rhExperienciaSeleccionado.fechaHastaObj!)}
                  id='date-time-picker-fin'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerFechaFin(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Fecha Hasta' />}
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

export default FormRhVariacionCreateAsync
