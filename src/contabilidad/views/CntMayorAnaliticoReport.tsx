import { useEffect, useMemo, useState } from 'react'
import { Autocomplete, Box, Button, Card, CardActions, CardContent, Grid, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCurrentUserId } from '../hooks/useCntCurrentUserId'
import { CntAuxiliarDto, CntMayorAnaliticoDto, CntMayorDto } from '../interfaces/CntDtos'
import { exportCntRowsToExcel } from '../utils/cntExcelExport'
import {
  CNT_PERIODOS_QUERY_KEY,
  CNT_RPT_MAYOR_ANALITICO_QUERY_KEY,
  CntMayorAnaliticoGetAllResult,
  fetchCntMayorAnalitico,
  fetchCntPeriodos,
  searchCntAuxiliares,
  searchCntMayores
} from '../services/cntService'

interface CellType {
  row: CntMayorAnaliticoDto
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value ?? 0)

const CntMayorAnaliticoReport = () => {
  const router = useRouter()
  const currentUserId = useCntCurrentUserId()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [codigoPeriodo, setCodigoPeriodo] = useState(0)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [mayor, setMayor] = useState<CntMayorDto | null>(null)
  const [auxiliar, setAuxiliar] = useState<CntAuxiliarDto | null>(null)
  const [mayorSearch, setMayorSearch] = useState('')
  const [auxiliarSearch, setAuxiliarSearch] = useState('')

  useEffect(() => {
    if (!router.isReady || typeof router.query.codigoMayor !== 'string') return

    const codigoMayor = Number(router.query.codigoMayor)
    if (!codigoMayor || mayor?.codigoMayor === codigoMayor) return

    setMayor({
      codigoMayor,
      numeroMayor: typeof router.query.numeroMayor === 'string' ? router.query.numeroMayor : '',
      denominacion: typeof router.query.denominacion === 'string' ? router.query.denominacion : '',
      descripcion: '',
      columnaBalance: ''
    })
    setPage(0)
  }, [mayor?.codigoMayor, router.isReady, router.query.codigoMayor, router.query.denominacion, router.query.numeroMayor])

  const queryPayload = useMemo(
    () => ({
      usuarioId: currentUserId,
      pageSize,
      pageNumber: page + 1,
      searchText,
      codigoPeriodo: codigoPeriodo || undefined,
      codigoMayor: mayor?.codigoMayor,
      codigoAuxiliar: auxiliar?.codigoAuxiliar,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined
    }),
    [auxiliar?.codigoAuxiliar, codigoPeriodo, currentUserId, fechaDesde, fechaHasta, mayor?.codigoMayor, page, pageSize, searchText]
  )

  const query = useQuery<CntMayorAnaliticoGetAllResult>({
    queryKey: [CNT_RPT_MAYOR_ANALITICO_QUERY_KEY, queryPayload],
    queryFn: () => fetchCntMayorAnalitico(queryPayload),
    enabled: currentUserId > 0,
    retry: 1
  })

  const mayoresQuery = useQuery({
    queryKey: ['cnt-rpt-mayores', mayorSearch],
    queryFn: () => searchCntMayores(mayorSearch),
    retry: 1
  })
  const periodosQuery = useQuery({
    queryKey: [CNT_PERIODOS_QUERY_KEY, false],
    queryFn: () => fetchCntPeriodos(false),
    retry: 1
  })
  const auxiliaresQuery = useQuery({
    queryKey: ['cnt-rpt-auxiliares', auxiliarSearch, mayor?.codigoMayor],
    queryFn: () => searchCntAuxiliares(auxiliarSearch, mayor?.codigoMayor),
    retry: 1
  })

  const resetFilters = () => {
    setPage(0)
    setSearchText('')
    setCodigoPeriodo(0)
    setFechaDesde('')
    setFechaHasta('')
    setMayor(null)
    setAuxiliar(null)
    setMayorSearch('')
    setAuxiliarSearch('')
  }

  const handleExportExcel = () => {
    const rows = (query.data?.data ?? []).map(item => ({
      Cuenta: item.codigoCuenta,
      Denominacion: item.denominacionCuenta,
      Comprobante: item.numeroComprobante,
      Fecha: item.fechaComprobante?.slice(0, 10) ?? '',
      Descripcion: item.descripcion,
      Referencia1: item.referencia1,
      Referencia2: item.referencia2,
      Debe: item.debe,
      Haber: item.haber,
      Empresa: item.codigoEmpresa
    }))

    exportCntRowsToExcel(rows, 'Mayor analitico', 'CNT-Mayor-Analitico')
  }

  const columns: GridColumns<CntMayorAnaliticoDto> = [
    { flex: 0.14, field: 'codigoCuenta', minWidth: 160, headerName: 'Cuenta' },
    { flex: 0.2, field: 'denominacionCuenta', minWidth: 220, headerName: 'Denominacion' },
    { flex: 0.13, field: 'numeroComprobante', minWidth: 150, headerName: 'Comprobante' },
    { flex: 0.11, field: 'fechaComprobante', minWidth: 120, headerName: 'Fecha', valueGetter: ({ row }: CellType) => row.fechaComprobante?.slice(0, 10) ?? '' },
    { flex: 0.22, field: 'descripcion', minWidth: 240, headerName: 'Descripcion' },
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
            <Typography variant='h6'>Mayor analitico</Typography>
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
                value={mayor}
                options={mayoresQuery.data ?? []}
                getOptionLabel={(option: CntMayorDto) => `${option.numeroMayor} - ${option.denominacion}`}
                onInputChange={(_, value) => setMayorSearch(value)}
                onChange={(_, value) => {
                  setPage(0)
                  setMayor(value)
                  setAuxiliar(null)
                }}
                renderInput={params => <TextField {...params} label='Mayor' />}
              />
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
            <Grid item xs={12} sm={6} md={1.5}>
              <TextField fullWidth size='small' type='date' label='Desde' InputLabelProps={{ shrink: true }} value={fechaDesde} onChange={event => { setPage(0); setFechaDesde(event.target.value) }} />
            </Grid>
            <Grid item xs={12} sm={6} md={1.5}>
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
              getRowId={row => `${row.codigoComprobante ?? 'saldo'}-${row.codigoMayor}-${row.codigoAuxiliar}-${row.codigoCuenta}-${row.monto}`}
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

export default CntMayorAnaliticoReport
