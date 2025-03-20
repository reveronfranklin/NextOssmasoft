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
import { Autocomplete, Box } from '@mui/material'

// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports

import { IBmPlacaCuarentenaUpdateDto } from 'src/interfaces/Bm/BmPlacasCuarentena/BmPlacaCuarentenaUpdateDto'
import { setBmPlacaCuarentenaSeleccionado, setVerBmPlacaCuarentenaActive } from 'src/store/apps/bmPlacaCuarentena'

interface FormInputs {
  codigoPlacaCuarentena: number
  numeroPlaca: string
}

const FormBmPlacaCuarentenaCreateAsync = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  // ** States
  const dispatch = useDispatch()

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { bmPlacaCuarentenaSeleccionado, listPlacas } = useSelector((state: RootState) => state.bmPlacaCuarentena)

  const defaultValues = {
    codigoPlacaCuarentena: bmPlacaCuarentenaSeleccionado.codigoPlacaCuarentena,
    numeroPlaca: bmPlacaCuarentenaSeleccionado.numeroPlaca,
    articulo: bmPlacaCuarentenaSeleccionado.articulo
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerPlaca = async (e: any, value: any) => {
    console.log(value)
    if (value != null) {
      setValue('numeroPlaca', value.numeroPlaca)
    }
  }

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)
    setErrorMessage('')
    const updateDto: IBmPlacaCuarentenaUpdateDto = {
      codigoPlacaCuarentena: 0,
      numeroPlaca: data.numeroPlaca
    }

    console.log('updateDto', updateDto)

    const responseAll = await ossmmasofApi.post<any>('/BmPlacaCuarentena/Create', updateDto)

    if (responseAll.data.isValid) {
      dispatch(setBmPlacaCuarentenaSeleccionado({}))

      dispatch(setVerBmPlacaCuarentenaActive(false))
    }
    setErrorMessage(responseAll.data.message)
    setLoading(false)
  }
  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      console.log(popperPlacement)

      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader title='BM- Agregar Placa Cuarentena' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoPlacaCuarentena'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoPlacaCuarentena)}
                      aria-describedby='validation-async-codigoBmConteo'
                      disabled
                    />
                  )}
                />
                {errors.codigoPlacaCuarentena && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoBmConteo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {listPlacas.length > 0 && (
              <Grid item sm={10} xs={12}>
                <Autocomplete
                  options={listPlacas}
                  id='autocomplete-padre'
                  getOptionLabel={option => option.numeroPlaca}
                  onChange={handlerPlaca}
                  renderInput={params => <TextField {...params} label='Placas' />}
                />
              </Grid>
            )}

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
            {errorMessage.length > 0 && (
              <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{errorMessage}</FormHelperText>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormBmPlacaCuarentenaCreateAsync
