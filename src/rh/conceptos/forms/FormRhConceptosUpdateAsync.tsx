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
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Tab} from '@mui/material'



import { ISelectListDescriptiva } from 'src/interfaces/rh/ISelectListDescriptiva'



// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports

import { IRhTiposNominaDeleteDto } from 'src/interfaces/rh/TipoNomina/RhTiposNominaDeleteDto'
import { IRhConceptosUpdateDto } from 'src/interfaces/rh/Conceptos/RhConceptosUpdateDto'
import { setRhConceptosSeleccionado, setVerRhConceptosActive } from 'src/store/apps/rh-conceptos'
import { IRhTiposNominaResponseDto } from 'src/interfaces/rh/TipoNomina/RhTiposNominaResponseDto'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import ConceptosAcumuladoList from 'src/rh/conceptosAcumulado/views/ConceptosAcumuladoList'
import ConceptosFormulaList from 'src/rh/conceptosFormula/views/ConceptosFormulaList'
import ConceptosPUCList from 'src/rh/conceptosPUC/views/ConceptosPUCList'

interface FormInputs {
  codigoConcepto:number,
  codigoTipoNomina:number;
  codigo :string;
  denominacion:string;
  descripcion :string;
  tipoConcepto:string;
  moduloId :number;
  codigoPuc:number;
  status :string
  frecuenciaId :number;
  dedusible :number;
  automatico :number;
  idModeloCalculo:number,
  extra1:string;

}




const FormRhConceptosUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();



  const {rhTipoNominaSeleccionado,listRhTipoNomina} = useSelector((state: RootState) => state.rhTipoNomina)
  const {listPuc} = useSelector((state: RootState) => state.puc)
  const {rhConceptosSeleccionado,listRhFrecuencia,listRhModulo,listOssModeloCalculo} = useSelector((state: RootState) => state.rhConceptos)

  const listTipoConcepto =[{id:'A',descripcion:'(A)signación'},{id:'D',descripcion:'(D)educción'}]
  const listStatus =[{id:'A',descripcion:'Activo'},{id:'I',descripcion:'Inactivo'}]
  const listSiNo =[{id:1,descripcion:'Si'},{id:0,descripcion:'No'}]
  const  getTipoConcepto=(id:string)=>{

    const result = listTipoConcepto?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }
  const  getStatus=(id:string)=>{

    const result = listStatus?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }
  const  getSiNo=(id:number)=>{

    const result = listSiNo?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getFrecuencia=(id:number)=>{

    const result = listRhFrecuencia?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }
  const  getModulo=(id:number)=>{

    const result = listRhModulo?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }
  const  getModelo=(id:number)=>{

    const result = listOssModeloCalculo?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }
  const  getTipoNomina=(id:number)=>{

    const result = listRhTipoNomina?.filter((elemento)=>{

      return elemento.codigoTipoNomina==id;
    });


    return result[0];
  }

  const  getPuc=(id:number)=>{

    const result = listPuc?.filter((elemento:any)=>{

      return elemento.codigoPuc==id;
    });


    return result[0];
  }


  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);

  const [frecuencia,setFrecuencia] = useState<ISelectListDescriptiva>(getFrecuencia(rhConceptosSeleccionado.frecuenciaId));
  const [tipoNomina,setTipoNomina] = useState<IRhTiposNominaResponseDto>(getTipoNomina(rhConceptosSeleccionado.codigoTipoNomina));
  const [tipoConcepto,setTipoConcepto] = useState<any>(getTipoConcepto(rhConceptosSeleccionado.tipoConcepto));
  const [modulo,setModulo] = useState<ISelectListDescriptiva>(getModulo(rhConceptosSeleccionado.moduloId));
  const [modelo,setModelo] = useState<ISelectListDescriptiva>(getModelo(rhConceptosSeleccionado.idModeloCalculo));
  const [status,setStatus] = useState<any>(getStatus(rhConceptosSeleccionado.status));
  const [puc,setPuc] = useState<any>(getPuc(rhConceptosSeleccionado.codigoPuc));
  const [dedusible,setDedusible] = useState<any>(getSiNo(rhConceptosSeleccionado.dedusible));
  const [automatico,setAutomatico] = useState<any>(getSiNo(rhConceptosSeleccionado.automatico));

  const [valueTab, setValueTab] = useState('1');

  const defaultValues = {

    codigoConcepto:rhConceptosSeleccionado.codigoConcepto,
    codigo:rhConceptosSeleccionado.codigo,
    codigoTipoNomina:rhConceptosSeleccionado.codigoTipoNomina,
    denominacion:rhConceptosSeleccionado.denominacion,
    descripcion:rhConceptosSeleccionado.descripcion,
    tipoConcepto :rhConceptosSeleccionado.tipoConcepto,
    moduloId :rhConceptosSeleccionado.moduloId,
    codigoPuc :rhConceptosSeleccionado.codigoPuc,
    status :rhConceptosSeleccionado.status,
    frecuenciaId :rhConceptosSeleccionado.frecuenciaId,
    dedusible :rhConceptosSeleccionado.dedusible,
    automatico :rhConceptosSeleccionado.automatico,
    extra1:rhConceptosSeleccionado.extra1,
    idModeloCAlculo:rhConceptosSeleccionado.idModeloCalculo
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })



  const handlerFrecuencia=async (e: any,value:any)=>{

    if(value!=null){
      setValue('frecuenciaId',value.id);
      setFrecuencia(value);

    }else{
      setValue('frecuenciaId',0);

    }
  }
  const handlerTipoNomina=async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoTipoNomina',value.codigoTipoNomina);
      setTipoNomina(value);

    }else{
      setValue('codigoTipoNomina',0);

    }
  }
  const handlerModulo=async (e: any,value:any)=>{

    if(value!=null){
      setValue('moduloId',value.id);
      setModulo(value);

    }else{
      setModulo(value);

    }
  }

  const handlerModelo=async (e: any,value:any)=>{

    if(value!=null){
      setValue('idModeloCalculo',value.id);
      setModelo(value);

    }else{
      setModelo(value);

    }
  }

  const handlerTipoConcepto=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tipoConcepto',value.id);
      setTipoConcepto(value);

    }else{
      setValue('tipoConcepto','');

    }
  }
  const handlerStatus=async (e: any,value:any)=>{

    if(value!=null){
      setValue('status',value.id);
      setStatus(value);

    }else{
      setValue('status','');

    }
  }

  const handlerPuc=async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoPuc',value.id);
      setPuc(value);

    }else{
      setValue('codigoPuc',0);

    }
  }

  const handlerDedusible=async (e: any,value:any)=>{

    if(value!=null){
      setValue('dedusible',value.id);
      setDedusible(value);

    }else{
      setValue('dedusible',0);

    }
  }
  const handlerAutomatico=async (e: any,value:any)=>{

    if(value!=null){
      setValue('automatico',value.id);
      setAutomatico(value);

    }else{
      setValue('automatico',0);

    }
  }



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setVerRhConceptosActive(false))
    dispatch(setRhConceptosSeleccionado({}))
  };




  const handleDelete = async  () => {

    setOpen(false);
    const deleteTipoNomina : IRhTiposNominaDeleteDto={
      codigoTipoNomina:rhTipoNominaSeleccionado.codigoTipoNomina
    }
    const responseAll= await ossmmasofApi.post<any>('/RhTipoNomina/Delete',deleteTipoNomina);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerRhConceptosActive(false))
      dispatch(setRhConceptosSeleccionado({}))
    }


  };



  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };

  const onSubmit = async (data:FormInputs) => {


    setLoading(true)
    setErrorMessage('')
    const updateDto:IRhConceptosUpdateDto= {
    codigoConcepto:rhConceptosSeleccionado.codigoConcepto,
    codigoTipoNomina:data.codigoTipoNomina,
    codigo:data.codigo,
    denominacion:data.denominacion,
    descripcion:data.descripcion,
    tipoConcepto :data.tipoConcepto,
    moduloId :data.moduloId,
    codigoPuc :data.codigoPuc,
    status :data.status,
    frecuenciaId :data.frecuenciaId,
    dedusible :data.dedusible,
    automatico :data.automatico,
    idModeloCalculo:data.idModeloCalculo,
    extra1:data.extra1

    };

    console.log('updateDto',updateDto)
    try {
        const responseAll= await ossmmasofApi.post<any>('/RhConceptos/Update',updateDto);

        if(responseAll.data.isValid){
          dispatch(setRhConceptosSeleccionado(responseAll.data.data))
          dispatch(setVerRhConceptosActive(false))
        }
        setErrorMessage(responseAll.data.message)
        setLoading(false)
        toast.success('Form Submitted')
      } catch (error) {
          console.log('error',error);
          setLoading(false)
      }

  }
  useEffect(() => {

    const getData = async () => {
      setLoading(true);
      console.log(popperPlacement);

      setLoading(false);
    };




    getData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='RH - Concepto' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12} >
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
              {/* codigo */}
              <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Codigo'
                      onChange={onChange}
                      placeholder='Codigo'
                      error={Boolean(errors.codigo)}
                      aria-describedby='validation-async-codigo'
                      disabled
                    />
                  )}
                />
                {errors.codigo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
              {/* status */}
           <Grid item sm={3} xs={12}>

            <Autocomplete

                  options={listStatus}
                  value={status}
                  id='autocomplete-padre'
                  isOptionEqualToValue={(option, value) => option.id=== value.id}
                  getOptionLabel={option => option.id + '-' + option.descripcion }
                  onChange={handlerStatus}
                  renderInput={params => <TextField {...params} label='Estatus' />}
                />

            </Grid>
              {/* Tipo Nomina */}
           <Grid item sm={5} xs={12}>

            <Autocomplete

                  options={listRhTipoNomina}
                  value={tipoNomina}
                  id='autocomplete-padre'
                  isOptionEqualToValue={(option, value) => option.codigoTipoNomina=== value.codigoTipoNomina}
                  getOptionLabel={option => option.codigoTipoNomina + '-' + option.descripcion }
                  onChange={handlerTipoNomina}
                  renderInput={params => <TextField {...params} label='Tipo Nomina' />}
                />

            </Grid>
                {/* dedusible */}
            <Grid item sm={4} xs={12}>

            <Autocomplete

            options={listSiNo}
            value={dedusible}
            id='autocomplete-padre'
            isOptionEqualToValue={(option, value) => option.id=== value.id}
            getOptionLabel={option => option.id + '-' + option.descripcion }
            onChange={handlerDedusible}
            renderInput={params => <TextField {...params} label='Dedusible' />}
            />

            </Grid>
                {/* automatico */}
            <Grid item sm={4} xs={12}>

            <Autocomplete

                  options={listSiNo}
                  value={automatico}
                  id='autocomplete-padre'
                  isOptionEqualToValue={(option, value) => option.id=== value.id}
                  getOptionLabel={option => option.id + '-' + option.descripcion }
                  onChange={handlerAutomatico}
                  renderInput={params => <TextField {...params} label='Automatico' />}
                />

            </Grid>

                 {/* status */}
           <Grid item sm={4} xs={12}>

          <Autocomplete

                options={listTipoConcepto}
                value={tipoConcepto}
                id='autocomplete-padre'
                isOptionEqualToValue={(option, value) => option.id=== value.id}
                getOptionLabel={option => option.id + '-' + option.descripcion }
                onChange={handlerTipoConcepto}
                renderInput={params => <TextField {...params} label='Tipo Concepto' />}
              />

          </Grid>

           {/* Modulo */}
           <Grid item sm={6} xs={12}>

            <Autocomplete

                  options={listRhModulo}
                  value={modulo}
                  id='autocomplete-padre'
                  isOptionEqualToValue={(option, value) => option.id=== value.id}
                  getOptionLabel={option => option.id + '-' + option.descripcion }
                  onChange={handlerModulo}
                  renderInput={params => <TextField {...params} label='Modulo' />}
                />

          </Grid>
           {/* Frecuencia */}
           <Grid item sm={6} xs={12}>

              <Autocomplete

                    options={listRhFrecuencia}
                    value={frecuencia}
                    id='autocomplete-padre'
                    isOptionEqualToValue={(option, value) => option.id=== value.id}
                    getOptionLabel={option => option.id + '-' + option.descripcion }
                    onChange={handlerFrecuencia}
                    renderInput={params => <TextField {...params} label='Frecuencia' />}
                  />

          </Grid>

              {/* extra1*/}
              <Grid item sm={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='extra1'
                  control={control}
                  rules={{ maxLength:100,minLength:1}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Extra'
                      onChange={onChange}
                      placeholder='Extra'
                      error={Boolean(errors.descripcion)}
                      aria-describedby='validation-async-extra1'
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
          {/* denominacion*/}
          <Grid item sm={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='denominacion'
                  control={control}
                  rules={{ maxLength:100,minLength:1}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Denominacion'
                      onChange={onChange}
                      placeholder='Denominacion'
                      error={Boolean(errors.denominacion)}
                      aria-describedby='validation-async-Descripcion'
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
                  rules={{ maxLength:100,minLength:1}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Descripcion'
                      onChange={onChange}
                      placeholder='Descripcion'
                      error={Boolean(errors.descripcion)}
                      aria-describedby='validation-async-Descripcion'
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
            {/* Tipo Nomina */}
            <Grid item sm={12} xs={12}>

              <Autocomplete

                    options={listPuc}
                    value={puc}
                    id='autocomplete-padre'
                    isOptionEqualToValue={(option, value) => option.codigoPuc=== value.codigoPuc}
                    getOptionLabel={option => option.codigoPucConcat + '-' + option.denominacion }
                    onChange={handlerPuc}
                    renderInput={params => <TextField {...params} label='PUC' />}
                  />

            </Grid>
                {/* Modelo Calculo*/}
           <Grid item sm={12} xs={12}>

            <Autocomplete

                  options={listOssModeloCalculo}
                  value={modelo}
                  id='autocomplete-padre'
                  isOptionEqualToValue={(option, value) => option.id=== value.id}
                  getOptionLabel={option => option.id + '-' + option.descripcion }
                  onChange={handlerModelo}
                  renderInput={params => <TextField {...params} label='Modelo Calculo' />}
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
                  {"Esta Seguro de Eliminar estos Datos Tipo Nomina?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminaran los datos de Tipo Nomina
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
        <Divider   component="li" />
        <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Acumulado" value="1" />
            <Tab label="Formula" value="2" />
            <Tab label="PUC" value="3" />

          </TabList>
        </Box>
        <TabPanel value="1">
          <ConceptosAcumuladoList></ConceptosAcumuladoList>
        </TabPanel>
        <TabPanel value="2">
          <ConceptosFormulaList></ConceptosFormulaList>
        </TabPanel>
        <TabPanel value="3">
          <ConceptosPUCList></ConceptosPUCList>
        </TabPanel>

      </TabContext>
    </Box>
      </CardContent>
    </Card>
  )


}

export default FormRhConceptosUpdateAsync
