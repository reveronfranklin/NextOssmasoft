import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
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
import { Autocomplete, Box} from '@mui/material'
import { setRhPersonaMovCtrSeleccionado, setVerRhPersonaMovCtrActive } from 'src/store/apps/rh-persona-mov-ctrl'
import { setConceptoSeleccionado } from 'src/store/apps/rh'
import { CreateRhMovNominaCommand } from '../interfaces'

type FormInputs = CreateRhMovNominaCommand

const FormRhVariacionCreateAsync = () => {
  const dispatch = useDispatch()

  const { rhPersonaMovCtrSeleccionado } = useSelector((state: RootState) => state.rhPersonaMovCtrl)
  const { conceptos } = useSelector((state: RootState) => state.nomina)

  const  getConcepto = (id:number) => {
    const result = conceptos?.filter((elemento) => elemento.codigoConcepto == id)

    return result[0]
  }

  const [loading, setLoading]           = useState<boolean>(false)
  const [concepto, setConcepto]         = useState<any>(getConcepto(rhPersonaMovCtrSeleccionado.codigoConcepto))
  const [errorMessage, setErrorMessage] = useState<string>('')

  const defaultValues: CreateRhMovNominaCommand = {
    codigoTipoNomina: 12,
    codigoPersona: rhPersonaMovCtrSeleccionado.codigoPersona,
    codigoConcepto: rhPersonaMovCtrSeleccionado.codigoConcepto,
    complementoConcepto: '',
    tipo: 'E',
    frecuenciaId: 1,
    monto: 0,
    status: 'A',
    usuarioIns: 1
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerConceptos =(e: any,value:any)=>{
    console.log('conceptos',value)
    if(value){
      dispatch(setConceptoSeleccionado(value));
      setConcepto(value);
      setValue('codigoConcepto',value.codigoConcepto)
    }
  }

  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const createMovControl: CreateRhMovNominaCommand = {
      codigoTipoNomina: 12,
      codigoPersona: rhPersonaMovCtrSeleccionado.codigoPersona,
      codigoConcepto: rhPersonaMovCtrSeleccionado.codigoConcepto,
      complementoConcepto: data.complementoConcepto,
      tipo: data.tipo,
      frecuenciaId: data.frecuenciaId,
      monto: data.monto,
      status: data.status,
      usuarioIns: 1
    }

    const responseAll= await ossmmasofApi.post<any>('/RhPersonasMovControl/Create', createMovControl);

    if(responseAll.data.isValid){
      dispatch(setRhPersonaMovCtrSeleccionado(responseAll.data.data))
      dispatch(setVerRhPersonaMovCtrActive(false))
      toast.success('Form Submitted')
    }

    setErrorMessage(responseAll.data.message)
    setLoading(false)
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
    <>
      <Box sx={{ my: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>

            {/* CodigoPersona (Solo lectura o Hidden) */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth size="small">
                <Controller
                  name='codigoPersona'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      size="small"
                      value={value || 0}
                      label='Id'
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

            {/* Selección de Concepto */}
            <Grid item sm={10} xs={12}>
              <Autocomplete
                size="small"
                options={conceptos}
                id='autocomplete-concepto'
                value={concepto}
                isOptionEqualToValue={(option, value) => option.codigo + option.codigoTipoNomina === value.codigo+ value.codigoTipoNomina}
                getOptionLabel={option => option.codigo + '-' +option.codigoTipoNomina +'-'+ option.denominacion}
                onChange={handlerConceptos}
                renderInput={params => <TextField {...params} label='Conceptos' />}
              />
            </Grid>

            {/* Monto */}
            <Grid item sm={4} xs={12}>
              <Controller
                name='monto'
                control={control}
                rules={{ required: true, min: 0.01 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    size="small"
                    label='Monto'
                    error={Boolean(errors.monto)}
                    helperText={errors.monto && "Monto requerido"}
                  />
                )}
              />
            </Grid>

            {/* Complemento / Descripción adicional */}
            <Grid item sm={8} xs={12}>
              <Controller
                name='complementoConcepto'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label='Complemento del Concepto'
                    placeholder='Información adicional...'
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button size='small' type='submit' variant='contained' sx={{ pb: 0 }}>
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
      </Box>
    </>
  )
}

export default FormRhVariacionCreateAsync
