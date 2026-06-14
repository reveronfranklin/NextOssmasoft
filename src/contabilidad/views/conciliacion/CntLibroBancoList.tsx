import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Grid, MenuItem, TextField, Typography } from '@mui/material'
import { DataGrid, GridColumns, GridSelectionModel } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import CntHelpDialog from '../../components/CntHelpDialog'
import { useCntCurrentUserId } from '../../hooks/useCntCurrentUserId'
import { CntLibroBancoDetalleDto, CntLibroBancoDto } from '../../interfaces/CntDtos'
import { exportCntRowsToExcel } from '../../utils/cntExcelExport'
import {
  CNT_BANCOS_QUERY_KEY,
  CNT_CUENTAS_BANCO_QUERY_KEY,
  CNT_LIBRO_BANCO_QUERY_KEY,
  CNT_PERMISSION_CONCILIACION_ADMIN,
  CNT_PERMISSION_CONCILIACION_VIEW,
  CNT_PERMISSIONS_QUERY_KEY,
  checkCntPermission,
  fetchCntBancos,
  fetchCntCuentasBanco,
  fetchCntLibroBancoDetalles,
  fetchCntLibrosBanco,
  generateCntLibroBanco
} from '../../services/cntService'

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2
  }).format(Number(value || 0))

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('es-VE') : '')

const CntLibroBancoList = () => {
  const currentUserId = useCntCurrentUserId()
  const [codigoBanco, setCodigoBanco] = useState<number | ''>('')
  const [codigoCuentaBanco, setCodigoCuentaBanco] = useState<number | ''>('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [status, setStatus] = useState('')
  const [searchText, setSearchText] = useState('')
  const [detailSearchText, setDetailSearchText] = useState('')
  const [detailStatus, setDetailStatus] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const permissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CONCILIACION_VIEW, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CONCILIACION_VIEW }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const canView = permissionQuery.data?.hasPermission === true

  const adminPermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CONCILIACION_ADMIN, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CONCILIACION_ADMIN }),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const canGenerate = adminPermissionQuery.data?.hasPermission === true

  const bancosQuery = useQuery({
    queryKey: [CNT_BANCOS_QUERY_KEY, currentUserId, 'libro'],
    queryFn: () => fetchCntBancos(currentUserId),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const cuentasQuery = useQuery({
    queryKey: [CNT_CUENTAS_BANCO_QUERY_KEY, currentUserId, codigoBanco, 'libro'],
    queryFn: () => fetchCntCuentasBanco(currentUserId, codigoBanco === '' ? undefined : Number(codigoBanco), true),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const librosQuery = useQuery({
    queryKey: [CNT_LIBRO_BANCO_QUERY_KEY, currentUserId, codigoBanco, codigoCuentaBanco, fechaDesde, fechaHasta, status, searchText],
    queryFn: () =>
      fetchCntLibrosBanco({
        usuarioId: currentUserId,
        codigoBanco: codigoBanco === '' ? null : Number(codigoBanco),
        codigoCuentaBanco: codigoCuentaBanco === '' ? null : Number(codigoCuentaBanco),
        fechaDesde: fechaDesde || null,
        fechaHasta: fechaHasta || null,
        status,
        searchText
      }),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const detallesQuery = useQuery({
    queryKey: [CNT_LIBRO_BANCO_QUERY_KEY, 'detalle', currentUserId, selectedId, detailStatus, detailSearchText],
    queryFn: () =>
      fetchCntLibroBancoDetalles({
        usuarioId: currentUserId,
        codigoLibro: selectedId ?? 0,
        status: detailStatus,
        searchText: detailSearchText
      }),
    enabled: currentUserId > 0 && canView && selectedId !== null,
    retry: 1
  })

  const generateMutation = useMutation({
    mutationFn: generateCntLibroBanco,
    onSuccess: async result => {
      toast.success(`Libro generado: ${result?.cantidadMovimientos ?? 0} movimientos`)
      setSelectedId(null)
      await librosQuery.refetch()
    },
    onError: error => toast.error((error as Error).message)
  })

  useEffect(() => {
    if (selectedId === null && (librosQuery.data?.length ?? 0) > 0) {
      setSelectedId(librosQuery.data?.[0].codigoLibro ?? null)
    }
  }, [librosQuery.data, selectedId])

  const libroColumns = useMemo<GridColumns<CntLibroBancoDto>>(
    () => [
      { field: 'fechaLibro', headerName: 'Fecha', width: 120, valueFormatter: params => formatDate(params.value as string) },
      { field: 'banco', headerName: 'Banco', minWidth: 170, flex: 0.8 },
      { field: 'noCuenta', headerName: 'Cuenta', minWidth: 160, flex: 0.8 },
      { field: 'cantidadMovimientos', headerName: 'Mov.', width: 90, align: 'right', headerAlign: 'right' },
      { field: 'montoMovimientos', headerName: 'Monto', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      { field: 'status', headerName: 'Estado', width: 110, renderCell: ({ row }) => <Chip size='small' label={row.status || '-'} variant='outlined' /> }
    ],
    []
  )

  const detalleColumns = useMemo<GridColumns<CntLibroBancoDetalleDto>>(
    () => [
      { field: 'tipoDocumento', headerName: 'Tipo', width: 140 },
      { field: 'numeroDocumento', headerName: 'Documento', width: 140 },
      { field: 'descripcion', headerName: 'Descripcion', minWidth: 260, flex: 1 },
      { field: 'monto', headerName: 'Monto', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      { field: 'codigoCheque', headerName: 'Cheque', width: 100 },
      { field: 'origenId', headerName: 'Origen', width: 100 },
      { field: 'status', headerName: 'Estado', width: 100, renderCell: ({ row }) => <Chip size='small' label={row.status || '-'} variant='outlined' /> }
    ],
    []
  )

  const handleGenerate = () => {
    if (codigoCuentaBanco === '') {
      toast.error('Seleccione una cuenta bancaria.')

      return
    }

    if (!fechaDesde || !fechaHasta) {
      toast.error('Indique el rango de fechas.')

      return
    }

    generateMutation.mutate({
      usuarioId: currentUserId,
      codigoCuentaBanco: Number(codigoCuentaBanco),
      fechaDesde,
      fechaHasta
    })
  }

  const handleExportLibrosExcel = () => {
    const rows = (librosQuery.data ?? []).map(row => ({
      Fecha: formatDate(row.fechaLibro),
      Banco: row.banco,
      Cuenta: row.noCuenta,
      Movimientos: row.cantidadMovimientos,
      Monto: row.montoMovimientos,
      Estado: row.status
    }))

    exportCntRowsToExcel(rows, 'Libro banco', 'CNT-Libro-Banco')
  }

  const handleExportDetalleExcel = () => {
    const rows = (detallesQuery.data ?? []).map(row => ({
      Tipo: row.tipoDocumento,
      Documento: row.numeroDocumento,
      Descripcion: row.descripcion,
      Monto: row.monto,
      Cheque: row.codigoCheque ?? '',
      Identificador: row.codigoIdentificador ?? '',
      Origen: row.origenId ?? '',
      Estado: row.status
    }))

    exportCntRowsToExcel(rows, 'Detalle libro', 'CNT-Libro-Banco-Detalle')
  }

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
              <Typography variant='h5'>Libro banco</Typography>
              <Typography variant='body2' color='text.secondary'>Consulta de movimientos contables bancarios.</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <CntHelpDialog context='libro-banco' />
              {canGenerate && (
                <Button variant='contained' startIcon={<Icon icon='mdi:bank-transfer-in' />} disabled={generateMutation.isPending} onClick={handleGenerate}>
                  Generar
                </Button>
              )}
              <Button variant='outlined' startIcon={<Icon icon='mdi:refresh' />} onClick={() => librosQuery.refetch()}>
                Actualizar
              </Button>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:file-excel-outline' />}
                disabled={(librosQuery.data ?? []).length === 0}
                onClick={handleExportLibrosExcel}
              >
                Excel
              </Button>
            </Box>
          </CardActions>
          <CardContent>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={2.4}>
                <TextField fullWidth select label='Banco' size='small' value={codigoBanco} onChange={event => {
                  setCodigoBanco(event.target.value === '' ? '' : Number(event.target.value))
                  setCodigoCuentaBanco('')
                  setSelectedId(null)
                }}>
                  <MenuItem value=''>Todos</MenuItem>
                  {(bancosQuery.data ?? []).map(banco => <MenuItem key={banco.codigoBanco} value={banco.codigoBanco}>{banco.nombre}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={2.8}>
                <TextField fullWidth select label='Cuenta' size='small' value={codigoCuentaBanco} onChange={event => {
                  setCodigoCuentaBanco(event.target.value === '' ? '' : Number(event.target.value))
                  setSelectedId(null)
                }}>
                  <MenuItem value=''>Todas</MenuItem>
                  {(cuentasQuery.data ?? []).map(cuenta => <MenuItem key={cuenta.codigoCuentaBanco} value={cuenta.codigoCuentaBanco}>{cuenta.noCuenta} - {cuenta.banco}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6} md={1.4}>
                <TextField fullWidth type='date' label='Desde' size='small' InputLabelProps={{ shrink: true }} value={fechaDesde} onChange={event => setFechaDesde(event.target.value)} />
              </Grid>
              <Grid item xs={6} md={1.4}>
                <TextField fullWidth type='date' label='Hasta' size='small' InputLabelProps={{ shrink: true }} value={fechaHasta} onChange={event => setFechaHasta(event.target.value)} />
              </Grid>
              <Grid item xs={12} md={1.4}>
                <TextField fullWidth select label='Estado' size='small' value={status} onChange={event => setStatus(event.target.value)}>
                  <MenuItem value=''>Todos</MenuItem>
                  <MenuItem value='A'>A</MenuItem>
                  <MenuItem value='C'>C</MenuItem>
                  <MenuItem value='T'>T</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={2.6}>
                <TextField fullWidth label='Buscar' size='small' value={searchText} onChange={event => setSearchText(event.target.value)} />
              </Grid>
            </Grid>
            <DataGrid
              autoHeight
              rows={librosQuery.data ?? []}
              columns={libroColumns}
              getRowId={row => row.codigoLibro}
              loading={librosQuery.isLoading}
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
            <Typography variant='h6'>Detalle libro</Typography>
            <Grid container spacing={2} sx={{ maxWidth: 520 }}>
              <Grid item xs={4}>
                <TextField fullWidth select label='Estado' size='small' value={detailStatus} onChange={event => setDetailStatus(event.target.value)}>
                  <MenuItem value=''>Todos</MenuItem>
                  <MenuItem value='A'>A</MenuItem>
                  <MenuItem value='C'>C</MenuItem>
                  <MenuItem value='T'>T</MenuItem>
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
              getRowId={row => row.codigoDetalleLibro}
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

export default CntLibroBancoList
