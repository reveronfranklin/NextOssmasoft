import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useDispatch } from 'react-redux'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useEffect, useState } from 'react'
import { Autocomplete, Box, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel} from '@mui/material'
import { ISelectListDescriptiva, ComunicacionResponse } from '../../../interfaces'
import { setProveedorSeleccionado, setVerProveedorActive } from 'src/store/apps/proveedor-comunicacion'
import { UrlServices } from '../enums/UrlServices.enum'

interface FormInputs {
  codigoComProveedor :number;
  codigoProveedor :number;
  tipoComunicacionId:number;
  codigoArea :string;
  lineaComunicacion:string;
  principal :boolean;
}

const FormComunicacionUpdateAsync = () => {
  const dispatch = useDispatch();

  const {proveedorSeleccionado, listTipoProveedor} = useSelector((state: RootState) => state.admProveedor)

  const  getTipoComunicacion=(id:number)=>{
    const result = listTipoProveedor?.filter((elemento)=>{

      return elemento.id==id;
    });

    return result[0];
  }

  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);
  const [principal, setPrincipal] = useState(false);
  const [tipoComunicacion,setTipoComunicacion] = useState<ISelectListDescriptiva>(getTipoComunicacion(proveedorSeleccionado.tipoComunicacionId))
  const [listTipoComunicacion] = useState<ISelectListDescriptiva[]>(listTipoProveedor)

  const defaultValues:ComunicacionResponse = {
    codigoComProveedor :proveedorSeleccionado.codigoComProveedor,
    codigoProveedor :proveedorSeleccionado.codigoProveedor,
    tipoComunicacionId :proveedorSeleccionado.tipoComunicacionId,
    codigoArea :proveedorSeleccionado.codigoArea,
    lineaComunicacion :proveedorSeleccionado.lineaComunicacion,
    extension :proveedorSeleccionado.extension,
    principal:proveedorSeleccionado.principal
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerTipoComunicacion=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tipoComunicacionId',value.tipoComunicacionId);
      setTipoComunicacion(value);
    }else{
      setValue('tipoComunicacionId',0);
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setVerProveedorActive(false))
    dispatch(setProveedorSeleccionado({}))
  };
  const handlePrincipal=async (e: any,value:any)=>{
    console.log('valuee on click principal',value)
    setPrincipal(value);
    if(principal===true) {
      setValue('principal',value);
    }else{
      setValue('principal',value);
    }
  };

  const handleDelete = async  () => {
    try {
      setOpen(false);

      const deleteComunicacion = {
        codigoComProveedor:proveedorSeleccionado.codigoComProveedor
      }

      const responseAll= await ossmmasofApi.post<any>(`${UrlServices.DELETE_COMUNICACIONES}`,deleteComunicacion);

      setErrorMessage(responseAll.data.message)

      if (responseAll.data.isValid) {
        dispatch(setVerProveedorActive(false))
        dispatch(setProveedorSeleccionado({}))
        toast.success('Comunicacion eliminada correctamente');
      } else {
        toast.error(responseAll.data.message || 'Error de validación');
      }
    } catch (error) {
      console.error('Error opening direccion modal:', error);
    }
  };

  function validarEmail(valor:string) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)){
     return true;
    } else {
     return false;
    }
  }

  const onSubmit = async (data:FormInputs) => {
    try {
      const isEmail = tipoComunicacion.descripcion.includes('CORREO');

      if(isEmail==true && !validarEmail(data.lineaComunicacion)){
        setErrorMessage('Formato de Email Invalido');

        return;
      }

      setLoading(true)

      const updateComunicacion: ComunicacionResponse = {
        codigoComProveedor :data.codigoComProveedor,
        codigoProveedor :proveedorSeleccionado.codigoProveedor,
        tipoComunicacionId :data.tipoComunicacionId,
        codigoArea :data.codigoArea,
        lineaComunicacion :data.lineaComunicacion,
        extension :0,
        principal:data.principal
      };

      const responseAll= await ossmmasofApi.post<any>(`${UrlServices.UPDATE_COMUNICACIONES}`,updateComunicacion);

      if (responseAll.data.isValid) {
        dispatch(setProveedorSeleccionado(responseAll.data.data))
        dispatch(setVerProveedorActive(false))
        toast.success('Comunicacion actualizada correctamente');
      } else {
        toast.error(responseAll.data.message || 'Error de validación');
      }

      setErrorMessage(responseAll.data.message)
      setLoading(false)
    } catch (error) {
      console.error('Error on submit comunicacion update:', error);
    }
  }
  useEffect(() => {
    setPrincipal(proveedorSeleccionado.principal)
    setTipoComunicacion(getTipoComunicacion(proveedorSeleccionado.tipoComunicacionId));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='Proveedor - Modificar Comunicaion' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoComProveedor'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoComProveedor)}
                      aria-describedby='validation-async-codigoComProveedor'
                      disabled
                    />
                  )}
                />
                {errors.codigoComProveedor && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoComProveedor'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
           {/* Tipo de Comunicacion */}
           <Grid item sm={6} xs={12}>

              <Autocomplete
                    options={listTipoComunicacion}
                    value={tipoComunicacion}
                    id='autocomplete-tipoComunicacion'
                    isOptionEqualToValue={(option, value) => option.id=== value.id}
                    getOptionLabel={option => option.id + '-' + option.descripcion }
                    onChange={handlerTipoComunicacion}
                    renderInput={params => <TextField {...params} label='Tipo Pago' />}
                  />

          </Grid>
          <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
              <FormControlLabel  control={ <Checkbox

                    checked={principal}
                    onChange={handlePrincipal}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />} label="Principal?" />

              </FormControl>
            </Grid>

            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoArea'
                  control={control}
                  rules={{ maxLength:20}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Area'
                      onChange={onChange}
                      placeholder='noCuenta'
                      error={Boolean(errors.codigoArea)}
                      aria-describedby='validation-async-codigoArea'
                    />
                  )}
                />
                {errors.codigoArea && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoArea'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item sm={9} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='lineaComunicacion'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Linea'
                      onChange={onChange}
                      placeholder='linea Comunicacion'
                      error={Boolean(errors.lineaComunicacion)}
                      aria-describedby='validation-async-lineaComunicacion'
                    />
                  )}
                />
                {errors.lineaComunicacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-lineaComunicacion'>
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
                  {"Esta Seguro de Eliminar estos Datos?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminaran los datos de esta linea de comunicacion
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

export default FormComunicacionUpdateAsync
