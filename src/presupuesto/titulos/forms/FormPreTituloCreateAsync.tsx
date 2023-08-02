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

//import { IFechaDto } from 'src/interfaces/fecha-dto'
//import { fechaToFechaObj } from 'src/utlities/fecha-to-fecha-object'
import { useDispatch } from 'react-redux'

//import { getDateByObject } from 'src/utlities/ge-date-by-object'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useState } from 'react'
import { Autocomplete, Box} from '@mui/material'
import { IPreTitulosGetDto } from 'src/interfaces/Presupuesto/i-pre-titulos-get-dto'
import { IPreTitulosUpdateDto } from 'src/interfaces/Presupuesto/i-pre-titulos-update-dto'
import { setPreTituloSeleccionado, setVerPreTituloActive } from 'src/store/apps/pre-titulos'


interface FormInputs {
  tituloId :number;
  tituloIdFk :number;
  titulo :string;
  codigo :string;
  extra1 :string;
  extra2 :string;
  extra3 :string;

}





const FormPreTituloCreateAsync = () => {
  // ** States
  const dispatch = useDispatch();
  const { listPreTitulos,preTituloSeleccionado
      } = useSelector((state: RootState) => state.preTitulo)





      const  getTitulo=(tituloId:number)=>{
        const result = listPreTitulos.filter((elemento)=>{

          return elemento.tituloId==tituloId;
        });

        return result[0];
      }

 // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  //const [open, setOpen] = useState(false);
  const [padre] = useState<IPreTitulosGetDto>(getTitulo(preTituloSeleccionado.tituloIdFk))

  const defaultValues = {
      tituloId :preTituloSeleccionado.tituloId,
      tituloIdFk :preTituloSeleccionado.tituloIdFk,
      titulo:preTituloSeleccionado.titulo,
      codigo :preTituloSeleccionado.codigo,
      extra1 :preTituloSeleccionado.extra1,
      extra2 :preTituloSeleccionado.extra2,
      extra3 :preTituloSeleccionado.extra3,

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerPadre=async (e: any,value:any)=>{
    console.log('handlerPadre',value)
    if(value!=null){
      setValue('tituloIdFk',value.tituloId);

      //setPadre(value)


    }else{
      setValue('tituloIdFk',0);

    }
  }






  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updateTitulo:IPreTitulosUpdateDto= {
      tituloId :preTituloSeleccionado.tituloId,
      tituloIdFk :data.tituloIdFk,
      titulo :data.titulo,
      codigo:data.codigo,
      extra1 :data.extra1,
      extra2 :data.extra2,
      extra3 :data.extra3

    };
    console.log('updateDescriptiva',updateTitulo);
    const responseAll= await ossmmasofApi.post<any>('/PreTitulos/Create',updateTitulo);

    if(responseAll.data.isValid){
      dispatch(setPreTituloSeleccionado(responseAll.data.data))
      dispatch(setVerPreTituloActive(false))
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
  }


  return (
    <Card>
      <CardHeader title='Presupuesto - Crear Titulo' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='tituloId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.tituloId)}
                      aria-describedby='validation-async-descripcionId'
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
               {/* descripcion*/}
               <Grid item sm={10} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='titulo'
                  control={control}
                  rules={{ required: true ,maxLength:200}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Titulo'
                      onChange={onChange}
                      placeholder='Denominacion'
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


            {/* descripcionIdFk */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='tituloIdFk'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id Padre'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.tituloIdFk)}
                      aria-describedby='validation-async-tituloIdFk'
                      disabled
                    />
                  )}
                />
                {errors.tituloIdFk && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-tituloIdFk'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
               {/* Padre */}

               <Grid item sm={10} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete

                        options={listPreTitulos}
                        value={padre}
                        id='autocomplete-padre'
                        isOptionEqualToValue={(option, value) => option.tituloId=== value.tituloId}
                        getOptionLabel={option => option.tituloId + '-' + option.titulo }
                        onChange={handlerPadre}
                        renderInput={params => <TextField {...params} label='Padre' />}
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

export default FormPreTituloCreateAsync
