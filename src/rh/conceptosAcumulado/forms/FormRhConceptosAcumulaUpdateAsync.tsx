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
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tooltip} from '@mui/material'



import { ISelectListDescriptiva } from 'src/interfaces/rh/ISelectListDescriptiva'


import { getDateByObject } from 'src/utilities/ge-date-by-object'


// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import dayjs from 'dayjs'
import { setRhConceptosAcumuladoSeleccionado, setVerRhConceptosAcumuladoActive } from 'src/store/apps/rh-conceptos-acumulado';
import { IRhConceptosAcumulaDeleteDto } from 'src/interfaces/rh/ConceptosAcumula/RhConceptosAcumulaDeleteDto'
import { IRhConceptosAcumulaUpdateDto } from 'src/interfaces/rh/ConceptosAcumula/RhConceptosAcumulaUpdateDto'

interface FormInputs {
  codigoConceptoAcumula :number;
  codigoConcepto:number;
  tipoAcumuladoId:number;
  codigoConceptoAsociado:number;
  fechaDesdeString:string;
  fechaHastaString :string


}



const FormRhConceptosAcumulaUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();

  const {rhConceptoAcumuladoSeleccionado,listRhTipoAcumulado} = useSelector((state: RootState) => state.rhConceptosAcumulado)
  const {listRhConceptos} = useSelector((state: RootState) => state.rhConceptos)


  const  getTipoAcumulado=(id:number)=>{

    const result = listRhTipoAcumulado?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getConcepto=(id:number)=>{

    const result = listRhConceptos?.filter((elemento)=>{

      return elemento.codigoConcepto==id;
    });


    return result[0];
  }

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);

  const [tipoAcumulado,setTipoAcumulado] = useState<ISelectListDescriptiva>(getTipoAcumulado(rhConceptoAcumuladoSeleccionado.tipoAcumuladoId))
  const [conceptoAsociado,setConceptoAsociado] = useState<any>(getConcepto(rhConceptoAcumuladoSeleccionado.codigoConceptoAsociado))

  const defaultValues = {



    codigoConceptoAcumula :rhConceptoAcumuladoSeleccionado.codigoConceptoAcumula,
    codigoConcepto:rhConceptoAcumuladoSeleccionado.codigoConcepto,
    tipoAcumuladoId:rhConceptoAcumuladoSeleccionado.tipoAcumuladoId,
    codigoConceptoAsociado:rhConceptoAcumuladoSeleccionado.codigoConceptoAsociado,
    fechaDesdeString:rhConceptoAcumuladoSeleccionado.fechaDesdeString,
    fechaHastaString :rhConceptoAcumuladoSeleccionado.fechaHastaString,


  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })



  const handlerTipoAcumulado=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tipoAcumuladoId',value.id);
      setTipoAcumulado(value);

    }else{
      setValue('tipoAcumuladoId',0);

    }
  }
  const handlerConceptoAsociado=async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoConceptoAsociado',value.codigoConcepto);
      setConceptoAsociado(value);
    }else{
      setValue('codigoConceptoAsociado',0);

    }
  }




  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setVerRhConceptosAcumuladoActive(false))
    dispatch(setRhConceptosAcumuladoSeleccionado({}))
  };

  const handlerFechaDesde=(desde?:Date)=>{

    const dateIsValid = dayjs(desde).isValid();
    if(dateIsValid){
      const fechaObj:IFechaDto =fechaToFechaObj(desde!);
      const presupuestoTmp= {...rhConceptoAcumuladoSeleccionado,fechaDesdeString:desde!.toISOString(),fechaDesdeObj:fechaObj};
      dispatch(setRhConceptosAcumuladoSeleccionado(presupuestoTmp))
      setValue('fechaDesdeString',desde!.toISOString());
     } else{

      setValue('fechaDesdeString','');
      const acumulado= {...rhConceptoAcumuladoSeleccionado,fechaDesdeString:'',fechaDesdeObj:null};
      dispatch(setRhConceptosAcumuladoSeleccionado(acumulado))
     }



  }

  const handlerFechaHasta=(hasta:Date)=>{

    const dateIsValid = dayjs(hasta).isValid();
    if(dateIsValid){
      const fechaObj:IFechaDto =fechaToFechaObj(hasta);
      const presupuestoTmp= {...rhConceptoAcumuladoSeleccionado,fechaHastaString:hasta.toISOString(),fechaHastaObj:fechaObj};
      dispatch(setRhConceptosAcumuladoSeleccionado(presupuestoTmp))
      setValue('fechaHastaString',hasta.toISOString());
    }

  }

  const handleDelete = async  () => {

    setOpen(false);
    const deleteConceptoAcumula : IRhConceptosAcumulaDeleteDto={
      codigoConceptoAcumula:rhConceptoAcumuladoSeleccionado.codigoConceptoAcumula
    }
    const responseAll= await ossmmasofApi.post<any>('/RhConceptoAcumulado/Delete',deleteConceptoAcumula);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerRhConceptosAcumuladoActive(false))
      dispatch(setRhConceptosAcumuladoSeleccionado({}))
    }


  };
  const handleClearDesde=()=>{

    setValue('fechaDesdeString','');
    const acumulado= {...rhConceptoAcumuladoSeleccionado,fechaDesdeString:'',fechaDesdeObj:null};
    dispatch(setRhConceptosAcumuladoSeleccionado(acumulado))


 }
 const handleClearHasta=()=>{

   setValue('fechaHastaString','');
   const acumulado= {...rhConceptoAcumuladoSeleccionado,fechaHastaString:'',fechaHastaObj:null};
   dispatch(setRhConceptosAcumuladoSeleccionado(acumulado))


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
    const updateConceptoAcumulado:IRhConceptosAcumulaUpdateDto= {
      codigoConceptoAcumula :rhConceptoAcumuladoSeleccionado.codigoConceptoAcumula,
      codigoConcepto:rhConceptoAcumuladoSeleccionado.codigoConcepto,
      tipoAcumuladoId :data.tipoAcumuladoId,
      codigoConceptoAsociado:data.codigoConceptoAsociado,
      fechaDesdeString :data.fechaDesdeString,
      fechaHastaString :data.fechaHastaString,


    };

    console.log('updateConceptoAcumulado',updateConceptoAcumulado)
    const responseAll= await ossmmasofApi.post<any>('/RhConceptoAcumulado/Update',updateConceptoAcumulado);

    if(responseAll.data.isValid){
      dispatch(setRhConceptosAcumuladoSeleccionado(responseAll.data.data))
      dispatch(setVerRhConceptosAcumuladoActive(false))
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

     /* const filterBanco={descripcionId:0,tituloId:18}
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
      <CardHeader title='RH - Modificar Concepto Acumulado' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* codigoConceptoAcumula */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoConceptoAcumula'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoConceptoAcumula)}
                      aria-describedby='validation-async-codigoAdministrativo'
                      disabled
                    />
                  )}
                />
                {errors.codigoConceptoAcumula && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoConceptoAcumula'>
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

              options={listRhTipoAcumulado}
              value={tipoAcumulado}
              id='autocomplete-concepto'
              isOptionEqualToValue={(option, value) => option.id=== value.id}
              getOptionLabel={option => option.id + '-' + option.descripcion }
              onChange={handlerTipoAcumulado}
              renderInput={params => <TextField {...params} label='Tipo Acumulado' />}
            />


          </Grid>

          {/* Concepto Asociado */}
          <Grid item sm={12} xs={12}>


          <Autocomplete

              options={listRhConceptos}
              value={conceptoAsociado}
              id='autocomplete-concepto'
              isOptionEqualToValue={(option, value) => option.codigoConcepto=== value.codigoConcepto}
              getOptionLabel={option => option.codigoConcepto + '-' + option.denominacion }
              onChange={handlerConceptoAsociado}
              renderInput={params => <TextField {...params} label='Concepto Asociado' />}
            />


          </Grid>

          <Grid item  sm={3} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DatePicker
                    selected={ getDateByObject(rhConceptoAcumuladoSeleccionado.fechaDesdeObj!)}
                    id='date-time-picker-desde'
                    dateFormat='dd/MM/yyyy'
                    popperPlacement={popperPlacement}
                    onChange={(date: Date) => handlerFechaDesde(date)}
                    placeholderText='Click to seleccionar Fecha'
                    customInput={<CustomInput label='Fecha Desde' />}
                    />
                { rhConceptoAcumuladoSeleccionado.fechaDesdeObj
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

                      selected={ getDateByObject(rhConceptoAcumuladoSeleccionado.fechaHastaObj!)}
                      id='date-time-picker-desde'
                      dateFormat='dd/MM/yyyy'
                      popperPlacement={popperPlacement}
                      onChange={(date: Date) => handlerFechaHasta(date)}
                      placeholderText='Click to select a date'
                      customInput={<CustomInput label='Fecha Hasta' />}
                      />
                        { rhConceptoAcumuladoSeleccionado.fechaHastaObj
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
                  {"Esta Seguro de Eliminar estos Datos Administrativos?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminaran los datos Administrativos
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

export default FormRhConceptosAcumulaUpdateAsync
