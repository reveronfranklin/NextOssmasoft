import { useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCatalogPermissions } from '../../hooks/useCntCatalogPermissions'
import { CntMayorAdminDto } from '../../interfaces/CntDtos'
import {
  CNT_BALANCES_QUERY_KEY,
  CNT_MAYORES_ADMIN_QUERY_KEY,
  deleteCntMayor,
  fetchCntBalances,
  fetchCntMayorUsedBy,
  fetchCntMayoresAdmin,
  saveCntMayor
} from '../../services/cntService'

interface MayorCell {
  row: CntMayorAdminDto
}

const emptyMayor = {
  codigoMayor: 0,
  numeroMayor: '',
  denominacion: '',
  descripcion: '',
  codigoBalance: 0,
  columnaBalance: '',
  extra1: '',
  extra2: '',
  extra3: ''
}

const CntMayoresCatalog = () => {
  const router = useRouter()
  const { currentUserId, canView, canAdmin, isLoading: permissionLoading } = useCntCatalogPermissions()
  const [searchText, setSearchText] = useState('')
  const [codigoBalanceFilter, setCodigoBalanceFilter] = useState<number | ''>('')
  const [form, setForm] = useState(emptyMayor)
  const [usedByInfo, setUsedByInfo] = useState<{ title: string; count: number } | null>(null)

  const balancesQuery = useQuery({
    queryKey: [CNT_BALANCES_QUERY_KEY, currentUserId, 'mayores-select'],
    queryFn: () => fetchCntBalances(currentUserId, undefined, ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const mayoresQuery = useQuery({
    queryKey: [CNT_MAYORES_ADMIN_QUERY_KEY, currentUserId, codigoBalanceFilter, searchText],
    queryFn: () => fetchCntMayoresAdmin(currentUserId, codigoBalanceFilter === '' ? undefined : Number(codigoBalanceFilter), searchText),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const saveMutation = useMutation({
    mutationFn: () => saveCntMayor({ ...form, codigoMayor: form.codigoMayor || undefined, usuarioId: currentUserId }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Mayor guardado')
      setForm(emptyMayor)
      mayoresQuery.refetch()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (codigoMayor: number) => deleteCntMayor(currentUserId, codigoMayor),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Mayor eliminado')
      mayoresQuery.refetch()
    }
  })

  const showUsedBy = async (row: CntMayorAdminDto) => {
    try {
      const response = await fetchCntMayorUsedBy(currentUserId, row.codigoMayor)

      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      setUsedByInfo({ title: `${row.numeroMayor} - ${row.denominacion}`, count: response.data ?? 0 })
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const columns: GridColumns<CntMayorAdminDto> = [
    { flex: 0.12, minWidth: 110, field: 'numeroMayor', headerName: 'Numero' },
    { flex: 0.24, minWidth: 200, field: 'denominacion', headerName: 'Denominacion' },
    { flex: 0.2, minWidth: 170, field: 'balance', headerName: 'Balance' },
    { flex: 0.16, minWidth: 130, field: 'rubro', headerName: 'Rubro' },
    { flex: 0.08, minWidth: 80, field: 'columnaBalance', headerName: 'Col.' },
    {
      flex: 0.1,
      minWidth: 132,
      field: 'actions',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: MayorCell) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canAdmin && (
            <Tooltip title='Editar'>
              <IconButton size='small' color='primary' onClick={() => setForm({ ...row, codigoBalance: row.codigoBalance || 0 })}>
                <Icon icon='mdi:pencil-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title='Ver movimientos'>
            <IconButton
              size='small'
              color='primary'
              onClick={() =>
                router.push({
                  pathname: '/apps/cnt/reportes/mayor-analitico',
                  query: {
                    codigoMayor: row.codigoMayor,
                    numeroMayor: row.numeroMayor,
                    denominacion: row.denominacion
                  }
                })
              }
            >
              <Icon icon='mdi:chart-line' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Usado por'>
            <IconButton size='small' color='info' onClick={() => showUsedBy(row)}>
              <Icon icon='mdi:information-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          {canAdmin && (
            <Tooltip title='Eliminar'>
              <IconButton
                size='small'
                color='error'
                onClick={() => {
                  if (window.confirm('Eliminar mayor CNT?')) deleteMutation.mutate(row.codigoMayor)
                }}
              >
                <Icon icon='mdi:delete-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]

  const canSave =
    canAdmin &&
    currentUserId > 0 &&
    form.numeroMayor.trim().length > 0 &&
    form.denominacion.trim().length > 0 &&
    form.codigoBalance > 0 &&
    !saveMutation.isPending

  if (permissionLoading) return <Spinner />

  if (!canView) {
    return <Typography color='error'>El usuario no tiene el permiso requerido: contabilidad.catalogos.ver.</Typography>
  }

  return (
    <>
      <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title='Refrescar'>
                <IconButton color='primary' onClick={() => mayoresQuery.refetch()}>
                  <Icon icon='mdi:refresh' />
                </IconButton>
              </Tooltip>
              {canAdmin && (
                <Tooltip title='Nuevo'>
                  <IconButton color='primary' onClick={() => setForm(emptyMayor)}>
                    <Icon icon='mdi:plus' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                select
                size='small'
                label='Balance'
                value={codigoBalanceFilter}
                onChange={event => setCodigoBalanceFilter(event.target.value === '' ? '' : Number(event.target.value))}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value=''>Todos</MenuItem>
                {(balancesQuery.data ?? []).map(balance => (
                  <MenuItem key={balance.codigoBalance} value={balance.codigoBalance}>
                    {balance.numeroBalance} - {balance.denominacion}
                  </MenuItem>
                ))}
              </TextField>
              <TextField size='small' label='Buscar' value={searchText} onChange={event => setSearchText(event.target.value)} sx={{ minWidth: 260 }} />
            </Box>
          </CardActions>
          <CardContent sx={{ pt: 0 }}>
            {mayoresQuery.isLoading ? (
              <Spinner />
            ) : (
              <DataGrid
                autoHeight
                rows={mayoresQuery.data ?? []}
                columns={columns}
                getRowId={row => row.codigoMayor}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      {canAdmin && (
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              {form.codigoMayor ? 'Editar mayor' : 'Nuevo mayor'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField label='Numero' value={form.numeroMayor} inputProps={{ maxLength: 20 }} onChange={event => setForm(current => ({ ...current, numeroMayor: event.target.value }))} />
              <TextField label='Denominacion' value={form.denominacion} inputProps={{ maxLength: 100 }} onChange={event => setForm(current => ({ ...current, denominacion: event.target.value }))} />
              <TextField
                select
                label='Balance'
                value={form.codigoBalance || ''}
                onChange={event => setForm(current => ({ ...current, codigoBalance: Number(event.target.value) }))}
              >
                <MenuItem value=''>Seleccionar</MenuItem>
                {(balancesQuery.data ?? []).map(balance => (
                  <MenuItem key={balance.codigoBalance} value={balance.codigoBalance}>
                    {balance.numeroBalance} - {balance.denominacion}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label='Columna balance' value={form.columnaBalance} inputProps={{ maxLength: 1 }} onChange={event => setForm(current => ({ ...current, columnaBalance: event.target.value.toUpperCase() }))} />
              <TextField label='Descripcion' value={form.descripcion} multiline minRows={4} inputProps={{ maxLength: 1000 }} onChange={event => setForm(current => ({ ...current, descripcion: event.target.value }))} />
              <TextField label='Extra 1' value={form.extra1} onChange={event => setForm(current => ({ ...current, extra1: event.target.value }))} />
              <TextField label='Extra 2' value={form.extra2} onChange={event => setForm(current => ({ ...current, extra2: event.target.value }))} />
              <TextField label='Extra 3' value={form.extra3} onChange={event => setForm(current => ({ ...current, extra3: event.target.value }))} />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 5, pb: 5 }}>
            <Button variant='outlined' color='secondary' onClick={() => setForm(emptyMayor)}>
              Limpiar
            </Button>
            <Button variant='contained' disabled={!canSave} onClick={() => saveMutation.mutate()}>
              Guardar
            </Button>
          </CardActions>
        </Card>
      </Grid>
      )}
      </Grid>

      <Dialog open={Boolean(usedByInfo)} onClose={() => setUsedByInfo(null)} fullWidth maxWidth='xs'>
        <DialogTitle>Usado por</DialogTitle>
        <DialogContent>
          <Typography variant='body2' sx={{ mb: 2 }}>
            {usedByInfo?.title}
          </Typography>
          <Typography variant='h6'>{usedByInfo?.count ?? 0} referencia(s)</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => setUsedByInfo(null)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CntMayoresCatalog
