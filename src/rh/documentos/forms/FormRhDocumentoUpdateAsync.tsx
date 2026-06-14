import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  TextField
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { RootState } from 'src/store'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva'
import { IRhDocumentoDeleteDto } from 'src/interfaces/rh/RhDocumentoDeleteDto'
import { IRhDocumentoUpdateDto } from 'src/interfaces/rh/RhDocumentoUpdateDto'
import { setRhDocumentoSeleccionado, setVerRhDocumentoActive } from 'src/store/apps/rh-documentos'
import RhDocumentoDescriptivaAutocomplete from '../components/RhDocumentoDescriptivaAutocomplete'
import {
  deleteRhDocumento,
  DOCUMENTOS_QUERY_KEY,
  RH_DOCUMENTOS_TITULOS,
  updateRhDocumento
} from '../services/rhDocumentosService'

interface FormInputs {
  tipoDocumentoId: number
  numeroDocumento: string
  fechaVencimiento: string
  tipoGradoId: number
  gradoId: number
  extra1: string
  extra2: string
  extra3: string
}

const FormRhDocumentoUpdateAsync = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { rhDocumentoSeleccionado } = useSelector((state: RootState) => state.rhDocumento)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [open, setOpen] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues: {
      tipoDocumentoId: rhDocumentoSeleccionado.tipoDocumentoId ?? 0,
      numeroDocumento: rhDocumentoSeleccionado.numeroDocumento ?? '',
      fechaVencimiento: rhDocumentoSeleccionado.fechaVencimiento?.slice(0, 10) ?? '',
      tipoGradoId: rhDocumentoSeleccionado.tipoGradoId ?? 0,
      gradoId: rhDocumentoSeleccionado.gradoId ?? 0,
      extra1: rhDocumentoSeleccionado.extra1 ?? '',
      extra2: rhDocumentoSeleccionado.extra2 ?? '',
      extra3: rhDocumentoSeleccionado.extra3 ?? ''
    }
  })

  const handleDelete = async () => {
    setOpen(false)
    setLoading(true)
    setErrorMessage('')

    const payload: IRhDocumentoDeleteDto = {
      codigoDocumento: rhDocumentoSeleccionado.codigoDocumento
    }

    try {
      const response = await deleteRhDocumento(payload)

      if (response.isValid) {
        toast.success('Documento eliminado correctamente')
        dispatch(setVerRhDocumentoActive(false))
        dispatch(setRhDocumentoSeleccionado({}))
        queryClient.invalidateQueries({ queryKey: [DOCUMENTOS_QUERY_KEY, rhDocumentoSeleccionado.codigoPersona] })
      } else {
        setErrorMessage(response.message)
      }
    } catch (error: any) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormInputs) => {
    if (data.tipoDocumentoId <= 0) {
      setErrorMessage('Seleccione el tipo de documento')

      return
    }

    setLoading(true)
    setErrorMessage('')

    const payload: IRhDocumentoUpdateDto = {
      codigoDocumento: rhDocumentoSeleccionado.codigoDocumento,
      codigoPersona: rhDocumentoSeleccionado.codigoPersona,
      tipoDocumentoId: data.tipoDocumentoId,
      numeroDocumento: data.numeroDocumento,
      fechaVencimiento: data.fechaVencimiento || null,
      tipoGradoId: data.tipoGradoId > 0 ? data.tipoGradoId : 0,
      gradoId: data.gradoId > 0 ? data.gradoId : 0,
      usuarioUpd: 1,
      extra1: data.extra1 || null,
      extra2: data.extra2 || null,
      extra3: data.extra3 || null
    }

    try {
      const response = await updateRhDocumento(payload)

      if (response.isValid) {
        toast.success('Documento actualizado correctamente')
        dispatch(setVerRhDocumentoActive(false))
        queryClient.invalidateQueries({ queryKey: [DOCUMENTOS_QUERY_KEY, rhDocumentoSeleccionado.codigoPersona] })
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
      <CardHeader title='RH - Modificar Documento' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item sm={3} xs={12}>
              <TextField fullWidth disabled label='Id' value={rhDocumentoSeleccionado.codigoDocumento || 0} />
            </Grid>
            <Grid item sm={5} xs={12}>
              <RhDocumentoDescriptivaAutocomplete
                id={watch('tipoDocumentoId')}
                tituloId={RH_DOCUMENTOS_TITULOS.tipoDocumento}
                label='Tipo Documento'
                required
                onSelectionChange={(value: ISelectListDescriptiva | null) => setValue('tipoDocumentoId', value?.id ?? 0)}
              />
              {errors.tipoDocumentoId && <FormHelperText sx={{ color: 'error.main' }}>Seleccione el tipo de documento</FormHelperText>}
            </Grid>
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='numeroDocumento'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField {...field} label='Numero Documento' error={Boolean(errors.numeroDocumento)} />
                  )}
                />
                {errors.numeroDocumento && <FormHelperText sx={{ color: 'error.main' }}>Este campo es requerido</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item sm={4} xs={12}>
              <Controller
                name='fechaVencimiento'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth type='date' label='Fecha Vencimiento' InputLabelProps={{ shrink: true }} />}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <RhDocumentoDescriptivaAutocomplete
                id={watch('tipoGradoId')}
                tituloId={RH_DOCUMENTOS_TITULOS.tipoGrado}
                label='Tipo Grado'
                onSelectionChange={(value: ISelectListDescriptiva | null) => setValue('tipoGradoId', value?.id ?? 0)}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <RhDocumentoDescriptivaAutocomplete
                id={watch('gradoId')}
                tituloId={RH_DOCUMENTOS_TITULOS.grado}
                label='Grado'
                onSelectionChange={(value: ISelectListDescriptiva | null) => setValue('gradoId', value?.id ?? 0)}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Controller name='extra1' control={control} render={({ field }) => <TextField {...field} fullWidth label='Extra 1' />} />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Controller name='extra2' control={control} render={({ field }) => <TextField {...field} fullWidth label='Extra 2' />} />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Controller name='extra3' control={control} render={({ field }) => <TextField {...field} fullWidth label='Extra 3' />} />
            </Grid>
            <Grid item xs={12}>
              <Button size='large' type='submit' variant='contained' disabled={loading}>
                {loading ? <CircularProgress sx={{ color: 'common.white', width: '20px !important', height: '20px !important', mr: 2 }} /> : null}
                Guardar
              </Button>
              <Button variant='outlined' size='large' onClick={() => setOpen(true)} sx={{ color: 'error.main', ml: 2 }} disabled={loading}>
                Eliminar
              </Button>
            </Grid>
          </Grid>
          <Box>{errorMessage.length > 0 && <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>{errorMessage}</FormHelperText>}</Box>
        </form>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Esta Seguro de Eliminar estos Datos?</DialogTitle>
          <DialogContent>
            <DialogContentText>Se eliminaran los datos de este documento</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>No</Button>
            <Button onClick={handleDelete} autoFocus>
              Si
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default FormRhDocumentoUpdateAsync
