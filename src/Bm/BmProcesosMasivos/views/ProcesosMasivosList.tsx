import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { BmDescriptivaRow, BmProcesoMasivoRow, BmRow, BmUbicacionRow } from 'src/interfaces/Bm/bienes-municipales'
import { bienesMunicipalesEndpoints, bmGet, bmPost } from 'src/Bm/services/bienesMunicipales.service'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

type RowWithId<T> = T & { id: number }
type BmArticuloRow = BmRow & {
  codigoArticulo?: number
  codigo?: string
  denominacion?: string
  descripcion?: string
  clasificacion?: string
}
type BmIcpRow = {
  codigoIcp?: number
  unidadTrabajo?: string
}

type ProcesoForm = {
  codigoIcp: number
  codigoDirOrigen: number
  codigoArticulo: number
  placasCsv: string
  responsableText: string
  codigoDirDestino: number
  conceptoMovId: number
  fechaMovimiento: string
  usuarioId: number
  observacion: string
}

const initialForm: ProcesoForm = {
  codigoIcp: 0,
  codigoDirOrigen: 0,
  codigoArticulo: 0,
  placasCsv: '',
  responsableText: '',
  codigoDirDestino: 0,
  conceptoMovId: 0,
  fechaMovimiento: '',
  usuarioId: 0,
  observacion: ''
}

const columns: GridColumns<RowWithId<BmProcesoMasivoRow>> = [
  { field: 'numeroPlaca', headerName: 'Placa', minWidth: 130 },
  { field: 'articulo', headerName: 'Articulo', minWidth: 220, flex: 1 },
  { field: 'codigoIcpOrigen', headerName: 'ICP', width: 100 },
  { field: 'codigoDirOrigen', headerName: 'Dir origen', width: 120 },
  { field: 'unidadOrigen', headerName: 'Unidad origen', minWidth: 220, flex: 1 },
  { field: 'codigoDirDestino', headerName: 'Dir destino', width: 120 },
  { field: 'unidadDestino', headerName: 'Unidad destino', minWidth: 220, flex: 1 },
  { field: 'estado', headerName: 'Estado', width: 120 },
  { field: 'mensaje', headerName: 'Mensaje', minWidth: 240, flex: 1 },
  { field: 'codigoMovBien', headerName: 'Mov.', width: 90 }
]

const escapeCsv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`

const downloadCsv = (rows: RowWithId<BmProcesoMasivoRow>[]) => {
  const visibleColumns = columns.filter(column => Boolean(column.field))
  const header = visibleColumns.map(column => escapeCsv(column.headerName || column.field)).join(',')
  const body = rows.map(row => visibleColumns.map(column => escapeCsv(row[column.field])).join(',')).join('\n')
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'bm-proceso-masivo.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const normalizeRows = (items: BmProcesoMasivoRow[]) =>
  items.map((item, index) => ({
    ...item,
    id:
      Number(item.codigoProcesoMasivoDet ?? 0) ||
      Number(item.codigoBien ?? 0) ||
      Number(item.codigoMovBien ?? 0) ||
      index + 1
  }))

const getIcpOptionLabel = (option: BmIcpRow) => {
  const codigo = option.codigoIcp ? `ICP ${option.codigoIcp}` : ''
  const unidad = option.unidadTrabajo || ''

  return [codigo, unidad].filter(Boolean).join(' | ')
}

const getUbicacionOptionLabel = (option: BmUbicacionRow) => {
  const codigo = option.codigoDirBien ? `#${option.codigoDirBien}` : ''
  const icp = option.codigoIcp ? `ICP ${option.codigoIcp}` : ''
  const unidad = option.unidadEjecutora || ''
  const direccion = option.direccion || option.complementoDir || ''

  return [codigo, icp, unidad, direccion].filter(Boolean).join(' | ')
}

const getArticuloOptionLabel = (option: BmArticuloRow) => {
  const codigo = option.codigo ? `${option.codigo}` : option.codigoArticulo ? `#${option.codigoArticulo}` : ''
  const denominacion = option.denominacion || ''
  const descripcion = option.descripcion || ''

  return [codigo, denominacion, descripcion].filter(Boolean).join(' | ')
}

const getConceptoOptionLabel = (option: BmDescriptivaRow) => {
  const id = option.id ? `#${option.id}` : ''
  const codigo = option.codigo ? `${option.codigo}` : ''
  const descripcion = option.descripcion || ''

  return [id, codigo, descripcion].filter(Boolean).join(' | ')
}

const ProcesosMasivosList = () => {
  const [form, setForm] = useState<ProcesoForm>(initialForm)
  const [rows, setRows] = useState<RowWithId<BmProcesoMasivoRow>[]>([])
  const [icpOptions, setIcpOptions] = useState<BmIcpRow[]>([])
  const [selectedIcp, setSelectedIcp] = useState<BmIcpRow | null>(null)
  const [ubicacionSearch, setUbicacionSearch] = useState('')
  const [ubicacionOptions, setUbicacionOptions] = useState<BmUbicacionRow[]>([])
  const [selectedDirOrigen, setSelectedDirOrigen] = useState<BmUbicacionRow | null>(null)
  const [selectedDirDestino, setSelectedDirDestino] = useState<BmUbicacionRow | null>(null)
  const [articuloSearch, setArticuloSearch] = useState('')
  const [articuloOptions, setArticuloOptions] = useState<BmArticuloRow[]>([])
  const [selectedArticulo, setSelectedArticulo] = useState<BmArticuloRow | null>(null)
  const [conceptoSearch, setConceptoSearch] = useState('')
  const [conceptoOptions, setConceptoOptions] = useState<BmDescriptivaRow[]>([])
  const [selectedConcepto, setSelectedConcepto] = useState<BmDescriptivaRow | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingIcp, setLoadingIcp] = useState(false)
  const [loadingUbicaciones, setLoadingUbicaciones] = useState(false)
  const [loadingArticulos, setLoadingArticulos] = useState(false)
  const [loadingConceptos, setLoadingConceptos] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [message, setMessage] = useState('')

  const resumen = useMemo(() => {
    const first = rows[0]

    return {
      procesados: Number(first?.totalProcesados ?? rows.length),
      exitosos: Number(first?.totalExitosos ?? rows.filter(row => row.estado === 'EXITOSO').length),
      rechazados: Number(first?.totalRechazados ?? rows.filter(row => row.estado === 'RECHAZADO').length)
    }
  }, [rows])

  const payload = {
    codigoIcp: form.codigoIcp,
    codigoDirOrigen: form.codigoDirOrigen,
    codigoArticulo: form.codigoArticulo,
    placasCsv: form.placasCsv,
    responsableText: form.responsableText,
    codigoDirDestino: form.codigoDirDestino,
    conceptoMovId: form.conceptoMovId,
    fechaMovimiento: form.fechaMovimiento || null,
    usuarioId: form.usuarioId,
    observacion: form.observacion
  }

  const handleChange = (field: keyof ProcesoForm, value: string | number) => {
    setForm(current => ({ ...current, [field]: value }))
  }

  const findIcpValue = useCallback(
    (codigo: number) => {
      if (!codigo) return null
      if (selectedIcp?.codigoIcp === codigo) return selectedIcp

      return icpOptions.find(item => item.codigoIcp === codigo) ?? null
    },
    [icpOptions, selectedIcp]
  )

  const findUbicacionValue = useCallback(
    (codigo: number, selected: BmUbicacionRow | null) => {
      if (!codigo) return null
      if (selected?.codigoDirBien === codigo) return selected

      return ubicacionOptions.find(item => item.codigoDirBien === codigo) ?? null
    },
    [ubicacionOptions]
  )

  const findArticuloValue = useCallback(
    (codigo: number) => {
      if (!codigo) return null
      if (selectedArticulo?.codigoArticulo === codigo) return selectedArticulo

      return articuloOptions.find(item => item.codigoArticulo === codigo) ?? null
    },
    [articuloOptions, selectedArticulo]
  )

  const findConceptoValue = useCallback(
    (codigo: number) => {
      if (!codigo) return null
      if (selectedConcepto?.id === codigo) return selectedConcepto

      return conceptoOptions.find(item => item.id === codigo) ?? null
    },
    [conceptoOptions, selectedConcepto]
  )

  const loadIcpOptions = useCallback(async () => {
    try {
      setLoadingIcp(true)
      const data = await bmGet<BmIcpRow[]>(bienesMunicipalesEndpoints.ubicaciones.getIcp, [])
      setIcpOptions(data)
    } catch (error) {
      setIcpOptions([])
      setMessage(error instanceof Error ? error.message : 'No se pudo cargar ICP origen')
    } finally {
      setLoadingIcp(false)
    }
  }, [])

  const searchUbicaciones = useCallback(async (value: string) => {
    const searchValue = value.trim()
    if (searchValue.length < 2) {
      setUbicacionOptions([])

      return
    }

    try {
      setLoadingUbicaciones(true)
      const data = await bmPost<BmUbicacionRow[], unknown>(
        bienesMunicipalesEndpoints.ubicaciones.getAll,
        { searchText: searchValue, page: 1, pageSize: 25 },
        []
      )
      setUbicacionOptions(data)
    } catch (error) {
      setUbicacionOptions([])
      setMessage(error instanceof Error ? error.message : 'No se pudo buscar ubicaciones')
    } finally {
      setLoadingUbicaciones(false)
    }
  }, [])

  const searchArticulos = useCallback(async (value: string) => {
    const searchValue = value.trim()
    if (searchValue.length < 2) {
      setArticuloOptions([])

      return
    }

    try {
      setLoadingArticulos(true)
      const data = await bmPost<BmArticuloRow[], unknown>(
        bienesMunicipalesEndpoints.catalogos.articulos,
        { searchText: searchValue, page: 1, pageSize: 25 },
        []
      )
      setArticuloOptions(data)
    } catch (error) {
      setArticuloOptions([])
      setMessage(error instanceof Error ? error.message : 'No se pudo buscar articulos')
    } finally {
      setLoadingArticulos(false)
    }
  }, [])

  const searchConceptos = useCallback(async (value: string) => {
    try {
      setLoadingConceptos(true)
      const data = await bmPost<BmDescriptivaRow[], unknown>(
        bienesMunicipalesEndpoints.catalogos.descriptivas,
        { tituloId: 4, searchText: value.trim(), page: 1, pageSize: 50 },
        []
      )
      setConceptoOptions(data)
    } catch (error) {
      setConceptoOptions([])
      setMessage(error instanceof Error ? error.message : 'No se pudo buscar conceptos de movimiento')
    } finally {
      setLoadingConceptos(false)
    }
  }, [])

  const handlePreview = async () => {
    try {
      setLoading(true)
      setMessage('')
      const data = await bmPost<BmProcesoMasivoRow[], unknown>(bienesMunicipalesEndpoints.procesosMasivos.preview, payload, [])
      setRows(normalizeRows(data))
      setMessage(data.length ? 'Previsualizacion cargada.' : 'No hay bienes para los filtros seleccionados.')
    } catch (error) {
      setRows([])
      setMessage(error instanceof Error ? error.message : 'No se pudo previsualizar el proceso masivo')
    } finally {
      setLoading(false)
    }
  }

  const handleExecute = async () => {
    if (!form.codigoDirDestino || !form.conceptoMovId || !form.fechaMovimiento) {
      setMessage('Debe indicar ubicacion destino, concepto y fecha.')

      return
    }

    try {
      setLoading(true)
      setMessage('')
      const data = await bmPost<BmProcesoMasivoRow[], unknown>(bienesMunicipalesEndpoints.procesosMasivos.execute, payload, [])
      setRows(normalizeRows(data))
      setConfirmOpen(false)
      setMessage('Proceso masivo ejecutado.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo ejecutar el proceso masivo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIcpOptions()
  }, [loadIcpOptions])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      searchUbicaciones(ubicacionSearch)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [searchUbicaciones, ubicacionSearch])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      searchArticulos(articuloSearch)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [articuloSearch, searchArticulos])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      searchConceptos(conceptoSearch)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [conceptoSearch, searchConceptos])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Procesos masivos BM' />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={2}>
                <Autocomplete
                  fullWidth
                  size='small'
                  options={icpOptions}
                  value={findIcpValue(form.codigoIcp)}
                  loading={loadingIcp}
                  getOptionLabel={getIcpOptionLabel}
                  isOptionEqualToValue={(option, value) => option.codigoIcp === value.codigoIcp}
                  renderOption={(props, option) => (
                    <Box component='li' {...props} sx={{ whiteSpace: 'normal', alignItems: 'flex-start !important' }}>
                      {getIcpOptionLabel(option)}
                    </Box>
                  )}
                  onChange={(_, value) => {
                    setSelectedIcp(value)
                    handleChange('codigoIcp', Number(value?.codigoIcp ?? 0))
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='ICP origen'
                      placeholder='Unidad o ICP'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingIcp ? <CircularProgress color='inherit' size={18} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Autocomplete
                  fullWidth
                  size='small'
                  options={ubicacionOptions}
                  value={findUbicacionValue(form.codigoDirOrigen, selectedDirOrigen)}
                  loading={loadingUbicaciones}
                  getOptionLabel={getUbicacionOptionLabel}
                  isOptionEqualToValue={(option, value) => option.codigoDirBien === value.codigoDirBien}
                  renderOption={(props, option) => (
                    <Box component='li' {...props} sx={{ whiteSpace: 'normal', alignItems: 'flex-start !important' }}>
                      {getUbicacionOptionLabel(option)}
                    </Box>
                  )}
                  onInputChange={(_, value) => setUbicacionSearch(value)}
                  onChange={(_, value) => {
                    setSelectedDirOrigen(value)
                    handleChange('codigoDirOrigen', Number(value?.codigoDirBien ?? 0))
                    if (value?.codigoIcp) {
                      handleChange('codigoIcp', Number(value.codigoIcp))
                      setSelectedIcp({ codigoIcp: value.codigoIcp, unidadTrabajo: value.unidadEjecutora })
                    }
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Dir origen'
                      placeholder='Codigo, ICP, unidad o direccion'
                      helperText={
                        findUbicacionValue(form.codigoDirOrigen, selectedDirOrigen)
                          ? getUbicacionOptionLabel(
                              findUbicacionValue(form.codigoDirOrigen, selectedDirOrigen) as BmUbicacionRow
                            )
                          : ''
                      }
                      FormHelperTextProps={{ sx: { mx: 0, whiteSpace: 'normal', lineHeight: 1.35 } }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingUbicaciones ? <CircularProgress color='inherit' size={18} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Autocomplete
                  fullWidth
                  size='small'
                  options={articuloOptions}
                  value={findArticuloValue(form.codigoArticulo)}
                  loading={loadingArticulos}
                  getOptionLabel={getArticuloOptionLabel}
                  isOptionEqualToValue={(option, value) => option.codigoArticulo === value.codigoArticulo}
                  renderOption={(props, option) => (
                    <Box component='li' {...props} sx={{ whiteSpace: 'normal', alignItems: 'flex-start !important' }}>
                      {getArticuloOptionLabel(option)}
                    </Box>
                  )}
                  onInputChange={(_, value) => setArticuloSearch(value)}
                  onChange={(_, value) => {
                    setSelectedArticulo(value)
                    handleChange('codigoArticulo', Number(value?.codigoArticulo ?? 0))
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Articulo'
                      placeholder='Codigo, denominacion o descripcion'
                      helperText={
                        findArticuloValue(form.codigoArticulo)
                          ? getArticuloOptionLabel(findArticuloValue(form.codigoArticulo) as BmArticuloRow)
                          : ''
                      }
                      FormHelperTextProps={{ sx: { mx: 0, whiteSpace: 'normal', lineHeight: 1.35 } }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingArticulos ? <CircularProgress color='inherit' size={18} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size='small'
                  label='Placas'
                  value={form.placasCsv}
                  onChange={event => handleChange('placasCsv', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size='small'
                  label='Responsable'
                  value={form.responsableText}
                  onChange={event => handleChange('responsableText', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  fullWidth
                  size='small'
                  options={ubicacionOptions}
                  value={findUbicacionValue(form.codigoDirDestino, selectedDirDestino)}
                  loading={loadingUbicaciones}
                  getOptionLabel={getUbicacionOptionLabel}
                  isOptionEqualToValue={(option, value) => option.codigoDirBien === value.codigoDirBien}
                  renderOption={(props, option) => (
                    <Box component='li' {...props} sx={{ whiteSpace: 'normal', alignItems: 'flex-start !important' }}>
                      {getUbicacionOptionLabel(option)}
                    </Box>
                  )}
                  onInputChange={(_, value) => setUbicacionSearch(value)}
                  onChange={(_, value) => {
                    setSelectedDirDestino(value)
                    handleChange('codigoDirDestino', Number(value?.codigoDirBien ?? 0))
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      required
                      label='Dir destino'
                      placeholder='Codigo, ICP, unidad o direccion'
                      helperText={
                        findUbicacionValue(form.codigoDirDestino, selectedDirDestino)
                          ? getUbicacionOptionLabel(
                              findUbicacionValue(form.codigoDirDestino, selectedDirDestino) as BmUbicacionRow
                            )
                          : ''
                      }
                      FormHelperTextProps={{ sx: { mx: 0, whiteSpace: 'normal', lineHeight: 1.35 } }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingUbicaciones ? <CircularProgress color='inherit' size={18} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  fullWidth
                  size='small'
                  options={conceptoOptions}
                  value={findConceptoValue(form.conceptoMovId)}
                  loading={loadingConceptos}
                  getOptionLabel={getConceptoOptionLabel}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderOption={(props, option) => (
                    <Box component='li' {...props} sx={{ whiteSpace: 'normal', alignItems: 'flex-start !important' }}>
                      {getConceptoOptionLabel(option)}
                    </Box>
                  )}
                  onInputChange={(_, value) => setConceptoSearch(value)}
                  onChange={(_, value) => {
                    setSelectedConcepto(value)
                    handleChange('conceptoMovId', Number(value?.id ?? 0))
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      required
                      label='Concepto'
                      placeholder='Codigo o descripcion'
                      helperText={
                        findConceptoValue(form.conceptoMovId)
                          ? getConceptoOptionLabel(findConceptoValue(form.conceptoMovId) as BmDescriptivaRow)
                          : ''
                      }
                      FormHelperTextProps={{ sx: { mx: 0, whiteSpace: 'normal', lineHeight: 1.35 } }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingConceptos ? <CircularProgress color='inherit' size={18} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  required
                  size='small'
                  type='date'
                  label='Fecha'
                  value={form.fechaMovimiento}
                  InputLabelProps={{ shrink: true }}
                  onChange={event => handleChange('fechaMovimiento', event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size='small'
                  type='number'
                  label='Usuario'
                  value={form.usuarioId}
                  onChange={event => handleChange('usuarioId', Number(event.target.value || 0))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size='small'
                  label='Observacion'
                  value={form.observacion}
                  onChange={event => handleChange('observacion', event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant='contained' startIcon={<PreviewOutlinedIcon />} onClick={handlePreview} disabled={loading}>
                    Previsualizar
                  </Button>
                  <Button
                    variant='contained'
                    color='success'
                    startIcon={<CheckCircleOutlineOutlinedIcon />}
                    onClick={() => setConfirmOpen(true)}
                    disabled={loading || rows.length === 0}
                  >
                    Ejecutar
                  </Button>
                  <Button
                    variant='outlined'
                    startIcon={<FileDownloadOutlinedIcon />}
                    onClick={() => downloadCsv(rows)}
                    disabled={rows.length === 0}
                  >
                    Exportar
                  </Button>
                  <BmScreenHelpButton title='Procesos Masivos BM' docPath='/bm-docs/procesos-masivos-bm.md' />
                </Stack>
              </Grid>
            </Grid>
            {message ? (
              <Alert severity='info' sx={{ mt: 4 }}>
                {message}
              </Alert>
            ) : null}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Resultado'
            subheader={`Procesados: ${resumen.procesados} | Exitosos: ${resumen.exitosos} | Rechazados: ${resumen.rechazados}`}
          />
          <CardContent>
            <Box sx={{ height: 560, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pageSize={25}
                rowsPerPageOptions={[25, 50, 100]}
                disableSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Confirmar proceso masivo</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Alert severity='warning'>
              Se generara un movimiento de traslado para los bienes validos de la previsualizacion.
            </Alert>
            <Typography variant='body2'>
              Bienes previsualizados: {rows.length}. Destino: {form.codigoDirDestino}. Fecha: {form.fechaMovimiento || 'sin fecha'}.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setConfirmOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant='contained' color='success' onClick={handleExecute} disabled={loading}>
            Ejecutar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ProcesosMasivosList
