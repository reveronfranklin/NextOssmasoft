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
import  { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports

import { setRhConceptosAcumuladoSeleccionado, setVerRhConceptosAcumuladoActive } from 'src/store/apps/rh-conceptos-acumulado';
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'
import { setListpresupuestoDtoSeleccionado, setPreMtrDenominacionPucSeleccionado, setPreMtrUnidadEjecutoraSeleccionado } from 'src/store/apps/presupuesto'
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'
import { fetchDataPreMtrDenominacionPuc, fetchDataPreMtrUnidadEjecutora } from 'src/store/apps/presupuesto/thunks'
import { FilterByPresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto'
import { IPreAsignacionesDeleteDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesDeleteDto'
import TableServerSide from 'src/presupuesto/asignacionesDetalle/components/TableServerSide'
import { IPreAsignacionesUpdateDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesUpdateDto'

interface FormInputs {
  codigoAsignacion :number;
  codigoPresupuesto:number;
  codigoIcp:number;
  codigoPuc:number;
  presupuestado:number;
  ordinario:number;
  coordinado:number;
  laee:number;
  fides:number;

}



const FormPreAsignacionesUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();


  const {listpresupuestoDto,preMtrUnidadEjecutora,preMtrDenominacionPuc} = useSelector((state: RootState) => state.presupuesto)
  const {preAsignacionesSeleccionado} = useSelector((state: RootState) => state.preAsignaciones)


  const  getPresupuesto=(id:number)=>{

    const result = listpresupuestoDto?.filter((elemento)=>{

      return elemento.codigoPresupuesto==id;
    });


    return result[0];
  }


  const  getIcp=(id:number)=>{

    const result = preMtrUnidadEjecutora?.filter((elemento)=>{

      return elemento.codigoIcp==id;
    });


    return result[0];
  }
  const  getPuc=(id:number)=>{

    const result = preMtrDenominacionPuc?.filter((elemento)=>{

      return elemento.codigoPuc==id;
    });


    return result[0];
  }


  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);

  const [presupuesto,setPresupuesto] = useState<IListPresupuestoDto>(getPresupuesto(preAsignacionesSeleccionado.codigoPresupuesto));
  const [icp,setIcp] = useState<IListPreMtrUnidadEjecutora>(getIcp(preAsignacionesSeleccionado.codigoIcp));
  const [puc,setPuc] = useState<IListPreMtrDenominacionPuc>(getPuc(preAsignacionesSeleccionado.codigoPuc));

  const defaultValues = {

      codigoAsignacion :preAsignacionesSeleccionado.codigoAsignacion,
      codigoPresupuesto:preAsignacionesSeleccionado.codigoPresupuesto,
      codigoIcp:preAsignacionesSeleccionado.codigoIcp,
      codigoPuc:preAsignacionesSeleccionado.codigoPuc,
      presupuestado:preAsignacionesSeleccionado.presupuestado,
      ordinario:preAsignacionesSeleccionado.ordinario,
      coordinado:preAsignacionesSeleccionado.coordinado,
      laee:preAsignacionesSeleccionado.laee,
      fides:preAsignacionesSeleccionado.fides
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
    dispatch(setVerRhConceptosAcumuladoActive(false))
    dispatch(setRhConceptosAcumuladoSeleccionado({}))
  };




  const handleDelete = async  () => {

    setOpen(false);
    const deleteAsignacion : IPreAsignacionesDeleteDto={
      codigoAsignacion:preAsignacionesSeleccionado.codigoAsignacion,
    }
    const responseAll= await ossmmasofApi.post<any>('/PreAsignaciones/Delete',deleteAsignacion);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerRhConceptosAcumuladoActive(false))
      dispatch(setRhConceptosAcumuladoSeleccionado({}))
    }


  };



  const onSubmit = async (data:FormInputs) => {

    setLoading(true)

    const updateAsignacion:IPreAsignacionesUpdateDto= {
      codigoAsignacion :preAsignacionesSeleccionado.codigoAsignacion,
      codigoPresupuesto:data.codigoPresupuesto,
      codigoIcp:data.codigoIcp,
      codigoPuc:data.codigoPuc,
      presupuestado:data.presupuestado,
      ordinario:data.ordinario,
      coordinado:data.coordinado,
      laee:data.laee,
      fides:data.fides


    };

    console.log('updateConceptoAcumulado',updateAsignacion)
    const responseAll= await ossmmasofApi.post<any>('/PreAsignaciones/Update',updateAsignacion);

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

  const handlePresupuestos= async (e: any,value:any)=>{



    if(value){



      dispatch(setListpresupuestoDtoSeleccionado(value));
      setValue('codigoPresupuesto',value.codigoPresupuesto);
      setPresupuesto(value);
      const filter:FilterByPresupuestoDto ={
        codigoPresupuesto:value.codigoPresupuesto
      }

      await fetchDataPreMtrDenominacionPuc(dispatch,filter);
      await fetchDataPreMtrUnidadEjecutora(dispatch,filter);

    }else{

      const presupuesto:IListPresupuestoDto ={
        ano:0,
        codigoPresupuesto:0,
        descripcion:'',
        preFinanciadoDto:[],
        presupuestoEnEjecucion:false
      };


      dispatch(setListpresupuestoDtoSeleccionado(presupuesto));
    }


  }
  const handlerDenominacionPuc= (e: any,value:any)=>{


    if(value){

      dispatch(setPreMtrDenominacionPucSeleccionado(value));
      setValue('codigoPuc',value.codigoPuc);
      setPuc(value);
    }else{

      const denominacionPuc:IListPreMtrDenominacionPuc ={
          id:0,
          codigoPuc:0,
          codigoPucConcat:'',
          denominacionPuc:'',
          dercripcion:''


      };


      dispatch(setPreMtrDenominacionPucSeleccionado(denominacionPuc));
    }


  }


  const handlerUnidadEjecutora =(e: any,value:any)=>{


    if(value){

      dispatch(setPreMtrUnidadEjecutoraSeleccionado(value));
      setValue('codigoIcp',value.codigoIcp);
      setIcp(value);
    }else{

      const unidadEjecutora:IListPreMtrUnidadEjecutora ={
        id:0,

        codigoIcp:0,

        codigoIcpConcat:'',

        unidadEjecutora:'',

        dercripcion:''


      };


      dispatch(setPreMtrUnidadEjecutoraSeleccionado(unidadEjecutora));
    }


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


    console.log(popperPlacement);

    getData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='PRE - Modificar Credito Presupuestario' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* codigoConceptoAcumula */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoAsignacion'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoAsignacion)}
                      aria-describedby='validation-async-codigoAsignacion'
                      disabled
                    />
                  )}
                />
                {errors.codigoAsignacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoAsignacion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>


            {/* Concepto Presupuesto */}
            <Grid item sm={10} xs={12}>


                <Autocomplete

                    options={listpresupuestoDto}
                    value={presupuesto}
                    id='autocomplete-concepto'
                    isOptionEqualToValue={(option, value) => option.codigoPresupuesto === value.codigoPresupuesto}
                    getOptionLabel={option => option.codigoPresupuesto + '-' + option.descripcion }
                    onChange={handlePresupuestos}
                    renderInput={params => <TextField {...params} label='Presupuesto' />}
                  />


          </Grid>

          {/* ICP */}
          <Grid item sm={12} xs={12}>

            <Autocomplete

                options={preMtrUnidadEjecutora}
                value={icp}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                id='autocomplete-concepto'
                getOptionLabel={option => option.dercripcion  + '-' + option.id }
                onChange={handlerUnidadEjecutora}
                renderInput={params => <TextField {...params} label='Unidad Ejecutora' />}
              />

          </Grid>

          {/* PUC */}
          <Grid item sm={12} xs={12}>

              <Autocomplete


                value={puc}
                options={preMtrDenominacionPuc  }
                id='autocomplete-preMtrDenominacionPuc'
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={option => option.dercripcion + '-' + option.id + '' + option.codigoPuc}
                onChange={handlerDenominacionPuc}
                renderInput={params => <TextField {...params} label='Puc' />}
              />

          </Grid>
          {/* Presupuestado*/}
          <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='presupuestado'
                  control={control}
                  rules={{ min:0.001}}

                  render={({ field: { value, onChange } }) => (

                    <TextField
                      value={value || 0}
                      type="decimal"
                      label='Presupuestado'
                      onChange={onChange}
                      placeholder='Presupuestado'
                      error={Boolean(errors.presupuestado)}
                      aria-describedby='validation-async-sueldo'
                    />
                  )}
                />
                {errors.presupuestado && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-presupuestado'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Ordinario*/}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='ordinario'
                  control={control}
                  rules={{ min:0.00}}

                  render={({ field: { value, onChange } }) => (

                    <TextField
                      value={value || 0}
                      type="decimal"
                      label='Ordinario'
                      onChange={onChange}
                      placeholder='Ordinario'
                      error={Boolean(errors.ordinario)}
                      aria-describedby='validation-async-sueldo'
                    />
                  )}
                />
                {errors.ordinario && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-ordinario'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
              {/* coordinado*/}
              <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='coordinado'
                  control={control}
                  rules={{ min:0}}

                  render={({ field: { value, onChange } }) => (

                    <TextField
                      value={value || 0}
                      type="decimal"
                      label='Coordinado'
                      onChange={onChange}
                      placeholder='Coordinado'
                      error={Boolean(errors.coordinado)}
                      aria-describedby='validation-async-sueldo'
                    />
                  )}
                />
                {errors.coordinado && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-coordinado'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* LAEE*/}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='laee'
                  control={control}
                  rules={{ min:0}}

                  render={({ field: { value, onChange } }) => (

                    <TextField
                      value={value || 0}
                      type="decimal"
                      label='LAEE'
                      onChange={onChange}
                      placeholder='LAEE'
                      error={Boolean(errors.laee)}
                      aria-describedby='validation-async-sueldo'
                    />
                  )}
                />
                {errors.laee && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-laee'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
              {/* fides*/}
              <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='fides'
                  control={control}
                  rules={{ min:0}}

                  render={({ field: { value, onChange } }) => (

                    <TextField
                      value={value || 0}
                      type="decimal"
                      label='FIDES'
                      onChange={onChange}
                      placeholder='FIDES'
                      error={Boolean(errors.fides)}
                      aria-describedby='validation-async-fides'
                    />
                  )}
                />
                {errors.fides && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-fides'>
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
                  {"Esta Seguro de Eliminar estos Datos De Creditos Presupuestarios"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminaran los datos De Creditos Presupuestarios
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
      <TableServerSide></TableServerSide>
    </Card>

  )


}

export default FormPreAsignacionesUpdateAsync
