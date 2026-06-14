import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
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
import { CntPeriodoAdminDto } from '../../interfaces/CntDtos'
import { exportCntRowsToExcel } from '../../utils/cntExcelExport'
import {
  CNT_PERIODOS_ADMIN_QUERY_KEY,
  deleteCntPeriodo,
  fetchCntPeriodosAdmin,
  generateCntPeriodoYear,
  saveCntPeriodo
} from '../../services/cntService'

interface PeriodoCell {
  row: CntPeriodoAdminDto
}

const emptyPeriodo = {
  codigoPeriodo: 0,
  nombrePeriodo: '',
  fechaDesde: '',
  fechaHasta: '',
  anoPeriodo: new Date().getFullYear(),
  numeroPeriodo: 1,
  cerrado: false,
  extra1: '',
  extra2: '',
  extra3: ''
}

const normalizeDate = (value?: string) => (value ? value.substring(0, 10) : '')

const CntPeriodosCatalog = () => {
  const { currentUserId, canView, canAdmin, isLoading: permissionLoading } = useCntCatalogPermissions()
  const [searchText, setSearchText] = useState('')
  const [anoPeriodoFilter, setAnoPeriodoFilter] = useState('')
  const [soloAbiertos, setSoloAbiertos] = useState(false)
  const [form, setForm] = useState(emptyPeriodo)

  const periodosQuery = useQuery({
    queryKey: [CNT_PERIODOS_ADMIN_QUERY_KEY, currentUserId, anoPeriodoFilter, soloAbiertos, searchText],
    queryFn: () => fetchCntPeriodosAdmin(currentUserId, anoPeriodoFilter ? Number(anoPeriodoFilter) : undefined, soloAbiertos, searchText),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const saveMutation = useMutation({
    mutationFn: () =>
      saveCntPeriodo({
        ...form,
        codigoPeriodo: form.codigoPeriodo || undefined,
        usuarioId: currentUserId
      }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Periodo guardado')
      setForm(emptyPeriodo)
      periodosQuery.refetch()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (codigoPeriodo: number) => deleteCntPeriodo(currentUserId, codigoPeriodo),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Periodo eliminado')
      periodosQuery.refetch()
    }
  })

  const generateYearMutation = useMutation({
    mutationFn: (anoPeriodo: number) => generateCntPeriodoYear({ usuarioId: currentUserId, anoPeriodo }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success(`${response.data} periodos generados`)
      periodosQuery.refetch()
    }
  })

  const columns: GridColumns<CntPeriodoAdminDto> = [
    { flex: 0.22, minWidth: 190, field: 'nombrePeriodo', headerName: 'Periodo' },
    { flex: 0.1, minWidth: 90, field: 'anoPeriodo', headerName: 'Ano' },
    { flex: 0.1, minWidth: 90, field: 'numeroPeriodo', headerName: 'Numero' },
    { flex: 0.14, minWidth: 130, field: 'fechaDesde', headerName: 'Desde', valueGetter: params => normalizeDate(params.row.fechaDesde) },
    { flex: 0.14, minWidth: 130, field: 'fechaHasta', headerName: 'Hasta', valueGetter: params => normalizeDate(params.row.fechaHasta) },
    { flex: 0.1, minWidth: 90, field: 'cerrado', headerName: 'Cerrado', type: 'boolean' },
    {
      flex: 0.1,
      minWidth: 96,
      field: 'actions',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: PeriodoCell) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canAdmin && (
            <>
              <Tooltip title='Editar'>
                <IconButton
                  size='small'
                  color='primary'
                  onClick={() =>
                    setForm({
                      codigoPeriodo: row.codigoPeriodo,
                      nombrePeriodo: row.nombrePeriodo,
                      fechaDesde: normalizeDate(row.fechaDesde),
                      fechaHasta: normalizeDate(row.fechaHasta),
                      anoPeriodo: row.anoPeriodo,
                      numeroPeriodo: row.numeroPeriodo,
                      cerrado: row.cerrado,
                      extra1: row.extra1 || '',
                      extra2: row.extra2 || '',
                      extra3: row.extra3 || ''
                    })
                  }
                >
                  <Icon icon='mdi:pencil-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Eliminar'>
                <IconButton
                  size='small'
                  color='error'
                  onClick={() => {
                    if (window.confirm('Eliminar periodo CNT?')) deleteMutation.mutate(row.codigoPeriodo)
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
    form.nombrePeriodo.trim().length > 0 &&
    form.fechaDesde.length > 0 &&
    form.fechaHasta.length > 0 &&
    form.anoPeriodo > 0 &&
    form.numeroPeriodo > 0 &&
    !saveMutation.isPending

  const generateYear = () => {
    if (!canAdmin) return
    const anoPeriodo = anoPeriodoFilter ? Number(anoPeriodoFilter) : new Date().getFullYear()

    if (!anoPeriodo || anoPeriodo < 1900 || anoPeriodo > 9999) {
      toast.error('Indique un ano valido')

      return
    }

    if (window.confirm(`Generar los 12 periodos del ano ${anoPeriodo}?`)) {
      generateYearMutation.mutate(anoPeriodo)
    }
  }

  const exportPeriodos = () => {
    const rows = (periodosQuery.data ?? []).map(row => ({
      CodigoPeriodo: row.codigoPeriodo,
      Periodo: row.nombrePeriodo,
      Ano: row.anoPeriodo,
      Numero: row.numeroPeriodo,
      FechaDesde: normalizeDate(row.fechaDesde),
      FechaHasta: normalizeDate(row.fechaHasta),
      Estado: row.cerrado ? 'Cerrado' : 'Abierto',
      FechaCierre: normalizeDate(row.fechaCierre),
      Extra1: row.extra1,
      Extra2: row.extra2,
      Extra3: row.extra3
    }))

    exportCntRowsToExcel(rows, 'Periodos', 'CNT-Periodos')
  }

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
                <IconButton color='primary' onClick={() => periodosQuery.refetch()}>
                  <Icon icon='mdi:refresh' />
                </IconButton>
              </Tooltip>
              {canAdmin && (
                <>
                  <Tooltip title='Nuevo'>
                    <IconButton color='primary' onClick={() => setForm(emptyPeriodo)}>
                      <Icon icon='mdi:plus' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Generar ano'>
                    <span>
                      <IconButton color='primary' disabled={generateYearMutation.isPending} onClick={generateYear}>
                        <Icon icon='mdi:calendar-plus' />
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
              )}
              <Tooltip title='Exportar Excel'>
                <span>
                  <IconButton color='primary' disabled={(periodosQuery.data ?? []).length === 0} onClick={exportPeriodos}>
                    <Icon icon='mdi:file-excel-outline' />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField size='small' label='Ano' type='number' value={anoPeriodoFilter} onChange={event => setAnoPeriodoFilter(event.target.value)} sx={{ width: 120 }} />
              <FormControlLabel control={<Checkbox checked={soloAbiertos} onChange={event => setSoloAbiertos(event.target.checked)} />} label='Abiertos' />
              <TextField size='small' label='Buscar' value={searchText} onChange={event => setSearchText(event.target.value)} sx={{ minWidth: 240 }} />
            </Box>
          </CardActions>
          <CardContent sx={{ pt: 0 }}>
            {periodosQuery.isLoading ? (
              <Spinner />
            ) : (
              <DataGrid autoHeight rows={periodosQuery.data ?? []} columns={columns} getRowId={row => row.codigoPeriodo} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick />
            )}
          </CardContent>
        </Card>
      </Grid>

      {canAdmin && (
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              {form.codigoPeriodo ? 'Editar periodo' : 'Nuevo periodo'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField label='Nombre' value={form.nombrePeriodo} inputProps={{ maxLength: 100 }} onChange={event => setForm(current => ({ ...current, nombrePeriodo: event.target.value }))} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth label='Ano' type='number' value={form.anoPeriodo} onChange={event => setForm(current => ({ ...current, anoPeriodo: Number(event.target.value) }))} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label='Numero' type='number' value={form.numeroPeriodo} onChange={event => setForm(current => ({ ...current, numeroPeriodo: Number(event.target.value) }))} />
                </Grid>
              </Grid>
              <TextField label='Fecha desde' type='date' InputLabelProps={{ shrink: true }} value={form.fechaDesde} onChange={event => setForm(current => ({ ...current, fechaDesde: event.target.value }))} />
              <TextField label='Fecha hasta' type='date' InputLabelProps={{ shrink: true }} value={form.fechaHasta} onChange={event => setForm(current => ({ ...current, fechaHasta: event.target.value }))} />
              <FormControlLabel control={<Checkbox checked={form.cerrado} onChange={event => setForm(current => ({ ...current, cerrado: event.target.checked }))} />} label='Cerrado' />
              <TextField label='Extra 1' value={form.extra1} onChange={event => setForm(current => ({ ...current, extra1: event.target.value }))} />
              <TextField label='Extra 2' value={form.extra2} onChange={event => setForm(current => ({ ...current, extra2: event.target.value }))} />
              <TextField label='Extra 3' value={form.extra3} onChange={event => setForm(current => ({ ...current, extra3: event.target.value }))} />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 5, pb: 5 }}>
            <Button variant='outlined' color='secondary' onClick={() => setForm(emptyPeriodo)}>
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

export default CntPeriodosCatalog
