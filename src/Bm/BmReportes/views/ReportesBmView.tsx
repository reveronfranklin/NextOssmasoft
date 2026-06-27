import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { BmRow } from 'src/interfaces/Bm/bienes-municipales'
import { bienesMunicipalesEndpoints, bmPost, bmPostExcel, bmPostPdf } from 'src/Bm/services/bienesMunicipales.service'

type ReporteKey =
  | 'placa'
  | 'lote'
  | 'ficha'
  | 'ubicacion'
  | 'movimientos'
  | 'movimientosFiltro'
  | 'solicitudes'
  | 'procesosMasivos'
  | 'conteoDiferencias'
  | 'conteoHistorico'
type RowWithId = BmRow & { id: number }

const reportes = [
  { key: 'placa', label: 'Por placa' },
  { key: 'lote', label: 'Bienes por lote' },
  { key: 'ficha', label: 'Ficha del bien' },
  { key: 'ubicacion', label: 'Por ubicacion' },
  { key: 'movimientos', label: 'Movimientos' },
  { key: 'movimientosFiltro', label: 'Movimientos por filtro' },
  { key: 'solicitudes', label: 'Solicitudes' },
  { key: 'procesosMasivos', label: 'Procesos masivos' },
  { key: 'conteoDiferencias', label: 'Diferencias de conteo' },
  { key: 'conteoHistorico', label: 'Historico de conteos' }
] as const

const columns: GridColumns<RowWithId> = [
  { field: 'codigoBien', headerName: 'Bien', width: 100, type: 'number' },
  { field: 'numeroPlaca', headerName: 'Placa', minWidth: 130 },
  { field: 'numeroLote', headerName: 'Lote', minWidth: 120 },
  { field: 'articulo', headerName: 'Articulo', minWidth: 180, flex: 1 },
  { field: 'especificacion', headerName: 'Especificacion', minWidth: 220, flex: 1 },
  { field: 'seccion', headerName: 'Seccion', minWidth: 120 },
  { field: 'referencia', headerName: 'Referencia', minWidth: 150 },
  { field: 'descripcion', headerName: 'Descripcion', minWidth: 220, flex: 1 },
  { field: 'tipoMovimiento', headerName: 'Mov.', width: 90 },
  { field: 'tipoMovimientoDescripcion', headerName: 'Movimiento', minWidth: 160 },
  { field: 'fechaMovimientoString', headerName: 'Fecha', width: 120 },
  { field: 'fecha', headerName: 'Fecha ref.', width: 120 },
  { field: 'codigoIcp', headerName: 'ICP', width: 110 },
  { field: 'unidadEjecutora', headerName: 'Unidad', minWidth: 220, flex: 1 },
  { field: 'unidad', headerName: 'Unidad ref.', minWidth: 180 },
  { field: 'responsableBien', headerName: 'Responsable', minWidth: 190 },
  { field: 'estadoOperativo', headerName: 'Estado', minWidth: 130 },
  { field: 'numeroSolicitud', headerName: 'Solicitud', minWidth: 130 },
  { field: 'aprobado', headerName: 'Aprobado', width: 110, type: 'boolean' },
  { field: 'conceptoMovimiento', headerName: 'Concepto', minWidth: 180 },
  { field: 'notaIncidencia', headerName: 'Nota', minWidth: 180 },
  { field: 'codigoProcesoMasivo', headerName: 'Proceso', width: 110, type: 'number' },
  { field: 'estado', headerName: 'Estado proc.', minWidth: 120 },
  { field: 'mensaje', headerName: 'Mensaje', minWidth: 220, flex: 1 },
  { field: 'totalDiferencia', headerName: 'Diferencia', width: 120, type: 'number' }
]

const endpointMap: Record<ReporteKey, { data: string; pdf: string; excel: string; file: string }> = {
  placa: {
    data: bienesMunicipalesEndpoints.reportes.placa,
    pdf: bienesMunicipalesEndpoints.reportes.placaPdf,
    excel: bienesMunicipalesEndpoints.reportes.placaExcel,
    file: 'bm-reporte-placa.xlsx'
  },
  lote: {
    data: bienesMunicipalesEndpoints.reportes.lote,
    pdf: bienesMunicipalesEndpoints.reportes.lotePdf,
    excel: bienesMunicipalesEndpoints.reportes.loteExcel,
    file: 'bm-reporte-lote.xlsx'
  },
  ficha: {
    data: bienesMunicipalesEndpoints.reportes.ficha,
    pdf: bienesMunicipalesEndpoints.reportes.fichaPdf,
    excel: bienesMunicipalesEndpoints.reportes.fichaExcel,
    file: 'bm-reporte-ficha.xlsx'
  },
  ubicacion: {
    data: bienesMunicipalesEndpoints.reportes.ubicacion,
    pdf: bienesMunicipalesEndpoints.reportes.ubicacionPdf,
    excel: bienesMunicipalesEndpoints.reportes.ubicacionExcel,
    file: 'bm-reporte-ubicacion.xlsx'
  },
  movimientos: {
    data: bienesMunicipalesEndpoints.reportes.movimientos,
    pdf: bienesMunicipalesEndpoints.reportes.movimientosPdf,
    excel: bienesMunicipalesEndpoints.reportes.movimientosExcel,
    file: 'bm-reporte-movimientos.xlsx'
  },
  movimientosFiltro: {
    data: bienesMunicipalesEndpoints.reportes.movimientosFiltro,
    pdf: bienesMunicipalesEndpoints.reportes.movimientosFiltroPdf,
    excel: bienesMunicipalesEndpoints.reportes.movimientosFiltroExcel,
    file: 'bm-reporte-movimientos-filtro.xlsx'
  },
  solicitudes: {
    data: bienesMunicipalesEndpoints.reportes.solicitudes,
    pdf: bienesMunicipalesEndpoints.reportes.solicitudesPdf,
    excel: bienesMunicipalesEndpoints.reportes.solicitudesExcel,
    file: 'bm-reporte-solicitudes.xlsx'
  },
  procesosMasivos: {
    data: bienesMunicipalesEndpoints.reportes.procesosMasivos,
    pdf: bienesMunicipalesEndpoints.reportes.procesosMasivosPdf,
    excel: bienesMunicipalesEndpoints.reportes.procesosMasivosExcel,
    file: 'bm-reporte-procesos-masivos.xlsx'
  },
  conteoDiferencias: {
    data: bienesMunicipalesEndpoints.reportes.conteoDiferencias,
    pdf: bienesMunicipalesEndpoints.reportes.conteoDiferenciasPdf,
    excel: bienesMunicipalesEndpoints.reportes.conteoDiferenciasExcel,
    file: 'bm-reporte-conteo-diferencias.xlsx'
  },
  conteoHistorico: {
    data: bienesMunicipalesEndpoints.reportes.conteoHistorico,
    pdf: bienesMunicipalesEndpoints.reportes.conteoHistoricoPdf,
    excel: bienesMunicipalesEndpoints.reportes.conteoHistoricoExcel,
    file: 'bm-reporte-conteo-historico.xlsx'
  }
}

const ReportesBmView = () => {
  const [reporte, setReporte] = useState<ReporteKey>('placa')
  const [numeroPlaca, setNumeroPlaca] = useState('')
  const [numeroLote, setNumeroLote] = useState('')
  const [codigoIcp, setCodigoIcp] = useState('0')
  const [codigoBien, setCodigoBien] = useState('0')
  const [codigoBmConteo, setCodigoBmConteo] = useState('0')
  const [codigoProcesoMasivo, setCodigoProcesoMasivo] = useState('0')
  const [tipoMovimiento, setTipoMovimiento] = useState('')
  const [aprobado, setAprobado] = useState('-1')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [rows, setRows] = useState<RowWithId[]>([])
  const [pdfUrl, setPdfUrl] = useState('')
  const [loadingData, setLoadingData] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [message, setMessage] = useState('')

  const payload = useMemo(() => {
    if (reporte === 'placa') return { numeroPlaca }
    if (reporte === 'lote') return { numeroLote }
    if (reporte === 'ficha') return { numeroPlaca }
    if (reporte === 'ubicacion') return { codigoIcp: Number(codigoIcp) || 0 }
    if (reporte === 'movimientos') return { codigoBien: Number(codigoBien) || 0 }
    if (reporte === 'movimientosFiltro') {
      return {
        tipoMovimiento,
        fechaDesde: fechaDesde || null,
        fechaHasta: fechaHasta || null,
        codigoIcp: Number(codigoIcp) || 0
      }
    }
    if (reporte === 'solicitudes') {
      return {
        aprobado: Number(aprobado),
        tipoMovimiento,
        fechaDesde: fechaDesde || null,
        fechaHasta: fechaHasta || null
      }
    }
    if (reporte === 'procesosMasivos') {
      return {
        codigoProcesoMasivo: Number(codigoProcesoMasivo) || 0,
        fechaDesde: fechaDesde || null,
        fechaHasta: fechaHasta || null
      }
    }
    if (reporte === 'conteoDiferencias') return { codigoBmConteo: Number(codigoBmConteo) || 0 }

    return { fechaDesde: fechaDesde || null, fechaHasta: fechaHasta || null }
  }, [
    aprobado,
    codigoBien,
    codigoBmConteo,
    codigoIcp,
    codigoProcesoMasivo,
    fechaDesde,
    fechaHasta,
    numeroLote,
    numeroPlaca,
    reporte,
    tipoMovimiento
  ])

  const clearPdf = useCallback(() => {
    setPdfUrl(previousUrl => {
      if (previousUrl) URL.revokeObjectURL(previousUrl)

      return ''
    })
  }, [])

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [pdfUrl])

  const handleData = async () => {
    try {
      setLoadingData(true)
      setMessage('')
      clearPdf()
      const data = await bmPost<BmRow[], unknown>(endpointMap[reporte].data, payload, [])
      setRows(data.map((item, index) => ({ ...item, id: index + 1 })))
    } catch (error) {
      setRows([])
      setMessage(error instanceof Error ? error.message : 'No se pudo consultar el reporte')
    } finally {
      setLoadingData(false)
    }
  }

  const handlePdf = async () => {
    try {
      setLoadingPdf(true)
      setMessage('')
      const url = await bmPostPdf(endpointMap[reporte].pdf, payload)
      setPdfUrl(previousUrl => {
        if (previousUrl) URL.revokeObjectURL(previousUrl)

        return url
      })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo generar el PDF')
    } finally {
      setLoadingPdf(false)
    }
  }

  const handleExcel = async () => {
    try {
      setLoadingExcel(true)
      setMessage('')
      await bmPostExcel(endpointMap[reporte].excel, payload, endpointMap[reporte].file)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo descargar el Excel')
    } finally {
      setLoadingExcel(false)
    }
  }

  const isBusy = loadingData || loadingPdf || loadingExcel

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Reportes Bienes Municipales' />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Reporte'
                  value={reporte}
                  onChange={event => {
                    setReporte(event.target.value as ReporteKey)
                    clearPdf()
                  }}
                >
                  {reportes.map(item => (
                    <MenuItem key={item.key} value={item.key}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {reporte === 'placa' || reporte === 'ficha' ? (
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Numero placa'
                    value={numeroPlaca}
                    onChange={event => setNumeroPlaca(event.target.value)}
                  />
                </Grid>
              ) : null}
              {reporte === 'lote' ? (
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Numero lote'
                    value={numeroLote}
                    onChange={event => setNumeroLote(event.target.value)}
                  />
                </Grid>
              ) : null}
              {reporte === 'ubicacion' ? (
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Codigo ICP'
                    value={codigoIcp}
                    onChange={event => setCodigoIcp(event.target.value)}
                  />
                </Grid>
              ) : null}
              {reporte === 'movimientos' ? (
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Codigo bien'
                    value={codigoBien}
                    onChange={event => setCodigoBien(event.target.value)}
                  />
                </Grid>
              ) : null}
              {reporte === 'movimientosFiltro' || reporte === 'solicitudes' ? (
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    label='Tipo movimiento'
                    value={tipoMovimiento}
                    onChange={event => setTipoMovimiento(event.target.value)}
                  >
                    <MenuItem value=''>Todos</MenuItem>
                    <MenuItem value='I'>Incorporacion</MenuItem>
                    <MenuItem value='T'>Traslado</MenuItem>
                    <MenuItem value='D'>Desincorporacion</MenuItem>
                    <MenuItem value='E'>Egreso</MenuItem>
                  </TextField>
                </Grid>
              ) : null}
              {reporte === 'movimientosFiltro' ? (
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Codigo ICP'
                    value={codigoIcp}
                    onChange={event => setCodigoIcp(event.target.value)}
                  />
                </Grid>
              ) : null}
              {reporte === 'solicitudes' ? (
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    label='Estado solicitud'
                    value={aprobado}
                    onChange={event => setAprobado(event.target.value)}
                  >
                    <MenuItem value='-1'>Todas</MenuItem>
                    <MenuItem value='0'>Pendientes</MenuItem>
                    <MenuItem value='1'>Aprobadas</MenuItem>
                  </TextField>
                </Grid>
              ) : null}
              {reporte === 'procesosMasivos' ? (
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Codigo proceso'
                    value={codigoProcesoMasivo}
                    onChange={event => setCodigoProcesoMasivo(event.target.value)}
                  />
                </Grid>
              ) : null}
              {reporte === 'conteoDiferencias' ? (
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Codigo conteo'
                    value={codigoBmConteo}
                    onChange={event => setCodigoBmConteo(event.target.value)}
                  />
                </Grid>
              ) : null}
              {reporte === 'conteoHistorico' ||
              reporte === 'movimientosFiltro' ||
              reporte === 'solicitudes' ||
              reporte === 'procesosMasivos' ? (
                <>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size='small'
                      type='date'
                      label='Fecha desde'
                      InputLabelProps={{ shrink: true }}
                      value={fechaDesde}
                      onChange={event => setFechaDesde(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size='small'
                      type='date'
                      label='Fecha hasta'
                      InputLabelProps={{ shrink: true }}
                      value={fechaHasta}
                      onChange={event => setFechaHasta(event.target.value)}
                    />
                  </Grid>
                </>
              ) : null}
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant='outlined' startIcon={<SearchOutlinedIcon />} disabled={isBusy} onClick={handleData}>
                    Consultar
                  </Button>
                  <Button
                    variant='contained'
                    startIcon={<PictureAsPdfOutlinedIcon />}
                    disabled={isBusy}
                    onClick={handlePdf}
                  >
                    Vista previa PDF
                  </Button>
                  <Button
                    variant='outlined'
                    startIcon={<FileDownloadOutlinedIcon />}
                    disabled={isBusy}
                    onClick={handleExcel}
                  >
                    Descargar Excel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            {message ? (
              <Alert severity='warning' sx={{ mt: 4 }}>
                {message}
              </Alert>
            ) : null}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Vista previa PDF' />
          <CardContent>
            <Box
              sx={{
                height: 720,
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              {loadingPdf ? (
                <Stack alignItems='center' justifyContent='center' sx={{ width: '100%', height: '100%' }} spacing={3}>
                  <Typography variant='body2'>Generando reporte PDF...</Typography>
                </Stack>
              ) : pdfUrl ? (
                <object data={pdfUrl} type='application/pdf' width='100%' height='100%'>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    No se pudo mostrar el PDF.
                  </Box>
                </object>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'text.secondary'
                  }}
                >
                  Genere la vista previa para mostrar el reporte.
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Datos consultados' />
          <CardContent>
            <Box sx={{ height: 520, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loadingData}
                pageSize={25}
                rowsPerPageOptions={[25, 50, 100]}
                disableSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ReportesBmView
