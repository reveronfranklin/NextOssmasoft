import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Grid, MenuItem, TextField, Typography } from '@mui/material'
import { DataGrid, GridColumns, GridSelectionModel } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import CntHelpDialog from '../../components/CntHelpDialog'
import { useCntCurrentUserId } from '../../hooks/useCntCurrentUserId'
import { CntEstadoCuentaDetalleDto, CntEstadoCuentaDto } from '../../interfaces/CntDtos'
import { exportCntRowsToExcel } from '../../utils/cntExcelExport'
import {
  CNT_BANCOS_QUERY_KEY,
  CNT_CUENTAS_BANCO_QUERY_KEY,
  CNT_ESTADOS_CUENTA_QUERY_KEY,
  CNT_PERMISSION_CONCILIACION_VIEW,
  CNT_PERMISSIONS_QUERY_KEY,
  checkCntPermission,
  fetchCntBancos,
  fetchCntCuentasBanco,
  fetchCntEstadoCuentaDetalles,
  fetchCntEstadosCuenta
} from '../../services/cntService'

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2
  }).format(Number(value || 0))

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('es-VE') : '')

const CntEstadosCuentaList = () => {
  const currentUserId = useCntCurrentUserId()
  const [codigoBanco, setCodigoBanco] = useState<number | ''>('')
  const [codigoCuentaBanco, setCodigoCuentaBanco] = useState<number | ''>('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [searchText, setSearchText] = useState('')
  const [detailSearchText, setDetailSearchText] = useState('')
  const [status, setStatus] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const permissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CONCILIACION_VIEW, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CONCILIACION_VIEW }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const canView = permissionQuery.data?.hasPermission === true

  const bancosQuery = useQuery({
    queryKey: [CNT_BANCOS_QUERY_KEY, currentUserId, 'edo-cta'],
    queryFn: () => fetchCntBancos(currentUserId),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const cuentasQuery = useQuery({
    queryKey: [CNT_CUENTAS_BANCO_QUERY_KEY, currentUserId, codigoBanco, 'edo-cta'],
    queryFn: () => fetchCntCuentasBanco(currentUserId, codigoBanco === '' ? undefined : Number(codigoBanco), true),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const estadosQuery = useQuery({
    queryKey: [CNT_ESTADOS_CUENTA_QUERY_KEY, currentUserId, codigoBanco, codigoCuentaBanco, fechaDesde, fechaHasta, searchText],
    queryFn: () =>
      fetchCntEstadosCuenta({
        usuarioId: currentUserId,
        codigoBanco: codigoBanco === '' ? null : Number(codigoBanco),
        codigoCuentaBanco: codigoCuentaBanco === '' ? null : Number(codigoCuentaBanco),
        fechaDesde: fechaDesde || null,
        fechaHasta: fechaHasta || null,
        searchText
      }),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const detallesQuery = useQuery({
    queryKey: [CNT_ESTADOS_CUENTA_QUERY_KEY, 'detalle', currentUserId, selectedId, status, detailSearchText],
    queryFn: () =>
      fetchCntEstadoCuentaDetalles({
        usuarioId: currentUserId,
        codigoEstadoCuenta: selectedId ?? 0,
        status,
        searchText: detailSearchText
      }),
    enabled: currentUserId > 0 && canView && selectedId !== null,
    retry: 1
  })

  useEffect(() => {
    if (selectedId === null && (estadosQuery.data?.length ?? 0) > 0) {
      setSelectedId(estadosQuery.data?.[0].codigoEstadoCuenta ?? null)
    }
  }, [estadosQuery.data, selectedId])

  const handleExportEstadosExcel = () => {
    const rows = (estadosQuery.data ?? []).map(row => ({
      EstadoCuenta: row.numeroEstadoCuenta,
      Banco: row.banco,
      Cuenta: row.noCuenta,
      Desde: formatDate(row.fechaDesde),
      Hasta: formatDate(row.fechaHasta),
      Movimientos: row.cantidadMovimientos,
      Monto: row.montoMovimientos,
      SaldoInicial: row.saldoInicial,
      SaldoFinal: row.saldoFinal
    }))

    exportCntRowsToExcel(rows, 'Estados cuenta', 'CNT-Estados-Cuenta')
  }

  const handleExportDetalleExcel = () => {
    const rows = (detallesQuery.data ?? []).map(row => ({
      Fecha: formatDate(row.fechaTransaccion),
      Numero: row.numeroTransaccion,
      Tipo: row.tipoTransaccion,
      Descripcion: row.descripcion,
      Monto: row.monto,
      Estado: row.status
    }))

    exportCntRowsToExcel(rows, 'Detalle estado', 'CNT-Estado-Cuenta-Detalle')
  }

  const estadoColumns = useMemo<GridColumns<CntEstadoCuentaDto>>(
    () => [
      { field: 'numeroEstadoCuenta', headerName: 'Estado', width: 120 },
      { field: 'banco', headerName: 'Banco', minWidth: 170, flex: 0.7 },
      { field: 'noCuenta', headerName: 'Cuenta', minWidth: 160, flex: 0.7 },
      { field: 'fechaDesde', headerName: 'Desde', width: 115, valueFormatter: params => formatDate(params.value as string) },
      { field: 'fechaHasta', headerName: 'Hasta', width: 115, valueFormatter: params => formatDate(params.value as string) },
      { field: 'cantidadMovimientos', headerName: 'Mov.', width: 90, align: 'right', headerAlign: 'right' },
      { field: 'montoMovimientos', headerName: 'Monto', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      { field: 'saldoInicial', headerName: 'Saldo inicial', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      { field: 'saldoFinal', headerName: 'Saldo final', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) }
    ],
    []
  )

  const detalleColumns = useMemo<GridColumns<CntEstadoCuentaDetalleDto>>(
    () => [
      { field: 'fechaTransaccion', headerName: 'Fecha', width: 115, valueFormatter: params => formatDate(params.value as string) },
      { field: 'numeroTransaccion', headerName: 'Numero', width: 130 },
      { field: 'tipoTransaccion', headerName: 'Tipo', width: 140 },
      { field: 'descripcion', headerName: 'Descripcion', minWidth: 240, flex: 1 },
      { field: 'monto', headerName: 'Monto', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      { field: 'status', headerName: 'Estado', width: 100, renderCell: ({ row }) => <Chip size='small' label={row.status || '-'} variant='outlined' /> }
    ],
    []
  )

  if (currentUserId <= 0 || permissionQuery.isLoading) {
    return <Spinner />
  }

  if (!canView) {
    return <Alert severity='warning'>El usuario no tiene el permiso requerido: {CNT_PERMISSION_CONCILIACION_VIEW}.</Alert>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant='h5'>Estados de cuenta</Typography>
              <Typography variant='body2' color='text.secondary'>Consulta de estados bancarios importados.</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <CntHelpDialog context='estados-cuenta' />
              <Button variant='outlined' startIcon={<Icon icon='mdi:refresh' />} onClick={() => estadosQuery.refetch()}>
                Actualizar
              </Button>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:file-excel-outline' />}
                disabled={(estadosQuery.data ?? []).length === 0}
                onClick={handleExportEstadosExcel}
              >
                Excel
              </Button>
            </Box>
          </CardActions>
          <CardContent>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={2.5}>
                <TextField fullWidth select label='Banco' size='small' value={codigoBanco} onChange={event => {
                  setCodigoBanco(event.target.value === '' ? '' : Number(event.target.value))
                  setCodigoCuentaBanco('')
                  setSelectedId(null)
                }}>
                  <MenuItem value=''>Todos</MenuItem>
                  {(bancosQuery.data ?? []).map(banco => <MenuItem key={banco.codigoBanco} value={banco.codigoBanco}>{banco.nombre}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth select label='Cuenta' size='small' value={codigoCuentaBanco} onChange={event => {
                  setCodigoCuentaBanco(event.target.value === '' ? '' : Number(event.target.value))
                  setSelectedId(null)
                }}>
                  <MenuItem value=''>Todas</MenuItem>
                  {(cuentasQuery.data ?? []).map(cuenta => <MenuItem key={cuenta.codigoCuentaBanco} value={cuenta.codigoCuentaBanco}>{cuenta.noCuenta} - {cuenta.banco}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6} md={1.5}>
                <TextField fullWidth type='date' label='Desde' size='small' InputLabelProps={{ shrink: true }} value={fechaDesde} onChange={event => setFechaDesde(event.target.value)} />
              </Grid>
              <Grid item xs={6} md={1.5}>
                <TextField fullWidth type='date' label='Hasta' size='small' InputLabelProps={{ shrink: true }} value={fechaHasta} onChange={event => setFechaHasta(event.target.value)} />
              </Grid>
              <Grid item xs={12} md={3.5}>
                <TextField fullWidth label='Buscar' size='small' value={searchText} onChange={event => setSearchText(event.target.value)} />
              </Grid>
            </Grid>
            <DataGrid
              autoHeight
              rows={estadosQuery.data ?? []}
              columns={estadoColumns}
              getRowId={row => row.codigoEstadoCuenta}
              loading={estadosQuery.isLoading}
              selectionModel={selectedId === null ? [] : [selectedId]}
              onSelectionModelChange={(selection: GridSelectionModel) => setSelectedId(selection[0] === undefined ? null : Number(selection[0]))}
              disableSelectionOnClick={false}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant='h6'>Movimientos</Typography>
            <Grid container spacing={2} sx={{ maxWidth: 520 }}>
              <Grid item xs={4}>
                <TextField fullWidth select label='Estado' size='small' value={status} onChange={event => setStatus(event.target.value)}>
                  <MenuItem value=''>Todos</MenuItem>
                  <MenuItem value='T'>T</MenuItem>
                  <MenuItem value='C'>C</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={8}>
                <TextField fullWidth label='Buscar' size='small' value={detailSearchText} onChange={event => setDetailSearchText(event.target.value)} />
              </Grid>
            </Grid>
            <Button
              variant='outlined'
              startIcon={<Icon icon='mdi:file-excel-outline' />}
              disabled={(detallesQuery.data ?? []).length === 0}
              onClick={handleExportDetalleExcel}
            >
              Excel
            </Button>
          </CardActions>
          <CardContent>
            <DataGrid
              autoHeight
              rows={detallesQuery.data ?? []}
              columns={detalleColumns}
              getRowId={row => row.codigoDetalleEdoCta}
              loading={detallesQuery.isLoading}
              disableSelectionOnClick
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CntEstadosCuentaList
