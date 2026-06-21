import { useEffect, useMemo, useState } from 'react'
import { Autocomplete, Box, Button, Card, CardActions, CardContent, Grid, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCurrentUserId } from '../hooks/useCntCurrentUserId'
import { CntAuxiliarDto, CntMovimientoAuxiliarDto } from '../interfaces/CntDtos'
import { exportCntRowsToExcel } from '../utils/cntExcelExport'
import {
  CNT_PERIODOS_QUERY_KEY,
  CNT_RPT_MOV_AUX_QUERY_KEY,
  CntMovimientoAuxiliarGetAllResult,
  fetchCntMovimientoAuxiliar,
  fetchCntPeriodos,
  searchCntAuxiliares
} from '../services/cntService'

interface CellType {
  row: CntMovimientoAuxiliarDto
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value ?? 0)

const CntMovimientoAuxiliarReport = () => {
  const router = useRouter()
  const currentUserId = useCntCurrentUserId()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [codigoPeriodo, setCodigoPeriodo] = useState(0)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [auxiliar, setAuxiliar] = useState<CntAuxiliarDto | null>(null)
  const [auxiliarSearch, setAuxiliarSearch] = useState('')

  useEffect(() => {
    if (!router.isReady || typeof router.query.codigoAuxiliar !== 'string') return

    const codigoAuxiliar = Number(router.query.codigoAuxiliar)
    if (!codigoAuxiliar || auxiliar?.codigoAuxiliar === codigoAuxiliar) return

    setAuxiliar({
      codigoAuxiliar,
      codigoMayor: typeof router.query.codigoMayor === 'string' ? Number(router.query.codigoMayor) : 0,
      segmento1: typeof router.query.segmento1 === 'string' ? router.query.segmento1 : '',
      segmento2: typeof router.query.segmento2 === 'string' ? router.query.segmento2 : '',
      denominacion: typeof router.query.denominacion === 'string' ? router.query.denominacion : '',
      descripcion: ''
    })
    setPage(0)
  }, [
    auxiliar?.codigoAuxiliar,
    router.isReady,
    router.query.codigoAuxiliar,
    router.query.codigoMayor,
    router.query.denominacion,
    router.query.segmento1,
    router.query.segmento2
  ])

  const queryPayload = useMemo(
    () => ({
      usuarioId: currentUserId,
      pageSize,
      pageNumber: page + 1,
      searchText,
      codigoPeriodo: codigoPeriodo || undefined,
      codigoAuxiliar: auxiliar?.codigoAuxiliar,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined
    }),
    [auxiliar?.codigoAuxiliar, codigoPeriodo, currentUserId, fechaDesde, fechaHasta, page, pageSize, searchText]
  )

  const query = useQuery<CntMovimientoAuxiliarGetAllResult>({
    queryKey: [CNT_RPT_MOV_AUX_QUERY_KEY, queryPayload],
    queryFn: () => fetchCntMovimientoAuxiliar(queryPayload),
    enabled: currentUserId > 0,
    retry: 1
  })

  const auxiliaresQuery = useQuery({
    queryKey: ['cnt-rpt-mov-auxiliares', auxiliarSearch],
    queryFn: () => searchCntAuxiliares(auxiliarSearch),
    retry: 1
  })
  const periodosQuery = useQuery({
    queryKey: [CNT_PERIODOS_QUERY_KEY, false],
    queryFn: () => fetchCntPeriodos(false),
    retry: 1
  })

  const resetFilters = () => {
    setPage(0)
    setSearchText('')
    setCodigoPeriodo(0)
    setFechaDesde('')
    setFechaHasta('')
    setAuxiliar(null)
    setAuxiliarSearch('')
  }

  const handleExportExcel = () => {
    const rows = (query.data?.data ?? []).map(item => ({
      Cuenta: item.numeroContable,
      Auxiliar: item.nombreAuxiliar,
      Comprobante: item.numeroComprobante,
      Fecha: item.fechaComprobante?.slice(0, 10) ?? '',
      Descripcion: item.descripcion,
      Referencia1: item.referencia1,
      Referencia2: item.referencia2,
      Debe: item.debe,
      Haber: item.haber,
      Empresa: item.codigoEmpresa
    }))

    exportCntRowsToExcel(rows, 'Movimiento auxiliar', 'CNT-Movimiento-Auxiliar')
  }

  const columns: GridColumns<CntMovimientoAuxiliarDto> = [
    { flex: 0.16, field: 'numeroContable', minWidth: 170, headerName: 'Cuenta' },
    { flex: 0.2, field: 'nombreAuxiliar', minWidth: 220, headerName: 'Auxiliar' },
    { flex: 0.13, field: 'numeroComprobante', minWidth: 150, headerName: 'Comprobante' },
    { flex: 0.11, field: 'fechaComprobante', minWidth: 120, headerName: 'Fecha', valueGetter: ({ row }: CellType) => row.fechaComprobante?.slice(0, 10) ?? '' },
    { flex: 0.24, field: 'descripcion', minWidth: 240, headerName: 'Descripcion' },
    { flex: 0.12, field: 'referencia1', minWidth: 140, headerName: 'Referencia 1' },
    { flex: 0.12, field: 'referencia2', minWidth: 140, headerName: 'Referencia 2' },
    { flex: 0.1, field: 'debe', minWidth: 120, headerName: 'Debe', align: 'right', headerAlign: 'right', valueGetter: ({ row }: CellType) => formatMoney(row.debe) },
    { flex: 0.1, field: 'haber', minWidth: 120, headerName: 'Haber', align: 'right', headerAlign: 'right', valueGetter: ({ row }: CellType) => formatMoney(row.haber) }
  ]

  return (
    <Grid item xs={12}>
      <Card>
        <CardActions sx={{ justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title='Recargar'>
              <IconButton color='primary' size='small' onClick={() => query.refetch()}>
                <Icon icon='mdi:refresh' fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Exportar Excel'>
              <span>
                <IconButton color='primary' size='small' disabled={(query.data?.data ?? []).length === 0} onClick={handleExportExcel}>
                  <Icon icon='mdi:file-excel-outline' fontSize={20} />
                </IconButton>
              </span>
            </Tooltip>
            <Typography variant='h6'>Movimiento auxiliar</Typography>
          </Box>
          <TextField
            size='small'
            value={searchText}
            label='Buscar'
            sx={{ minWidth: { xs: '100%', sm: 340 } }}
            onChange={event => {
              setPage(0)
              setSearchText(event.target.value)
            }}
          />
        </CardActions>
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField fullWidth select size='small' label='Periodo' value={codigoPeriodo} onChange={event => { setPage(0); setCodigoPeriodo(Number(event.target.value)) }}>
                <MenuItem value={0}>Todos</MenuItem>
                {(periodosQuery.data ?? []).map(item => <MenuItem key={item.codigoPeriodo} value={item.codigoPeriodo}>{item.nombrePeriodo}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                size='small'
                value={auxiliar}
                options={auxiliaresQuery.data ?? []}
                getOptionLabel={(option: CntAuxiliarDto) => `${option.segmento1} ${option.segmento2} - ${option.denominacion}`}
                onInputChange={(_, value) => setAuxiliarSearch(value)}
                onChange={(_, value) => {
                  setPage(0)
                  setAuxiliar(value)
                }}
                renderInput={params => <TextField {...params} label='Auxiliar' />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth size='small' type='date' label='Desde' InputLabelProps={{ shrink: true }} value={fechaDesde} onChange={event => { setPage(0); setFechaDesde(event.target.value) }} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth size='small' type='date' label='Hasta' InputLabelProps={{ shrink: true }} value={fechaHasta} onChange={event => { setPage(0); setFechaHasta(event.target.value) }} />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant='outlined' onClick={resetFilters}>Limpiar</Button>
            </Grid>
          </Grid>
        </CardContent>
        {query.isLoading ? (
          <Spinner sx={{ height: 450 }} />
        ) : (
          <Box sx={{ height: 560 }}>
            <DataGrid
              getRowId={row => `${row.codigoComprobante ?? 'saldo'}-${row.codigoAuxiliar}-${row.numeroContable}-${row.monto}`}
              columns={columns}
              rows={query.data?.data ?? []}
              rowCount={query.data?.cantidadRegistros ?? 0}
              page={page}
              pageSize={pageSize}
              rowsPerPageOptions={[10, 25, 50]}
              pagination
              paginationMode='server'
              onPageChange={newPage => setPage(newPage)}
              onPageSizeChange={newPageSize => {
                setPageSize(newPageSize)
                setPage(0)
              }}
            />
          </Box>
        )}
        {query.isError && (
          <Typography sx={{ color: 'error.main', px: 4, pb: 4 }} variant='body2'>
            {(query.error as Error).message}
          </Typography>
        )}
      </Card>
    </Grid>
  )
}

export default CntMovimientoAuxiliarReport
