import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCatalogPermissions } from '../../hooks/useCntCatalogPermissions'
import { CntBalanceDto } from '../../interfaces/CntDtos'
import {
  CNT_BALANCES_QUERY_KEY,
  CNT_RUBROS_QUERY_KEY,
  deleteCntBalance,
  fetchCntBalances,
  fetchCntRubros,
  saveCntBalance
} from '../../services/cntService'

interface BalanceCell {
  row: CntBalanceDto
}

const emptyBalance = {
  codigoBalance: 0,
  numeroBalance: '',
  denominacion: '',
  descripcion: '',
  extra1: '',
  extra2: '',
  extra3: '',
  codigoRubro: undefined as number | undefined
}

const CntBalancesCatalog = () => {
  const { currentUserId, canView, canAdmin, isLoading: permissionLoading } = useCntCatalogPermissions()
  const [searchText, setSearchText] = useState('')
  const [codigoRubroFilter, setCodigoRubroFilter] = useState<number | ''>('')
  const [form, setForm] = useState(emptyBalance)

  const rubrosQuery = useQuery({
    queryKey: [CNT_RUBROS_QUERY_KEY, currentUserId, 'balances-select'],
    queryFn: () => fetchCntRubros(currentUserId, ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const balancesQuery = useQuery({
    queryKey: [CNT_BALANCES_QUERY_KEY, currentUserId, codigoRubroFilter, searchText],
    queryFn: () => fetchCntBalances(currentUserId, codigoRubroFilter === '' ? undefined : Number(codigoRubroFilter), searchText),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const saveMutation = useMutation({
    mutationFn: () => saveCntBalance({ ...form, codigoBalance: form.codigoBalance || undefined, usuarioId: currentUserId }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Balance guardado')
      setForm(emptyBalance)
      balancesQuery.refetch()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (codigoBalance: number) => deleteCntBalance(currentUserId, codigoBalance),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Balance eliminado')
      balancesQuery.refetch()
    }
  })

  const columns: GridColumns<CntBalanceDto> = [
    { flex: 0.12, minWidth: 110, field: 'numeroBalance', headerName: 'Numero' },
    { flex: 0.25, minWidth: 200, field: 'denominacion', headerName: 'Denominacion' },
    { flex: 0.22, minWidth: 180, field: 'rubro', headerName: 'Rubro' },
    { flex: 0.28, minWidth: 240, field: 'descripcion', headerName: 'Descripcion' },
    {
      flex: 0.1,
      minWidth: 96,
      field: 'actions',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: BalanceCell) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canAdmin && (
            <>
              <Tooltip title='Editar'>
                <IconButton size='small' color='primary' onClick={() => setForm({ ...row, codigoRubro: row.codigoRubro || undefined })}>
                  <Icon icon='mdi:pencil-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Eliminar'>
                <IconButton
                  size='small'
                  color='error'
                  onClick={() => {
                    if (window.confirm('Eliminar balance CNT?')) deleteMutation.mutate(row.codigoBalance)
                  }}
                >
                  <Icon icon='mdi:delete-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      )
    }
  ]

  const canSave =
    canAdmin &&
    currentUserId > 0 &&
    form.numeroBalance.trim().length > 0 &&
    form.denominacion.trim().length > 0 &&
    !saveMutation.isPending

  if (permissionLoading) return <Spinner />

  if (!canView) {
    return <Typography color='error'>El usuario no tiene el permiso requerido: contabilidad.catalogos.ver.</Typography>
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title='Refrescar'>
                <IconButton color='primary' onClick={() => balancesQuery.refetch()}>
                  <Icon icon='mdi:refresh' />
                </IconButton>
              </Tooltip>
              {canAdmin && (
                <Tooltip title='Nuevo'>
                  <IconButton color='primary' onClick={() => setForm(emptyBalance)}>
                    <Icon icon='mdi:plus' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                select
                size='small'
                label='Rubro'
                value={codigoRubroFilter}
                onChange={event => setCodigoRubroFilter(event.target.value === '' ? '' : Number(event.target.value))}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value=''>Todos</MenuItem>
                {(rubrosQuery.data ?? []).map(rubro => (
                  <MenuItem key={rubro.codigoRubro} value={rubro.codigoRubro}>
                    {rubro.numeroRubro} - {rubro.denominacion}
                  </MenuItem>
                ))}
              </TextField>
              <TextField size='small' label='Buscar' value={searchText} onChange={event => setSearchText(event.target.value)} sx={{ minWidth: 260 }} />
            </Box>
          </CardActions>
          <CardContent sx={{ pt: 0 }}>
            {balancesQuery.isLoading ? (
              <Spinner />
            ) : (
              <DataGrid
                autoHeight
                rows={balancesQuery.data ?? []}
                columns={columns}
                getRowId={row => row.codigoBalance}
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
              {form.codigoBalance ? 'Editar balance' : 'Nuevo balance'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label='Numero'
                value={form.numeroBalance}
                inputProps={{ maxLength: 20 }}
                onChange={event => setForm(current => ({ ...current, numeroBalance: event.target.value }))}
              />
              <TextField
                label='Denominacion'
                value={form.denominacion}
                inputProps={{ maxLength: 100 }}
                onChange={event => setForm(current => ({ ...current, denominacion: event.target.value }))}
              />
              <TextField
                select
                label='Rubro'
                value={form.codigoRubro || ''}
                onChange={event => setForm(current => ({ ...current, codigoRubro: event.target.value === '' ? undefined : Number(event.target.value) }))}
              >
                <MenuItem value=''>Sin rubro</MenuItem>
                {(rubrosQuery.data ?? []).map(rubro => (
                  <MenuItem key={rubro.codigoRubro} value={rubro.codigoRubro}>
                    {rubro.numeroRubro} - {rubro.denominacion}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label='Descripcion'
                value={form.descripcion}
                multiline
                minRows={4}
                inputProps={{ maxLength: 1000 }}
                onChange={event => setForm(current => ({ ...current, descripcion: event.target.value }))}
              />
              <TextField label='Extra 1' value={form.extra1} onChange={event => setForm(current => ({ ...current, extra1: event.target.value }))} />
              <TextField label='Extra 2' value={form.extra2} onChange={event => setForm(current => ({ ...current, extra2: event.target.value }))} />
              <TextField label='Extra 3' value={form.extra3} onChange={event => setForm(current => ({ ...current, extra3: event.target.value }))} />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 5, pb: 5 }}>
            <Button variant='outlined' color='secondary' onClick={() => setForm(emptyBalance)}>
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
  )
}

export default CntBalancesCatalog
