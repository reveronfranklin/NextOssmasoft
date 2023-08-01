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
import { useState } from 'react'
import { Autocomplete, Box} from '@mui/material'

import { IPreDescriptivasUpdateDto } from 'src/interfaces/Presupuesto/i-pre-descriptivas-update-dto'
import { setPreDescriptivaSeleccionado, setVerPreDescriptivaActive } from 'src/store/apps/pre-descriptiva'

import { IPreTitulosGetDto } from 'src/interfaces/Presupuesto/i-pre-titulos-get-dto'
import { IPreDescriptivasGetDto } from 'src/interfaces/Presupuesto/i-pre-descriptivas-get-dto';

interface FormInputs {
  descripcionId :number;
  descripcionIdFk :number;
  tituloId :number;
  descripcionTitulo:string;
  descripcion :string;
  codigo :string;
  extra1 :string;
  extra2 :string;
  extra3 :string;

}



const FormPreDescriptivaUpdateAsync = () => {
  // ** States
  const dispatch = useDispatch();

      const { preDescriptivaSeleccionado,listPreDescriptivas
      } = useSelector((state: RootState) => state.preDescriptiva)
      const { listPreTitulos
      } = useSelector((state: RootState) => state.preTitulo)



  const  getTitulo=(tituloId:number)=>{
    const result = listPreTitulos.filter((elemento)=>{

      return elemento.tituloId==tituloId;
    });

    return result[0];
  }

  const    getDescriptiva=(descriptivaId:number)=>{
    const result = listPreDescriptivas.filter((elemento)=>{

      return elemento.descripcionId==descriptivaId;
    });

    return result[0];
  }


  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  //const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState<IPreTitulosGetDto>(getTitulo(preDescriptivaSeleccionado.tituloId))
  const [padre] = useState<IPreDescriptivasGetDto>(getDescriptiva(preDescriptivaSeleccionado.descripcionIdFk))

  const defaultValues = {
      descripcionId :preDescriptivaSeleccionado.descripcionId,
      descripcionIdFk :preDescriptivaSeleccionado.descripcionIdFk,
      tituloId :preDescriptivaSeleccionado.tituloId,
      descripcionTitulo:preDescriptivaSeleccionado.descripcionTitulo,
      descripcion :preDescriptivaSeleccionado.descripcion,
      codigo :preDescriptivaSeleccionado.codigo,
      extra1 :preDescriptivaSeleccionado.extra1,
      extra2 :preDescriptivaSeleccionado.extra2,
      extra3 :preDescriptivaSeleccionado.extra3,

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerTitulo=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tituloId',value.tituloId);
      setTitulo(value)


    }else{
      setValue('tituloId',0);

    }
  }
  const handlerPadre=async (e: any,value:any)=>{
    console.log('handlerPadre',value)
    if(value!=null){
      setValue('descripcionIdFk',value.descripcionId);

      //setPadre(value)


    }else{
      setValue('descripcionIdFk',0);

    }
  }



  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updateDescriptiva:IPreDescriptivasUpdateDto= {
      descripcionId :preDescriptivaSeleccionado.descripcionId,
      descripcionIdFk :data.descripcionIdFk,
      tituloId :data.tituloId,
      descripcion :data.descripcion,
      codigo:data.codigo,
      extra1 :data.extra1,
      extra2 :data.extra2,
      extra3 :data.extra3

    };
    console.log('updateDescriptiva',updateDescriptiva);
    const responseAll= await ossmmasofApi.post<any>('/PreDescriptivas/Update',updateDescriptiva);

    if(responseAll.data.isValid){
      dispatch(setPreDescriptivaSeleccionado(responseAll.data.data))
      dispatch(setVerPreDescriptivaActive(false))
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
  }

  return (
    <Card>
      <CardHeader title='Presupuesto - Modificar Descriptiva' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='descripcionId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.descripcionId)}
                      aria-describedby='validation-async-descripcionId'
                      disabled
                    />
                  )}
                />
                {errors.descripcionId && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-descripcionId'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
               {/* descripcion*/}
               <Grid item sm={10} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='descripcion'
                  control={control}
                  rules={{ required: true ,maxLength:200}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Descripcion'
                      onChange={onChange}
                      placeholder='Denominacion'
                      error={Boolean(errors.descripcion)}
                      aria-describedby='validation-async-denodescripcionminacion'
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


            {/* descripcionIdFk */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='descripcionIdFk'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id Padre'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.descripcionIdFk)}
                      aria-describedby='validation-async-descripcionIdFk'
                      disabled
                    />
                  )}
                />
                {errors.descripcionIdFk && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-descripcionIdFk'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
               {/* Padre */}

               <Grid item sm={10} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete

                        options={listPreDescriptivas}
                        value={padre}
                        id='autocomplete-padre'
                        isOptionEqualToValue={(option, value) => option.descripcionId=== value.descripcionId}
                        getOptionLabel={option => option.descripcionId + '-' + option.descripcion }
                        onChange={handlerPadre}
                        renderInput={params => <TextField {...params} label='Padre' />}
                      />

                </FormControl>
            </Grid>


            {/* tituloId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='tituloId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Titulo'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.tituloId)}
                      aria-describedby='validation-async-descripcionIdFk'
                      disabled
                    />
                  )}
                />
                {errors.tituloId && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-tituloId'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

           {/* Titulo */}

            <Grid item sm={10} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete

                        options={listPreTitulos}
                        value={titulo}
                        id='autocomplete-grupo'
                        isOptionEqualToValue={(option, value) => option.tituloId=== value.tituloId}
                        getOptionLabel={option => option.titulo }
                        onChange={handlerTitulo}
                        renderInput={params => <TextField {...params} label='Titulos' />}
                      />

                </FormControl>
            </Grid>



            {/* codigo*/}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigo'
                  control={control}
                  rules={{ maxLength:10}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Codigo'
                      onChange={onChange}
                      placeholder='codigo'
                      error={Boolean(errors.codigo)}
                      aria-describedby='validation-async-codigo'
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
            {/* extra1*/}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='extra1'
                  control={control}
                  rules={{ maxLength:100}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Extra1'
                      onChange={onChange}
                      placeholder='extra1'
                      error={Boolean(errors.extra1)}
                      aria-describedby='validation-async-codigo'
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
            {/* extra2*/}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='extra2'
                  control={control}
                  rules={{ maxLength:100}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Extra2'
                      onChange={onChange}
                      placeholder='extra1'
                      error={Boolean(errors.extra2)}
                      aria-describedby='validation-async-extra2'
                    />
                  )}
                />
                {errors.extra2 && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-extra2'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* extra3*/}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='extra3'
                  control={control}
                  rules={{ maxLength:100}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Extra3'
                      onChange={onChange}
                      placeholder='extra3'
                      error={Boolean(errors.extra2)}
                      aria-describedby='validation-async-extra3'
                    />
                  )}
                />
                {errors.extra3 && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-extra3'>
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

export default FormPreDescriptivaUpdateAsync
