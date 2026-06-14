import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Chip, Grid, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCurrentUserId } from '../hooks/useCntCurrentUserId'
import { CntComprobanteDto } from '../interfaces/CntDtos'
import {
  CNT_CATALOGS_QUERY_KEY,
  CNT_COMPROBANTES_QUERY_KEY,
  CNT_PERIODOS_QUERY_KEY,
  CntComprobanteGetAllResult,
  fetchCntCatalog,
  fetchCntComprobantes,
  fetchCntPeriodos
} from '../services/cntService'

interface CellType {
  row: CntComprobanteDto
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value ?? 0)

const FILTERS_STORAGE_KEY = 'cnt.comprobantes.filters'

interface StoredFilters {
  pageSize?: number
  searchText?: string
  codigoPeriodo?: number
  origenId?: number
  fechaDesde?: string
  fechaHasta?: string
  tipoRegistro?: string
}

const getStoredFilters = (): StoredFilters => {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const rawFilters = window.localStorage.getItem(FILTERS_STORAGE_KEY)

    return rawFilters ? JSON.parse(rawFilters) as StoredFilters : {}
  } catch {
    return {}
  }
}

const CntComprobanteList = () => {
  const router = useRouter()
  const currentUserId = useCntCurrentUserId()
  const storedFilters = useMemo(() => getStoredFilters(), [])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(storedFilters.pageSize || 10)
  const [searchText, setSearchText] = useState(storedFilters.searchText || '')
  const [codigoPeriodo, setCodigoPeriodo] = useState(storedFilters.codigoPeriodo || 0)
  const [origenId, setOrigenId] = useState(storedFilters.origenId || 0)
  const [fechaDesde, setFechaDesde] = useState(storedFilters.fechaDesde || '')
  const [fechaHasta, setFechaHasta] = useState(storedFilters.fechaHasta || '')
  const [tipoRegistro, setTipoRegistro] = useState(storedFilters.tipoRegistro || '')

  const periodosQuery = useQuery({
    queryKey: [CNT_PERIODOS_QUERY_KEY],
    queryFn: () => fetchCntPeriodos(false),
    retry: 1
  })

  const origenesQuery = useQuery({
    queryKey: [CNT_CATALOGS_QUERY_KEY, 'origenes-comprobante'],
    queryFn: () => fetchCntCatalog('origenes-comprobante'),
    retry: 1
  })

  const selectedPeriodo = useMemo(
    () => (periodosQuery.data ?? []).find(item => item.codigoPeriodo === codigoPeriodo),
    [codigoPeriodo, periodosQuery.data]
  )
  const periodoDesde = selectedPeriodo?.fechaDesde?.slice(0, 10) ?? ''
  const periodoHasta = selectedPeriodo?.fechaHasta?.slice(0, 10) ?? ''
  const dateError = selectedPeriodo && (fechaDesde < periodoDesde || fechaHasta > periodoHasta || fechaDesde > fechaHasta)
    ? 'Las fechas deben estar dentro del periodo seleccionado.'
    : ''

  const queryPayload = useMemo(
    () => ({
      usuarioId: currentUserId,
      pageSize,
      pageNumber: page + 1,
      searchText,
      codigoPeriodo: codigoPeriodo || undefined,
      origenId: origenId || undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
      esAutomatico: tipoRegistro === 'automatico' ? true : tipoRegistro === 'manual' ? false : null
    }),
    [codigoPeriodo, currentUserId, fechaDesde, fechaHasta, origenId, page, pageSize, searchText, tipoRegistro]
  )

  const query = useQuery<CntComprobanteGetAllResult>({
    queryKey: [CNT_COMPROBANTES_QUERY_KEY, queryPayload],
    queryFn: () => fetchCntComprobantes(queryPayload),
    enabled: currentUserId > 0 && !dateError,
    retry: 1
  })

  useEffect(() => {
    const filters: StoredFilters = {
      pageSize,
      searchText,
      codigoPeriodo,
      origenId,
      fechaDesde,
      fechaHasta,
      tipoRegistro
    }

    window.localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters))
  }, [codigoPeriodo, fechaDesde, fechaHasta, origenId, pageSize, searchText, tipoRegistro])

  const resetFilters = () => {
    setPage(0)
    setSearchText('')
    setCodigoPeriodo(0)
    setOrigenId(0)
    setFechaDesde('')
    setFechaHasta('')
    setTipoRegistro('')
  }

  const handlePeriodoChange = (codigo: number) => {
    setPage(0)
    setCodigoPeriodo(codigo)

    const periodo = (periodosQuery.data ?? []).find(item => item.codigoPeriodo === codigo)
    if (periodo) {
      setFechaDesde(periodo.fechaDesde.slice(0, 10))
      setFechaHasta(periodo.fechaHasta.slice(0, 10))
    } else {
      setFechaDesde('')
      setFechaHasta('')
    }
  }

  const columns: GridColumns<CntComprobanteDto> = [
    { flex: 0.14, field: 'numeroComprobante', minWidth: 150, headerName: 'Comprobante' },
    { flex: 0.12, field: 'fechaComprobante', minWidth: 130, headerName: 'Fecha', valueGetter: ({ row }: CellType) => row.fechaComprobante?.slice(0, 10) },
    { flex: 0.16, field: 'tipoComprobante', minWidth: 160, headerName: 'Tipo' },
    { flex: 0.16, field: 'origen', minWidth: 160, headerName: 'Origen' },
    { flex: 0.24, field: 'observacion', minWidth: 220, headerName: 'Observacion' },
    {
      flex: 0.1,
      field: 'totalDebe',
      minWidth: 120,
      headerName: 'Debe',
      align: 'right',
      headerAlign: 'right',
      valueGetter: ({ row }: CellType) => formatMoney(row.totalDebe)
    },
    {
      flex: 0.1,
      field: 'totalHaber',
      minWidth: 120,
      headerName: 'Haber',
      align: 'right',
      headerAlign: 'right',
      valueGetter: ({ row }: CellType) => formatMoney(row.totalHaber)
    },
    {
      flex: 0.1,
      field: 'diferencia',
      minWidth: 120,
      headerName: 'Dif.',
      renderCell: ({ row }: CellType) => (
        <Chip size='small' label={formatMoney(row.diferencia)} color={Math.abs(row.diferencia) < 0.01 ? 'success' : 'error'} />
      )
    },
    {
      flex: 0.08,
      field: 'actions',
      minWidth: 150,
      headerName: '',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title='Abrir'>
            <IconButton color='primary' size='small' onClick={() => router.push(`/apps/cnt/comprobantes/${row.codigoComprobante}`)}>
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Imprimir'>
            <IconButton color='primary' size='small' onClick={() => router.push(`/apps/cnt/comprobantes/imprimir/${row.codigoComprobante}`)}>
              <Icon icon='mdi:printer-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Ver PDF'>
            <IconButton color='primary' size='small' onClick={() => router.push(`/apps/cnt/comprobantes/pdf/${row.codigoComprobante}`)}>
              <Icon icon='mdi:file-pdf-box' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Grid item xs={12}>
      <Card>
        <CardActions sx={{ justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title='Nuevo comprobante'>
              <IconButton color='primary' size='small' onClick={() => router.push('/apps/cnt/comprobantes/nuevo')}>
                <Icon icon='mdi:plus' fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Recargar'>
              <IconButton color='primary' size='small' onClick={() => query.refetch()}>
                <Icon icon='mdi:refresh' fontSize={20} />
              </IconButton>
            </Tooltip>
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
        {query.isLoading ? (
          <Spinner sx={{ height: 450 }} />
        ) : (
          <>
            <CardContent sx={{ pt: 0 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField fullWidth select size='small' label='Periodo' value={codigoPeriodo} onChange={event => handlePeriodoChange(Number(event.target.value))}>
                    <MenuItem value={0}>Todos</MenuItem>
                    {(periodosQuery.data ?? []).map(item => <MenuItem key={item.codigoPeriodo} value={item.codigoPeriodo}>{item.nombrePeriodo}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField fullWidth select size='small' label='Origen' value={origenId} onChange={event => { setPage(0); setOrigenId(Number(event.target.value)) }}>
                    <MenuItem value={0}>Todos</MenuItem>
                    {(origenesQuery.data ?? []).map(item => <MenuItem key={item.id} value={item.id}>{item.descripcion}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField fullWidth select size='small' label='Registro' value={tipoRegistro} onChange={event => { setPage(0); setTipoRegistro(event.target.value) }}>
                    <MenuItem value=''>Todos</MenuItem>
                    <MenuItem value='automatico'>Automatico</MenuItem>
                    <MenuItem value='manual'>Manual</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button fullWidth variant='outlined' onClick={resetFilters}>Limpiar</Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField fullWidth disabled={!selectedPeriodo} size='small' type='date' label='Desde' InputLabelProps={{ shrink: true }} inputProps={{ min: periodoDesde || undefined, max: periodoHasta || undefined }} value={fechaDesde} onChange={event => { setPage(0); setFechaDesde(event.target.value) }} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField fullWidth disabled={!selectedPeriodo} size='small' type='date' label='Hasta' InputLabelProps={{ shrink: true }} inputProps={{ min: periodoDesde || undefined, max: periodoHasta || undefined }} value={fechaHasta} onChange={event => { setPage(0); setFechaHasta(event.target.value) }} />
                </Grid>
              </Grid>
              {dateError && (
                <Typography sx={{ color: 'warning.main', mt: 2 }} variant='body2'>
                  {dateError}
                </Typography>
              )}
            </CardContent>
            <Box sx={{ height: 560 }}>
              <DataGrid
                getRowId={row => row.codigoComprobante}
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
          </>
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

export default CntComprobanteList
