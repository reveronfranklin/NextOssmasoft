// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface SidebarAddProveedorType {
  open: boolean
  toggle: () => void
}

interface ProveedorData {
  nombreProveedor: string
  rif: string
  cedula: number
  nacionalidad: string
  numeroCuenta: string
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  nombreProveedor: yup
    .string()
    .min(3, obj => showErrors('Proveedor', obj.value.length, obj.min))
    .required(),
  rif: yup.string().required(),
  cedula: yup
    .number()
    .typeError('Cédula es requerida')
    .required(),
  nacionalidad: yup.string().required(),
  numeroCuenta: yup.string().required()
})

const defaultValues = {
  nombreProveedor: '',
  rif: '',
  cedula: Number(''),
  nacionalidad: '',
  numeroCuenta: ''
}

const SidebarAddProveedor = (props: SidebarAddProveedorType) => {
  // ** Props
  const { open, toggle } = props

  // ** State (se mantienen, no se eliminan)
  const [plan, setPlan] = useState<string>('basic')
  const [role, setRole] = useState<string>('subscriber')

  // ** Hooks
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: ProveedorData) => {
    console.log('Proveedor a registrar', data, role, plan)
    toggle()
    reset()
  }

  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    setValue('cedula', Number(''))
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Agregar Proveedor</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>

      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='nombreProveedor'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Proveedor'
                  placeholder='Proveedor XYZ'
                  error={Boolean(errors.nombreProveedor)}
                />
              )}
            />
            {errors.nombreProveedor && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.nombreProveedor.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='rif'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='RIF'
                  placeholder='J-12345678-9'
                  error={Boolean(errors.rif)}
                />
              )}
            />
            {errors.rif && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.rif.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='cedula'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='number'
                  label='Cédula'
                  placeholder='12345678'
                  error={Boolean(errors.cedula)}
                />
              )}
            />
            {errors.cedula && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.cedula.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='nacionalidad'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Nacionalidad'
                  placeholder='Venezolana'
                  error={Boolean(errors.nacionalidad)}
                />
              )}
            />
            {errors.nacionalidad && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.nacionalidad.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='numeroCuenta'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Número de Cuenta'
                  placeholder='0102-0123-45-6789012345'
                  error={Boolean(errors.numeroCuenta)}
                />
              )}
            />
            {errors.numeroCuenta && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.numeroCuenta.message}
              </FormHelperText>
            )}
          </FormControl>

          {/* Se mantienen Plan y Role sin tocar comportamiento */}
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='role-select'>Role</InputLabel>
            <Select
              fullWidth
              value={role}
              label='Role'
              onChange={e => setRole(e.target.value)}
            >
              <MenuItem value='subscriber'>Subscriber</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='plan-select'>Plan</InputLabel>
            <Select
              fullWidth
              value={plan}
              label='Plan'
              onChange={e => setPlan(e.target.value)}
            >
              <MenuItem value='basic'>Basic</MenuItem>
              <MenuItem value='company'>Company</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Guardar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancelar
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddProveedor
