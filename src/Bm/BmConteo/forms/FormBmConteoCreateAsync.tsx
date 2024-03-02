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
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Third Party Imports

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
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports


import { IPersonaDto } from 'src/interfaces/rh/i-rh-persona-dto'
import { setPersonaSeleccionado, setPersonasDtoSeleccionado } from 'src/store/apps/rh'
import { fetchDataPersonasDto } from 'src/store/apps/rh/thunks'
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { IBmConteoUpdateDto } from 'src/interfaces/Bm/BmConteo/BmConteoUpdateDto'
import { setBmConteoSeleccionado, setListBmConteoResponseDto, setListIcp, setListIcpSeleccionado, setVerBmConteoActive } from 'src/store/apps/bmConteo'
import { ISelectListDescriptiva } from 'src/interfaces/rh/ISelectListDescriptiva'
import { ICPGetDto } from 'src/interfaces/Bm/BmConteo/ICPGetDto'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { IBmConteoDeleteDto } from 'src/interfaces/Bm/BmConteo/BmConteoDeleteDto'



interface FormInputs {
	  codigoBmConteo :number;
		titulo :string;
		codigoPersonaResponsable:number;
		conteoId:number;
		fecha :Date | null;
		fechaString :string;
		fechaObj:IFechaDto | null;

}




const FormBmConteoCreateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();


  const {bmConteoSeleccionado,listIcp,listIcpSeleccionado} = useSelector((state: RootState) => state.bmConteo)


  const  getConteo=(id:number)=>{

    console.log('id',id)
    console.log('conteos',conteos)
    const result = conteos?.filter((elemento:any)=>{

      return elemento.id==id;
    });

    console.log('result',result)

    return result[0];
  }

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);


  const [personas, setPersonas] = useState<IListSimplePersonaDto[]>([]);
  const [conteos, setConteos] = useState<ISelectListDescriptiva[]>([]);
  const [conteo,setConteo] = useState<ISelectListDescriptiva>(getConteo(bmConteoSeleccionado.conteoId));
  const [listUnidadTrabajo, setListUnidadTrabajo] = useState<ICPGetDto[]>([]);
  const defaultValues = {

    codigoBmConteo :bmConteoSeleccionado.codigoBmConteo,
		titulo :bmConteoSeleccionado.titulo,
		codigoPersonaResponsable:bmConteoSeleccionado.codigoPersonaResponsable,
		conteoId:bmConteoSeleccionado.conteoId,
		fecha :bmConteoSeleccionado.fecha,
		fechaString :bmConteoSeleccionado.fechaString,
		fechaObj:bmConteoSeleccionado.fechaObj
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })




  const handlerConteo=async (e: any,value:any)=>{

    if(value!=null){
      setValue('conteoId',value.id);
      setConteo(value);

    }else{
      setValue('conteoId',0);

    }
  }
  const handleIcp= (e: any,value:any)=>{
    console.log('handler Icp',value)
    if(value!=null){
      dispatch(setListIcpSeleccionado(value));

    }else{
      const icp: ICPGetDto[]=[{
        codigoIcp: 0,
        unidadTrabajo :  ''
      }]
      dispatch(setListIcpSeleccionado(icp));

    }
  }



  const handlerFechaDesde=(desde:Date)=>{
    const fechaObj:IFechaDto =fechaToFechaObj(desde);
    const conteoTmp= {...bmConteoSeleccionado,fechaString:desde.toISOString(),fechaObj:fechaObj,fecha:desde};
    dispatch(setBmConteoSeleccionado(conteoTmp))
    setValue('fechaString',desde.toISOString());
    setValue('fecha',desde);
    setValue('fechaObj',fechaObj);
  }


  const handlerPersona= async (e: any,value:any)=>{




    if(value && value.codigoPersona>0){
      setValue('codigoPersonaResponsable',value.codigoPersona)
      const filter={codigoPersona:value.codigoPersona}
      const responseAll= await ossmmasofApi.post<IPersonaDto>('/RhPersona/GetPersona',filter);
      dispatch(setPersonaSeleccionado(responseAll.data));
      dispatch(setPersonasDtoSeleccionado(responseAll.data));
    }else{

      const filter={codigoPersona:0}
      const responseAll= await ossmmasofApi.post<IPersonaDto>('/RhPersona/GetPersona',filter);
      dispatch(setPersonaSeleccionado(responseAll.data));
      dispatch(setPersonasDtoSeleccionado(responseAll.data));

  }


  }


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setVerBmConteoActive(false))
    dispatch(setBmConteoSeleccionado({}))
  };




  const handleDelete = async  () => {

    setOpen(false);
    const deleteConteo : IBmConteoDeleteDto={
      codigoBmConteo:bmConteoSeleccionado.codigoBmConteo
    }
    const responseAll= await ossmmasofApi.post<any>('/BmConteo/Delete',deleteConteo);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerBmConteoActive(false))
      dispatch(setBmConteoSeleccionado({}))
    }


  };




  const onSubmit = async (data:FormInputs) => {


    setLoading(true)
    setErrorMessage('')
    const updateDto:IBmConteoUpdateDto= {
      codigoBmConteo :data.codigoBmConteo,
      titulo :data.titulo,
      codigoPersonaResponsable:data.codigoPersonaResponsable,
      conteoId:data.conteoId,
      fecha :data.fecha,
      fechaString :data.fechaString,
      fechaObj:data.fechaObj,
      listIcpSeleccionado:listIcpSeleccionado,
      comentario:''

    };

    console.log('updateDto',updateDto)

    const responseAll= await ossmmasofApi.post<any>('/BmConteo/Create',updateDto);

    if(responseAll.data.isValid){
      dispatch(setListBmConteoResponseDto(responseAll.data.data))

      dispatch(setVerBmConteoActive(false))
    }
    setErrorMessage(responseAll.data.message)
    setLoading(false)


  }
  useEffect(() => {

    const getData = async () => {
      setLoading(true);
      console.log(popperPlacement);


      const responseIcps= await ossmmasofApi.get<any>('/Bm1/GetListICP');
      dispatch(setListIcp(responseIcps.data.data))

      const filterConteo={descripcionId:0,tituloId:7}
      const responseConteos= await ossmmasofApi.post<any>('/BmDescriptivas/GetByTitulo',filterConteo);
      setConteos(responseConteos.data)

      const dataPersonas= await fetchDataPersonasDto(dispatch);
      setPersonas(dataPersonas?.data.data)
      setListUnidadTrabajo(listIcp)
      setLoading(false);
    };




    getData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='BM- Conteo' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12} >
              <FormControl fullWidth>
                <Controller
                  name='codigoBmConteo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoBmConteo)}
                      aria-describedby='validation-async-codigoBmConteo'
                      disabled
                    />
                  )}
                />
                {errors.codigoBmConteo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoBmConteo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
              {/* codigo */}
              <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='titulo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Titulo'
                      onChange={onChange}
                      placeholder='Titulo'
                      error={Boolean(errors.titulo)}
                      aria-describedby='validation-async-titulo'

                    />
                  )}
                />
                {errors.titulo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-titulo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>


            <Grid item  sm={4} xs={12}>
                <DatePicker

                  selected={ getDateByObject(bmConteoSeleccionado.fechaObj!)}
                  id='date-time-picker-desde'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerFechaDesde(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Fecha' />}
                />
            </Grid>

              {/* status */}
           <Grid item sm={10} xs={12}>

              <Autocomplete
                  options={personas}
                  id='autocomplete-persona'
                  isOptionEqualToValue={(option, value) => option.codigoPersona=== value.codigoPersona}
                  getOptionLabel={option => option.cedula + ' ' + option.nombreCompleto}
                  onChange={handlerPersona}
                  renderInput={params => <TextField {...params} label='Responsable' />}
                />


            </Grid>




            <Grid item sm={2} xs={12}>

            <Autocomplete

                  options={conteos}
                  value={conteo}
                  id='autocomplete-padre'
                  isOptionEqualToValue={(option, value) => option.id=== value.id}
                  getOptionLabel={option =>  option.descripcion }
                  onChange={handlerConteo}
                  renderInput={params => <TextField {...params} label='Conteos' />}
                />

            </Grid>

            <Grid item sm={12} xs={12}>

                <div>

                  {listUnidadTrabajo && listUnidadTrabajo.length> 0?
                      ( <Autocomplete
                        multiple={true}
                        options={listUnidadTrabajo }
                        id='autocomplete-list-icp'
                        isOptionEqualToValue={(option, value) => option.codigoIcp=== value.codigoIcp}
                        getOptionLabel={option => option.codigoIcp + '-'+option.unidadTrabajo}
                        onChange={handleIcp}
                        renderInput={params => <TextField {...params} label='ICP' />}
                      /> ) : <div></div>
                  }
                  </div>


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
                  {"Esta Seguro de Eliminar estos Datos Del Conteo?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminaran los datos de Conteo
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

export default FormBmConteoCreateAsync
