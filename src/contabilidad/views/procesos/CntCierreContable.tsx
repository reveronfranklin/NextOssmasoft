import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCurrentUserId } from '../../hooks/useCntCurrentUserId'
import { CntCierrePeriodoDto } from '../../interfaces/CntDtos'
import { exportCntRowsToExcel } from '../../utils/cntExcelExport'
import {
  CNT_CIERRE_CONTABLE_QUERY_KEY,
  CNT_PERMISSION_CIERRE_CIERRE,
  CNT_PERMISSION_CIERRE_PRECIERRE,
  CNT_PERMISSION_CIERRE_REVERSO,
  CNT_PERMISSION_CIERRE_VIEW,
  CNT_PERMISSIONS_QUERY_KEY,
  checkCntPermission,
  cierreCntContable,
  fetchCntCierrePeriodos,
  precierreCntContable,
  reversoCntContable
} from '../../services/cntService'

interface PeriodoCell {
  row: CntCierrePeriodoDto
}

const currentYear = new Date().getFullYear()

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString('es-VE') : '-')

const estadoColor = (estado: string): 'default' | 'primary' | 'warning' | 'success' | 'error' => {
  if (estado === 'CERRADO') return 'success'
  if (estado === 'PRECIERRE') return 'primary'
  if (estado === 'MODIFICADO') return 'warning'

  return 'default'
}

const CntCierreContable = () => {
  const currentUserId = useCntCurrentUserId()
  const [anoPeriodo, setAnoPeriodo] = useState(`${currentYear}`)
  const [soloPendientes, setSoloPendientes] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selected, setSelected] = useState<CntCierrePeriodoDto | null>(null)

  const viewPermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CIERRE_VIEW, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CIERRE_VIEW }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const precierrePermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CIERRE_PRECIERRE, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CIERRE_PRECIERRE }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const cierrePermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CIERRE_CIERRE, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CIERRE_CIERRE }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const reversoPermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CIERRE_REVERSO, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CIERRE_REVERSO }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const canView = viewPermissionQuery.data?.hasPermission === true
  const canPrecierre = precierrePermissionQuery.data?.hasPermission === true
  const canCierre = cierrePermissionQuery.data?.hasPermission === true
  const canReverso = reversoPermissionQuery.data?.hasPermission === true
  const permissionsLoading =
    viewPermissionQuery.isLoading ||
    precierrePermissionQuery.isLoading ||
    cierrePermissionQuery.isLoading ||
    reversoPermissionQuery.isLoading

  const periodosQuery = useQuery({
    queryKey: [CNT_CIERRE_CONTABLE_QUERY_KEY, currentUserId, anoPeriodo, soloPendientes, searchText],
    queryFn: () =>
      fetchCntCierrePeriodos({
        usuarioId: currentUserId,
        anoPeriodo: anoPeriodo ? Number(anoPeriodo) : null,
        soloPendientes,
        searchText
      }),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const refresh = async () => {
    const result = await periodosQuery.refetch()
    const nextSelected = result.data?.find(row => row.codigoPeriodo === selected?.codigoPeriodo) ?? null
    setSelected(nextSelected)
  }

  const precierreMutation = useMutation({
    mutationFn: (codigoPeriodo: number) => precierreCntContable({ usuarioId: currentUserId, codigoPeriodo }),
    onSuccess: async response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Precierre registrado.')
      await refresh()
    },
    onError: error => toast.error((error as Error).message)
  })

  const cierreMutation = useMutation({
    mutationFn: (codigoPeriodo: number) => cierreCntContable({ usuarioId: currentUserId, codigoPeriodo }),
    onSuccess: async response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Cierre registrado.')
      await refresh()
    },
    onError: error => toast.error((error as Error).message)
  })

  const reversoMutation = useMutation({
    mutationFn: (codigoPeriodo: number) => reversoCntContable({ usuarioId: currentUserId, codigoPeriodo }),
    onSuccess: async response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Reverso registrado.')
      await refresh()
    },
    onError: error => toast.error((error as Error).message)
  })

  const isMutating = precierreMutation.isPending || cierreMutation.isPending || reversoMutation.isPending

  const handlePrecierre = (row: CntCierrePeriodoDto) => {
    if (!window.confirm(`Ejecutar precierre del periodo ${row.nombrePeriodo}?`)) return
    precierreMutation.mutate(row.codigoPeriodo)
  }

  const handleCierre = (row: CntCierrePeriodoDto) => {
    if (!window.confirm(`Cerrar definitivamente el periodo ${row.nombrePeriodo}?`)) return
    cierreMutation.mutate(row.codigoPeriodo)
  }

  const handleReverso = (row: CntCierrePeriodoDto) => {
    if (!window.confirm(`Reversar el cierre del periodo ${row.nombrePeriodo}? Esta accion elimina saldos definitivos del periodo.`)) return
    reversoMutation.mutate(row.codigoPeriodo)
  }

  const exportPeriodos = () => {
    const rows = (periodosQuery.data ?? []).map(row => ({
      CodigoPeriodo: row.codigoPeriodo,
      Periodo: row.nombrePeriodo,
      Ano: row.anoPeriodo,
      Numero: row.numeroPeriodo,
      Desde: formatDate(row.fechaDesde),
      Hasta: formatDate(row.fechaHasta),
      Estado: row.estado,
      FechaPrecierre: formatDate(row.fechaPrecierre),
      UsuarioPrecierre: row.usuarioPrecierre ?? '',
      FechaCierre: formatDate(row.fechaCierre),
      UsuarioCierre: row.usuarioCierre ?? '',
      TmpSaldos: row.cantidadTmpSaldos,
      TmpAnalitico: row.cantidadTmpAnalitico,
      Saldos: row.cantidadSaldos,
      HistAnalitico: row.cantidadHistAnalitico,
      Modificaciones: row.cantidadModificaciones
    }))

    exportCntRowsToExcel(rows, 'Cierre contable', 'CNT-Cierre-Contable')
  }

  const columns = useMemo<GridColumns<CntCierrePeriodoDto>>(
    () => [
      { field: 'nombrePeriodo', headerName: 'Periodo', minWidth: 180, flex: 0.9 },
      { field: 'anoPeriodo', headerName: 'Ano', width: 90 },
      { field: 'numeroPeriodo', headerName: 'Numero', width: 95 },
      { field: 'fechaDesde', headerName: 'Desde', width: 120, valueFormatter: params => formatDate(params.value as string) },
      { field: 'fechaHasta', headerName: 'Hasta', width: 120, valueFormatter: params => formatDate(params.value as string) },
      {
        field: 'estado',
        headerName: 'Estado',
        width: 130,
        renderCell: ({ row }) => <Chip size='small' label={row.estado} color={estadoColor(row.estado)} variant='outlined' />
      },
      { field: 'cantidadTmpSaldos', headerName: 'Tmp saldos', width: 110, align: 'right', headerAlign: 'right' },
      { field: 'cantidadSaldos', headerName: 'Saldos', width: 100, align: 'right', headerAlign: 'right' },
      { field: 'cantidadModificaciones', headerName: 'Modif.', width: 95, align: 'right', headerAlign: 'right' },
      {
        field: 'actions',
        headerName: '',
        width: 180,
        sortable: false,
        renderCell: ({ row }: PeriodoCell) => (
          <Stack direction='row' spacing={1}>
            <Tooltip title='Seleccionar'>
              <IconButton size='small' color='primary' onClick={() => setSelected(row)}>
                <Icon icon='mdi:eye-outline' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Precierre'>
              <span>
                <IconButton
                  size='small'
                  color='primary'
                  disabled={!canPrecierre || row.estado === 'CERRADO' || isMutating}
                  onClick={() => handlePrecierre(row)}
                >
                  <Icon icon='mdi:file-clock-outline' />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title='Cierre'>
              <span>
                <IconButton
                  size='small'
                  color='success'
                  disabled={!canCierre || row.estado !== 'PRECIERRE' || row.cantidadModificaciones > 0 || isMutating}
                  onClick={() => handleCierre(row)}
                >
                  <Icon icon='mdi:file-check-outline' />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title='Reverso'>
              <span>
                <IconButton
                  size='small'
                  color='warning'
                  disabled={!canReverso || row.estado !== 'CERRADO' || isMutating}
                  onClick={() => handleReverso(row)}
                >
                  <Icon icon='mdi:file-restore-outline' />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        )
      }
    ],
    [canCierre, canPrecierre, canReverso, isMutating]
  )

  if (currentUserId <= 0 || permissionsLoading) return <Spinner />

  if (!canView) {
    return <Alert severity='warning'>El usuario no tiene el permiso requerido: {CNT_PERMISSION_CIERRE_VIEW}.</Alert>
  }

  const selectedPeriodo = selected ?? periodosQuery.data?.[0] ?? null

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Alert severity='info'>
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            Flujo mensual CNT: Precierre genera saldos temporales, Cierre migra saldos definitivos y Reverso reabre un periodo cerrado eliminando saldos del cierre.
          </Typography>
        </Alert>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Periodo seleccionado
            </Typography>
            {selectedPeriodo ? (
              <Stack spacing={3}>
                <Box>
                  <Typography variant='caption'>Periodo</Typography>
                  <Typography variant='h6'>{selectedPeriodo.nombrePeriodo}</Typography>
                </Box>
                <Chip
                  label={selectedPeriodo.estado}
                  color={estadoColor(selectedPeriodo.estado)}
                  variant={selectedPeriodo.estado === 'ABIERTO' ? 'outlined' : 'filled'}
                  sx={{ width: 'fit-content' }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Desde</Typography>
                    <Typography>{formatDate(selectedPeriodo.fechaDesde)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Hasta</Typography>
                    <Typography>{formatDate(selectedPeriodo.fechaHasta)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Precierre</Typography>
                    <Typography>{formatDate(selectedPeriodo.fechaPrecierre)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='caption'>Cierre</Typography>
                    <Typography>{formatDate(selectedPeriodo.fechaCierre)}</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Chip size='small' variant='outlined' label={`Tmp ${selectedPeriodo.cantidadTmpSaldos}`} sx={{ width: '100%' }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip size='small' variant='outlined' label={`Saldos ${selectedPeriodo.cantidadSaldos}`} sx={{ width: '100%' }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip size='small' variant='outlined' label={`Analitico ${selectedPeriodo.cantidadTmpAnalitico}`} sx={{ width: '100%' }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      size='small'
                      color={selectedPeriodo.cantidadModificaciones > 0 ? 'warning' : 'default'}
                      variant='outlined'
                      label={`Modif. ${selectedPeriodo.cantidadModificaciones}`}
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            ) : (
              <Typography color='text.secondary'>Seleccione un periodo para ver el estado del proceso.</Typography>
            )}
          </CardContent>
          <CardActions sx={{ px: 5, pb: 5, gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant='outlined'
              startIcon={<Icon icon='mdi:file-clock-outline' />}
              disabled={!selectedPeriodo || !canPrecierre || selectedPeriodo.estado === 'CERRADO' || isMutating}
              onClick={() => selectedPeriodo && handlePrecierre(selectedPeriodo)}
            >
              Precierre
            </Button>
            <Button
              variant='contained'
              color='success'
              startIcon={<Icon icon='mdi:file-check-outline' />}
              disabled={!selectedPeriodo || !canCierre || selectedPeriodo.estado !== 'PRECIERRE' || selectedPeriodo.cantidadModificaciones > 0 || isMutating}
              onClick={() => selectedPeriodo && handleCierre(selectedPeriodo)}
            >
              Cierre
            </Button>
            <Button
              variant='outlined'
              color='warning'
              startIcon={<Icon icon='mdi:file-restore-outline' />}
              disabled={!selectedPeriodo || !canReverso || selectedPeriodo.estado !== 'CERRADO' || isMutating}
              onClick={() => selectedPeriodo && handleReverso(selectedPeriodo)}
            >
              Reverso
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant='h5'>Cierre contable CNT</Typography>
              <Typography variant='body2' color='text.secondary'>
                Control de precierre, cierre definitivo y reverso por periodo contable.
              </Typography>
            </Box>
            <Stack direction='row' spacing={2}>
              <Button variant='outlined' startIcon={<Icon icon='mdi:refresh' />} onClick={() => refresh()}>
                Actualizar
              </Button>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:file-excel-outline' />}
                disabled={(periodosQuery.data ?? []).length === 0}
                onClick={exportPeriodos}
              >
                Excel
              </Button>
            </Stack>
          </CardActions>
          <CardContent>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth size='small' type='number' label='Ano' value={anoPeriodo} onChange={event => setAnoPeriodo(event.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size='small' label='Buscar periodo' value={searchText} onChange={event => setSearchText(event.target.value)} />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControlLabel
                  control={<Checkbox checked={soloPendientes} onChange={event => setSoloPendientes(event.target.checked)} />}
                  label='Solo pendientes o modificados'
                />
              </Grid>
            </Grid>
            <DataGrid
              autoHeight
              rows={periodosQuery.data ?? []}
              columns={columns}
              getRowId={row => row.codigoPeriodo}
              loading={periodosQuery.isLoading}
              disableSelectionOnClick
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              onRowClick={params => setSelected(params.row)}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CntCierreContable
