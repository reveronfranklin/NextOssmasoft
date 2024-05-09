// ** React Imports
// ** React Imports
import { ElementType } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import Button, { ButtonProps } from '@mui/material/Button'
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
import { Box, Typography } from '@mui/material'

// ** Third Party Imports

// ** Custom Component Imports

import { styled } from '@mui/material/styles'
import { IBmBienesFotoUpdateDto } from 'src/interfaces/Bm/BmBienesFoto/BmBienesFotoUpdateDto'
import { setListBmBienesFotoResponseDto } from 'src/store/apps/bm'

interface FormInputs {
  codigoBien: number
  numeroPlaca: string
  titulo: string
  data: string
  nombreArchivo: string
}

interface IFile {
  name: string

  lastModified: number

  lastModifiedDate: Date

  webkitRelativePath: string

  size: number

  type: string
}

//Subir Archivos
//https://www.youtube.com/watch?v=nCggM2MXbT4

const FormBmFotosBienesAsync = () => {
  // ** States
  const dispatch = useDispatch()

  const { bmBm1Seleccionado } = useSelector((state: RootState) => state.bmBm1)

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [name, setName] = useState<string>('')
  const [archivos, setArchivos] = useState<IFile[]>([])
  const [archivosSend, setArchivosSend] = useState<any>([])

  const defaultValues: IBmBienesFotoUpdateDto = {
    codigoBien: bmBm1Seleccionado.codigoBien,
    numeroPlaca: bmBm1Seleccionado.numeroPlaca,
    titulo: '',
    data: '',
    nombreArchivo: ''
  }

  const ImgStyled = styled('img')(({ theme }) => ({
    marginLeft: theme.spacing(4),
    width: 120,
    height: 120,
    borderRadius: 4,
    marginRight: theme.spacing(5)
  }))

  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const subirArchivos = (e: any) => {
    setArchivos(e)
    setArchivosSend(e)
    for (let index = 0; index < archivos.length; index++) {
      setName(archivos[index].name as string)
    }
  }

  const handleInputImageReset = () => {
    setImgSrc('/images/avatars/1.png')
    setValue('data', '')
    setValue('nombreArchivo', '')
  }

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)

    console.log(data)
    const f = new FormData()
    for (let index = 0; index < archivosSend.length; index++) {
      f.append('files', archivosSend[index])
    }

    f.append('numeroPlaca', bmBm1Seleccionado.numeroPlaca)

    const responseAll = await ossmmasofApi.post<any>('/BmBienesFotos/AddImage/' + bmBm1Seleccionado.codigoBien, f)

    if (responseAll.data.isValid) {
      dispatch(setListBmBienesFotoResponseDto(responseAll.data.data))

      handleInputImageReset()
    }

    setErrorMessage(responseAll.data.message)

    setLoading(false)
    toast.success('Form Submitted')
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true)

      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader title='RH - Fotos Bienes' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item sm={12} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <div>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Cargar Nueva Foto
                    <input
                      hidden
                      type='file'
                      multiple
                      onChange={e => subirArchivos(e.target.files)}
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>

                  {archivos.length > 0 ? (
                    <ButtonStyled size='large' type='submit' variant='outlined' sx={{ ml: 4 }}>
                      {loading ? (
                        <CircularProgress
                          sx={{
                            color: 'common.blue',
                            width: '20px !important',
                            height: '20px !important',
                            mr: theme => theme.spacing(2)
                          }}
                        />
                      ) : null}
                      Enviar
                    </ButtonStyled>
                  ) : null}

                  <Typography variant='caption' sx={{ mt: 4, display: 'block', color: 'text.disabled' }}>
                    {archivos.length} Archivos {name}
                  </Typography>
                </div>
              </Box>
            </Grid>
            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoBien'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoBien)}
                      aria-describedby='validation-async-codigoBien'
                      disabled
                    />
                  )}
                />
                {errors.codigoBien && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoBien'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* cedula*/}
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='numeroPlaca'
                  control={control}
                  rules={{ minLength: 5 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='numeroPlaca'
                      onChange={onChange}
                      placeholder='numeroPlaca'
                      error={Boolean(errors.numeroPlaca)}
                      aria-describedby='validation-async-numeroPlaca'
                      disabled
                    />
                  )}
                />
                {errors.numeroPlaca && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-numeroPlaca'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/*    <Grid item xs={12}>
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

            </Grid> */}
          </Grid>
          <Box>
            {errorMessage.length > 0 && (
              <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{errorMessage}</FormHelperText>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormBmFotosBienesAsync
