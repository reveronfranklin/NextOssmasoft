import { useMemo, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Chip, Grid, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import CntHelpDialog from '../../components/CntHelpDialog'
import { useCntCurrentUserId } from '../../hooks/useCntCurrentUserId'
import { CntConciliacionDto } from '../../interfaces/CntDtos'
import { exportCntRowsToExcel } from '../../utils/cntExcelExport'
import {
  CNT_BANCOS_QUERY_KEY,
  CNT_CONCILIACIONES_QUERY_KEY,
  CNT_CUENTAS_BANCO_QUERY_KEY,
  CNT_PERIODOS_QUERY_KEY,
  CNT_PERMISSION_CONCILIACION_VIEW,
  CNT_PERMISSIONS_QUERY_KEY,
  checkCntPermission,
  createCntConciliacion,
  fetchCntBancos,
  fetchCntConciliaciones,
  fetchCntCuentasBanco,
  fetchCntPeriodos
} from '../../services/cntService'

const estados = [
  { value: '', label: 'Todos' },
  { value: 'ABIERTA', label: 'Abiertas' },
  { value: 'PRECIERRE', label: 'Precierre' },
  { value: 'CERRADA', label: 'Cerradas' }
]

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2
  }).format(Number(value || 0))

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('es-VE') : '')

const CntConciliacionList = () => {
  const router = useRouter()
  const currentUserId = useCntCurrentUserId()
  const [codigoPeriodo, setCodigoPeriodo] = useState<number | ''>('')
  const [codigoBanco, setCodigoBanco] = useState<number | ''>('')
  const [codigoCuentaBanco, setCodigoCuentaBanco] = useState<number | ''>('')
  const [estado, setEstado] = useState('')
  const [searchText, setSearchText] = useState('')

  const permissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CONCILIACION_VIEW, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CONCILIACION_VIEW }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const canView = permissionQuery.data?.hasPermission === true

  const periodosQuery = useQuery({
    queryKey: [CNT_PERIODOS_QUERY_KEY, 'conciliacion'],
    queryFn: () => fetchCntPeriodos(false),
    retry: 1
  })

  const bancosQuery = useQuery({
    queryKey: [CNT_BANCOS_QUERY_KEY, currentUserId],
    queryFn: () => fetchCntBancos(currentUserId),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const cuentasQuery = useQuery({
    queryKey: [CNT_CUENTAS_BANCO_QUERY_KEY, currentUserId, codigoBanco],
    queryFn: () => fetchCntCuentasBanco(currentUserId, codigoBanco === '' ? undefined : Number(codigoBanco), true),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const conciliacionesQuery = useQuery({
    queryKey: [CNT_CONCILIACIONES_QUERY_KEY, currentUserId, codigoPeriodo, codigoBanco, codigoCuentaBanco, estado, searchText],
    queryFn: () =>
      fetchCntConciliaciones({
        usuarioId: currentUserId,
        codigoPeriodo: codigoPeriodo === '' ? null : Number(codigoPeriodo),
        codigoBanco: codigoBanco === '' ? null : Number(codigoBanco),
        codigoCuentaBanco: codigoCuentaBanco === '' ? null : Number(codigoCuentaBanco),
        estado,
        searchText
      }),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const createMutation = useMutation({
    mutationFn: createCntConciliacion,
    onSuccess: async codigoConciliacion => {
      toast.success('Conciliacion lista')
      await conciliacionesQuery.refetch()

      if (codigoConciliacion > 0) {
        router.push(`/apps/cnt/conciliacion/${codigoConciliacion}`)
      }
    },
    onError: error => toast.error((error as Error).message)
  })

  const handleCreate = () => {
    if (codigoPeriodo === '' || codigoCuentaBanco === '') {
      toast.error('Selecciona periodo y cuenta bancaria.')

      return
    }

    createMutation.mutate({
      usuarioId: currentUserId,
      codigoPeriodo: Number(codigoPeriodo),
      codigoCuentaBanco: Number(codigoCuentaBanco)
    })
  }

  const handleExportExcel = () => {
    const rows = (conciliacionesQuery.data ?? []).map(row => ({
      Periodo: row.nombrePeriodo,
      Ano: row.anoPeriodo,
      Numero: row.numeroPeriodo,
      Banco: row.banco,
      Cuenta: row.noCuenta,
      Denominacion: row.denominacionFuncional,
      Estado: row.estado,
      Precierre: formatDate(row.fechaPrecierre),
      Cierre: formatDate(row.fechaCierre),
      SaldoBanco: row.saldoBanco,
      SaldoLibro: row.saldoLibro,
      Diferencia: Number(row.saldoBanco || 0) - Number(row.saldoLibro || 0)
    }))

    exportCntRowsToExcel(rows, 'Conciliaciones', 'CNT-Conciliaciones')
  }

  const columns = useMemo<GridColumns<CntConciliacionDto>>(
    () => [
      { field: 'nombrePeriodo', headerName: 'Periodo', minWidth: 150, flex: 0.8 },
      { field: 'banco', headerName: 'Banco', minWidth: 180, flex: 1 },
      { field: 'noCuenta', headerName: 'Cuenta', minWidth: 160, flex: 0.9 },
      { field: 'denominacionFuncional', headerName: 'Denominacion', minWidth: 180, flex: 1 },
      {
        field: 'estado',
        headerName: 'Estado',
        width: 130,
        renderCell: ({ row }) => (
          <Chip
            size='small'
            label={row.estado}
            color={row.estado === 'CERRADA' ? 'success' : row.estado === 'PRECIERRE' ? 'warning' : 'primary'}
            variant='outlined'
          />
        )
      },
      { field: 'fechaPrecierre', headerName: 'Precierre', width: 120, valueFormatter: params => formatDate(params.value as string) },
      { field: 'fechaCierre', headerName: 'Cierre', width: 120, valueFormatter: params => formatDate(params.value as string) },
      { field: 'saldoBanco', headerName: 'Saldo banco', minWidth: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      { field: 'saldoLibro', headerName: 'Saldo libro', minWidth: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      {
        field: 'diferencia',
        headerName: 'Diferencia',
        minWidth: 150,
        align: 'right',
        headerAlign: 'right',
        valueGetter: params => Number(params.row.saldoBanco || 0) - Number(params.row.saldoLibro || 0),
        valueFormatter: params => formatMoney(params.value as number)
      },
      {
        field: 'actions',
        headerName: '',
        width: 90,
        sortable: false,
        renderCell: ({ row }) => (
          <Tooltip title='Abrir'>
            <IconButton color='primary' size='small' onClick={() => router.push(`/apps/cnt/conciliacion/${row.codigoConciliacion}`)}>
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        )
      }
    ],
    [router]
  )

  const isLoading = permissionQuery.isLoading || conciliacionesQuery.isLoading

  if (currentUserId <= 0 || permissionQuery.isLoading) {
    return <Spinner />
  }

  if (!canView) {
    return <Alert severity='warning'>El usuario no tiene el permiso requerido: {CNT_PERMISSION_CONCILIACION_VIEW}.</Alert>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Alert
          severity='info'
          action={
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Button
                color='inherit'
                size='small'
                startIcon={<Icon icon='mdi:tune-variant' />}
                onClick={() => router.push('/apps/cnt/conciliacion/formatos-banco')}
              >
                Formatos
              </Button>
              <Button
                color='inherit'
                size='small'
                startIcon={<Icon icon='mdi:bank-transfer-in' />}
                onClick={() => router.push('/apps/cnt/conciliacion/carga-banco')}
              >
                Carga banco
              </Button>
            </Box>
          }
        >
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            Flujo de banco: primero se mantienen los formatos en CNT_BANCO_FORMATO, luego se importa el archivo bancario y la revision queda trazada en CNT_BANCO_ARCHIVO_EXTRACCION antes de confirmar movimientos.
          </Typography>
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant='h5'>Conciliacion bancaria</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Consulta de conciliaciones por periodo, banco y cuenta contable asociada.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <CntHelpDialog context='conciliacion' />
                <Button
                  variant='contained'
                  disabled={createMutation.isPending}
                  onClick={handleCreate}
                  startIcon={<Icon icon='mdi:plus' />}
                >
                  Crear/Abrir
                </Button>
                <Tooltip title='Actualizar'>
                  <Button variant='outlined' onClick={() => conciliacionesQuery.refetch()} startIcon={<Icon icon='mdi:refresh' />}>
                    Actualizar
                  </Button>
                </Tooltip>
                <Tooltip title='Exportar Excel'>
                  <span>
                    <Button
                      variant='outlined'
                      disabled={(conciliacionesQuery.data ?? []).length === 0}
                      onClick={handleExportExcel}
                      startIcon={<Icon icon='mdi:file-excel-outline' />}
                    >
                      Excel
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={2.2}>
                <TextField
                  fullWidth
                  select
                  label='Periodo'
                  size='small'
                  value={codigoPeriodo}
                  onChange={event => setCodigoPeriodo(event.target.value === '' ? '' : Number(event.target.value))}
                >
                  <MenuItem value=''>Todos</MenuItem>
                  {(periodosQuery.data ?? []).map(periodo => (
                    <MenuItem key={periodo.codigoPeriodo} value={periodo.codigoPeriodo}>
                      {periodo.nombrePeriodo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <TextField
                  fullWidth
                  select
                  label='Banco'
                  size='small'
                  value={codigoBanco}
                  onChange={event => {
                    setCodigoBanco(event.target.value === '' ? '' : Number(event.target.value))
                    setCodigoCuentaBanco('')
                  }}
                >
                  <MenuItem value=''>Todos</MenuItem>
                  {(bancosQuery.data ?? []).map(banco => (
                    <MenuItem key={banco.codigoBanco} value={banco.codigoBanco}>
                      {banco.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <TextField
                  fullWidth
                  select
                  label='Cuenta'
                  size='small'
                  value={codigoCuentaBanco}
                  onChange={event => setCodigoCuentaBanco(event.target.value === '' ? '' : Number(event.target.value))}
                >
                  <MenuItem value=''>Todas</MenuItem>
                  {(cuentasQuery.data ?? []).map(cuenta => (
                    <MenuItem key={cuenta.codigoCuentaBanco} value={cuenta.codigoCuentaBanco}>
                      {cuenta.noCuenta} - {cuenta.banco}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={1.8}>
                <TextField fullWidth select label='Estado' size='small' value={estado} onChange={event => setEstado(event.target.value)}>
                  {estados.map(item => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3.2}>
                <TextField fullWidth label='Buscar' size='small' value={searchText} onChange={event => setSearchText(event.target.value)} />
              </Grid>
            </Grid>

            <DataGrid
              autoHeight
              rows={conciliacionesQuery.data ?? []}
              columns={columns}
              getRowId={row => row.codigoConciliacion}
              loading={isLoading}
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

export default CntConciliacionList
