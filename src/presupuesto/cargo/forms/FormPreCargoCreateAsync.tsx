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

//import { IFechaDto } from 'src/interfaces/fecha-dto'
//import { fechaToFechaObj } from 'src/utlities/fecha-to-fecha-object'
import { useDispatch } from 'react-redux'

//import { getDateByObject } from 'src/utlities/ge-date-by-object'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useEffect, useState } from 'react'
import { Autocomplete, Box} from '@mui/material'
import { IPreDescriptivasGetDto } from 'src/interfaces/Presupuesto/i-pre-descriptivas-get-dto'
import { setPreCargoSeleccionado, setTipoPersonalSeleccionado, setVerPreCargoActive } from 'src/store/apps/pre-cargo'
import { IPreCargosUpdateDto } from 'src/interfaces/Presupuesto/i-pre-cargos-update-dto'


interface FormInputs {
  codigoCargo :number;
  tipoPersonalId :number;
  tipoCargoId :number;
  denominacion:string;
  descripcion:string;
  grado:number;
  extra1 :string;
  extra2 :string;
  extra3 :string;
  codigoPresupuesto:number;

}





const FormPreCargoCreateAsync = () => {
  // ** States
  const dispatch = useDispatch();
  const { listTipoPersonal,preCargoSeleccionado
  } = useSelector((state: RootState) => state.preCargo)


  const defaultCargo:IPreDescriptivasGetDto={
    descripcionId : 0,
    descripcionIdFk : 0,
    descripcion : 'Seleccione',
    codigo : '',
    tituloId : 0,
    descripcionTitulo : '',
    extra1 : '',
    extra2 : '',
    extra3 : '',
    listaDescriptiva:[{
      descripcionId : 0,
      descripcionIdFk : 0,
      descripcion : 'Seleccione',
      codigo : '',
      tituloId : 0,
      descripcionTitulo : '',
      extra1 : '',
      extra2 : '',
      extra3 : '',
      listaDescriptiva:[]
    }]
  }



  const  getTipoCargo=(id:number)=>{

    const result = tipoPersonal?.listaDescriptiva?.filter((elemento)=>{

      return elemento.descripcionId==id;
    });

    return result[0];
  }
  const  getTipoPersonal=(id:number)=>{

    if(id==0) return defaultCargo;
    const result = listTipoPersonal.filter((elemento)=>{

      return elemento.descripcionId==id;
    });

    return result[0];
  }



 // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [tipoPersonal,setTipoPersonal] = useState<IPreDescriptivasGetDto>(getTipoPersonal(preCargoSeleccionado.tipoPersonalId))

  const [tipoCargo,setTipoCargo] = useState<IPreDescriptivasGetDto>(getTipoCargo(preCargoSeleccionado.tipoCargoId))

  const [listCargos,setListCargos] = useState<IPreDescriptivasGetDto[]>([])


  const defaultValues = {
      codigoCargo :preCargoSeleccionado.codigoCargo,
      tipoPersonalId :preCargoSeleccionado.tipoPersonalId,
      tipoCargoId:preCargoSeleccionado.tipoCargoId,
      denominacion :preCargoSeleccionado.denominacion,
      descripcion :preCargoSeleccionado.descripcion,
      grado :preCargoSeleccionado.grado,
      extra1 :preCargoSeleccionado.extra1,
      extra2 :preCargoSeleccionado.extra2,
      extra3 :preCargoSeleccionado.extra3,
      codigoPresupuesto:preCargoSeleccionado.codigoPresupuesto

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })
  const handlerTipoPersonal=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tipoPersonalId',value.descripcionId);
      setTipoPersonal(value);
      setListCargos(value.listaDescriptiva);
      setValue('tipoCargoId',0);
      setTipoCargo(getTipoCargo(0))
      dispatch(setTipoPersonalSeleccionado(value))

      const newSeleccionado = {...preCargoSeleccionado,tipoPersonalId:value.descripcionId,tipoCargoId:0}
      dispatch(setPreCargoSeleccionado(newSeleccionado))



    }else{
      setValue('tipoPersonalId',0);
      setValue('tipoCargoId',0);
      setListCargos([]);
    }
  }

  const handlerTipoCargo=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tipoCargoId',value.descripcionId);
      setTipoCargo(value)
      const newSeleccionado = {...preCargoSeleccionado,tipoCargoId:value.descripcionId}
      dispatch(setPreCargoSeleccionado(newSeleccionado))


    }else{
      setValue('tipoCargoId',0);

    }
  }





  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updateCargo:IPreCargosUpdateDto= {
      codigoCargo :preCargoSeleccionado.codigoCargo,
      tipoPersonalId :data.tipoPersonalId,
      tipoCargoId:data.tipoCargoId,
      denominacion :data.denominacion,
      descripcion :data.descripcion,
      grado :data.grado,
      extra1 :data.extra1,
      extra2 :data.extra2,
      extra3 :data.extra3,
      codigoPresupuesto:preCargoSeleccionado.codigoPresupuesto

    };

    const responseAll= await ossmmasofApi.post<any>('/PreCargos/Create',updateCargo);

    if(responseAll.data.isValid){
      dispatch(setPreCargoSeleccionado(responseAll.data.data))
      dispatch(setVerPreCargoActive(false))
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
  }
  useEffect(() => {


    const selec =  getTipoPersonal(preCargoSeleccionado.tipoPersonalId);
    setListCargos(selec.listaDescriptiva);

   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);


   return (
    <Card>
      <CardHeader title='Presupuesto - Crear Cargo' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoCargo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoCargo)}
                      aria-describedby='validation-async-codigoCargo'
                      disabled
                    />
                  )}
                />
                {errors.codigoCargo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoCargo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
               {/* descripcion*/}
               <Grid item sm={10} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='denominacion'
                  control={control}
                  rules={{ required: true ,maxLength:200}}
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
            {/* descripcion*/}
            <Grid item sm={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='descripcion'
                  control={control}
                  rules={{ maxLength:2000}}
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
          {/* tipoPersonalId */}
          <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='tipoPersonalId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Tipo Personal Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.tipoPersonalId)}
                      aria-describedby='validation-async-tipoPersonalId'
                      disabled
                    />
                  )}
                />
                {errors.tipoPersonalId && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-tipoPersonalId'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
               {/* TipoPersonal */}

               <Grid item sm={10} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete

                        options={listTipoPersonal}
                        value={tipoPersonal}
                        id='autocomplete-tipoPersonal'
                        isOptionEqualToValue={(option, value) => option.descripcionId=== value.descripcionId}
                        getOptionLabel={option => option.descripcionId + '-' + option.descripcion }
                        onChange={handlerTipoPersonal}
                        renderInput={params => <TextField {...params} label='Tipo Personal' />}
                      />

                </FormControl>
            </Grid>


            {/* tipoCargoId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='tipoCargoId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id Tipo Cargo'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.tipoCargoId)}
                      aria-describedby='validation-async-tipoCargoId'
                      disabled
                    />
                  )}
                />
                {errors.tipoCargoId && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-tipoCargoId'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
               {/* TipoCargo */}

               <Grid item sm={10} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete

                        options={listCargos}
                        value={tipoCargo}
                        id='autocomplete-padre'
                        isOptionEqualToValue={(option, value) => option.descripcionId=== value.descripcionId}
                        getOptionLabel={option => option.descripcionId + '-' + option.descripcion }
                        onChange={handlerTipoCargo}
                        renderInput={params => <TextField {...params} label='Tipo Cargo' />}
                      />

                </FormControl>
            </Grid>




            {/* grado*/}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='grado'
                  control={control}
                  rules={{ maxLength:10}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                    type='number'
                      value={value || ''}
                      label='Grado'
                      onChange={onChange}
                      placeholder='Grado'
                      error={Boolean(errors.grado)}
                      aria-describedby='validation-async-grado'
                    />
                  )}
                />
                {errors.grado && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-grado'>
                    Este Campo es Requerido y su longitud Maxima es de 10 digitos.
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* extra1*/}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='extra1'
                  control={control}
                  rules={{ maxLength:100}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Extra1'
                      onChange={onChange}
                      placeholder='extra1'
                      error={Boolean(errors.extra1)}
                      aria-describedby='validation-async-codigo'
                    />
                  )}
                />
                {errors.extra1 && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-extra1'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* extra2*/}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='extra2'
                  control={control}
                  rules={{ maxLength:100}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Extra2'
                      onChange={onChange}
                      placeholder='extra1'
                      error={Boolean(errors.extra2)}
                      aria-describedby='validation-async-extra2'
                    />
                  )}
                />
                {errors.extra2 && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-extra2'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* extra3*/}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='extra3'
                  control={control}
                  rules={{ maxLength:100}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Extra3'
                      onChange={onChange}
                      placeholder='extra3'
                      error={Boolean(errors.extra2)}
                      aria-describedby='validation-async-extra3'
                    />
                  )}
                />
                {errors.extra3 && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-extra3'>
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

export default FormPreCargoCreateAsync
