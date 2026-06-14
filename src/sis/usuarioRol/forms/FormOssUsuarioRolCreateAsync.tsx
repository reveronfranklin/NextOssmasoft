import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { setOssUsuarioRolSeleccionado, setVerOssUsuarioRolActive } from 'src/store/apps/oss-usuario-rol'
import { OssUsuarioRolCreateDto } from '../interfaces/OssUsuarioRolDtos'
import { createOssUsuarioRol, OSS_USUARIO_ROL_QUERY_KEY } from '../services/ossUsuarioRolService'
import { defaultJsonMenuText, parseJsonMenu } from './jsonMenuUtils'

interface FormInputs {
  usuario: string
  codigoUsuario: number
  descripcion: string
  jsonMenuText: string
}

const FormOssUsuarioRolCreateAsync = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [jsonMessage, setJsonMessage] = useState('')

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues: {
      usuario: '',
      codigoUsuario: 0,
      descripcion: '',
      jsonMenuText: defaultJsonMenuText
    }
  })

  const jsonMenuText = watch('jsonMenuText')
  const menuPreview = useMemo(() => parseJsonMenu(jsonMenuText), [jsonMenuText])

  const handleFormatJson = () => {
    const result = parseJsonMenu(jsonMenuText)
    setJsonMessage(result.message)

    if (!result.message) {
      setValue('jsonMenuText', JSON.stringify(result.menu, null, 2))
      toast.success('JSON formateado correctamente')
    }
  }

  const handleValidateJson = () => {
    const result = parseJsonMenu(jsonMenuText)
    setJsonMessage(result.message)

    if (!result.message) {
      toast.success('JSON valido')
    }
  }

  const onSubmit = async (data: FormInputs) => {
    const result = parseJsonMenu(data.jsonMenuText)

    if (result.message) {
      setJsonMessage(result.message)

      return
    }

    setLoading(true)
    setErrorMessage('')
    setJsonMessage('')

    const payload: OssUsuarioRolCreateDto = {
      usuario: data.usuario,
      codigoUsuario: Number(data.codigoUsuario),
      descripcion: data.descripcion,
      jsonMenu: result.menu
    }

    try {
      const response = await createOssUsuarioRol(payload)

      if (response.isValid) {
        toast.success('Rol de usuario creado correctamente')
        dispatch(setOssUsuarioRolSeleccionado({ ...payload, codigoUsuarioRol: response.data }))
        dispatch(setVerOssUsuarioRolActive(false))
        queryClient.invalidateQueries({ queryKey: [OSS_USUARIO_ROL_QUERY_KEY] })
      } else {
        setErrorMessage(response.message)
      }
    } catch (error: any) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title='SIS - Crear Rol de Usuario' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='usuario'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <TextField {...field} label='Usuario' error={Boolean(errors.usuario)} />}
                />
                {errors.usuario && <FormHelperText sx={{ color: 'error.main' }}>Este campo es requerido</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoUsuario'
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type='number'
                      label='Codigo Usuario'
                      error={Boolean(errors.codigoUsuario)}
                      onChange={event => field.onChange(Number(event.target.value))}
                    />
                  )}
                />
                {errors.codigoUsuario && <FormHelperText sx={{ color: 'error.main' }}>Debe ser mayor a cero</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='descripcion'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <TextField {...field} label='Descripcion' error={Boolean(errors.descripcion)} />}
                />
                {errors.descripcion && <FormHelperText sx={{ color: 'error.main' }}>Este campo es requerido</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item md={8} xs={12}>
              <Controller
                name='jsonMenuText'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={18}
                    label='JSON Menu'
                    error={Boolean(jsonMessage)}
                    sx={{ '& textarea': { fontFamily: 'monospace', fontSize: 13 } }}
                  />
                )}
              />
              {jsonMessage && <FormHelperText sx={{ color: 'error.main' }}>{jsonMessage}</FormHelperText>}
            </Grid>
            <Grid item md={4} xs={12}>
              <Box sx={{ border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 1, p: 4, minHeight: 260 }}>
                <Typography variant='subtitle2' sx={{ mb: 3 }}>
                  Vista Previa
                </Typography>
                {menuPreview.message ? (
                  <Typography variant='body2' sx={{ color: 'error.main' }}>
                    {menuPreview.message}
                  </Typography>
                ) : (
                  menuPreview.menu.map(item => (
                    <Box key={`${item.title}-${item.path ?? ''}`} sx={{ mb: 3 }}>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      {(item.children ?? []).map(child => (
                        <Typography key={`${child.title}-${child.path ?? ''}`} variant='caption' sx={{ display: 'block', ml: 3 }}>
                          {child.title} {child.path ? `- ${child.path}` : ''}
                        </Typography>
                      ))}
                    </Box>
                  ))
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button type='button' variant='outlined' size='large' onClick={handleValidateJson} sx={{ mr: 2 }}>
                Validar JSON
              </Button>
              <Button type='button' variant='outlined' size='large' onClick={handleFormatJson} sx={{ mr: 2 }}>
                Formatear JSON
              </Button>
              <Button size='large' type='submit' variant='contained' disabled={loading}>
                {loading ? <CircularProgress sx={{ color: 'common.white', width: '20px !important', height: '20px !important', mr: 2 }} /> : null}
                Guardar
              </Button>
            </Grid>
          </Grid>
          <Box>{errorMessage.length > 0 && <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{errorMessage}</FormHelperText>}</Box>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormOssUsuarioRolCreateAsync
