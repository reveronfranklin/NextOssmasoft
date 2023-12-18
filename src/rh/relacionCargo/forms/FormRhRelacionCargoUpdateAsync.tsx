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
// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Types


import { useDispatch } from 'react-redux'

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useEffect, useState } from 'react'
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'
import { IRhRelacionCargoUpdateDto } from 'src/interfaces/rh/i-rh-relacion-cargo-update-dto'
import { setRhRelacionCargoSeleccionado, setVerRhRelacionCargoActive } from 'src/store/apps/rh-relacion-cargo'
import { IRhRelacionCargoDeleteDto } from 'src/interfaces/rh/i-rh-relacion-cargo-delete-dto'
import { IRhRelacionCargoDto } from 'src/interfaces/rh/i-rh-relacion-cargo-dto'
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas'


// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IListTipoNominaDto } from '../../../interfaces/rh/i-list-tipo-nomina';
import { IPreIndiceCategoriaProgramaticaGetDto } from 'src/interfaces/Presupuesto/i-pre-indice-categoria-programatica-get-dto'



interface FormInputs {
  codigoRelacionCargoPre:number
  codigoRelacionCargo: number
  tipoNomina:number
  codigoIcp:number
  codigoCargo: number
  denominacionCargo: string
  codigoPersona:number
  sueldo: number
  fechaIni:Date;
  fechaFin: Date;
  fechaIniString:string;
  fechaFinString: string;

}



const FormRhRelacionCargoUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();


  const { preRelacionCargoSeleccionado} = useSelector((state: RootState) => state.preRelacionCargo)
  const { rhRelacionCargoSeleccionado} = useSelector((state: RootState) => state.rhRelacionCargo)
  const { personas,tiposNomina} = useSelector((state: RootState) => state.nomina)
  const { listIcp} = useSelector((state: RootState) => state.icp)


  const  getIcp=(id:number)=>{

    //if(id==0) return default;
    const result = listIcp.filter((elemento)=>{

      return elemento.codigoIcp==id;
    });

    return result[0];
  }
  const  getPersona=(id:number)=>{

    //if(id==0) return default;
    const result = personas.filter((elemento)=>{

      return elemento.codigoPersona==id;
    });

    return result[0];
  }
  const  getTipoNomina=(id:number)=>{

    //if(id==0) return default;
    const result = tiposNomina.filter((elemento)=>{

      return elemento.codigoTipoNomina==id;
    });

    return result[0];
  }

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState<IListSimplePersonaDto>(getPersona(rhRelacionCargoSeleccionado.codigoPersona));
  const [tipo, setTipo] = useState<IListTipoNominaDto>(getTipoNomina(rhRelacionCargoSeleccionado.tipoNomina));
  const [icp,setIcp] = useState<IPreIndiceCategoriaProgramaticaGetDto>(getIcp(preRelacionCargoSeleccionado.codigoIcp))

  const defaultValues:IRhRelacionCargoDto = {
    codigoRelacionCargo:rhRelacionCargoSeleccionado.codigoRelacionCargo,
    codigoCargo :rhRelacionCargoSeleccionado.codigoCargo,
    tipoNomina:rhRelacionCargoSeleccionado.tipoNomina,
    codigoIcp:rhRelacionCargoSeleccionado.codigoIcp,
    denominacionCargo :rhRelacionCargoSeleccionado.denominacionCargo,
    codigoPersona :rhRelacionCargoSeleccionado.codigoPersona,
    nombre:rhRelacionCargoSeleccionado.nombre,
    apellido :rhRelacionCargoSeleccionado.apellido,
    cedula:rhRelacionCargoSeleccionado.cedula,
    sueldo :rhRelacionCargoSeleccionado.sueldo,
    fechaIni:rhRelacionCargoSeleccionado.fechaIni,
    fechaFin:rhRelacionCargoSeleccionado.fechaFin,
    fechaIniString:rhRelacionCargoSeleccionado.fechaIniString,
    fechaFinString:rhRelacionCargoSeleccionado.fechaFinString,
    fechaIniObj:rhRelacionCargoSeleccionado.fechaIniObj,
    fechaFinObj :rhRelacionCargoSeleccionado.fechaFinObj,
    codigoRelacionCargoPre :preRelacionCargoSeleccionado.codigoRelacionCargo,
    searchText:'',


  }



  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerInicio=(inicio:Date)=>{

    console.log(inicio)
    setValue('fechaIniString',inicio.toISOString())
    setValue('fechaIni',inicio)
    const fechaObj:IFechaDto =fechaToFechaObj(inicio);
    const rhRelacionCargoTmp= {...rhRelacionCargoSeleccionado,fechaIni:inicio,fechaIniString:inicio.toISOString(),fechaIniObj:fechaObj};
    dispatch(setRhRelacionCargoSeleccionado(rhRelacionCargoTmp))

  }
  const handlerFin=(fin:Date)=>{


    setValue('fechaFinString',fin.toISOString())
    setValue('fechaFin',fin)
    const fechaObj:IFechaDto =fechaToFechaObj(fin);
    const rhRelacionCargoTmp= {...rhRelacionCargoSeleccionado,fechaFin:fin,fechaFinString:fin.toISOString(),fechaFinObj:fechaObj};
    dispatch(setRhRelacionCargoSeleccionado(rhRelacionCargoTmp))

  }


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlerPersona=async (e: any,value:any)=>{
    console.log(value)
    if(value!=null){
      setValue('codigoPersona',value.codigoPersona);
      setPersona(value);
    }else{
      setValue('codigoPersona',0);
    }
  }
  const handlerTipoNomina=async (e: any,value:any)=>{
    console.log(value)
    if(value!=null){
      setValue('tipoNomina',value.codigoTipoNomina);
      setTipo(value);
    }else{
      setValue('tipoNomina',0);
    }
  }
  const handlerCodigoIcp= async (e: any,value:any)=>{
    console.log(value)
    if(value!=null){
      setValue('codigoIcp',value.codigoIcp);

      setIcp(value)

    }else{
      setValue('codigoIcp',0);

    }
  }
  const handleDelete = async  () => {

    setOpen(false);
    const deleteRelacionCargo : IRhRelacionCargoDeleteDto={
      codigoRelacionCargo:rhRelacionCargoSeleccionado.codigoRelacionCargo
    }
    const responseAll= await ossmmasofApi.post<any>('/RhRelacionCargos/Delete',deleteRelacionCargo);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerRhRelacionCargoActive(false))
      dispatch(setRhRelacionCargoSeleccionado({}))
    }


  };
  const onSubmit = async (data:FormInputs) => {

    if(rhRelacionCargoSeleccionado.fechaIniObj.year=='1900'){
      setErrorMessage('Debe indicar una fecha de Inicio Valida')

      return;
    }
    setLoading(true)

    const updateRelacionCargo:IRhRelacionCargoUpdateDto= {



      codigoRelacionCargoPre:data.codigoRelacionCargoPre,
      codigoRelacionCargo: data.codigoRelacionCargo,
      tipoNomina:data.tipoNomina,
      codigoIcp: data.codigoIcp,
      codigoCargo: data.codigoCargo,
      codigoPersona :data.codigoPersona,
      sueldo: data.sueldo,
      fechaIni:data.fechaIni,
      fechaFin:data.fechaFin


    };
    console.log('llamada a el update *****8',updateRelacionCargo)
    const responseAll= await ossmmasofApi.post<any>('/RhRelacionCargos/Update',updateRelacionCargo);

    if(responseAll.data.isValid){
      dispatch(setRhRelacionCargoSeleccionado(responseAll.data.data))
      dispatch(setVerRhRelacionCargoActive(false))
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
    <Card style={{height:'500px'}}>
      <CardHeader title='RH - Modificar Relacion Cargo' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>



            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoPersona'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='codigoPersona'
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
            {/* TipoPersonal */}
            <Grid item sm={10} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete

                        options={personas}
                        value={persona}
                        id='autocomplete-persona'
                        isOptionEqualToValue={(option, value) => option.codigoPersona=== value.codigoPersona}
                        getOptionLabel={option => option.cedula + '-' + option.nombre + option.apellido }
                        onChange={handlerPersona}
                        renderInput={params => <TextField {...params} label='Persona' />}
                      />

                </FormControl>
            </Grid>

            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='tipoNomina'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Tipo Nomina'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.tipoNomina)}
                      aria-describedby='validation-async-tipoNomina'
                      disabled
                    />
                  )}
                />
                {errors.tipoNomina && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-tipoNomina'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* TipoPersonal */}
            <Grid item sm={10} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete

                        options={tiposNomina}
                        value={tipo}
                        id='autocomplete-tipoNomina'
                        isOptionEqualToValue={(option, value) => option.codigoTipoNomina=== value.codigoTipoNomina}
                        getOptionLabel={option => option.codigoTipoNomina + '-' + option.descripcion  }
                        onChange={handlerTipoNomina}
                        renderInput={params => <TextField {...params} label='Tipo Nomina' />}
                      />

                </FormControl>
            </Grid>
          {/* codigoIcp */}
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

               {/* Icp */}

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
            {/* sueldo*/}
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='sueldo'
                  control={control}
                  rules={{ min:0.001}}

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

            <Grid item  sm={4} xs={12}>
            <DatePicker


                  selected={ getDateByObject(rhRelacionCargoSeleccionado.fechaIniObj)}
                  id='date-time-picker-desde'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerInicio(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Fecha Inicio' />}
                />
            </Grid>
            <Grid item  sm={4} xs={12}>
                <DatePicker
                  selected={ getDateByObject(rhRelacionCargoSeleccionado.fechaFinObj)}
                  id='date-time-picker-desde'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerFin(date)}
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
                  {"Esta Seguro de Eliminar este Cargo?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminara el Cargo solo si no tiene movimiento asociado
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
          <Grid container spacing={5}>


        </Grid>
          <Box>
              {errorMessage.length>0 && <FormHelperText sx={{ color: 'error.main' ,fontSize: 20,mt:4 }}>{errorMessage}</FormHelperText>}
          </Box>
        </form>
      </CardContent>
    </Card>
  )


}

export default FormRhRelacionCargoUpdateAsync
