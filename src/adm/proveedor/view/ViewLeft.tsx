import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Divider from '@mui/material/Divider'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'
import { ThemeColor } from 'src/@core/layouts/types'
import { useTheme } from '@mui/material/styles'
import { getInitials } from 'src/@core/utils/get-initials'
import { RootState } from 'src/store'
import { useSelector, useDispatch } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

import {
  setOperacionCrudProveedor,
  setProveedorSeleccionado,
  setProveedoresDtoSeleccionado,
  setVerProveedorActive
} from 'src/store/apps/adm-proveedor'

import { useServices } from '../services'
import { Autocomplete } from '@mui/material'

import { IProveedor } from '../interfaces/proveedor/proveedor.interfaces'
import DialogProveedorInfo from '../view/DialogInfo'

import toast from 'react-hot-toast'
import Spinner from 'src/@core/components/spinner'

interface ColorsType {
  [key: string]: ThemeColor
}

const roleColors: ColorsType = {
  Activo: 'success',
  Inactivo: 'warning',
  Suspendido: 'secondary'
}

const ViewLeft = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const dispatch = useDispatch()
  const { proveedorSeleccionado, proveedoresDtoSeleccionado } = useSelector(
    (state: RootState) => state.proveedor
  )

  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [proveedores, setProveedores] = useState<IProveedor[]>([])
  const [avatarKey, setAvatarKey] = useState<number>(0)

  const { getList } = useServices()

  const formatNumber = (value: number | null | undefined) => new Intl.NumberFormat('es-VE').format(value ?? 0)

  const handleEditClickOpen = () => {
    dispatch(setVerProveedorActive(true))
    dispatch(setOperacionCrudProveedor(2))
  }

  const handleEditClickOpenCreate = () => {
    const defaultValues: IProveedor = {
      codigoProveedor: 0,
      nombreProveedor: '',
      tipoProveedorId: 0,
      nacionalidad: null,
      cedula: 0,
      rif: '',
      fechaRif: new Date(),
      nit: null,
      fechaNit: null,
      numeroRegistroContraloria: null,
      fechaRegistroContraloria: null,
      fechaRegistroContraloriaString: '',
      fechaRegistroContraloriaObj: null,
      capitalPagado: 0,
      capitalSuscrito: 0,
      status: '',
      estatusFisicoId: 0,
      numeroCuenta: '',
      activo: true
    }

    dispatch(setProveedoresDtoSeleccionado(defaultValues))
    dispatch(setProveedorSeleccionado(defaultValues))
    dispatch(setVerProveedorActive(true))
    dispatch(setOperacionCrudProveedor(1))
  }

  const handlerProveedor = async (e: any, value: IProveedor | null) => {
    dispatch(setProveedorSeleccionado(value))
    dispatch(setProveedoresDtoSeleccionado(value))
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const filter = { PageSize: 0, PageNumber: 1, SearchText: '' }
      const data = await getList(filter)

      if (data?.isValid === false) {
        toast.error(data?.message)
      } else {
        setProveedores(data?.data)
      }

      setLoading(false)
    }

    getData()
  }, [dispatch])

  useEffect(() => {
    if (proveedoresDtoSeleccionado?.numeroCuenta) {
      setAvatarKey(prev => prev + 1)
    }
  }, [proveedoresDtoSeleccionado])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {loading ? (
          <Spinner sx={{ height: '100%' }} />
        ) : (
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Autocomplete
                sx={{ width: 380 }}
                options={proveedores}
                isOptionEqualToValue={(o, v) => o.codigoProveedor === v.codigoProveedor}
                getOptionLabel={o => `${o.cedula ?? ''} ${o.nombreProveedor}`}
                onChange={handlerProveedor}
                renderInput={params => <TextField {...params} label='Proveedores' />}
              />
            </CardContent>

            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {proveedorSeleccionado ? (
                <CustomAvatar
                  key={avatarKey}
                  variant='rounded'
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(proveedorSeleccionado?.nombreProveedor ?? '')}
                </CustomAvatar>
              ) : (
                <Typography variant='h6' sx={{ mb: 4 }}>
                  Seleccionar proveedor
                </Typography>
              )}

              <Typography variant='h6' sx={{ mb: 4 }}>
                {proveedorSeleccionado?.nombreProveedor ?? '---'}
              </Typography>

              {proveedorSeleccionado && (
                <CustomChip
                  skin='light'
                  size='small'
                  label={proveedorSeleccionado?.status || 'Activo'}
                  color={roleColors[proveedorSeleccionado?.status || 'Activo']}
                />
              )}
            </CardContent>

            {proveedorSeleccionado && (
              <>
                {/* Resumen de Capitales */}
                <CardContent sx={{ my: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ mr: 8, textAlign: 'center' }}>
                      <Typography variant='h6'>
                        {formatNumber(proveedorSeleccionado.capitalPagado)}
                      </Typography>
                      <Typography variant='body2'>Capital Pagado</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant='h6'>
                        {formatNumber(proveedorSeleccionado.capitalSuscrito)}
                      </Typography>
                      <Typography variant='body2'>Capital Suscrito</Typography>
                    </Box>
                  </Box>
                </CardContent>

                {/* Detalle */}
                <CardContent>
                  <Typography variant='h6'>Detalle del Proveedor</Typography>
                  <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
                  <Box sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Código:</Typography>
                      <Typography variant='body2'>{formatNumber(proveedorSeleccionado.codigoProveedor)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>RIF:</Typography>
                      <Typography variant='body2'>{proveedorSeleccionado.rif || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Cédula:</Typography>
                      <Typography variant='body2'>{formatNumber(proveedorSeleccionado.cedula)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Nacionalidad:</Typography>
                      <Typography variant='body2'>{proveedorSeleccionado.nacionalidad || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Cuenta Bancaria:</Typography>
                      <Typography variant='body2'>{proveedorSeleccionado.numeroCuenta || 'No registrada'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Reg. Contraloría:</Typography>
                      <Typography variant='body2'>
                        {proveedorSeleccionado.numeroRegistroContraloria || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>F. Registro Cont.:</Typography>
                      <Typography variant='body2'>
                        {proveedorSeleccionado.fechaRegistroContraloriaString || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>NIT:</Typography>
                      <Typography variant='body2'>{proveedorSeleccionado.nit || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </>
            )}

            <CardActions sx={{ justifyContent: 'center' }}>
              {proveedorSeleccionado?.codigoProveedor > 0 && (
                <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                  Editar
                </Button>
              )}

              <Button color='success' variant='contained' onClick={handleEditClickOpenCreate}>
                Crear
              </Button>
            </CardActions>

            <DatePickerWrapper>
              <DialogProveedorInfo popperPlacement={popperPlacement} />
            </DatePickerWrapper>

            <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
            <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
          </Card>
        )}
      </Grid>
    </Grid>
  )
}

export default ViewLeft
