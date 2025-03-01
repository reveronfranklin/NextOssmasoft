// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'
import { useTheme } from '@mui/material/styles'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {
  setListEstados,
  setListPaises,
  setOperacionCrudRhPersonas,
  setPersonaSeleccionado,
  setPersonasDtoSeleccionado,
  setVerRhPersonasActive
} from 'src/store/apps/rh'
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas'
import { Autocomplete } from '@mui/material'
import { fetchDataPersonasDto } from 'src/store/apps/rh/thunks'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IPersonaDto } from 'src/interfaces/rh/i-rh-persona-dto'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DialogRhPersonasInfo from './DialogRhPersonasInfo'

//import QRCode from "react-qr-code";
import toast from 'react-hot-toast'
import Spinner from 'src/@core/components/spinner'

//import { IFechaDto } from 'src/interfaces/fecha-dto'
//import { monthByIndex } from 'src/utilities/ge-date-by-object'

interface ColorsType {
  [key: string]: ThemeColor
}

const data: UsersType = {
  id: 1,
  role: 'admin',
  status: 'active',
  username: 'gslixby0',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  contact: '(479) 232-9151',
  currentPlan: 'enterprise',
  fullName: 'Daisy Patterson',
  email: 'gslixby0@abc.net.au',
  avatar: '/images/avatars/4.png'
}

const roleColors: ColorsType = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary',
  Activo: 'success',
  Egresado: 'warning',
  Suspendido: 'secondary'
}

const PersonaViewLeft = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const { personasDtoSeleccionado } = useSelector((state: RootState) => state.nomina)

  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)

  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const dispatch = useDispatch()
  const [personas, setPersonas] = useState<IListSimplePersonaDto[]>([])
  const { personaSeleccionado } = useSelector((state: RootState) => state.nomina)
  const [avatar, setAvatar] = useState<string | undefined>(personasDtoSeleccionado.avatar ?? undefined)
  const [avatarKey, setAvatarKey] = useState<number>(0)

  //const fechaActual = new Date()

  //const currentYear  = new Date().getFullYear();
  //const currentMonth = new Date().getMonth();
  //const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  //const currentDay =new Date().getDate();
  //const currentDayString = '00' + currentDay.toString();
  //const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}
  //const defaultDateString = fechaActual.toISOString();

  //const router = useRouter();

  // Handle Edit dialog
  const handleEditClickOpen = () => {
    //setOpenEdit(true)
    dispatch(setVerRhPersonasActive(true))
    dispatch(setOperacionCrudRhPersonas(2))
  }
  const handleEditClickOpenCreate = () => {
    //setOpenEdit(true)
    const defaultValues: IPersonaDto = {
      codigoPersona: 0,
      cedula: 0,
      nombre: '',
      apellido: '',
      nombreCompleto: '',
      nacionalidad: '',
      sexo: '',
      edad: 0,
      paisNacimientoId: 0,
      estadoNacimientoId: 0,
      numeroGacetaNacional: '',
      estadoCivilId: 0,
      descripcionEstadoCivil: '',
      estatura: 0,
      peso: 0,
      manoHabil: '',
      extra1: '',
      extra2: '',
      extra3: '',
      status: '',
      descripcionStatus: '',
      identificacionId: 0,
      numeroIdentificacion: 0,
      fechaNacimiento: undefined,
      fechaNacimientoString: '',
      fechaNacimientoObj: undefined,
      codigoCargo: 0,
      descripcionCargo: '',
      codigoIcp: 0,
      descripcionIcp: '',
      avatar: '',
      sueldo: 0,
      fechaGacetaNacional: '',
      fechaGacetaNacionalObj: undefined
    }

    dispatch(setPersonasDtoSeleccionado(defaultValues))
    dispatch(setPersonaSeleccionado(defaultValues))
    dispatch(setVerRhPersonasActive(true))
    dispatch(setOperacionCrudRhPersonas(1))
  }
  const handleEditClose = () => setOpenEdit(false)

  const handlerPersona = async (e: any, value: any) => {
    if (value && value.codigoPersona > 0) {
      const filter = { codigoPersona: value.codigoPersona }
      const responseAll = await ossmmasofApi.post<IPersonaDto>('/RhPersona/GetPersona', filter)
      dispatch(setPersonaSeleccionado(responseAll.data))
      dispatch(setPersonasDtoSeleccionado(responseAll.data))
      console.log('responseAll.data persona', responseAll.data)
    } else {
      const filter = { codigoPersona: 0 }
      const responseAll = await ossmmasofApi.post<IPersonaDto>('/RhPersona/GetPersona', filter)
      dispatch(setPersonaSeleccionado(responseAll.data))
      dispatch(setPersonasDtoSeleccionado(responseAll.data))
    }
  }

  useEffect(() => {
    const getData = async () => {
      //dispatch(setTiposNominaSeleccionado(tiposNomina[0]));
      /*const personaDefault:IListSimplePersonaDto ={
        apellido:'',
        cedula:0,
        codigoPersona:0,
        nombre:'',
        nombreCompleto:'',
        avatar:'',
        descripcionStatus:'',
        nacionalidad:'',
        sexo:'',
        fechaNacimiento:undefined,
        fechaNacimientoString:'',
        fechaNacimientoObj:undefined,
        email:'',
        paisNacimiento:'',
        edad:0,
        descripcionEstadoCivil:'',
        paisNacimientoId:0,
        estadoNacimientoId:0,
        manoHabil:'',
        status:'',
        fechaGacetaNacional:'',
        estadoCivilId:0,
        estatura:0,
        peso:0,
        identificacionId:0,
        numeroIdentificacion:0,
        numeroGacetaNacional:0,

      };
      dispatch(setPersonaSeleccionado(personaDefault));
      dispatch(setPersonasDtoSeleccionado(personaDefault));*/

      setLoading(true)
      const data = await fetchDataPersonasDto(dispatch)
      console.log('data persona', data)
      if (data?.data.isValid === false) {
        toast.error(data?.data.message)
      } else {
        setPersonas(data?.data.data)
        console.log('personas', personas)
        console.log('data persona', data?.data.data)
      }

      const filterClave = { clave: '' }
      const responseEstados = await ossmmasofApi.post<ISelectListDescriptiva[]>('/SisUbicacion/GetEstados', filterClave)
      dispatch(setListEstados(responseEstados.data))

      const responsePaises = await ossmmasofApi.post<ISelectListDescriptiva[]>('/SisUbicacion/GetPaises', filterClave)
      dispatch(setListPaises(responsePaises.data))
      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    if (personasDtoSeleccionado.avatar === null) {
      setAvatar(undefined)
    } else {
      setAvatar(personasDtoSeleccionado.avatar)
      setAvatarKey(prevKey => prevKey + 1)
    }
  }, [personasDtoSeleccionado.avatar])

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {loading ? (
            <Spinner sx={{ height: '100%' }} />
          ) : (
            <Card>
              <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div>
                  <Autocomplete
                    sx={{ width: 380, ml: 2, mr: 2 }}
                    options={personas}
                    id='autocomplete-persona'
                    isOptionEqualToValue={(option, value) => option.codigoPersona === value.codigoPersona}
                    getOptionLabel={option => option.cedula + ' ' + option.nombreCompleto}
                    onChange={handlerPersona}
                    renderInput={params => <TextField {...params} label='Personas' />}
                  />
                </div>
              </CardContent>
              <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {data.avatar.length ? (
                  <CustomAvatar
                    key={avatarKey}
                    src={avatar + '?v=' + Date.now()}
                    variant='rounded'
                    alt={personaSeleccionado.nombreCompleto}
                    sx={{ width: 260, height: 320, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                  />
                ) : (
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color={data.avatarColor as ThemeColor}
                    sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                  >
                    {getInitials(personaSeleccionado.nombreCompleto)}
                  </CustomAvatar>
                )}
                {/*  <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "80%", width: "80%" }}
              value={String(personaSeleccionado.cedula)}
              viewBox={`0 0 128 128`}
              /> */}

                <Typography variant='h6' sx={{ mb: 4 }}>
                  {personaSeleccionado.nombreCompleto} - {personaSeleccionado.avatar}
                </Typography>
                <CustomChip
                  skin='light'
                  size='small'
                  label={personaSeleccionado.descripcionStatus}
                  color={roleColors[personaSeleccionado.descripcionStatus]}
                  sx={{ textTransform: 'capitalize' }}
                />
              </CardContent>

              <CardContent sx={{ my: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 44, height: 44 }}>
                      <Icon icon='mdi:check' />
                    </CustomAvatar>
                    <div>
                      <Typography variant='h6'>{personaSeleccionado.sueldo}</Typography>
                      <Typography variant='body2'>Sueldo</Typography>
                    </div>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 44, height: 44 }}>
                      <Icon icon='mdi:star-outline' />
                    </CustomAvatar>
                    <div>
                      <Typography variant='h6'> {personaSeleccionado.tiempoServicio?.cantidadAños} </Typography>
                      <Typography variant='body2'>Años Servicio</Typography>
                    </div>
                  </Box>
                </Box>
              </CardContent>

              <CardContent>
                <Typography variant='h6'>Detalle</Typography>
                <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
                <Box sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Dpto:</Typography>
                    <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                      {personaSeleccionado.descripcionIcp}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Cargo:</Typography>
                    <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                      {personaSeleccionado.descripcionCargo}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Ficha:</Typography>
                    <Typography variant='body2'>{personaSeleccionado.codigoPersona}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Cedula:</Typography>
                    <Typography variant='body2'>{personaSeleccionado.cedula}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Nacionalidad:</Typography>
                    <Typography variant='body2'>{personaSeleccionado.nacionalidad}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Sexo:</Typography>
                    <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                      {personaSeleccionado.sexo}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Fecha Nacimiento:</Typography>
                    <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                      {personaSeleccionado.fechaNacimientoObj?.day}/{personaSeleccionado.fechaNacimientoObj?.month}/
                      {personaSeleccionado.fechaNacimientoObj?.year}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Edad:</Typography>
                    <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                      {personaSeleccionado.edad}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Estado Civil:</Typography>
                    <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                      {personaSeleccionado.descripcionEstadoCivil}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Pais Nacimiento:</Typography>
                    <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                      {personaSeleccionado.paisNacimiento}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Email:</Typography>
                    <Typography variant='body2'>{personaSeleccionado.email}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Fecha Ingreso:</Typography>
                    <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                      {personaSeleccionado.tiempoServicio?.fechaDesdeString}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Tiempo Servicio:</Typography>
                    <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                      {personaSeleccionado.tiempoServicio?.cantidadAños} Años{' '}
                      {personaSeleccionado.tiempoServicio?.cantidadMeses} Meses{' '}
                      {personaSeleccionado.tiempoServicio?.cantidadDias} Dias
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                {personaSeleccionado && personaSeleccionado.cedula > 0 ? (
                  <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                    Editar
                  </Button>
                ) : (
                  <div></div>
                )}

                <Button color='success' variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpenCreate}>
                  Crear
                </Button>
              </CardActions>

              <DatePickerWrapper>
                <DialogRhPersonasInfo popperPlacement={popperPlacement} />
              </DatePickerWrapper>

              <Dialog
                open={openEdit}
                onClose={handleEditClose}
                aria-labelledby='user-view-edit'
                sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
                aria-describedby='user-view-edit-description'
              >
                <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                  Edit User Information
                </DialogTitle>
                <DialogContent>
                  <DialogContentText
                    variant='body2'
                    id='user-view-edit-description'
                    sx={{ textAlign: 'center', mb: 7 }}
                  >
                    Updating user details will receive a privacy audit.
                  </DialogContentText>
                  <form>
                    <Grid container spacing={6}>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label='Full Name' defaultValue={data.fullName} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label='Username'
                          defaultValue={data.username}
                          InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth type='email' label='Billing Email' defaultValue={data.email} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id='user-view-status-label'>Status</InputLabel>
                          <Select
                            label='Status'
                            defaultValue={data.status}
                            id='user-view-status'
                            labelId='user-view-status-label'
                          >
                            <MenuItem value='pending'>Pending</MenuItem>
                            <MenuItem value='active'>Active</MenuItem>
                            <MenuItem value='inactive'>Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label='TAX ID' defaultValue='Tax-8894' />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label='Contact' defaultValue={`+1 ${data.contact}`} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id='user-view-language-label'>Language</InputLabel>
                          <Select
                            label='Language'
                            defaultValue='English'
                            id='user-view-language'
                            labelId='user-view-language-label'
                          >
                            <MenuItem value='English'>English</MenuItem>
                            <MenuItem value='Spanish'>Spanish</MenuItem>
                            <MenuItem value='Portuguese'>Portuguese</MenuItem>
                            <MenuItem value='Russian'>Russian</MenuItem>
                            <MenuItem value='French'>French</MenuItem>
                            <MenuItem value='German'>German</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id='user-view-country-label'>Country</InputLabel>
                          <Select
                            label='Country'
                            defaultValue='USA'
                            id='user-view-country'
                            labelId='user-view-country-label'
                          >
                            <MenuItem value='USA'>USA</MenuItem>
                            <MenuItem value='UK'>UK</MenuItem>
                            <MenuItem value='Spain'>Spain</MenuItem>
                            <MenuItem value='Russia'>Russia</MenuItem>
                            <MenuItem value='France'>France</MenuItem>
                            <MenuItem value='Germany'>Germany</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          label='Use as a billing address?'
                          control={<Switch defaultChecked />}
                          sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                        />
                      </Grid>
                    </Grid>
                  </form>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                  <Button variant='contained' sx={{ mr: 1 }} onClick={handleEditClose}>
                    Salvar
                  </Button>
                  <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                    Cancelar
                  </Button>
                </DialogActions>
              </Dialog>

              <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
              <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
            </Card>
          )}
        </Grid>

        {/*  <Grid item xs={12}>
          <Card sx={{ boxShadow: 'none', border: theme => `2px solid ${theme.palette.primary.main}` }}>
            <CardContent
              sx={{ display: 'flex', flexWrap: 'wrap', pb: '0 !important', justifyContent: 'space-between' }}
            >
              <CustomChip skin='light' size='small' color='primary' label='Standard' />
              <Box sx={{ display: 'flex', position: 'relative' }}>
                <Typography variant='h6' sx={{ color: 'primary.main', alignSelf: 'flex-end' }}>
                  $
                </Typography>
                <Typography
                  variant='h3'
                  sx={{
                    color: 'primary.main'
                  }}
                >
                  99
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', alignSelf: 'flex-end' }}>
                  / month
                </Typography>
              </Box>
            </CardContent>

            <CardContent>
              <Box sx={{ mt: 6, mb: 5 }}>
                <Box sx={{ display: 'flex', mb: 3.5, alignItems: 'center', '& svg': { mr: 2, color: 'grey.300' } }}>
                  <Icon icon='mdi:circle' fontSize='0.5rem' />
                  <Typography variant='body2'>10 Users</Typography>
                </Box>
                <Box
                  sx={{
                    mb: 3.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 2, color: 'grey.300' }
                  }}
                >
                  <Icon icon='mdi:circle' fontSize='0.5rem' />
                  <Typography variant='body2'>Up to 10GB storage</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 2, color: 'grey.300' }
                  }}
                >
                  <Icon icon='mdi:circle' fontSize='0.5rem' />
                  <Typography variant='body2'>Basic Support</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5, justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Days
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                  26 of 30 Days
                </Typography>
              </Box>
              <LinearProgress value={86.66} variant='determinate' sx={{ height: 6, borderRadius: '5px' }} />
              <Typography variant='caption' sx={{ mt: 1.5, mb: 6, display: 'block' }}>
                4 days remaining
              </Typography>
              <Button variant='contained' sx={{ width: '100%' }} onClick={handlePlansClickOpen}>
                Upgrade Plan
              </Button>
            </CardContent>

            <Dialog
              open={openPlans}
              onClose={handlePlansClose}
              aria-labelledby='user-view-plans'
              aria-describedby='user-view-plans-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, pt: 8, pb: 8 } }}
            >
              <DialogTitle id='user-view-plans' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                Upgrade Plan
              </DialogTitle>

              <DialogContent>
                <DialogContentText variant='body2' sx={{ textAlign: 'center' }} id='user-view-plans-description'>
                  Choose the best plan for the user.
                </DialogContentText>
              </DialogContent>

              <DialogContent
                sx={{
                  display: 'flex',
                  pb: 8,
                  pl: [6, 15],
                  pr: [6, 15],
                  alignItems: 'center',
                  flexWrap: ['wrap', 'nowrap'],
                  pt: theme => `${theme.spacing(2)} !important`
                }}
              >
                <FormControl fullWidth size='small' sx={{ mr: [0, 3], mb: [3, 0] }}>
                  <InputLabel id='user-view-plans-select-label'>Choose Plan</InputLabel>
                  <Select
                    label='Choose Plan'
                    defaultValue='Standard'
                    id='user-view-plans-select'
                    labelId='user-view-plans-select-label'
                  >
                    <MenuItem value='Basic'>Basic - $0/month</MenuItem>
                    <MenuItem value='Standard'>Standard - $99/month</MenuItem>
                    <MenuItem value='Enterprise'>Enterprise - $499/month</MenuItem>
                    <MenuItem value='Company'>Company - $999/month</MenuItem>
                  </Select>
                </FormControl>
                <Button variant='contained' sx={{ minWidth: ['100%', 0] }}>
                  Upgrade
                </Button>
              </DialogContent>

              <Divider sx={{ m: '0 !important' }} />

              <DialogContent sx={{ pt: 8, pl: [6, 15], pr: [6, 15] }}>
                <Typography sx={{ fontWeight: 500, mb: 2, fontSize: '0.875rem' }}>
                  User current plan is standard plan
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: ['wrap', 'nowrap'],
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ mr: 3, display: 'flex', ml: 2.4, position: 'relative' }}>
                    <Sup>$</Sup>
                    <Typography
                      variant='h3'
                      sx={{
                        mb: -1.2,
                        lineHeight: 1,
                        color: 'primary.main',
                        fontSize: '3rem !important'
                      }}
                    >
                      99
                    </Typography>
                    <Sub>/ month</Sub>
                  </Box>
                  <Button
                    color='error'
                    sx={{ mt: 2 }}
                    variant='outlined'
                    onClick={() => setSubscriptionDialogOpen(true)}
                  >
                    Cancel Subscription
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          </Card>
        </Grid> */}
      </Grid>
    )
  } else {
    return null
  }
}

export default PersonaViewLeft
