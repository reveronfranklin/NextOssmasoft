import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, CircularProgress, Grid, MenuItem, TextField, Tooltip } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import CntHelpDialog from '../components/CntHelpDialog'
import { useCntCurrentUserId } from '../hooks/useCntCurrentUserId'
import { CntAutomaticDailyConfirmResultDto, CntAutomaticLineDto, CntAutomaticPreviewResultDto, CntAutomaticConfirmResultDto } from '../interfaces/CntDtos'
import {
  CNT_CATALOGS_QUERY_KEY,
  CNT_PERIODOS_QUERY_KEY,
  confirmCntAutomatico,
  fetchCntCatalog,
  fetchCntPeriodos,
  previewCntAutomatico
} from '../services/cntService'

interface CellType {
  row: CntAutomaticLineDto
}

interface ConfirmCellType {
  row: CntAutomaticDailyConfirmResultDto
}

const today = () => new Date().toISOString().slice(0, 10)

const toDateInputValue = (value?: string) => value ? value.slice(0, 10) : ''

const defaultFechaHasta = (periodo?: { fechaDesde: string; fechaHasta: string }) => {
  if (!periodo) return today()

  const desde = toDateInputValue(periodo.fechaDesde)
  const hasta = toDateInputValue(periodo.fechaHasta)
  const actual = today()

  if (actual < desde) return desde

  return actual > hasta ? hasta : actual
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value ?? 0)

const allowedAutomaticOriginCodes = new Set([
  'COMP',
  'ANCOMP',
  'COMPORDCOM',
  'ANCOMPORDC',
  'COMPCONTOB',
  'ANCOCONTOB',
  'ODPAUT',
  'ANODPAUT',
  'CHEAUT',
  'CHEPROAUT',
  'CHERETAUT',
  'CHERETDAUT',
  'RETENFTDT',
  'ANCHEAUT'
])

const CntProcesoAutomatico = () => {
  const currentUserId = useCntCurrentUserId()
  const [codigoPeriodo, setCodigoPeriodo] = useState(0)
  const [tipoComprobanteId, setTipoComprobanteId] = useState(0)
  const [origenId, setOrigenId] = useState(0)
  const [fechaDesde, setFechaDesde] = useState(today())
  const [fechaHasta, setFechaHasta] = useState(today())
  const [observacion, setObservacion] = useState('')
  const [preview, setPreview] = useState<CntAutomaticPreviewResultDto | null>(null)
  const [confirmResult, setConfirmResult] = useState<CntAutomaticConfirmResultDto | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const periodosQuery = useQuery({
    queryKey: [CNT_PERIODOS_QUERY_KEY, 'automaticos'],
    queryFn: () => fetchCntPeriodos(true),
    retry: 1
  })

  const tiposQuery = useQuery({
    queryKey: [CNT_CATALOGS_QUERY_KEY, 'tipos-comprobante'],
    queryFn: () => fetchCntCatalog('tipos-comprobante'),
    retry: 1
  })

  const origenesQuery = useQuery({
    queryKey: [CNT_CATALOGS_QUERY_KEY, 'origenes-comprobante'],
    queryFn: () => fetchCntCatalog('origenes-comprobante'),
    retry: 1
  })

  const origenesPermitidos = useMemo(
    () => (origenesQuery.data ?? []).filter(item => allowedAutomaticOriginCodes.has((item.codigo ?? '').toUpperCase())),
    [origenesQuery.data]
  )

  const selectedPeriodo = useMemo(
    () => (periodosQuery.data ?? []).find(item => item.codigoPeriodo === codigoPeriodo),
    [codigoPeriodo, periodosQuery.data]
  )

  const periodoDesde = toDateInputValue(selectedPeriodo?.fechaDesde)
  const periodoHasta = toDateInputValue(selectedPeriodo?.fechaHasta)
  const fechaHastaInicial = defaultFechaHasta(selectedPeriodo)

  useEffect(() => {
    if (!selectedPeriodo) return

    setFechaDesde(periodoDesde)
    setFechaHasta(fechaHastaInicial)
    setPreview(null)
    setConfirmResult(null)
    setMessage('')
    setError('')
  }, [fechaHastaInicial, periodoDesde, selectedPeriodo])

  const payload = useMemo(
    () => ({
      usuarioId: currentUserId,
      codigoPeriodo,
      tipoComprobanteId,
      origenId,
      fechaDesde,
      fechaHasta
    }),
    [codigoPeriodo, currentUserId, fechaDesde, fechaHasta, origenId, tipoComprobanteId]
  )

  const previewMutation = useMutation({
    mutationFn: () => previewCntAutomatico(payload),
    onSuccess: data => {
      setPreview(data)
      setConfirmResult(null)
      setError('')
      setMessage(data?.lineas?.length ? 'Preview generado correctamente.' : 'Preview generado sin lineas para el origen seleccionado.')
    },
    onError: err => {
      setPreview(null)
      setMessage('')
      setError((err as Error).message)
    }
  })

  const confirmMutation = useMutation({
    mutationFn: () => confirmCntAutomatico({ ...payload, observacion }),
    onSuccess: response => {
      if (response.isValid === false) {
        setConfirmResult(response.data ?? null)
        setError(response.message)
        setMessage('')

        return
      }

      setConfirmResult(response.data)
      setError('')
      setMessage(`Comprobantes generados: ${response.data?.cantidadComprobantes ?? 0}`)
    },
    onError: err => {
      setMessage('')
      setError((err as Error).message)
    }
  })

  const totalDebe = preview?.totalDebe ?? 0
  const totalHaber = preview?.totalHaber ?? 0
  const diferencia = preview?.diferencia ?? 0
  const dateError = selectedPeriodo && (fechaDesde < periodoDesde || fechaHasta > periodoHasta || fechaDesde > fechaHasta)
    ? 'Las fechas deben estar dentro del periodo seleccionado.'
    : ''
  const canConfirm = Boolean(preview?.lineas?.length) && Math.abs(diferencia) < 0.01 && !confirmMutation.isPending && !dateError
  const canPreview = currentUserId > 0 && codigoPeriodo > 0 && tipoComprobanteId > 0 && origenId > 0 && Boolean(fechaDesde) && Boolean(fechaHasta) && !dateError

  const columns: GridColumns<CntAutomaticLineDto> = [
    { flex: 0.08, field: 'secuencia', minWidth: 90, headerName: '#' },
    { flex: 0.2, field: 'mayor', minWidth: 220, headerName: 'Mayor' },
    { flex: 0.22, field: 'auxiliar', minWidth: 240, headerName: 'Auxiliar' },
    { flex: 0.24, field: 'descripcion', minWidth: 260, headerName: 'Descripcion' },
    { flex: 0.12, field: 'referencia1', minWidth: 130, headerName: 'Ref. 1' },
    { flex: 0.12, field: 'referencia2', minWidth: 130, headerName: 'Ref. 2' },
    { flex: 0.12, field: 'debe', minWidth: 130, headerName: 'Debe', align: 'right', headerAlign: 'right', valueGetter: ({ row }: CellType) => formatMoney(row.debe) },
    { flex: 0.12, field: 'haber', minWidth: 130, headerName: 'Haber', align: 'right', headerAlign: 'right', valueGetter: ({ row }: CellType) => formatMoney(row.haber) }
  ]

  const confirmColumns: GridColumns<CntAutomaticDailyConfirmResultDto> = [
    { flex: 0.12, field: 'fechaComprobante', minWidth: 130, headerName: 'Fecha', valueGetter: ({ row }: ConfirmCellType) => row.fechaComprobante?.slice(0, 10) },
    { flex: 0.14, field: 'estado', minWidth: 140, headerName: 'Estado' },
    { flex: 0.16, field: 'numeroComprobante', minWidth: 160, headerName: 'Comprobante' },
    { flex: 0.1, field: 'cantidadLineas', minWidth: 120, headerName: 'Lineas', align: 'right', headerAlign: 'right' },
    { flex: 0.12, field: 'totalDebe', minWidth: 130, headerName: 'Debe', align: 'right', headerAlign: 'right', valueGetter: ({ row }: ConfirmCellType) => formatMoney(row.totalDebe) },
    { flex: 0.12, field: 'totalHaber', minWidth: 130, headerName: 'Haber', align: 'right', headerAlign: 'right', valueGetter: ({ row }: ConfirmCellType) => formatMoney(row.totalHaber) },
    { flex: 0.28, field: 'mensaje', minWidth: 260, headerName: 'Mensaje' }
  ]

  const reset = () => {
    setCodigoPeriodo(0)
    setTipoComprobanteId(0)
    setOrigenId(0)
    setFechaDesde(today())
    setFechaHasta(today())
    setObservacion('')
    setPreview(null)
    setConfirmResult(null)
    setMessage('')
    setError('')
  }

  const handlePeriodoChange = (codigo: number) => {
    setCodigoPeriodo(codigo)
    const periodo = (periodosQuery.data ?? []).find(item => item.codigoPeriodo === codigo)

    if (periodo) {
      setFechaDesde(toDateInputValue(periodo.fechaDesde))
      setFechaHasta(defaultFechaHasta(periodo))
    }

    setPreview(null)
    setConfirmResult(null)
    setMessage('')
    setError('')
  }

  const resetResults = () => {
    setPreview(null)
    setConfirmResult(null)
    setMessage('')
    setError('')
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardActions sx={{ justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CntHelpDialog context='proceso-automatico' />
            <Tooltip title='Previsualizar'>
              <span>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={<Icon icon='mdi:eye-outline' />}
                  disabled={!canPreview || previewMutation.isPending}
                  onClick={() => previewMutation.mutate()}
                >
                  Previsualizar
                </Button>
              </span>
            </Tooltip>
            <Tooltip title='Limpiar'>
              <Button size='small' variant='outlined' startIcon={<Icon icon='mdi:eraser' />} onClick={reset}>
                Limpiar
              </Button>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip size='small' label={`Debe ${formatMoney(totalDebe)}`} />
            <Chip size='small' label={`Haber ${formatMoney(totalHaber)}`} />
            <Chip size='small' color={Math.abs(diferencia) < 0.01 ? 'success' : 'error'} label={`Dif. ${formatMoney(diferencia)}`} />
          </Box>
        </CardActions>
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth select size='small' label='Periodo' value={codigoPeriodo} onChange={event => handlePeriodoChange(Number(event.target.value))}>
                <MenuItem value={0}>Seleccione</MenuItem>
                {(periodosQuery.data ?? []).map(item => <MenuItem key={item.codigoPeriodo} value={item.codigoPeriodo}>{item.nombrePeriodo}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth select size='small' label='Origen' value={origenId} onChange={event => { setOrigenId(Number(event.target.value)); resetResults() }}>
                <MenuItem value={0}>Seleccione</MenuItem>
                {origenesPermitidos.map(item => <MenuItem key={item.id} value={item.id}>{item.descripcion}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth select size='small' label='Tipo' value={tipoComprobanteId} onChange={event => { setTipoComprobanteId(Number(event.target.value)); resetResults() }}>
                <MenuItem value={0}>Seleccione</MenuItem>
                {(tiposQuery.data ?? []).map(item => <MenuItem key={item.id} value={item.id}>{item.descripcion}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size='small' type='date' label='Desde' InputLabelProps={{ shrink: true }} inputProps={{ min: periodoDesde || undefined, max: periodoHasta || undefined }} value={fechaDesde} onChange={event => { setFechaDesde(event.target.value); resetResults() }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size='small' type='date' label='Hasta' InputLabelProps={{ shrink: true }} inputProps={{ min: periodoDesde || undefined, max: periodoHasta || undefined }} value={fechaHasta} onChange={event => { setFechaHasta(event.target.value); resetResults() }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size='small' label='Observacion' value={observacion} onChange={event => setObservacion(event.target.value)} />
            </Grid>
          </Grid>
        </CardContent>
        {previewMutation.isPending ? (
          <Spinner sx={{ height: 420 }} />
        ) : (
          <Box sx={{ height: 460 }}>
            <DataGrid
              getRowId={row => row.secuencia}
              columns={columns}
              rows={preview?.lineas ?? []}
              rowsPerPageOptions={[10, 25, 50]}
              pageSize={10}
            />
          </Box>
        )}
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 260 }}>
            {message && <Alert severity='success'>{message}</Alert>}
            {error && <Alert severity='error'>{error}</Alert>}
            {dateError && <Alert severity='warning'>{dateError}</Alert>}
          </Box>
          <Button
            variant='contained'
            startIcon={confirmMutation.isPending ? <CircularProgress color='inherit' size={18} /> : <Icon icon='mdi:file-check-outline' />}
            disabled={!canConfirm}
            onClick={() => confirmMutation.mutate()}
          >
            {confirmMutation.isPending ? 'Generando...' : 'Generar comprobante'}
          </Button>
        </CardContent>
        {confirmResult && (
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              <Chip size='small' color='success' label={`Generados ${confirmResult.cantidadComprobantes}`} />
              <Chip size='small' label={`Sin lineas ${confirmResult.cantidadDiasSinLineas}`} />
              <Chip size='small' color={confirmResult.cantidadErrores > 0 ? 'error' : 'default'} label={`Errores ${confirmResult.cantidadErrores}`} />
              <Chip size='small' label={`Lineas ${confirmResult.totalLineas}`} />
              <Chip size='small' label={`Debe ${formatMoney(confirmResult.totalDebe)}`} />
              <Chip size='small' label={`Haber ${formatMoney(confirmResult.totalHaber)}`} />
            </Box>
            <Box sx={{ height: 320 }}>
              <DataGrid
                getRowId={row => `${row.fechaComprobante}-${row.codigoComprobante}-${row.estado}`}
                columns={confirmColumns}
                rows={confirmResult.comprobantes ?? []}
                rowsPerPageOptions={[10, 25, 50]}
                pageSize={10}
              />
            </Box>
          </CardContent>
        )}
      </Card>
    </Grid>
  )
}

export default CntProcesoAutomatico
