import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { SisSegMenuDto, SisSegPermisoDto, SisSegRolDto } from '../interfaces/SisSeguridadDtos'
import {
  fetchSisSegCatalogos,
  saveSisSegRol,
  saveSisSegRolMenus,
  saveSisSegRolPermisos,
  SIS_SEGURIDAD_QUERY_KEY
} from '../services/sisSeguridadService'

interface RoleCellType {
  row: SisSegRolDto
}

interface PermCellType {
  row: SisSegPermisoDto
}

interface MenuCellType {
  row: SisSegMenuDto
}

const emptyRole: SisSegRolDto = {
  codigoRol: 0,
  codigoMod: 0,
  clave: '',
  nombre: '',
  descripcion: '',
  activo: true
}

const SisSeguridadRolesView = () => {
  const queryClient = useQueryClient()
  const [role, setRole] = useState<SisSegRolDto>(emptyRole)
  const [roleModuleFilter, setRoleModuleFilter] = useState(0)
  const [selectedPerms, setSelectedPerms] = useState<number[]>([])
  const [selectedMenus, setSelectedMenus] = useState<number[]>([])

  const catalogosQuery = useQuery({
    queryKey: [SIS_SEGURIDAD_QUERY_KEY, 'catalogos'],
    queryFn: fetchSisSegCatalogos,
    retry: 1
  })

  const modules = useMemo(() => catalogosQuery.data?.modulos ?? [], [catalogosQuery.data?.modulos])
  const roles = useMemo(() => catalogosQuery.data?.roles ?? [], [catalogosQuery.data?.roles])
  const permisos = useMemo(() => catalogosQuery.data?.permisos ?? [], [catalogosQuery.data?.permisos])
  const menus = useMemo(() => catalogosQuery.data?.menus ?? [], [catalogosQuery.data?.menus])
  const selectedModuleId = role.codigoMod || modules[0]?.codigoMod || 0

  const visiblePermisos = permisos.filter(item => item.codigoMod === selectedModuleId)
  const visibleMenus = menus.filter(item => item.codigoMod === selectedModuleId)

  useEffect(() => {
    if (role.codigoRol <= 0 || !catalogosQuery.data) {
      setSelectedPerms([])
      setSelectedMenus([])

      return
    }

    setSelectedPerms(catalogosQuery.data.rolPermisos.filter(item => item.codigoRol === role.codigoRol).map(item => item.codigoPerm))
    setSelectedMenus(catalogosQuery.data.rolMenus.filter(item => item.codigoRol === role.codigoRol).map(item => item.codigoMenu))
  }, [role.codigoRol, catalogosQuery.data])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const savedRole = await saveSisSegRol({
        codigoRol: role.codigoRol,
        codigoMod: selectedModuleId,
        clave: role.clave,
        nombre: role.nombre,
        descripcion: role.descripcion,
        activo: role.activo,
        usuarioUpd: 0
      })

      await saveSisSegRolPermisos({ codigoRol: savedRole.codigoRol, permisos: selectedPerms, usuarioUpd: 0 })
      await saveSisSegRolMenus({ codigoRol: savedRole.codigoRol, menus: selectedMenus, usuarioUpd: 0 })

      return savedRole
    },
    onSuccess: async savedRole => {
      toast.success('Rol guardado')
      setRole(savedRole)
      await queryClient.invalidateQueries({ queryKey: [SIS_SEGURIDAD_QUERY_KEY, 'catalogos'] })
    },
    onError: error => toast.error((error as Error).message)
  })

  const toggle = (items: number[], value: number) =>
    items.includes(value) ? items.filter(item => item !== value) : [...items, value]

  const roleColumns: GridColumns = [
    {
      flex: 0.28,
      minWidth: 180,
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
      flex: 0.12,
      minWidth: 90,
      field: 'modulo',
      headerName: 'Modulo',
      valueGetter: params => modules.find(item => item.codigoMod === params.row.codigoMod)?.codigo ?? ''
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'activo',
      headerName: 'Activo',
      renderCell: ({ row }: RoleCellType) => <Checkbox checked={row.activo} disabled />
    }
  ]

  const permColumns: GridColumns = [
    {
      flex: 0.08,
      minWidth: 70,
      field: 'selected',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: PermCellType) => (
        <Checkbox checked={selectedPerms.includes(row.codigoPerm)} onChange={() => setSelectedPerms(current => toggle(current, row.codigoPerm))} />
      )
    },
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
    }
  ]

  const menuColumns: GridColumns = [
    {
      flex: 0.08,
      minWidth: 70,
      field: 'selected',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: MenuCellType) => (
        <Checkbox checked={selectedMenus.includes(row.codigoMenu)} onChange={() => setSelectedMenus(current => toggle(current, row.codigoMenu))} />
      )
    },
    {
      flex: 0.3,
      minWidth: 220,
      field: 'titulo',
      headerName: 'Menu',
      renderCell: ({ row }: MenuCellType) => (
        <Box>
          <Typography variant='body2'>{row.titulo}</Typography>
          <Typography variant='caption' color='text.secondary'>
            {row.path || 'Sin ruta'}
          </Typography>
        </Box>
      )
    }
  ]

  const filteredRoles = useMemo(() => roles.filter(item => roleModuleFilter === 0 || item.codigoMod === roleModuleFilter), [roles, roleModuleFilter])

  return (
    <>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 4, flexWrap: 'wrap' }}>
              <Typography variant='h6'>Roles</Typography>
              <FormControl size='small' sx={{ minWidth: 180 }}>
                <InputLabel>Modulo</InputLabel>
                <Select label='Modulo' value={roleModuleFilter} onChange={event => setRoleModuleFilter(Number(event.target.value))}>
                  <MenuItem value={0}>Todos</MenuItem>
                  {modules.map(item => (
                    <MenuItem key={item.codigoMod} value={item.codigoMod}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button size='small' variant='outlined' startIcon={<Icon icon='mdi:plus' />} onClick={() => setRole({ ...emptyRole, codigoMod: modules[0]?.codigoMod ?? 0 })}>
                Nuevo
              </Button>
            </Box>
            {catalogosQuery.isLoading ? (
              <Spinner sx={{ height: 420 }} />
            ) : (
              <Box sx={{ height: 520 }}>
                <DataGrid rows={filteredRoles} columns={roleColumns} getRowId={row => row.codigoRol} pageSize={10} rowsPerPageOptions={[10, 25]} onRowClick={params => setRole(params.row)} />
              </Box>
            )}
            {catalogosQuery.isError && <Alert severity='error'>{(catalogosQuery.error as Error).message}</Alert>}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Detalle del rol
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Modulo</InputLabel>
                  <Select label='Modulo' value={selectedModuleId} onChange={event => setRole(current => ({ ...current, codigoMod: Number(event.target.value) }))}>
                    {modules.map(item => (
                      <MenuItem key={item.codigoMod} value={item.codigoMod}>
                        {item.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size='small' label='Clave' value={role.clave} onChange={event => setRole(current => ({ ...current, clave: event.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
                  <Switch checked={role.activo} onChange={event => setRole(current => ({ ...current, activo: event.target.checked }))} />
                  <Typography variant='body2'>Activo</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Nombre' value={role.nombre} onChange={event => setRole(current => ({ ...current, nombre: event.target.value }))} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Descripcion' value={role.descripcion} onChange={event => setRole(current => ({ ...current, descripcion: event.target.value }))} />
              </Grid>
              <Grid item xs={12}>
                <Button variant='contained' startIcon={<Icon icon='mdi:content-save-outline' />} disabled={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
                  Guardar rol
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant='subtitle1' sx={{ mb: 4 }}>
              Permisos del rol
            </Typography>
            <Box sx={{ height: 420 }}>
              <DataGrid rows={visiblePermisos} columns={permColumns} getRowId={row => row.codigoPerm} pageSize={10} rowsPerPageOptions={[10, 25]} disableSelectionOnClick />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant='subtitle1' sx={{ mb: 4 }}>
              Menus del rol
            </Typography>
            <Box sx={{ height: 420 }}>
              <DataGrid rows={visibleMenus} columns={menuColumns} getRowId={row => row.codigoMenu} pageSize={10} rowsPerPageOptions={[10, 25]} disableSelectionOnClick />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default SisSeguridadRolesView
