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

import { IPreRelacionCargosGetDto } from 'src/interfaces/Presupuesto/i-pre-relacion-cargos-get-dto'
import { IPreCargosGetDto } from 'src/interfaces/Presupuesto/i-pre-cargos-get-dto'
import { IPreRelacionCargosUpdateDto } from 'src/interfaces/Presupuesto/i-pre-relacion-cargos-update-dto'
import { setPreRelacionCargoSeleccionado, setVerPreRelacionCargoActive } from 'src/store/apps/pre-relacion-cargo'
import { IPreIndiceCategoriaProgramaticaGetDto } from '../../../interfaces/Presupuesto/i-pre-indice-categoria-programatica-get-dto';

interface FormInputs {
  codigoRelacionCargo: number
  ano: number
  escenario: number
  codigoIcp: number
  denominacionIcp: string
  codigoCargo: number
  denominacionCargo: string
  descripcionTipoCargo: string
  descripcionTipoPersonal: string
  cantidad: number
  sueldo: number
  compensacion: number
  prima: number
  otro: number
  extra1: string
  extra2: string
  extra3: string
  codigoPresupuesto: number
  totalMensual: string
  totalAnual: string


}

const FormPreRelacionCargoCreateAsync = () => {
  // ** States
  const dispatch = useDispatch();
  const { preRelacionCargoSeleccionado} = useSelector((state: RootState) => state.preRelacionCargo)
  const { presupuestoSeleccionado} = useSelector((state: RootState) => state.presupuesto)
  const { listIcp} = useSelector((state: RootState) => state.icp)
  const { listPreCargos} = useSelector((state: RootState) => state.preCargo)

  const  getCargo=(id:number)=>{

    //if(id==0) return default;
    console.log('listPreCargos',listPreCargos)
    const result = listPreCargos.filter((elemento)=>{

      return elemento.codigoCargo==id;
    });

    return result[0];
  }

  const  getIcp=(id:number)=>{

    //if(id==0) return default;
    const result = listIcp.filter((elemento)=>{

      return elemento.codigoIcp==id;
    });

    return result[0];
  }



  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [icp,setIcp] = useState<IPreIndiceCategoriaProgramaticaGetDto>(getIcp(preRelacionCargoSeleccionado.codigoIcp))
  const [cargo,setCargo] = useState<IPreCargosGetDto>(getCargo(preRelacionCargoSeleccionado.codigoCargo))

  const defaultValues:IPreRelacionCargosGetDto = {
    codigoRelacionCargo:preRelacionCargoSeleccionado.codigoRelacionCargo,
    ano: presupuestoSeleccionado.ano,
    escenario: preRelacionCargoSeleccionado.escenario,
    codigoIcp: preRelacionCargoSeleccionado.codigoIcp,
    denominacionIcp:preRelacionCargoSeleccionado.denominacionIcp,
    codigoCargo:preRelacionCargoSeleccionado.codigoCargo,
    denominacionCargo: preRelacionCargoSeleccionado.denominacionCargo,
    descripcionTipoCargo:preRelacionCargoSeleccionado.descripcionTipoCargo,
    descripcionTipoPersonal: preRelacionCargoSeleccionado.descripcionTipoPersonal,
    cantidad: preRelacionCargoSeleccionado.cantidad,
    sueldo: preRelacionCargoSeleccionado.sueldo,
    compensacion: preRelacionCargoSeleccionado.compensacion,
    prima: preRelacionCargoSeleccionado.prima ,
    otro: preRelacionCargoSeleccionado.otro,
    extra1: preRelacionCargoSeleccionado.extra1,
    extra2: preRelacionCargoSeleccionado.extra2,
    extra3: preRelacionCargoSeleccionado.extra3,
    totalMensual: preRelacionCargoSeleccionado.totalMensual,
    totalAnual: preRelacionCargoSeleccionado.totalAnual,
    codigoPresupuesto:presupuestoSeleccionado.codigoPresupuesto,
    icpConcat:preRelacionCargoSeleccionado.icpConcat,
    searchText:preRelacionCargoSeleccionado.searchText

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })


  const handlerCargo=async (e: any,value:any)=>{
    console.log(value)
    if(value!=null){
      setValue('codigoCargo',value.codigoCargo);
      setValue('denominacionCargo',value.denominacion);
      setCargo(value)
      console.log(cargo)

    }else{
      setValue('codigoCargo',0);

    }
  }
  const handlerCodigoIcp= async (e: any,value:any)=>{
    console.log(value)
    if(value!=null){
      setValue('codigoIcp',value.codigoIcp);
      setValue('denominacionIcp',value.denominacion);
      setIcp(value)

    }else{
      setValue('codigoIcp',0);
      setValue('denominacionIcp','');
    }
  }




  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updateRelacionCargo:IPreRelacionCargosUpdateDto= {


      codigoRelacionCargo: data.codigoRelacionCargo,
      ano: data.ano,
      escenario: data.escenario,
      codigoIcp: data.codigoIcp,
      denominacionIcp: data.denominacionIcp,
      codigoCargo: data.codigoCargo,
      cantidad: data.cantidad,
      sueldo: data.sueldo,
      compensacion: data.compensacion,
      prima: data.prima,
      otro: data.otro,
      extra1: data.extra1,
      extra2: data.extra2,
      extra3: data.extra3,
      codigoPresupuesto:data.codigoPresupuesto


    };

    const responseAll= await ossmmasofApi.post<any>('/PreRelacionCargos/Create',updateRelacionCargo);

    if(responseAll.data.isValid){
      dispatch(setPreRelacionCargoSeleccionado(responseAll.data.data))
      dispatch(setVerPreRelacionCargoActive(false))
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
  }
  useEffect(() => {




  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='Presupuesto - Crear Relacion Cargo' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoRelacionCargo'
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
               <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='ano'
                  control={control}
                  rules={{ required: true ,maxLength:200}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Ano'
                      onChange={onChange}
                      placeholder='Ano'
                      error={Boolean(errors.ano)}
                      disabled
                      aria-describedby='validation-async-ano'
                    />
                  )}
                />
                {errors.ano && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-ano'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* descripcion*/}
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='escenario'
                  control={control}
                  rules={{ min:0}}

                  render={({ field: { value, onChange } }) => (

                    <TextField

                      value={value || 0}
                      type="number"
                      label='Escenario'
                      onChange={onChange}
                      placeholder='Escenario'
                      error={Boolean(errors.escenario)}
                      aria-describedby='validation-async-escenario'
                    />
                  )}
                />
                {errors.escenario && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-escenario'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          {/* tipoPersonalId */}
          <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoIcp'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='codigoIcp'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoIcp)}
                      aria-describedby='validation-async-codigoIcp'
                      disabled
                    />
                  )}
                />
                {errors.codigoIcp && (
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

                        options={listIcp}
                        value={icp}
                        id='autocomplete-icp'
                        isOptionEqualToValue={(option, value) => option.codigoIcp=== value.codigoIcp}
                        getOptionLabel={option => option.codigoIcpConcat + '-' + option.denominacion }
                        onChange={handlerCodigoIcp}
                        renderInput={params => <TextField {...params} label='Icp' />}
                      />

                </FormControl>
            </Grid>


            {/* tipoCargoId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoCargo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id Cargo'
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
               {/* TipoCargo */}

               <Grid item sm={10} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete

                        options={listPreCargos}
                        value={cargo}
                        id='autocomplete-padre'
                        isOptionEqualToValue={(option, value) => option.codigoCargo=== value.codigoCargo}
                        getOptionLabel={option => option.codigoCargo + '-' + option.denominacion }
                        onChange={handlerCargo}
                        renderInput={params => <TextField {...params} label='Cargo' />}
                      />

                </FormControl>
            </Grid>

 {/* cantidad*/}
 <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='cantidad'
                  control={control}
                  rules={{ min:1}}

                  render={({ field: { value, onChange } }) => (

                    <TextField

                      value={value || 0}
                      type="number"
                      label='Cantidad'
                      onChange={onChange}
                      placeholder='Cantidad'
                      error={Boolean(errors.cantidad)}
                      aria-describedby='validation-async-Cantidad'
                    />
                  )}
                />
                {errors.escenario && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-cantidad'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* sueldo*/}
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='sueldo'
                  control={control}
                  rules={{ min:1}}

                  render={({ field: { value, onChange } }) => (

                    <TextField

                      value={value || 0}
                      type="decimal"
                      label='Sueldo'
                      onChange={onChange}
                      placeholder='Sueldo'
                      error={Boolean(errors.sueldo)}
                      aria-describedby='validation-async-sueldo'
                    />
                  )}
                />
                {errors.sueldo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-sueldo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* compensacion*/}
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='compensacion'
                  control={control}
                  rules={{ min:1}}

                  render={({ field: { value, onChange } }) => (

                    <TextField

                      value={value || 0}
                      type="decimal"
                      label='Compensacion'
                      onChange={onChange}
                      placeholder='Compensacion'
                      error={Boolean(errors.sueldo)}
                      aria-describedby='validation-async-compensacion'
                    />
                  )}
                />
                {errors.compensacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-compensacion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* prima*/}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='prima'
                  control={control}
                  rules={{ min:1}}

                  render={({ field: { value, onChange } }) => (

                    <TextField

                      value={value || 0}
                      type="decimal"
                      label='Prima'
                      onChange={onChange}
                      placeholder='Prima'
                      error={Boolean(errors.sueldo)}
                      aria-describedby='validation-async-prima'
                    />
                  )}
                />
                {errors.prima && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-prima'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* otro*/}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='otro'
                  control={control}
                  rules={{ min:1}}

                  render={({ field: { value, onChange } }) => (

                    <TextField

                      value={value || 0}
                      type="decimal"
                      label='Otro'
                      onChange={onChange}
                      placeholder='Otro'
                      error={Boolean(errors.sueldo)}
                      aria-describedby='validation-async-otro'
                    />
                  )}
                />
                {errors.otro && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-otro'>
                    This field is required
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

export default FormPreRelacionCargoCreateAsync
