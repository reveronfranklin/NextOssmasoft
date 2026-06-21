import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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
import { SisSegMenuDto } from '../interfaces/SisSeguridadDtos'
import { fetchSisSegCatalogos, saveSisSegMenu, SIS_SEGURIDAD_QUERY_KEY } from '../services/sisSeguridadService'

interface MenuCellType {
  row: SisSegMenuDto
}

const emptyMenu: SisSegMenuDto = {
  codigoMenu: 0,
  codigoMod: 0,
  codigoPadre: null,
  titulo: '',
  path: '',
  icono: '',
  orden: 0,
  activo: true
}

const SisSeguridadMenuView = () => {
  const queryClient = useQueryClient()
  const [menu, setMenu] = useState<SisSegMenuDto>(emptyMenu)
  const [moduleFilter, setModuleFilter] = useState(0)

  const catalogosQuery = useQuery({
    queryKey: [SIS_SEGURIDAD_QUERY_KEY, 'catalogos'],
    queryFn: fetchSisSegCatalogos,
    retry: 1
  })

  const modules = catalogosQuery.data?.modulos ?? []
  const menus = catalogosQuery.data?.menus ?? []
  const selectedModuleId = menu.codigoMod || moduleFilter || modules[0]?.codigoMod || 0

  const visibleMenus = useMemo(
    () => menus.filter(item => moduleFilter === 0 || item.codigoMod === moduleFilter),
    [menus, moduleFilter]
  )

  const parentMenus = menus.filter(item => item.codigoMod === selectedModuleId && item.codigoMenu !== menu.codigoMenu)

  const saveMutation = useMutation({
    mutationFn: () =>
      saveSisSegMenu({
        codigoMenu: menu.codigoMenu,
        codigoMod: selectedModuleId,
        codigoPadre: menu.codigoPadre ?? null,
        titulo: menu.titulo,
        path: menu.path,
        icono: menu.icono,
        orden: Number(menu.orden) || 0,
        activo: menu.activo,
        usuarioUpd: 0
      }),
    onSuccess: async savedMenu => {
      toast.success('Menu guardado')
      setMenu(savedMenu)
      setModuleFilter(savedMenu.codigoMod)
      await queryClient.invalidateQueries({ queryKey: [SIS_SEGURIDAD_QUERY_KEY, 'catalogos'] })
    },
    onError: error => toast.error((error as Error).message)
  })

  const columns: GridColumns = [
    {
      flex: 0.24,
      minWidth: 180,
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
    },
    {
      flex: 0.1,
      minWidth: 90,
      field: 'modulo',
      headerName: 'Modulo',
      valueGetter: params => modules.find(item => item.codigoMod === params.row.codigoMod)?.codigo ?? ''
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'orden',
      headerName: 'Orden'
    },
    {
      flex: 0.12,
      minWidth: 100,
      field: 'activo',
      headerName: 'Estado',
      valueGetter: params => (params.row.activo ? 'Activo' : 'Inactivo')
    }
  ]

  return (
    <>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 4, flexWrap: 'wrap' }}>
              <Typography variant='h6'>Menu normalizado</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl size='small' sx={{ minWidth: 170 }}>
                  <InputLabel>Modulo</InputLabel>
                  <Select label='Modulo' value={moduleFilter} onChange={event => setModuleFilter(Number(event.target.value))}>
                    <MenuItem value={0}>Todos</MenuItem>
                    {modules.map(item => (
                      <MenuItem key={item.codigoMod} value={item.codigoMod}>
                        {item.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={<Icon icon='mdi:plus' />}
                  onClick={() => setMenu({ ...emptyMenu, codigoMod: moduleFilter || modules[0]?.codigoMod || 0 })}
                >
                  Nuevo
                </Button>
              </Box>
            </Box>
            {catalogosQuery.isLoading ? (
              <Spinner sx={{ height: 480 }} />
            ) : (
              <Box sx={{ height: 560 }}>
                <DataGrid rows={visibleMenus} columns={columns} getRowId={row => row.codigoMenu} pageSize={10} rowsPerPageOptions={[10, 25, 50]} onRowClick={params => setMenu(params.row)} />
              </Box>
            )}
            {catalogosQuery.isError && <Alert severity='error'>{(catalogosQuery.error as Error).message}</Alert>}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Detalle del menu
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Modulo</InputLabel>
                  <Select label='Modulo' value={selectedModuleId} onChange={event => setMenu(current => ({ ...current, codigoMod: Number(event.target.value), codigoPadre: null }))}>
                    {modules.map(item => (
                      <MenuItem key={item.codigoMod} value={item.codigoMod}>
                        {item.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Padre</InputLabel>
                  <Select label='Padre' value={menu.codigoPadre ?? 0} onChange={event => setMenu(current => ({ ...current, codigoPadre: Number(event.target.value) || null }))}>
                    <MenuItem value={0}>Raiz</MenuItem>
                    {parentMenus.map(item => (
                      <MenuItem key={item.codigoMenu} value={item.codigoMenu}>
                        {item.titulo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Titulo' value={menu.titulo} onChange={event => setMenu(current => ({ ...current, titulo: event.target.value }))} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Ruta' value={menu.path} onChange={event => setMenu(current => ({ ...current, path: event.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size='small' label='Icono' value={menu.icono} onChange={event => setMenu(current => ({ ...current, icono: event.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth size='small' type='number' label='Orden' value={menu.orden} onChange={event => setMenu(current => ({ ...current, orden: Number(event.target.value) }))} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
                  <Switch checked={menu.activo} onChange={event => setMenu(current => ({ ...current, activo: event.target.checked }))} />
                  <Typography variant='body2'>Activo</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button variant='contained' startIcon={<Icon icon='mdi:content-save-outline' />} disabled={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
                  Guardar menu
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default SisSeguridadMenuView
