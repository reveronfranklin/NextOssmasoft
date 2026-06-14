import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { SisUsuarioDto } from 'src/sis/usuarios/interfaces/SisUsuarioDtos'
import { fetchSisUsuarios, SIS_USUARIOS_QUERY_KEY } from 'src/sis/usuarios/services/sisUsuarioService'
import { SisSegPermisoDto, SisSegRolDto, SisSegUsrPermCommand } from '../interfaces/SisSeguridadDtos'
import {
  applySisSegMigracionSugerida,
  cloneSisSegUsuario,
  fetchSisSegCatalogos,
  fetchSisSegEstadoInstalacion,
  fetchSisSegUsuario,
  regenerateSisSegCache,
  saveSisSegUsuarioRoles,
  SIS_SEGURIDAD_QUERY_KEY
} from '../services/sisSeguridadService'

type ExceptionType = 'ALLOW' | 'DENY'

interface UserCellType {
  row: SisUsuarioDto
}

interface RoleCellType {
  row: SisSegRolDto
}

interface PermCellType {
  row: SisSegPermisoDto
}

const jsonPreview = (value: unknown) => JSON.stringify(value ?? [], null, 2)

const SisSeguridadUsuarioView = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [selectedUser, setSelectedUser] = useState<SisUsuarioDto | null>(null)
  const [codigoModulo, setCodigoModulo] = useState('TODOS')
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])
  const [exceptions, setExceptions] = useState<Record<number, ExceptionType>>({})
  const [cloneOpen, setCloneOpen] = useState(false)
  const [cloneMode, setCloneMode] = useState<'existente' | 'nuevo'>('existente')
  const [cloneSearchText, setCloneSearchText] = useState('')
  const [cloneTargetUser, setCloneTargetUser] = useState<SisUsuarioDto | null>(null)
  const [cloneOverwrite, setCloneOverwrite] = useState(true)
  const [cloneNewUser, setCloneNewUser] = useState({
    usuario: '',
    login: '',
    clave: '',
    cedula: '',
    email: '',
    recibeEmail: true
  })

  const usersPayload = useMemo(
    () => ({
      pageSize,
      pageNumber: page + 1,
      searchText
    }),
    [page, pageSize, searchText]
  )

  const usersQuery = useQuery({
    queryKey: [SIS_USUARIOS_QUERY_KEY, 'seguridad', usersPayload],
    queryFn: () => fetchSisUsuarios(usersPayload),
    retry: 1
  })

  const cloneUsersPayload = useMemo(
    () => ({
      pageSize: 10,
      pageNumber: 1,
      searchText: cloneSearchText,
      soloActivos: true
    }),
    [cloneSearchText]
  )

  const cloneUsersQuery = useQuery({
    queryKey: [SIS_USUARIOS_QUERY_KEY, 'seguridad-clone', cloneUsersPayload],
    queryFn: () => fetchSisUsuarios(cloneUsersPayload),
    enabled: cloneOpen && cloneMode === 'existente',
    retry: 1
  })

  const catalogosQuery = useQuery({
    queryKey: [SIS_SEGURIDAD_QUERY_KEY, 'catalogos'],
    queryFn: fetchSisSegCatalogos,
    retry: 1
  })

  const installQuery = useQuery({
    queryKey: [SIS_SEGURIDAD_QUERY_KEY, 'estado-instalacion'],
    queryFn: fetchSisSegEstadoInstalacion,
    retry: 1
  })

  const usuarioQuery = useQuery({
    queryKey: [SIS_SEGURIDAD_QUERY_KEY, 'usuario', selectedUser?.codigoUsuario],
    queryFn: () => {
      if (!selectedUser?.codigoUsuario) {
        throw new Error('Seleccione un usuario.')
      }

      return fetchSisSegUsuario(selectedUser.codigoUsuario)
    },
    enabled: (selectedUser?.codigoUsuario ?? 0) > 0,
    retry: 1
  })

  const modules = catalogosQuery.data?.modulos ?? []
  const roles = catalogosQuery.data?.roles ?? []
  const permisos = catalogosQuery.data?.permisos ?? []

  const selectedModuleId = modules.find(item => item.codigo === codigoModulo)?.codigoMod
  const visibleRoles = roles.filter(item => item.activo && (codigoModulo === 'TODOS' || item.codigoMod === selectedModuleId))
  const visiblePermisos = permisos.filter(
    item => item.activo && (codigoModulo === 'TODOS' || item.codigoMod === selectedModuleId)
  )
  const installReady = installQuery.data?.instalacionCompleta ?? true

  useEffect(() => {
    if (!usuarioQuery.data) {
      setSelectedRoles([])
      setExceptions({})

      return
    }

    setSelectedRoles(usuarioQuery.data.roles.map(item => item.codigoRol))
    setExceptions(
      usuarioQuery.data.excepciones.reduce<Record<number, ExceptionType>>((acc, item) => {
        acc[item.codigoPerm] = item.tipo === 'DENY' ? 'DENY' : 'ALLOW'

        return acc
      }, {})
    )
  }, [usuarioQuery.data])

  const invalidateUsuario = async () => {
    await queryClient.invalidateQueries({ queryKey: [SIS_SEGURIDAD_QUERY_KEY, 'usuario', selectedUser?.codigoUsuario] })
  }

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!selectedUser) {
        throw new Error('Seleccione un usuario.')
      }

      const permisosPayload: SisSegUsrPermCommand[] = Object.entries(exceptions).map(([codigoPerm, tipo]) => ({
        codigoPerm: Number(codigoPerm),
        tipo,
        activo: true
      }))

      return saveSisSegUsuarioRoles({
        codigoUsuario: selectedUser.codigoUsuario,
        roles: selectedRoles,
        permisos: permisosPayload,
        usuarioUpd: 0
      })
    },
    onSuccess: async () => {
      toast.success('Seguridad del usuario guardada')
      await invalidateUsuario()
    },
    onError: error => toast.error((error as Error).message)
  })

  const cacheMutation = useMutation({
    mutationFn: () => {
      if (!selectedUser) {
        throw new Error('Seleccione un usuario.')
      }

      return regenerateSisSegCache({
        codigoUsuario: selectedUser.codigoUsuario,
        codigoModulo: codigoModulo === 'TODOS' ? null : codigoModulo
      })
    },
    onSuccess: async () => {
      toast.success('Cache regenerada')
      await invalidateUsuario()
    },
    onError: error => toast.error((error as Error).message)
  })

  const migrationMutation = useMutation({
    mutationFn: () => {
      if (!selectedUser) {
        throw new Error('Seleccione un usuario.')
      }

      return applySisSegMigracionSugerida({
        codigoUsuario: selectedUser.codigoUsuario,
        codigoModulo: codigoModulo === 'TODOS' ? null : codigoModulo,
        usuarioUpd: 0
      })
    },
    onSuccess: async () => {
      toast.success('Migracion sugerida aplicada')
      await invalidateUsuario()
      await queryClient.invalidateQueries({ queryKey: [SIS_SEGURIDAD_QUERY_KEY, 'catalogos'] })
    },
    onError: error => toast.error((error as Error).message)
  })

  const resetCloneForm = () => {
    setCloneMode('existente')
    setCloneSearchText('')
    setCloneTargetUser(null)
    setCloneOverwrite(true)
    setCloneNewUser({
      usuario: '',
      login: '',
      clave: '',
      cedula: '',
      email: '',
      recibeEmail: true
    })
  }

  const handleCloseClone = () => {
    setCloneOpen(false)
    resetCloneForm()
  }

  const cloneMutation = useMutation({
    mutationFn: () => {
      if (!selectedUser) {
        throw new Error('Seleccione un usuario origen.')
      }

      if (cloneMode === 'existente') {
        if (!cloneTargetUser) {
          throw new Error('Seleccione el usuario destino.')
        }

        if (cloneTargetUser.codigoUsuario === selectedUser.codigoUsuario) {
          throw new Error('El usuario origen y destino no pueden ser el mismo.')
        }

        return cloneSisSegUsuario({
          codigoUsuarioOrigen: selectedUser.codigoUsuario,
          codigoUsuarioDestino: cloneTargetUser.codigoUsuario,
          sobrescribirAccesos: cloneOverwrite,
          usuarioUpd: 0
        })
      }

      if (!cloneNewUser.usuario.trim() || !cloneNewUser.login.trim() || !cloneNewUser.clave.trim()) {
        throw new Error('Usuario, login y clave temporal son obligatorios.')
      }

      return cloneSisSegUsuario({
        codigoUsuarioOrigen: selectedUser.codigoUsuario,
        usuarioDestino: {
          usuario: cloneNewUser.usuario.trim(),
          login: cloneNewUser.login.trim(),
          clave: cloneNewUser.clave,
          cedula: cloneNewUser.cedula ? Number(cloneNewUser.cedula) : null,
          email: cloneNewUser.email.trim() || null,
          recibeEmail: cloneNewUser.recibeEmail
        },
        sobrescribirAccesos: cloneOverwrite,
        usuarioUpd: 0
      })
    },
    onSuccess: async result => {
      const nextSelectedUser =
        cloneMode === 'existente' && cloneTargetUser
          ? cloneTargetUser
          : ({
              codigoUsuario: result.codigoUsuarioDestino,
              usuario: cloneNewUser.usuario.trim(),
              login: cloneNewUser.login.trim(),
              cedula: cloneNewUser.cedula ? Number(cloneNewUser.cedula) : undefined,
              status: 'A',
              email: cloneNewUser.email.trim(),
              recibeEmail: cloneNewUser.recibeEmail,
              esAnalistaSoporte: false,
              esAnalistaCnt: false,
              esAdminCnt: false,
              isSuperuser: false,
              codigoEmpresa: 0
            } as SisUsuarioDto)

      toast.success(
        `Accesos clonados a ${nextSelectedUser.login} (${
          result.usuarioDestinoCreado ? 'nuevo' : 'existente'
        }): ${result.rolesCopiados} roles, ${result.excepcionesCopiadas} excepciones y cache regenerada`
      )
      setSelectedUser(nextSelectedUser)
      handleCloseClone()
      await queryClient.invalidateQueries({ queryKey: [SIS_USUARIOS_QUERY_KEY] })
      await queryClient.invalidateQueries({ queryKey: [SIS_SEGURIDAD_QUERY_KEY, 'usuario', result.codigoUsuarioDestino] })
    },
    onError: error => toast.error((error as Error).message)
  })

  const handleRoleToggle = (codigoRol: number) => {
    setSelectedRoles(current =>
      current.includes(codigoRol) ? current.filter(item => item !== codigoRol) : [...current, codigoRol]
    )
  }

  const handleExceptionChange = (codigoPerm: number, tipo: ExceptionType | 'NONE') => {
    setExceptions(current => {
      const next = { ...current }

      if (tipo === 'NONE') {
        delete next[codigoPerm]
      } else {
        next[codigoPerm] = tipo
      }

      return next
    })
  }

  const usersColumns: GridColumns = [
    {
      flex: 0.12,
      minWidth: 90,
      field: 'codigoUsuario',
      headerName: 'Codigo'
    },
    {
      flex: 0.28,
      minWidth: 160,
      field: 'usuario',
      headerName: 'Usuario',
      renderCell: ({ row }: UserCellType) => <Typography variant='body2'>{row.usuario}</Typography>
    },
    {
      flex: 0.24,
      minWidth: 130,
      field: 'login',
      headerName: 'Login'
    },
    {
      flex: 0.12,
      minWidth: 90,
      field: 'isSuperuser',
      headerName: 'SU',
      renderCell: ({ row }: UserCellType) =>
        row.isSuperuser ? <Icon icon='mdi:shield-star-outline' fontSize={20} /> : null
    }
  ]

  const roleColumns: GridColumns = [
    {
      flex: 0.08,
      minWidth: 70,
      field: 'selected',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: RoleCellType) => (
        <Checkbox checked={selectedRoles.includes(row.codigoRol)} onChange={() => handleRoleToggle(row.codigoRol)} />
      )
    },
    {
      flex: 0.26,
      minWidth: 170,
      field: 'nombre',
      headerName: 'Rol',
      renderCell: ({ row }: RoleCellType) => (
        <Box>
          <Typography variant='body2'>{row.nombre}</Typography>
          <Typography variant='caption' color='text.secondary'>
            {row.clave}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.18,
      minWidth: 120,
      field: 'modulo',
      headerName: 'Modulo',
      valueGetter: params => modules.find(item => item.codigoMod === params.row.codigoMod)?.codigo ?? ''
    }
  ]

  const permisoColumns: GridColumns = [
    {
      flex: 0.32,
      minWidth: 230,
      field: 'clave',
      headerName: 'Permiso',
      renderCell: ({ row }: PermCellType) => (
        <Box>
          <Typography variant='body2'>{row.nombre}</Typography>
          <Typography variant='caption' color='text.secondary'>
            {row.clave}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.16,
      minWidth: 130,
      field: 'tipo',
      headerName: 'Excepcion',
      sortable: false,
      renderCell: ({ row }: PermCellType) => (
        <Select
          size='small'
          value={exceptions[row.codigoPerm] ?? 'NONE'}
          sx={{ minWidth: 118 }}
          onChange={event => handleExceptionChange(row.codigoPerm, event.target.value as ExceptionType | 'NONE')}
        >
          <MenuItem value='NONE'>Ninguna</MenuItem>
          <MenuItem value='ALLOW'>ALLOW</MenuItem>
          <MenuItem value='DENY'>DENY</MenuItem>
        </Select>
      )
    },
    {
      flex: 0.16,
      minWidth: 120,
      field: 'modulo',
      headerName: 'Modulo',
      valueGetter: params => modules.find(item => item.codigoMod === params.row.codigoMod)?.codigo ?? ''
    }
  ]

  const loadingAction =
    saveMutation.isPending || cacheMutation.isPending || migrationMutation.isPending || cloneMutation.isPending
  const cloneTargetRows = (cloneUsersQuery.data?.data ?? []).filter(
    item => item.codigoUsuario !== selectedUser?.codigoUsuario
  )
  const cloneSubmitDisabled =
    cloneMutation.isPending ||
    !selectedUser ||
    (cloneMode === 'existente' && !cloneTargetUser) ||
    (cloneMode === 'nuevo' &&
      (!cloneNewUser.usuario.trim() || !cloneNewUser.login.trim() || !cloneNewUser.clave.trim()))

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
            <Box sx={{ flex: 1, minWidth: 260 }}>
              <Typography variant='h6'>Seguridad normalizada</Typography>
              <Typography variant='body2' color='text.secondary'>
                {selectedUser
                  ? `${selectedUser.usuario} · ${selectedUser.login}`
                  : 'Seleccione un usuario para administrar roles y excepciones'}
              </Typography>
            </Box>
            <FormControl size='small' sx={{ minWidth: 180 }}>
              <InputLabel>Modulo</InputLabel>
              <Select label='Modulo' value={codigoModulo} onChange={event => setCodigoModulo(event.target.value)}>
                <MenuItem value='TODOS'>Todos</MenuItem>
                {modules.map(item => (
                  <MenuItem key={item.codigo} value={item.codigo}>
                    {item.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title='Recargar datos'>
              <IconButton
                color='primary'
                onClick={() => {
                  usersQuery.refetch()
                  catalogosQuery.refetch()
                  installQuery.refetch()
                  usuarioQuery.refetch()
                }}
              >
                <Icon icon='mdi:refresh' fontSize={22} />
              </IconButton>
            </Tooltip>
            {installQuery.data && !installQuery.data.instalacionCompleta && (
              <Alert severity='warning' sx={{ flexBasis: '100%' }}>
                {installQuery.data.mensaje}
              </Alert>
            )}
            {installQuery.isError && (
              <Alert severity='error' sx={{ flexBasis: '100%' }}>
                {(installQuery.error as Error).message}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
            <Typography variant='subtitle1'>Usuarios</Typography>
            <TextField
              size='small'
              label='Buscar'
              value={searchText}
              sx={{ minWidth: { xs: '100%', sm: 260 } }}
              onChange={event => {
                setPage(0)
                setSearchText(event.target.value)
              }}
            />
          </CardActions>
          {usersQuery.isLoading ? (
            <Spinner sx={{ height: 420 }} />
          ) : (
            <Box sx={{ height: 520 }}>
              <DataGrid
                rows={usersQuery.data?.data ?? []}
                columns={usersColumns}
                getRowId={row => row.codigoUsuario}
                rowCount={usersQuery.data?.cantidadRegistros ?? 0}
                page={page}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 25, 50]}
                pagination
                paginationMode='server'
                onPageChange={newPage => setPage(newPage)}
                onPageSizeChange={newPageSize => {
                  setPageSize(newPageSize)
                  setPage(0)
                }}
                onRowClick={params => setSelectedUser(params.row)}
              />
            </Box>
          )}
          {usersQuery.isError && (
            <Box sx={{ p: 4 }}>
              <Alert severity='error'>{(usersQuery.error as Error).message}</Alert>
            </Box>
          )}
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                  <Box>
                    <Typography variant='subtitle1'>Roles del usuario</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {selectedRoles.length} roles seleccionados
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      size='small'
                      variant='outlined'
                      startIcon={<Icon icon='mdi:account-multiple-plus-outline' />}
                      disabled={!selectedUser || loadingAction || !installReady}
                      onClick={() => setCloneOpen(true)}
                    >
                      Clonar accesos
                    </Button>
                    <Button
                      size='small'
                      variant='outlined'
                      startIcon={<Icon icon='mdi:magic-staff' />}
                      disabled={!selectedUser || loadingAction || !installReady}
                      onClick={() => migrationMutation.mutate()}
                    >
                      Migracion sugerida
                    </Button>
                    <Button
                      size='small'
                      variant='outlined'
                      startIcon={<Icon icon='mdi:cached' />}
                      disabled={!selectedUser || loadingAction || !installReady}
                      onClick={() => cacheMutation.mutate()}
                    >
                      Regenerar cache
                    </Button>
                    <Button
                      size='small'
                      variant='contained'
                      startIcon={<Icon icon='mdi:content-save-outline' />}
                      disabled={!selectedUser || loadingAction || !installReady}
                      onClick={() => saveMutation.mutate()}
                    >
                      Guardar
                    </Button>
                  </Box>
                </Box>
                {catalogosQuery.isLoading || usuarioQuery.isLoading ? (
                  <Spinner sx={{ height: 260 }} />
                ) : (
                  <Box sx={{ height: 330 }}>
                    <DataGrid
                      rows={visibleRoles}
                      columns={roleColumns}
                      getRowId={row => row.codigoRol}
                      pageSize={5}
                      rowsPerPageOptions={[5, 10]}
                      disableSelectionOnClick
                    />
                  </Box>
                )}
                {(catalogosQuery.isError || (selectedUser && usuarioQuery.isError)) && (
                  <Alert severity='error' sx={{ mt: 4 }}>
                    {((catalogosQuery.error || usuarioQuery.error) as Error).message}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                  <Box>
                    <Typography variant='subtitle1'>Excepciones de permisos</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {Object.keys(exceptions).length} excepciones activas
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(exceptions).slice(0, 4).map(([codigoPerm, tipo]) => (
                      <Chip key={codigoPerm} size='small' label={`${codigoPerm}: ${tipo}`} color={tipo === 'DENY' ? 'error' : 'success'} />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ height: 360 }}>
                  <DataGrid
                    rows={visiblePermisos}
                    columns={permisoColumns}
                    getRowId={row => row.codigoPerm}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    disableSelectionOnClick
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', mb: 4 }}>
              <Box>
                <Typography variant='subtitle1'>Cache JSON_MENU</Typography>
                <Typography variant='body2' color='text.secondary'>
                  {usuarioQuery.data?.jsonMenu?.length ?? 0} nodos raiz
                </Typography>
              </Box>
              {usuarioQuery.data?.isSuperuser && <Chip color='primary' label='Superuser' size='small' />}
            </Box>
            <Divider sx={{ mb: 4 }} />
            <Box
              component='pre'
              sx={{
                m: 0,
                p: 4,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 420,
                bgcolor: 'action.hover',
                fontSize: 12,
                lineHeight: 1.6
              }}
            >
              {jsonPreview(usuarioQuery.data?.jsonMenu)}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={cloneOpen} onClose={cloneMutation.isPending ? undefined : handleCloseClone} maxWidth='md' fullWidth>
        <DialogTitle>Clonar accesos</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Alert severity='info'>
                Origen: {selectedUser ? `${selectedUser.usuario} · ${selectedUser.login}` : 'Sin usuario seleccionado'}
              </Alert>
            </Grid>

            <Grid item xs={12} md={7}>
              <FormControl>
                <FormLabel>Destino</FormLabel>
                <RadioGroup
                  row
                  value={cloneMode}
                  onChange={event => {
                    setCloneMode(event.target.value as 'existente' | 'nuevo')
                    setCloneTargetUser(null)
                  }}
                >
                  <FormControlLabel value='existente' control={<Radio />} label='Usuario existente' />
                  <FormControlLabel value='nuevo' control={<Radio />} label='Crear usuario' />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={5}>
              <FormControlLabel
                control={
                  <Checkbox checked={cloneOverwrite} onChange={event => setCloneOverwrite(event.target.checked)} />
                }
                label='Sobrescribir accesos actuales'
              />
            </Grid>

            {cloneMode === 'existente' ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Buscar usuario destino'
                    value={cloneSearchText}
                    onChange={event => {
                      setCloneSearchText(event.target.value)
                      setCloneTargetUser(null)
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ height: 320 }}>
                    <DataGrid
                      rows={cloneTargetRows}
                      columns={usersColumns}
                      getRowId={row => row.codigoUsuario}
                      pageSize={5}
                      rowsPerPageOptions={[5, 10]}
                      loading={cloneUsersQuery.isFetching}
                      onRowClick={params => setCloneTargetUser(params.row)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  {cloneTargetUser ? (
                    <Alert severity='success'>
                      Destino: {cloneTargetUser.usuario} · {cloneTargetUser.login}
                    </Alert>
                  ) : (
                    <Alert severity='warning'>Seleccione el usuario destino.</Alert>
                  )}
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    size='small'
                    label='Usuario'
                    value={cloneNewUser.usuario}
                    onChange={event => setCloneNewUser(current => ({ ...current, usuario: event.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    size='small'
                    label='Login'
                    value={cloneNewUser.login}
                    onChange={event => setCloneNewUser(current => ({ ...current, login: event.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    size='small'
                    type='password'
                    label='Clave temporal'
                    value={cloneNewUser.clave}
                    onChange={event => setCloneNewUser(current => ({ ...current, clave: event.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size='small'
                    type='number'
                    label='Cedula'
                    value={cloneNewUser.cedula}
                    onChange={event => setCloneNewUser(current => ({ ...current, cedula: event.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Email'
                    value={cloneNewUser.email}
                    onChange={event => setCloneNewUser(current => ({ ...current, email: event.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={cloneNewUser.recibeEmail}
                        onChange={event =>
                          setCloneNewUser(current => ({ ...current, recibeEmail: event.target.checked }))
                        }
                      />
                    }
                    label='Recibe email'
                  />
                </Grid>
              </>
            )}

            {cloneMutation.isError && (
              <Grid item xs={12}>
                <Alert severity='error'>{(cloneMutation.error as Error).message}</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClone} disabled={cloneMutation.isPending}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            startIcon={<Icon icon='mdi:content-copy' />}
            disabled={cloneSubmitDisabled}
            onClick={() => {
              const confirmed = window.confirm('Confirma clonar los accesos del usuario origen hacia el destino?')

              if (confirmed) {
                cloneMutation.mutate()
              }
            }}
          >
            Clonar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SisSeguridadUsuarioView
