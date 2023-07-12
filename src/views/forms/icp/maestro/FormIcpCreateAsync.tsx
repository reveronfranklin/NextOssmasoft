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


// ** Third Party Imports

// ** Custom Component Imports
//import CustomInput from '../../form-elements/pickers/PickersCustomInput'

// ** Types


import { useDispatch } from 'react-redux'


import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useState } from 'react'
import { Box } from '@mui/material'
import { IUpdateIcp } from 'src/interfaces/Presupuesto/i-update-pre-indice-categoria-programatica-dto'
import { setIcpSeleccionado } from 'src/store/apps/ICP';

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'

interface FormInputs {
  codigoIcp :number;
  ano :number;
  codigoSector:string;
  codigoPrograma :string;
  codigoSubPrograma :string
  codigoProyecto:string;
  codigoActividad :string;
  codigoOficina :string;
  denominacion :string;
  unidadEjecutora:string;
  descripcion:string;
  codigoFuncionario:number;
  codigoPresupuesto:number;

}



const FormIcpCreateAsync = () => {
  // ** States
  const dispatch = useDispatch();

 const {listpresupuestoDtoSeleccionado} = useSelector((state: RootState) => state.presupuesto)

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)



  const [errorMessage, setErrorMessage] = useState<string>('')
  const defaultValues = {
    codigoIcp: 0,
    ano:0,
    codigoSector:'',
    codigoPrograma:'',
    codigoSubPrograma:'',
    codigoProyecto:'',
    codigoActividad:'',
    codigoOficina:'',
    unidadEjecutora:'',
    denominacion:'',
    descripcion:'',
    codigoFuncionario:0,
    codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,

  }


  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })




  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updateIcp:IUpdateIcp= {
      codigoIcp:0,
      ano:Number(data.ano),
      codigoSector:data.codigoSector,
      codigoPrograma:data.codigoPrograma,
      codigoSubPrograma:data.codigoSubPrograma,
      codigoProyecto:data.codigoProyecto,
      codigoActividad:data.codigoActividad,
      codigoOficina:data.codigoOficina,
      unidadEjecutora:data.unidadEjecutora,
      codigoPresupuesto:data.codigoPresupuesto,
      denominacion:data.denominacion,
      descripcion:data.descripcion,
      codigoFuncionario:data.codigoFuncionario,

    };

    console.log(updateIcp)

    const responseAll= await ossmmasofApi.post<any>('/PreIndiceCategoriaProgramatica/Create',updateIcp);
    if(responseAll.data.isValid){
      dispatch(setIcpSeleccionado(responseAll.data.data))
    }


    setErrorMessage(responseAll.data.message)



    setLoading(false)
    toast.success('Form Submitted')
  }

  return (
    <Card>
      <CardHeader title='Crear ICP' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

                       {/* Codigo de Indice Categoria Programada(ICP) */}
                       <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoIcp'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Codigo'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoIcp)}
                      aria-describedby='validation-async-codigo-icp'
                      disabled
                    />
                  )}
                />
                {errors.codigoIcp && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigo-icp'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Año de Indice Categoria Programada(ICP) */}
            <Grid item  sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='ano'
                  control={control}
                  rules={{ min:2000 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Año'
                      onChange={onChange}
                      placeholder='Año'
                      error={Boolean(errors.ano)}
                      aria-describedby='validation-async-año'
                    />
                  )}
                />
                {errors.ano && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-año'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Denominacion de Indice Categoria Programada(ICP) */}
            <Grid item xs={8}>
              <FormControl fullWidth>
                <Controller
                  name='denominacion'
                  control={control}
                  rules={{ required: true ,maxLength:200}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Denominacion'
                      onChange={onChange}
                      placeholder='Denominacion'
                      error={Boolean(errors.denominacion)}
                      aria-describedby='validation-async-denominacion'
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

             {/* Codigo Sector de Indice Categoria Programada(ICP) */}
            <Grid item xs={2}>
              <FormControl fullWidth>
                <Controller
                  name='codigoSector'
                  control={control}
                  rules={{ minLength: 2 ,maxLength: 2}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Sector'
                      onChange={onChange}
                      placeholder='Sector'
                      error={Boolean(errors.codigoSector)}
                      aria-describedby='validation-async-sector'
                    />
                  )}
                />
                {errors.codigoSector && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-sector'>
                    Logitud debe ser de 2 digitos
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Codigo Programa de Indice Categoria Programada(ICP) */}
            <Grid item xs={2}>
              <FormControl fullWidth>
                <Controller
                  name='codigoPrograma'
                  control={control}
                  rules={{ minLength: 2 ,maxLength: 2}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Programa'
                      onChange={onChange}
                      placeholder='Programa'
                      error={Boolean(errors.codigoPrograma)}
                      aria-describedby='validation-async-programa'
                    />
                  )}
                />
                {errors.codigoPrograma && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-programa'>
                    Logitud debe ser de 2 digitos
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Codigo SubPrograma de Indice Categoria Programada(ICP) */}
            <Grid item xs={2}>
              <FormControl fullWidth>
                <Controller
                  name='codigoSubPrograma'
                  control={control}
                  rules={{ minLength: 2 ,maxLength: 2}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='SubPrograma'
                      onChange={onChange}
                      placeholder='SubPrograma'
                      error={Boolean(errors.codigoSubPrograma)}
                      aria-describedby='validation-async-sub-programa'
                    />
                  )}
                />
                {errors.codigoSubPrograma && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-sub-programa'>
                    Logitud debe ser de 2 digitos
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Codigo Proyecto de Indice Categoria Programada(ICP) */}
            <Grid item xs={2}>
              <FormControl fullWidth>
                <Controller
                  name='codigoProyecto'
                  control={control}
                  rules={{ minLength: 2 ,maxLength: 2}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Proyecto.'
                      onChange={onChange}
                      placeholder='Proyecto'
                      error={Boolean(errors.codigoProyecto)}
                      aria-describedby='validation-async-proyecto'
                    />
                  )}
                />
                {errors.codigoProyecto && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-sub-proyecto'>
                    Logitud debe ser de 2 digitos
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

           {/* Codigo Actividad de Indice Categoria Programada(ICP) */}
           <Grid item xs={2}>
              <FormControl fullWidth>
                <Controller
                  name='codigoActividad'
                  control={control}
                  rules={{ minLength: 2 ,maxLength: 2}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Actividad u Obra'
                      onChange={onChange}
                      placeholder='Actividad u Obra'
                      error={Boolean(errors.codigoActividad)}
                      aria-describedby='validation-async-actividad'
                    />
                  )}
                />
                {errors.codigoActividad && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-actividad'>
                    Logitud debe ser de 2 digitos
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Codigo Oficina de Indice Categoria Programada(ICP) */}
            <Grid item xs={2}>
              <FormControl fullWidth>
                <Controller
                  name='codigoOficina'
                  control={control}
                  rules={{ minLength: 2 ,maxLength: 2}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Oficina'
                      onChange={onChange}
                      placeholder='Oficina'
                      error={Boolean(errors.codigoOficina)}
                      aria-describedby='validation-async-oficina'
                    />
                  )}
                />
                {errors.codigoOficina && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-oficina'>
                    Logitud debe ser de 2 digitos
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>


            {/* Unidad Ejecutora de Indice Categoria Programada(ICP) */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='unidadEjecutora'
                  control={control}
                  rules={{ maxLength:200}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Unidad Ejecutora'
                      onChange={onChange}
                      placeholder='Unidad Ejecutora'
                      error={Boolean(errors.unidadEjecutora)}
                      aria-describedby='validation-async-unidad-ejecutora'
                    />
                  )}
                />
                {errors.unidadEjecutora && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-unidad-ejecutora'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>



            {/* Descripcion de Indice Categoria Programada(ICP) */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='descripcion'
                  control={control}
                  rules={{ required:true, maxLength: 4000 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Descripcion'
                      onChange={onChange}
                      placeholder='Descripcion'
                      error={Boolean(errors.descripcion)}
                      aria-describedby='validation-async-descripcion'
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

            {/* Codigo Funcionario de Indice Categoria Programada(ICP) */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoFuncionario'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Funcionario'
                      onChange={onChange}
                      placeholder='Funcionario'
                      error={Boolean(errors.codigoFuncionario)}
                      aria-describedby='validation-async-funcionario'
                    />
                  )}
                />
                {errors.codigoFuncionario && (
                  <FormHelperText sx={{ color: 'error.main'}} id='validation-async-funcionario'>
                    This field is required
                  </FormHelperText>

                )}
              </FormControl>
            </Grid>



            {/* Codigo Presupuesto de Indice Categoria Programada(ICP) */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoPresupuesto'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Presupuesto'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoPresupuesto)}
                      aria-describedby='validation-async-codigo-presupuesto'
                      disabled
                    />
                  )}
                />
                {errors.codigoPresupuesto && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigo-presupuesto'>
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

export default FormIcpCreateAsync
