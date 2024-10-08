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
import { Autocomplete, Box} from '@mui/material'
import { IRhRelacionCargoUpdateDto } from 'src/interfaces/rh/i-rh-relacion-cargo-update-dto'
import { setRhRelacionCargoSeleccionado, setVerRhRelacionCargoActive } from 'src/store/apps/rh-relacion-cargo'
import { IRhRelacionCargoDto } from 'src/interfaces/rh/i-rh-relacion-cargo-dto'
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas'


// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina'
import { NumericFormat } from 'react-number-format'



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
  fechaIngreso:Date;
  fechaIniString:string;
  fechaFinString: string;
  fechaIngresoString:string;

}



const FormRhRelacionCargoCreateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();


  const { preRelacionCargoSeleccionado} = useSelector((state: RootState) => state.preRelacionCargo)
  const { rhRelacionCargoSeleccionado} = useSelector((state: RootState) => state.rhRelacionCargo)
  const { personas,tiposNomina} = useSelector((state: RootState) => state.nomina)

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
  const [persona, setPersona] = useState<IListSimplePersonaDto>(getPersona(rhRelacionCargoSeleccionado.codigoPersona));
  const [tipo, setTipo] = useState<IListTipoNominaDto>(getTipoNomina(rhRelacionCargoSeleccionado.tipoNomina));

const defaultValues:IRhRelacionCargoDto = {
    codigoRelacionCargo:rhRelacionCargoSeleccionado.codigoRelacionCargo,
    codigoCargo :rhRelacionCargoSeleccionado.codigoCargo,
    tipoNomina:rhRelacionCargoSeleccionado.tipoNomina,
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
    codigoIcp:rhRelacionCargoSeleccionado.codigoIcp,
    fechaIngresoObj :rhRelacionCargoSeleccionado.fechaIngresoObj,
    fechaIngresoString:rhRelacionCargoSeleccionado.fechaIngresoString,
    fechaIngreso:rhRelacionCargoSeleccionado.fechaIngreso,

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




  const handlerPersona=async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoPersona',value.codigoPersona);
      setPersona(getPersona(value.codigoPersona));
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

  const handlerIngreso=(ingreso:Date)=>{


    setValue('fechaIngresoString',ingreso.toISOString())
    setValue('fechaIngreso',ingreso)
    const fechaObj:IFechaDto =fechaToFechaObj(ingreso);
    const rhRelacionCargoTmp= {...rhRelacionCargoSeleccionado,fechaIngreso:ingreso,fechaIngresoString:ingreso.toISOString(),fechaIngresoObj:fechaObj};
    dispatch(setRhRelacionCargoSeleccionado(rhRelacionCargoTmp))

  }

  const handlerSueldo = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)
    setValue('sueldo', valueInt)
  }
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
      codigoCargo: data.codigoCargo,
      codigoPersona :data.codigoPersona,
      sueldo: data.sueldo,
      fechaIni:data.fechaIni,
      fechaFin:data.fechaFin,
      codigoIcp:rhRelacionCargoSeleccionado.codigoIcp,
      fechaIngreso:data.fechaIngreso,



    };
    console.log('create ',updateRelacionCargo)
    const responseAll= await ossmmasofApi.post<any>('/RhRelacionCargos/Create',updateRelacionCargo);

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
    <Card style={{height:'400px'}}>
      <CardHeader title='RH - Crear Relacion Cargo.' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>



            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoPersona'
                  control={control}
                  rules={{ required: true}}
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
             {/* sueldo*/}
             <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                                  <Controller
                                      name='sueldo'
                                      control={control}
                                      rules={{
                                          required: false,
                                          min: 0.001,
                                      }}
                                      render={({ field: { value } }) => (
                                          <NumericFormat
                                              value={value}
                                              customInput={TextField}
                                              thousandSeparator="."
                                              decimalSeparator=","
                                              allowNegative={false}
                                              decimalScale={2}
                                              fixedDecimalScale={true}
                                              label="Sueldo"
                                              onValueChange={(values: any) => {
                                                  const { value } = values
                                                  handlerSueldo(value)
                                              }}
                                              placeholder='Sueldo'
                                              error={Boolean(errors.sueldo)}
                                              aria-describedby='validation-async-sueldo'
                                              inputProps={{
                                                  type: 'text',
                                              }}
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

            <Grid item  sm={3} xs={12}>
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
            <Grid item  sm={3} xs={12}>
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
            <Grid item  sm={3} xs={12}>
                <DatePicker
                  selected={ getDateByObject(rhRelacionCargoSeleccionado.fechaIngresoObj)}
                  id='date-time-picker-desde'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerIngreso(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Fecha Ingreso' />}
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

export default FormRhRelacionCargoCreateAsync
