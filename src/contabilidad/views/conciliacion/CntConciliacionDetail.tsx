import { useMemo, useState } from 'react'
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Divider, Grid, IconButton, Stack, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns, GridSelectionModel } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import CntHelpDialog from '../../components/CntHelpDialog'
import { useCntCurrentUserId } from '../../hooks/useCntCurrentUserId'
import {
  CntConciliacionBancoMovimientoDto,
  CntConciliacionLibroMovimientoDto,
  CntConciliacionSuggestionDto,
  CntConciliacionTemporalDto
} from '../../interfaces/CntDtos'
import {
  CNT_CONCILIACIONES_QUERY_KEY,
  CNT_PERMISSION_CONCILIACION_EDIT_PRECLOSE,
  CNT_PERMISSION_CONCILIACION_FORCE_CLOSE,
  CNT_PERMISSIONS_QUERY_KEY,
  checkCntPermission,
  closeCntConciliacion,
  fetchCntConciliacionBancoMovimientos,
  fetchCntConciliacionById,
  fetchCntConciliacionLibroMovimientos,
  fetchCntConciliacionSuggestions,
  fetchCntConciliacionTemporales,
  matchCntConciliacion,
  matchMultiCntConciliacion,
  precloseCntConciliacion,
  reverseCntConciliacion,
  unmatchCntConciliacion
} from '../../services/cntService'

interface Props {
  codigoConciliacion: number
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2
  }).format(Number(value || 0))

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('es-VE') : '-')

const CntConciliacionDetail = ({ codigoConciliacion }: Props) => {
  const router = useRouter()
  const currentUserId = useCntCurrentUserId()
  const [tab, setTab] = useState('banco')
  const [selectedBancoIds, setSelectedBancoIds] = useState<number[]>([])
  const [selectedLibroIds, setSelectedLibroIds] = useState<number[]>([])
  const [toleranciaDias, setToleranciaDias] = useState(0)
  const [toleranciaMonto, setToleranciaMonto] = useState(0)

  const query = useQuery({
    queryKey: [CNT_CONCILIACIONES_QUERY_KEY, 'detalle', codigoConciliacion, currentUserId],
    queryFn: () => fetchCntConciliacionById(codigoConciliacion, currentUserId),
    enabled: codigoConciliacion > 0 && currentUserId > 0,
    retry: 1
  })

  const bancoQuery = useQuery({
    queryKey: [CNT_CONCILIACIONES_QUERY_KEY, 'banco', codigoConciliacion, currentUserId],
    queryFn: () => fetchCntConciliacionBancoMovimientos({ usuarioId: currentUserId, codigoConciliacion }),
    enabled: codigoConciliacion > 0 && currentUserId > 0,
    retry: 1
  })

  const libroQuery = useQuery({
    queryKey: [CNT_CONCILIACIONES_QUERY_KEY, 'libro', codigoConciliacion, currentUserId],
    queryFn: () => fetchCntConciliacionLibroMovimientos({ usuarioId: currentUserId, codigoConciliacion }),
    enabled: codigoConciliacion > 0 && currentUserId > 0,
    retry: 1
  })

  const temporalesQuery = useQuery({
    queryKey: [CNT_CONCILIACIONES_QUERY_KEY, 'temporales', codigoConciliacion, currentUserId],
    queryFn: () => fetchCntConciliacionTemporales({ usuarioId: currentUserId, codigoConciliacion }),
    enabled: codigoConciliacion > 0 && currentUserId > 0,
    retry: 1
  })

  const sugerenciasQuery = useQuery({
    queryKey: [CNT_CONCILIACIONES_QUERY_KEY, 'sugerencias', codigoConciliacion, currentUserId, toleranciaDias, toleranciaMonto],
    queryFn: () =>
      fetchCntConciliacionSuggestions({
        usuarioId: currentUserId,
        codigoConciliacion,
        toleranciaDias,
        toleranciaMonto,
        maxRows: 100
      }),
    enabled: codigoConciliacion > 0 && currentUserId > 0 && tab === 'sugerencias',
    retry: 1
  })

  const forceClosePermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CONCILIACION_FORCE_CLOSE, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CONCILIACION_FORCE_CLOSE }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const editPreclosePermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CONCILIACION_EDIT_PRECLOSE, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CONCILIACION_EDIT_PRECLOSE }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const refetchMovimientos = async () => {
    await Promise.all([bancoQuery.refetch(), libroQuery.refetch(), temporalesQuery.refetch(), sugerenciasQuery.refetch(), query.refetch()])
  }

  const matchMutation = useMutation({
    mutationFn: matchCntConciliacion,
    onSuccess: async () => {
      toast.success('Movimiento conciliado')
      setSelectedBancoIds([])
      setSelectedLibroIds([])
      await refetchMovimientos()
    },
    onError: error => toast.error((error as Error).message)
  })

  const matchMultiMutation = useMutation({
    mutationFn: matchMultiCntConciliacion,
    onSuccess: async count => {
      toast.success(`${count} movimientos conciliados`)
      setSelectedBancoIds([])
      setSelectedLibroIds([])
      await refetchMovimientos()
    },
    onError: error => toast.error((error as Error).message)
  })

  const unmatchMutation = useMutation({
    mutationFn: unmatchCntConciliacion,
    onSuccess: async () => {
      toast.success('Conciliacion temporal reversada')
      await refetchMovimientos()
    },
    onError: error => toast.error((error as Error).message)
  })

  const precloseMutation = useMutation({
    mutationFn: precloseCntConciliacion,
    onSuccess: async () => {
      toast.success('Precierre registrado')
      await refetchMovimientos()
    },
    onError: error => toast.error((error as Error).message)
  })

  const closeMutation = useMutation({
    mutationFn: closeCntConciliacion,
    onSuccess: async () => {
      toast.success('Conciliacion cerrada')
      setSelectedBancoIds([])
      setSelectedLibroIds([])
      await refetchMovimientos()
    },
    onError: error => toast.error((error as Error).message)
  })

  const reverseMutation = useMutation({
    mutationFn: reverseCntConciliacion,
    onSuccess: async () => {
      toast.success('Conciliacion reversada')
      await refetchMovimientos()
    },
    onError: error => toast.error((error as Error).message)
  })

  const handleMatch = (tipo: 'ambos' | 'banco' | 'libro') => {
    const codigosDetalleEdoCta = tipo !== 'libro' ? selectedBancoIds : []
    const codigosDetalleLibro = tipo !== 'banco' ? selectedLibroIds : []
    const isSimpleMatch = codigosDetalleEdoCta.length <= 1 && codigosDetalleLibro.length <= 1

    if (!isSimpleMatch) {
      matchMultiMutation.mutate({
        usuarioId: currentUserId,
        codigoConciliacion,
        codigosDetalleEdoCta,
        codigosDetalleLibro
      })

      return
    }

    matchMutation.mutate({
      usuarioId: currentUserId,
      codigoConciliacion,
      codigoDetalleEdoCta: codigosDetalleEdoCta[0] ?? null,
      codigoDetalleLibro: codigosDetalleLibro[0] ?? null
    })
  }

  const conciliacion = query.data
  const diferencia = Number(conciliacion?.saldoBanco || 0) - Number(conciliacion?.saldoLibro || 0)
  const isClosed = conciliacion?.estado === 'CERRADA'
  const isPreclosed = conciliacion?.estado === 'PRECIERRE'
  const isOutOfBalance = Math.abs(diferencia) > 0.01
  const canForceClose = forceClosePermissionQuery.data?.hasPermission === true
  const canEditPreclose = editPreclosePermissionQuery.data?.hasPermission === true
  const canEditMovimientos = !isPreclosed || canEditPreclose
  const selectedBancoCount = selectedBancoIds.length
  const selectedLibroCount = selectedLibroIds.length
  const isMutating =
    matchMutation.isPending ||
    matchMultiMutation.isPending ||
    unmatchMutation.isPending ||
    precloseMutation.isPending ||
    closeMutation.isPending ||
    reverseMutation.isPending

  const bancoColumns = useMemo<GridColumns<CntConciliacionBancoMovimientoDto>>(
    () => [
      { field: 'fechaTransaccion', headerName: 'Fecha', width: 120, valueFormatter: params => formatDate(params.value as string) },
      { field: 'numeroTransaccion', headerName: 'Numero', minWidth: 130, flex: 0.7 },
      { field: 'tipoTransaccion', headerName: 'Tipo', minWidth: 160, flex: 0.8 },
      { field: 'descripcion', headerName: 'Descripcion', minWidth: 260, flex: 1.4 },
      { field: 'monto', headerName: 'Monto', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      {
        field: 'enTemporal',
        headerName: 'Tmp',
        width: 90,
        renderCell: ({ row }) => <Chip size='small' label={row.enTemporal ? 'Si' : 'No'} color={row.enTemporal ? 'warning' : 'default'} variant='outlined' />
      }
    ],
    []
  )

  const libroColumns = useMemo<GridColumns<CntConciliacionLibroMovimientoDto>>(
    () => [
      { field: 'fechaLibro', headerName: 'Fecha', width: 120, valueFormatter: params => formatDate(params.value as string) },
      { field: 'numeroDocumento', headerName: 'Documento', minWidth: 130, flex: 0.7 },
      { field: 'tipoDocumento', headerName: 'Tipo', minWidth: 160, flex: 0.8 },
      { field: 'descripcion', headerName: 'Descripcion', minWidth: 260, flex: 1.4 },
      { field: 'monto', headerName: 'Monto', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      {
        field: 'enTemporal',
        headerName: 'Tmp',
        width: 90,
        renderCell: ({ row }) => <Chip size='small' label={row.enTemporal ? 'Si' : 'No'} color={row.enTemporal ? 'warning' : 'default'} variant='outlined' />
      }
    ],
    []
  )

  const temporalColumns = useMemo<GridColumns<CntConciliacionTemporalDto>>(
    () => [
      {
        field: 'acciones',
        headerName: '',
        width: 64,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Tooltip title='Reversar temporal'>
            <span>
              <IconButton
                size='small'
                color='error'
                disabled={unmatchMutation.isPending || !canEditMovimientos}
                onClick={() => unmatchMutation.mutate({ usuarioId: currentUserId, codigoTmpConciliacion: row.codigoTmpConciliacion })}
              >
                <Icon icon='mdi:link-variant-off' />
              </IconButton>
            </span>
          </Tooltip>
        )
      },
      { field: 'fecha', headerName: 'Fecha', width: 120, valueFormatter: params => formatDate(params.value as string) },
      { field: 'numero', headerName: 'Numero', minWidth: 130, flex: 0.7 },
      { field: 'tipo', headerName: 'Tipo', width: 120 },
      { field: 'bancoDescripcion', headerName: 'Banco', minWidth: 220, flex: 1 },
      { field: 'libroDescripcion', headerName: 'Libro', minWidth: 220, flex: 1 },
      { field: 'monto', headerName: 'Monto', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) }
    ],
    [canEditMovimientos, currentUserId, unmatchMutation]
  )

  const sugerenciaColumns = useMemo<GridColumns<CntConciliacionSuggestionDto>>(
    () => [
      {
        field: 'acciones',
        headerName: '',
        width: 64,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Tooltip title='Aplicar sugerencia'>
            <span>
              <IconButton
                size='small'
                color='primary'
                disabled={isClosed || isMutating || !canEditMovimientos}
                onClick={() =>
                  matchMutation.mutate({
                    usuarioId: currentUserId,
                    codigoConciliacion,
                    codigoDetalleEdoCta: row.codigoDetalleEdoCta,
                    codigoDetalleLibro: row.codigoDetalleLibro
                  })
                }
              >
                <Icon icon='mdi:link-variant-plus' />
              </IconButton>
            </span>
          </Tooltip>
        )
      },
      {
        field: 'score',
        headerName: 'Score',
        width: 100,
        renderCell: ({ row }) => <Chip size='small' label={row.score} color={row.score >= 80 ? 'success' : row.score >= 45 ? 'warning' : 'default'} variant='outlined' />
      },
      {
        field: 'motivos',
        headerName: 'Coincide',
        minWidth: 210,
        flex: 0.8,
        renderCell: ({ row }) => (
          <Stack direction='row' spacing={1} flexWrap='wrap'>
            <Chip size='small' label='Monto' color={row.matchMonto ? 'success' : 'default'} variant={row.matchMonto ? 'filled' : 'outlined'} />
            <Chip size='small' label='Numero' color={row.matchNumero ? 'success' : 'default'} variant={row.matchNumero ? 'filled' : 'outlined'} />
            <Chip size='small' label='Fecha' color={row.matchFecha ? 'success' : 'default'} variant={row.matchFecha ? 'filled' : 'outlined'} />
          </Stack>
        )
      },
      { field: 'bancoFecha', headerName: 'Banco fecha', width: 130, valueFormatter: params => formatDate(params.value as string) },
      { field: 'libroFecha', headerName: 'Libro fecha', width: 130, valueFormatter: params => formatDate(params.value as string) },
      {
        field: 'diferenciaDias',
        headerName: 'Dias',
        width: 90,
        renderCell: ({ row }) => <Chip size='small' label={row.diferenciaDias} color={row.matchFecha ? 'success' : 'error'} variant='outlined' />
      },
      { field: 'numeroTransaccion', headerName: 'Banco num.', minWidth: 130, flex: 0.6 },
      { field: 'numeroDocumento', headerName: 'Libro num.', minWidth: 130, flex: 0.6 },
      { field: 'bancoDescripcion', headerName: 'Banco', minWidth: 220, flex: 1 },
      { field: 'libroDescripcion', headerName: 'Libro', minWidth: 220, flex: 1 },
      { field: 'bancoMonto', headerName: 'Banco monto', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      { field: 'libroMonto', headerName: 'Libro monto', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      {
        field: 'diferenciaMonto',
        headerName: 'Dif. monto',
        width: 150,
        align: 'right',
        headerAlign: 'right',
        renderCell: ({ row }) => (
          <Chip size='small' label={formatMoney(row.diferenciaMonto)} color={row.matchMonto ? 'success' : 'error'} variant='outlined' />
        )
      }
    ],
    [canEditMovimientos, codigoConciliacion, currentUserId, isClosed, isMutating, matchMutation]
  )

  if (query.isLoading || currentUserId <= 0) {
    return <Spinner sx={{ height: 450 }} />
  }

  if (query.isError) {
    return <Alert severity='error'>{(query.error as Error).message}</Alert>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Button variant='outlined' startIcon={<Icon icon='mdi:arrow-left' />} onClick={() => router.push('/apps/cnt/conciliacion')}>
              Volver
            </Button>
            <CntHelpDialog context='detalle' />
            <Chip
              label={conciliacion?.estado ?? '-'}
              color={conciliacion?.estado === 'CERRADA' ? 'success' : conciliacion?.estado === 'PRECIERRE' ? 'warning' : 'primary'}
              variant='outlined'
            />
            <Button
              variant='contained'
              startIcon={<Icon icon='mdi:lock-clock' />}
              disabled={isClosed || isPreclosed || isMutating}
              onClick={() => precloseMutation.mutate({ usuarioId: currentUserId, codigoConciliacion })}
            >
              Precierre
            </Button>
            <Button
              variant='contained'
              color='success'
              startIcon={<Icon icon='mdi:lock-check' />}
              disabled={isClosed || isMutating}
              onClick={() => closeMutation.mutate({ usuarioId: currentUserId, codigoConciliacion })}
            >
              Cerrar
            </Button>
            {isOutOfBalance && canForceClose && (
              <Button
                variant='outlined'
                color='error'
                startIcon={<Icon icon='mdi:lock-alert' />}
                disabled={isClosed || isMutating}
                onClick={() => closeMutation.mutate({ usuarioId: currentUserId, codigoConciliacion, forzarDiferencia: true })}
              >
                Cierre forzado
              </Button>
            )}
            <Button
              variant='outlined'
              color='warning'
              startIcon={<Icon icon='mdi:lock-open-variant' />}
              disabled={!isClosed || isMutating}
              onClick={() => reverseMutation.mutate({ usuarioId: currentUserId, codigoConciliacion })}
            >
              Reversar
            </Button>
          </CardActions>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap', mb: 4 }}>
              <Box>
                <Typography variant='h5'>Conciliacion #{conciliacion?.codigoConciliacion}</Typography>
                <Typography color='text.secondary'>{conciliacion?.nombrePeriodo}</Typography>
              </Box>
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography>Banco: {conciliacion?.banco || '-'}</Typography>
                <Typography>Cuenta: {conciliacion?.noCuenta || '-'}</Typography>
              </Box>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Typography variant='caption'>Periodo</Typography>
                <Typography>{conciliacion?.anoPeriodo}-{conciliacion?.numeroPeriodo}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant='caption'>Denominacion</Typography>
                <Typography>{conciliacion?.denominacionFuncional || '-'}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant='caption'>Precierre</Typography>
                <Typography>{formatDate(conciliacion?.fechaPrecierre)}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant='caption'>Cierre</Typography>
                <Typography>{formatDate(conciliacion?.fechaCierre)}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant='caption'>Saldo banco</Typography>
                <Typography variant='h6'>{formatMoney(conciliacion?.saldoBanco ?? 0)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='caption'>Saldo libro</Typography>
                <Typography variant='h6'>{formatMoney(conciliacion?.saldoLibro ?? 0)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='caption'>Diferencia</Typography>
                <Typography variant='h6' color={Math.abs(diferencia) < 0.01 ? 'success.main' : 'error.main'}>
                  {formatMoney(diferencia)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }} flexWrap='wrap'>
              <Button
                variant='contained'
                startIcon={<Icon icon='mdi:link-variant' />}
                disabled={isClosed || !canEditMovimientos || isMutating || selectedBancoCount === 0 || selectedLibroCount === 0}
                onClick={() => handleMatch('ambos')}
              >
                Conciliar seleccion
              </Button>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:bank' />}
                disabled={isClosed || !canEditMovimientos || isMutating || selectedBancoCount === 0}
                onClick={() => handleMatch('banco')}
              >
                Solo banco
              </Button>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:book-open-variant' />}
                disabled={isClosed || !canEditMovimientos || isMutating || selectedLibroCount === 0}
                onClick={() => handleMatch('libro')}
              >
                Solo libro
              </Button>
              <Button
                variant='text'
                startIcon={<Icon icon='mdi:refresh' />}
                disabled={isMutating}
                onClick={() => refetchMovimientos()}
              >
                Recargar
              </Button>
            </Stack>

            <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 4 }}>
              <Tab value='banco' label='Banco' />
              <Tab value='libro' label='Libro' />
              <Tab value='temporales' label='Temporales' />
              <Tab value='sugerencias' label='Sugerencias' />
            </Tabs>

            {tab === 'banco' && (
              <DataGrid
                autoHeight
                rows={bancoQuery.data ?? []}
                columns={bancoColumns}
                getRowId={row => row.codigoDetalleEdoCta}
                loading={bancoQuery.isLoading}
                checkboxSelection
                selectionModel={selectedBancoIds}
                onSelectionModelChange={(model: GridSelectionModel) => setSelectedBancoIds(model.map(Number))}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
              />
            )}
            {tab === 'libro' && (
              <DataGrid
                autoHeight
                rows={libroQuery.data ?? []}
                columns={libroColumns}
                getRowId={row => row.codigoDetalleLibro}
                loading={libroQuery.isLoading}
                checkboxSelection
                selectionModel={selectedLibroIds}
                onSelectionModelChange={(model: GridSelectionModel) => setSelectedLibroIds(model.map(Number))}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
              />
            )}
            {tab === 'temporales' && (
              <DataGrid
                autoHeight
                rows={temporalesQuery.data ?? []}
                columns={temporalColumns}
                getRowId={row => row.codigoTmpConciliacion}
                loading={temporalesQuery.isLoading}
                disableSelectionOnClick
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
              />
            )}
            {tab === 'sugerencias' && (
              <Stack spacing={4}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <TextField
                    size='small'
                    type='number'
                    label='Tolerancia dias'
                    value={toleranciaDias}
                    inputProps={{ min: 0 }}
                    onChange={event => setToleranciaDias(Math.max(Number(event.target.value || 0), 0))}
                  />
                  <TextField
                    size='small'
                    type='number'
                    label='Tolerancia monto'
                    value={toleranciaMonto}
                    inputProps={{ min: 0, step: '0.01' }}
                    onChange={event => setToleranciaMonto(Math.max(Number(event.target.value || 0), 0))}
                  />
                  <Button
                    variant='outlined'
                    startIcon={<Icon icon='mdi:refresh' />}
                    disabled={sugerenciasQuery.isFetching || isMutating}
                    onClick={() => sugerenciasQuery.refetch()}
                  >
                    Buscar
                  </Button>
                </Stack>
                <DataGrid
                  autoHeight
                  rows={sugerenciasQuery.data ?? []}
                  columns={sugerenciaColumns}
                  getRowId={row => `${row.codigoDetalleEdoCta}-${row.codigoDetalleLibro}`}
                  loading={sugerenciasQuery.isLoading || sugerenciasQuery.isFetching}
                  disableSelectionOnClick
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                />
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CntConciliacionDetail
