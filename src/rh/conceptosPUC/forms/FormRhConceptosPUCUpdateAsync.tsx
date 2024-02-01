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
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'




// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports

import { setRhConceptosFormulaSeleccionado, setVerRhConceptosFormulaActive } from 'src/store/apps/rh-conceptos-formula';
import { setListpresupuestoDtoSeleccionado } from 'src/store/apps/presupuesto'
import { FilterByPresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto'
import { setListPuc } from 'src/store/apps/PUC'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'
import { IRhConceptosPUCDeleteDto } from 'src/interfaces/rh/ConceptosPUC/RhConceptosPUCDeleteDto'
import { setRhConceptosPUCSeleccionado, setVerRhConceptosPUCActive } from 'src/store/apps/rh-conceptos-PUC'
import { IRhConceptosPUCUpdateDto } from 'src/interfaces/rh/ConceptosPUC/RhConceptosPUCUpdateDto'

interface FormInputs {
  codigoConceptoPUC:number;
  codigoConcepto:number;
  codigoPUC :number;
  codigoPresupuesto:number;
  status :number;

}



const FormRhConceptosPUCUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();

  const {rhConceptoPUCSeleccionado} = useSelector((state: RootState) => state.rhConceptosPUC)
  const {rhConceptosSeleccionado} = useSelector((state: RootState) => state.rhConceptos)
  const listStatus=[{codigo:1,descripcion:'Activo'},{codigo:0,descripcion:'Inactivo'}]
  const {listpresupuestoDto} = useSelector((state: RootState) => state.presupuesto)
  const {listPuc} = useSelector((state: RootState) => state.puc)

  const  getStatus=(id:number)=>{



    const result = listStatus?.filter((elemento)=>{

      return elemento.codigo==id;
    });


    return result[0];
  }
  const  getPuc=(id:number)=>{


    const result = listPuc?.filter((elemento:any)=>{

      return elemento.codigoPuc==id;
    });


    return result[0];
  }

  const  getPresupuesto=(id:number)=>{

    const result = listpresupuestoDto?.filter((elemento:any)=>{


      return elemento.codigoPresupuesto==id;
    });


    return result[0];
  }



  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);




  const [status,setStatus] = useState<any>(getStatus(rhConceptoPUCSeleccionado.status))
  const [presupuesto,setPresupuesto] = useState<any>(getPresupuesto(rhConceptoPUCSeleccionado.codigoPresupuesto));
  const [puc,setPuc] = useState<any>(getPuc(rhConceptoPUCSeleccionado.codigoPUC));

  const [data,setData] = useState<any>(listPuc);
  const defaultValues = {


    codigoConceptoPUC :rhConceptoPUCSeleccionado.codigoConceptoPUC,
    codigoConcepto:rhConceptosSeleccionado.codigoConcepto,
    codigoPUC :rhConceptoPUCSeleccionado.codigoPUC,
    codigoPUCConcat:rhConceptoPUCSeleccionado.codigoPUCConcat,
    codigoPUCDenominacion:rhConceptoPUCSeleccionado.codigoPUCDenominacion,
    codigoPresupuesto:rhConceptoPUCSeleccionado.codigoPresupuesto,
    presupuestoDescripcion :rhConceptoPUCSeleccionado.presupuestoDescripcion,
    status :rhConceptoPUCSeleccionado.status,
    descripcionStatus:rhConceptoPUCSeleccionado.descripcionStatus


  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })







  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setVerRhConceptosFormulaActive(false))
    dispatch(setRhConceptosFormulaSeleccionado({}))
  };

  const handlerStatus=async (e: any,value:any)=>{


    console.log('value en HandlerStatus',value)

    if(value!=null){
      setValue('status',value.codigo);
      setStatus(value);

    }else{
      setValue('status',0);

    }
  }


  const handlerPuc=async (e: any,value:any)=>{

    console.log('Handler puc',value)
    if(value!=null){
      setValue('codigoPUC',value.codigoPuc
      );
      setPuc(value);

    }else{
      setValue('codigoPUC',0);

    }
  }


  const handlePresupuestos= async (e: any,value:any)=>{
    console.log('Handler Presupuesto',value)

    if(value){

      setPresupuesto(value);
      setValue('codigoPresupuesto',value.codigoPresupuesto);

      dispatch(setListpresupuestoDtoSeleccionado(value));


      const filterPre:FilterByPresupuestoDto={
        codigoPresupuesto:value.codigoPresupuesto

      }
      console.log('filterPre',filterPre,value)
      const responseAllPUC= await ossmmasofApi.post<any>('/PrePlanUnicoCuentas/GetAllFilter',filterPre);
      const dataPUC = responseAllPUC.data.data;
      console.log('dataPUCvv',dataPUC)
      setData(dataPUC);
      dispatch(setListPuc(dataPUC));
      setValue('codigoPUC',0);
      setPuc(null);





    }else{

      const presupuesto:IListPresupuestoDto ={
        ano:0,
        codigoPresupuesto:0,
        descripcion:'',
        preFinanciadoDto:[]

      };
      setValue('codigoPresupuesto',0);
      dispatch(setListpresupuestoDtoSeleccionado(presupuesto));
    }


  }


  const handleDelete = async  () => {

    setOpen(false);
    const deleteConcepto : IRhConceptosPUCDeleteDto={
      codigoConceptoPUC:rhConceptoPUCSeleccionado.codigoConceptoPUC
    }
    const responseAll= await ossmmasofApi.post<any>('/RhConceptoPUC/Delete',deleteConcepto);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerRhConceptosPUCActive(false))
      dispatch(setRhConceptosPUCSeleccionado({}))
    }


  };


  const onSubmit = async (data:FormInputs) => {


    if(data.codigoPUC<=0){
      setErrorMessage('PUC Invalido');

      return;
    }
    setLoading(true)

    const updateConceptoPUC:IRhConceptosPUCUpdateDto= {

      codigoConceptoPUC:rhConceptoPUCSeleccionado.codigoConceptoPUC,
      codigoConcepto:rhConceptosSeleccionado.codigoConcepto,
      codigoPUC :data.codigoPUC,
      codigoPresupuesto:data.codigoPresupuesto,
      status :data.status

    };

    console.log('updateConceptoAcumulado',updateConceptoPUC)
    const responseAll= await ossmmasofApi.post<any>('/RhConceptoPUC/Update',updateConceptoPUC);

    if(responseAll.data.isValid){
      dispatch(setRhConceptosPUCSeleccionado(responseAll.data.data))
      dispatch(setVerRhConceptosPUCActive(false))
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
      console.log(popperPlacement)
      console.log('rhConceptoPUCSeleccionado>>>>',rhConceptoPUCSeleccionado)
      const filterPre:FilterByPresupuestoDto={
        codigoPresupuesto:rhConceptoPUCSeleccionado.codigoPresupuesto
      }
      const responseAllPUC= await ossmmasofApi.post<any>('/PrePlanUnicoCuentas/GetAllFilter',filterPre);
      const dataPUC = responseAllPUC.data.data;

      dispatch(setListPuc(dataPUC));
      setLoading(false);
    };




    getData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='RH - Modificar Concepto PUC' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

       {/* codigoConceptoAcumula */}
       <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoConceptoPUC'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoConceptoPUC)}
                      aria-describedby='validation-async-codigoConceptoPUC'
                      disabled
                    />
                  )}
                />
                {errors.codigoConceptoPUC && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoConceptoPUC'>
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
            {/* Status */}
            <Grid item sm={8} xs={12}>


              <Autocomplete

                  options={listStatus}
                  value={status}
                  id='autocomplete-tipoPoSueldo'
                  isOptionEqualToValue={(option, value) => option.codigo=== value.codigo}
                  getOptionLabel={option => option.codigo + '-' + option.descripcion }
                  onChange={handlerStatus}
                  renderInput={params => <TextField {...params} label='Estatus' />}
                />


            </Grid>

            {/* Presupuesto */}
            <Grid item sm={6} xs={12}>

                <Autocomplete

                        options={listpresupuestoDto}
                        value={presupuesto}
                        id='autocomplete-MaestroPresupuesto'
                        isOptionEqualToValue={(option, value) => option.codigoPresupuesto=== value.codigoPresupuesto}
                        getOptionLabel={option => option.codigoPresupuesto + '-' + option.descripcion}
                        onChange={handlePresupuestos}
                        renderInput={params => <TextField {...params} label='Presupuesto' />}
                      />


            </Grid>
            {/* Tipo Nomina */}
            <Grid item sm={6} xs={12}>

            <Autocomplete

                  options={data}
                  value={puc}
                  id='autocomplete-padre'
                  isOptionEqualToValue={(option, value) =>option.codigoPresupuesto + '-' +  option.codigoPuc === value.codigoPresupuesto +'-' +value.codigoPuc}
                  getOptionLabel={option => option.codigoPresupuesto + '-' + option.codigoPucConcat + '-' + option.denominacion }
                  onChange={handlerPuc}
                  renderInput={params => <TextField {...params} label='PUC' />}
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
                  {"Esta Seguro de Eliminar estos Datos Concepto PUC?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminaran los datos Concepto PUC
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

export default FormRhConceptosPUCUpdateAsync
