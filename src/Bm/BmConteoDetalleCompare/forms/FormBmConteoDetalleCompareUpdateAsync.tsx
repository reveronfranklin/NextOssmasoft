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
import { Box} from '@mui/material'





// ** Third Party Imports

// ** Custom Component Imports

import {  setListBmConteoDetalleResponseDto, setVerBmConteoDetalleActive } from 'src/store/apps/bmConteo'
import { IBmConteoDetalleUpdateDto } from 'src/interfaces/Bm/BmConteoDetalle/BmConteoDetalleUpdateDto'

interface FormInputs {
    codigoBmConteoDetalle :number;
		cantidad :number;
    cantidadContada :number;
    diferencia:number;
    comentario :string;
    codigoPlaca:string;
    articulo:string;

}




const FormBmConteoDetalleCompareUpdateAsync = () => {
  // ** States
  const dispatch = useDispatch();


  const {bmConteoDetalleSeleccionado} = useSelector((state: RootState) => state.bmConteo)

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const defaultValues = {
    codigoBmConteoDetalle :bmConteoDetalleSeleccionado.codigoBmConteoDetalle,
		cantidad :bmConteoDetalleSeleccionado.cantidad,
    cantidadContada:bmConteoDetalleSeleccionado.cantidadContada,
    diferencia:bmConteoDetalleSeleccionado.diferencia,
    comentario :bmConteoDetalleSeleccionado.comentario,
    codigoPlaca:bmConteoDetalleSeleccionado.codigoPlaca,
    articulo:bmConteoDetalleSeleccionado.articulo
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })






  const onSubmit = async (data:FormInputs) => {


    setLoading(true)
    setErrorMessage('')
    const updateDto:IBmConteoDetalleUpdateDto= {
      codigoBmConteoDetalle :data.codigoBmConteoDetalle,
      cantidadContada :data.cantidadContada,
      comentario:data.comentario,


    };

    console.log('updateDto',updateDto)

    const responseAll= await ossmmasofApi.post<any>('/BmConteoDetalle/Update',updateDto);

    if(responseAll.data.isValid){
      dispatch(setListBmConteoDetalleResponseDto(responseAll.data.data))

      dispatch(setVerBmConteoDetalleActive(false))
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
    <Card>
      <CardHeader title='BM- Conteo' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* Id */}
            <Grid item sm={2} xs={12} >
              <FormControl fullWidth>
                <Controller
                  name='codigoBmConteoDetalle'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoBmConteoDetalle)}
                      aria-describedby='validation-async-codigoBmConteoDetalle'
                      disabled
                    />
                  )}
                />
                {errors.codigoBmConteoDetalle && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoBmConteoDetalle'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* codigoPlaca */}
            <Grid item sm={4} xs={12} >
              <FormControl fullWidth>
                <Controller
                  name='codigoPlaca'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Placa'
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors.codigoPlaca)}
                      aria-describedby='validation-async-codigoPlaca'
                      disabled
                    />
                  )}
                />
                {errors.codigoPlaca && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoPlaca'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
              {/* codigoPlaca */}
              <Grid item sm={6} xs={12} >
              <FormControl fullWidth>
                <Controller
                  name='articulo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='articulo'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.articulo)}
                      aria-describedby='validation-async-articulo'
                      disabled
                    />
                  )}
                />
                {errors.articulo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-articulo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>


         {/* Comentario */}
         <Grid item sm={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='comentario'
                  control={control}
                  rules={{ maxLength:4000}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Comentario'
                      onChange={onChange}
                      placeholder='Comentario'
                      error={Boolean(errors.comentario)}
                      aria-describedby='validation-async-comentario'
                      multiline
                    />
                  )}
                />
                {errors.comentario && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-comentario'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

             {/* descripcionId */}
             <Grid item sm={4} xs={12} >
             <TextField
                      value={bmConteoDetalleSeleccionado.cantidad}
                      label='Total Cantidad'
                      placeholder='0'

                      aria-describedby='validation-async-cantidad'
                      disabled
                    />
            </Grid>
                {/* Cantidad COntada */}
                <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='cantidadContada'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Cantidad Contada'
                      onChange={onChange}
                      placeholder='Cantidad Contada'
                      error={Boolean(errors.cantidadContada)}
                      aria-describedby='validation-async-cantidadContada'

                    />
                  )}
                />
                {errors.cantidadContada && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-cantidadContada'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item sm={4} xs={12} >
             <TextField
                      value={bmConteoDetalleSeleccionado.diferencia}
                      label='Total Contado'
                      placeholder='0'

                      aria-describedby='validation-async-cantidad'
                      disabled
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

export default FormBmConteoDetalleCompareUpdateAsync
