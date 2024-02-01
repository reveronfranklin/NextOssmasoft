// ** React Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Icon from 'src/@core/components/icon'
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
import { Autocomplete, Box, IconButton, Tooltip} from '@mui/material'



import { getDateByObject } from 'src/utilities/ge-date-by-object'


// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import dayjs from 'dayjs'
import { setRhConceptosFormulaSeleccionado, setVerRhConceptosFormulaActive } from 'src/store/apps/rh-conceptos-formula';
import { IRhConceptosFormulaUpdateDto } from 'src/interfaces/rh/ConceptosFormula/RhConceptosFormulaUpdateDto'

interface FormInputs {
  codigoFormulaConcepto  :number;
  codigoConcepto:number;
  porcentaje:number;
  montoTope:number;
  porcentajePatronal:number;
  tipoSueldo:string;
  fechaDesde:Date | null;
  fechaDesdeString:string;
  fechaDesdeObj:IFechaDto  | null;
  fechaHasta:Date |null;
  fechaHastaString :string
  fechaHastaObj :IFechaDto| null;


}



const FormRhConceptosFormulaCreateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();

  const {rhConceptoFormulaSeleccionado} = useSelector((state: RootState) => state.rhConceptosFormula)
  const {rhConceptosSeleccionado} = useSelector((state: RootState) => state.rhConceptos)
  const listTipoSueldo =[{codigo:'SB',descripcion:'Sueldo Basico'},{codigo:'SI',descripcion:'Sueldo Integral'}]


  const  getTipoSueldo=(id:string)=>{

    const result = listTipoSueldo?.filter((elemento)=>{

      return elemento.codigo==id;
    });


    return result[0];
  }


  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')


  const [tipoSueldo,setTipoSueldo] = useState<any>(getTipoSueldo(rhConceptoFormulaSeleccionado.tipoSueldo))

  const defaultValues = {



    codigoFormulaConcepto :rhConceptoFormulaSeleccionado.codigoFormulaConcepto,
    codigoConcepto:rhConceptosSeleccionado.codigoConcepto,
    porcentaje:rhConceptoFormulaSeleccionado.porcentaje,
    montoTope:rhConceptoFormulaSeleccionado.montoTope,
    porcentajePatronal:rhConceptoFormulaSeleccionado.porcentajePatronal,
    tipoSueldo:rhConceptoFormulaSeleccionado.tipoSueldo,
    tipoSueldoDescripcion:rhConceptoFormulaSeleccionado.tipoSueldoDescripcion,
    fechaDesde:rhConceptoFormulaSeleccionado.fechaDesde,
    fechaDesdeString:rhConceptoFormulaSeleccionado.fechaDesdeString,
    fechaDesdeObj:rhConceptoFormulaSeleccionado.fechaDesdeObj,
    fechaHasta:rhConceptoFormulaSeleccionado.fechaHasta,
    fechaHastaString :rhConceptoFormulaSeleccionado.fechaHastaString,
    fechaHastaObj :rhConceptoFormulaSeleccionado.fechaHastaObj,


  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })


  const handlerTipoSueldo=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tipoSueldo',value.id);
      setTipoSueldo(value);

    }else{
      setValue('tipoSueldo','');

    }
  }






  const handlerFechaDesde=(desde?:Date)=>{

    const dateIsValid = dayjs(desde).isValid();
    if(dateIsValid){
      const fechaObj:IFechaDto =fechaToFechaObj(desde!);
      const presupuestoTmp= {...rhConceptoFormulaSeleccionado,fechaDesdeString:desde!.toISOString(),fechaDesdeObj:fechaObj,fechaDesde:desde};
      dispatch(setRhConceptosFormulaSeleccionado(presupuestoTmp))
      setValue('fechaDesdeString',desde!.toISOString());
      setValue('fechaDesde',desde!);
      setValue('fechaDesdeObj',fechaObj!);
     } else{

      setValue('fechaDesdeString','');
      setValue('fechaDesde',null);
      setValue('fechaDesdeObj',null);
      const acumulado= {...rhConceptoFormulaSeleccionado,fechaDesdeString:'',fechaDesdeObj:null,fechaDesde:null};
      dispatch(setRhConceptosFormulaSeleccionado(acumulado))
     }



  }

  const handlerFechaHasta=(hasta:Date)=>{

    const dateIsValid = dayjs(hasta).isValid();
    if(dateIsValid){
      const fechaObj:IFechaDto =fechaToFechaObj(hasta);
      const presupuestoTmp= {...rhConceptoFormulaSeleccionado,fechaHastaString:hasta.toISOString(),fechaHastaObj:fechaObj,fechaHasta:hasta};
      dispatch(setRhConceptosFormulaSeleccionado(presupuestoTmp))
      setValue('fechaHastaString',hasta.toISOString());
      setValue('fechaDesde',hasta!);
      setValue('fechaDesdeObj',fechaObj!);
    }

  }


  const handleClearDesde=()=>{

    setValue('fechaDesdeString','');
    setValue('fechaDesde',null);
    setValue('fechaDesdeObj',null);
    const acumulado= {...rhConceptoFormulaSeleccionado,fechaDesdeString:'',fechaDesdeObj:null,fechaDesde:null};
    dispatch(setRhConceptosFormulaSeleccionado(acumulado))


 }
 const handleClearHasta=()=>{

   setValue('fechaHastaString','');
   setValue('fechaHasta',null);
   setValue('fechaHastaObj',null);
   const acumulado= {...rhConceptoFormulaSeleccionado,fechaHastaString:'',fechaHastaObj:null,fechaHasta:null};
   dispatch(setRhConceptosFormulaSeleccionado(acumulado))


}

  const onSubmit = async (data:FormInputs) => {
    const  now = dayjs();
    const fechaIngreso=dayjs(data.fechaDesdeString)
    const fechaPosterior = dayjs(fechaIngreso).isAfter(now );
    if(fechaPosterior==true){
      setErrorMessage('Fecha desde Invalida')

      return;
    }
    setLoading(true)
    console.log(data.fechaHastaString)
    if(data.fechaHastaString==null || data.fechaHastaString==undefined){
      setValue('fechaHastaString','');
    }
    const updateConceptoAcumulado:IRhConceptosFormulaUpdateDto= {
      codigoFormulaConcepto :rhConceptoFormulaSeleccionado.codigoFormulaConcepto,
      codigoConcepto:rhConceptosSeleccionado.codigoConcepto,
      porcentaje:data.porcentaje,
      montoTope:data.montoTope,
      porcentajePatronal:data.porcentajePatronal,
      tipoSueldo:data.tipoSueldo,
      fechaDesde:rhConceptoFormulaSeleccionado.fechaDesde,
      fechaDesdeString:rhConceptoFormulaSeleccionado.fechaDesdeString,
      fechaDesdeObj:rhConceptoFormulaSeleccionado.fechaDesdeObj,
      fechaHasta:rhConceptoFormulaSeleccionado.fechaHasta,
      fechaHastaString :rhConceptoFormulaSeleccionado.fechaHastaString,
      fechaHastaObj :rhConceptoFormulaSeleccionado.fechaHastaObj,


    };

    console.log('updateConceptoAcumulado',updateConceptoAcumulado)
    const responseAll= await ossmmasofApi.post<any>('/RhConceptoFormula/Create',updateConceptoAcumulado);

    if(responseAll.data.isValid){
      dispatch(setRhConceptosFormulaSeleccionado(responseAll.data.data))
      dispatch(setVerRhConceptosFormulaActive(false))
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


      setLoading(false);
    };




    getData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='RH - Crear Concepto Formula' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* codigoConceptoAcumula */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoFormulaConcepto'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoFormulaConcepto)}
                      aria-describedby='validation-async-codigoFormulaConcepto'
                      disabled
                    />
                  )}
                />
                {errors.codigoFormulaConcepto && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoFormulaConcepto'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
             {/* codigoConcepto */}
             <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoConcepto'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoConcepto)}
                      aria-describedby='validation-async-codigoConcepto'
                      disabled
                    />
                  )}
                />
                {errors.codigoConcepto && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoConcepto'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>


            {/* Concepto Asociado */}
            <Grid item sm={12} xs={12}>


          <Autocomplete

              options={listTipoSueldo}
              value={tipoSueldo}
              id='autocomplete-tipoPoSueldo'
              isOptionEqualToValue={(option, value) => option.codigo=== value.codigo}
              getOptionLabel={option => option.codigo + '-' + option.descripcion }
              onChange={handlerTipoSueldo}
              renderInput={params => <TextField {...params} label='Tipo Acumulado' />}
            />


          </Grid>

          {/* porcentaje*/}
          <Grid item sm={2} xs={12}>
            <FormControl fullWidth>
              <Controller
                name='porcentaje'
                control={control}
                rules={{ min:0}}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value || 0}
                    type='number'
                    label='porcentaje'
                    onChange={onChange}
                    placeholder='%'
                    error={Boolean(errors.porcentaje)}
                    aria-describedby='validation-async-sueldoMinimo'
                  />
                )}
              />
              {errors.porcentaje && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-async-sueldoMinimo'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          {/* montoTope*/}
          <Grid item sm={2} xs={12}>
            <FormControl fullWidth>
              <Controller
                name='montoTope'
                control={control}
                rules={{ min:0}}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value || 0}
                    type='number'
                    label='Monto Tope'
                    onChange={onChange}
                    placeholder='Monto Tope'
                    error={Boolean(errors.montoTope)}
                    aria-describedby='validation-async-montoTope'
                  />
                )}
              />
              {errors.montoTope && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-async-montoTope'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          {/* porcentajePatronal*/}
          <Grid item sm={2} xs={12}>
            <FormControl fullWidth>
              <Controller
                name='porcentajePatronal'
                control={control}
                rules={{ min:0}}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value || 0}
                    type='number'
                    label='Porcentaje Patronal'
                    onChange={onChange}
                    placeholder='Porcentaje Patronal'
                    error={Boolean(errors.porcentajePatronal)}
                    aria-describedby='validation-async-porcentajePatronal'
                  />
                )}
              />
              {errors.porcentajePatronal && (
                <FormHelperText sx={{ color: 'error.main' }} id='validation-async-porcentajePatronal'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
          </Grid>


          <Grid item  sm={3} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DatePicker
                    selected={ getDateByObject(rhConceptoFormulaSeleccionado.fechaDesdeObj!)}
                    id='date-time-picker-desde'
                    dateFormat='dd/MM/yyyy'
                    popperPlacement={popperPlacement}
                    onChange={(date: Date) => handlerFechaDesde(date)}
                    placeholderText='Click to seleccionar Fecha'
                    customInput={<CustomInput label='Fecha Desde' />}
                    />
                { rhConceptoFormulaSeleccionado.fechaDesdeObj
                    ?
                    <Tooltip title='Clear'>
                      <IconButton  color='primary' size='small' onClick={() => handleClearDesde()}>
                      <Icon icon='mdi:file-remove-outline' fontSize={20} />
                      </IconButton>
                    </Tooltip>

                      :<div></div>
                }
              </Box>
            </Grid>
            <Grid item  sm={3} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DatePicker

                      selected={ getDateByObject(rhConceptoFormulaSeleccionado.fechaHastaObj!)}
                      id='date-time-picker-desde'
                      dateFormat='dd/MM/yyyy'
                      popperPlacement={popperPlacement}
                      onChange={(date: Date) => handlerFechaHasta(date)}
                      placeholderText='Click to select a date'
                      customInput={<CustomInput label='Fecha Hasta' />}
                      />
                        { rhConceptoFormulaSeleccionado.fechaHastaObj
                        ?
                        <Tooltip title='Clear'>
                          <IconButton  color='primary' size='small' onClick={() => handleClearHasta()}>
                          <Icon icon='mdi:file-remove-outline' fontSize={20} />
                          </IconButton>
                        </Tooltip>

                          :<div></div>
                    }
              </Box>
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

export default FormRhConceptosFormulaCreateAsync
