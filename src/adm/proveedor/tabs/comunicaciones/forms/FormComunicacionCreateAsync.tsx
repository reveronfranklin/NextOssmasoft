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
import { Autocomplete, Box, Checkbox, FormControlLabel} from '@mui/material'
import { ISelectListDescriptiva, ComunicacionResponse } from '../../../interfaces'
import { setProveedorSeleccionado, setVerProveedorActive } from 'src/store/apps/proveedor-comunicacion'
import { UrlServices } from '../enums/UrlServices.enum'

interface FormInputs {
  codigoComProveedor: number;
  codigoProveedor: number;
  tipoComunicacionId:number;
  codigoArea :string;
  lineaComunicacion:string;
  principal :boolean;
}

const FormComunicacionCreateAsync = () => {
  const dispatch = useDispatch();
  const {proveedorSeleccionado, listTipoProveedor} = useSelector((state: RootState) => state.admProveedor)

  const getTipoComunicacion=(id:number) => {
    const result = listTipoProveedor?.filter((elemento)=>{

      return elemento.id==id;
    });

    return result[0];
  }

  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [principal, setPrincipal] = useState(false);
  const [tipoComunicacion,setTipoComunicacion] = useState<ISelectListDescriptiva>(getTipoComunicacion(proveedorSeleccionado.tipoComunicacionId))
  const [listTipoComunicacion] = useState<ISelectListDescriptiva[]>(listTipoProveedor)

  const defaultValues:ComunicacionResponse = {
    codigoComProveedor :0,
    codigoProveedor :proveedorSeleccionado.codigoProveedor,
    tipoComunicacionId :proveedorSeleccionado.tipoComunicacionId,
    codigoArea :'',
    lineaComunicacion :'',
    extension :0,
    principal:false
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerTipoComunicacion=async (e: any,value:any)=>{
    if(value!=null){
      setValue('tipoComunicacionId',value.id);
      setTipoComunicacion(value);
    }else{
      setValue('tipoComunicacionId',0);
    }
  }

  const handlePrincipal=async (e: any,value:any)=>{
    setPrincipal(value);
    if(principal===true) {
      setValue('principal',value);
    }else{
      setValue('principal',value);
    }
  };

  const onSubmit = async (data:FormInputs) => {
    console.log('data',data)
    setLoading(true)

    const createComunicacion:ComunicacionResponse= {
      codigoComProveedor :data.codigoComProveedor,
      codigoProveedor :proveedorSeleccionado.codigoProveedor,
      tipoComunicacionId :data.tipoComunicacionId,
      codigoArea :data.codigoArea,
      lineaComunicacion :data.lineaComunicacion,
      extension :0,
      principal:data.principal
    };

    const responseAll= await ossmmasofApi.post<any>(`${UrlServices.CREATE_COMUNICACIONES}`,createComunicacion);

    console.log('responseAll update comunicaciones',responseAll)

    if(responseAll.data.isValid){
      dispatch(setProveedorSeleccionado(responseAll.data.data))
      dispatch(setVerProveedorActive(false))
    }

    setErrorMessage(responseAll.data.message)
    setLoading(false)
    toast.success('Form Submitted')
  }
  useEffect(() => {
    setPrincipal(proveedorSeleccionado.principal)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='Proveedor - Crear Comunicaion' />
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
           {/* Tipo de Pago */}
           <Grid item sm={6} xs={12}>
              <Autocomplete
                    options={listTipoComunicacion}
                    value={tipoComunicacion}
                    id='autocomplete-tipoComunicacion'
                    isOptionEqualToValue={(option, value) => option.id=== value.id}
                    getOptionLabel={option => option.id + '-' + option.descripcion }
                    onChange={handlerTipoComunicacion}
                    renderInput={params => <TextField {...params} label='Tipo Comunicacion' />}
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

export default FormComunicacionCreateAsync
