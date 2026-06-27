import { useCallback, useEffect, useState } from 'react'
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
  MenuItem,
  Stack,
  TextField
} from '@mui/material'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import {
  BmBienRow,
  BmDescriptivaRow,
  BmMovimientoRow,
  BmSolicitudMovimientoRow,
  BmUbicacionRow
} from 'src/interfaces/Bm/bienes-municipales'
import { bienesMunicipalesEndpoints, bmPost } from 'src/Bm/services/bienesMunicipales.service'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

type RowWithId<T> = T & { id: number }

type SolicitudForm = {
  codigoBien: number
  tipoMovimiento: string
  fechaMovimiento: string
  codigoDirBien: number
  conceptoMovId: number
  notaIncidencia: string
}

type MovimientoForm = {
  codigoBien: number
  tipoMovimiento: string
  fechaMovimiento: string
  codigoDirBien: number
  conceptoMovId: number
  observacion: string
}

const solicitudInitialForm: SolicitudForm = {
  codigoBien: 0,
  tipoMovimiento: 'T',
  fechaMovimiento: '',
  codigoDirBien: 0,
  conceptoMovId: 0,
  notaIncidencia: ''
}

const movimientoInitialForm: MovimientoForm = {
  codigoBien: 0,
  tipoMovimiento: 'T',
  fechaMovimiento: '',
  codigoDirBien: 0,
  conceptoMovId: 0,
  observacion: ''
}

const movimientosColumns: GridColumns<RowWithId<BmMovimientoRow>> = [
  { field: 'codigoMovBien', headerName: 'Id', width: 80 },
  { field: 'numeroPlaca', headerName: 'Placa', width: 170, minWidth: 170 },
  { field: 'articulo', headerName: 'Articulo', minWidth: 190, flex: 1 },
  { field: 'tipoMovimiento', headerName: 'Tipo', width: 90 },
  { field: 'tipoMovimientoDescripcion', headerName: 'Movimiento', minWidth: 170 },
  { field: 'fechaMovimientoString', headerName: 'Fecha', width: 120 },
  { field: 'unidadEjecutora', headerName: 'Unidad', minWidth: 220, flex: 1 },
  { field: 'conceptoMovimiento', headerName: 'Concepto', minWidth: 220, flex: 1 },
  { field: 'esMovimientoFinal', headerName: 'Final', width: 90, type: 'boolean' }
]

const solicitudesColumns: GridColumns<RowWithId<BmSolicitudMovimientoRow>> = [
  { field: 'codigoSolMovBien', headerName: 'Id', width: 80 },
  { field: 'numeroSolicitud', headerName: 'Solicitud', minWidth: 140 },
  { field: 'numeroPlaca', headerName: 'Placa', width: 170, minWidth: 170 },
  { field: 'articulo', headerName: 'Articulo', minWidth: 180, flex: 1 },
  { field: 'tipoMovimientoDescripcion', headerName: 'Movimiento', minWidth: 170 },
  { field: 'fechaMovimientoString', headerName: 'Fecha Mov.', width: 130 },
  { field: 'aprobado', headerName: 'Aprobado', width: 110, type: 'boolean' },
  { field: 'notaIncidencia', headerName: 'Nota', minWidth: 240, flex: 1 }
]

const getBienOptionLabel = (option: BmBienRow) => {
  const codigo = option.codigoBien ? `#${option.codigoBien}` : ''
  const placa = option.numeroPlaca || 'Sin placa'
  const articulo = option.articulo || ''
  const lote = option.numeroLote ? `Lote ${option.numeroLote}` : ''

  return [codigo, placa, articulo, lote].filter(Boolean).join(' | ')
}

const getUbicacionOptionLabel = (option: BmUbicacionRow) => {
  const codigo = option.codigoDirBien ? `#${option.codigoDirBien}` : ''
  const icp = option.codigoIcp ? `ICP ${option.codigoIcp}` : ''
  const unidad = option.unidadEjecutora || ''
  const direccion = option.direccion || option.complementoDir || ''

  return [codigo, icp, unidad, direccion].filter(Boolean).join(' | ')
}

const getConceptoOptionLabel = (option: BmDescriptivaRow) => {
  const id = option.id ? `#${option.id}` : ''
  const codigo = option.codigo ? `${option.codigo}` : ''
  const descripcion = option.descripcion || ''

  return [id, codigo, descripcion].filter(Boolean).join(' | ')
}

const MovimientosList = () => {
  const [codigoBien, setCodigoBien] = useState('')
  const [bienSearch, setBienSearch] = useState('')
  const [bienOptions, setBienOptions] = useState<BmBienRow[]>([])
  const [selectedBien, setSelectedBien] = useState<BmBienRow | null>(null)
  const [ubicacionSearch, setUbicacionSearch] = useState('')
  const [ubicacionOptions, setUbicacionOptions] = useState<BmUbicacionRow[]>([])
  const [selectedUbicacion, setSelectedUbicacion] = useState<BmUbicacionRow | null>(null)
  const [conceptoSearch, setConceptoSearch] = useState('')
  const [conceptoOptions, setConceptoOptions] = useState<BmDescriptivaRow[]>([])
  const [selectedConcepto, setSelectedConcepto] = useState<BmDescriptivaRow | null>(null)
  const [aprobado, setAprobado] = useState('-1')
  const [searchText, setSearchText] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [codigoDirBien, setCodigoDirBien] = useState('')
  const [movimientos, setMovimientos] = useState<RowWithId<BmMovimientoRow>[]>([])
  const [solicitudes, setSolicitudes] = useState<RowWithId<BmSolicitudMovimientoRow>[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [directOpen, setDirectOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const [selectedSolicitud, setSelectedSolicitud] = useState<RowWithId<BmSolicitudMovimientoRow> | null>(null)
  const [solicitudForm, setSolicitudForm] = useState<SolicitudForm>(solicitudInitialForm)
  const [movimientoForm, setMovimientoForm] = useState<MovimientoForm>(movimientoInitialForm)
  const [loadingMovimientos, setLoadingMovimientos] = useState(false)
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false)
  const [savingSolicitud, setSavingSolicitud] = useState(false)
  const [savingMovimiento, setSavingMovimiento] = useState(false)
  const [approvingSolicitud, setApprovingSolicitud] = useState(false)
  const [loadingBienes, setLoadingBienes] = useState(false)
  const [loadingUbicaciones, setLoadingUbicaciones] = useState(false)
  const [loadingConceptos, setLoadingConceptos] = useState(false)
  const [message, setMessage] = useState('')

  const findBienValue = useCallback(
    (codigo: number) => {
      if (!codigo) return null
      if (selectedBien?.codigoBien === codigo) return selectedBien

      return bienOptions.find(item => item.codigoBien === codigo) ?? null
    },
    [bienOptions, selectedBien]
  )

  const searchBienes = useCallback(async (value: string) => {
    const searchValue = value.trim()
    if (searchValue.length < 2) {
      setBienOptions([])

      return
    }

    try {
      setLoadingBienes(true)
      const data = await bmPost<BmBienRow[], unknown>(
        bienesMunicipalesEndpoints.bienes.getAll,
        { searchText: searchValue, page: 1, pageSize: 20 },
        []
      )
      setBienOptions(data)
    } catch (error) {
      setBienOptions([])
      setMessage(error instanceof Error ? error.message : 'No se pudo buscar bienes')
    } finally {
      setLoadingBienes(false)
    }
  }, [])

  const findUbicacionValue = useCallback(
    (codigo: number) => {
      if (!codigo) return null
      if (selectedUbicacion?.codigoDirBien === codigo) return selectedUbicacion

      return ubicacionOptions.find(item => item.codigoDirBien === codigo) ?? null
    },
    [selectedUbicacion, ubicacionOptions]
  )

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
        { searchText: searchValue, page: 1, pageSize: 20 },
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

  const findConceptoValue = useCallback(
    (codigo: number) => {
      if (!codigo) return null
      if (selectedConcepto?.id === codigo) return selectedConcepto

      return conceptoOptions.find(item => item.id === codigo) ?? null
    },
    [conceptoOptions, selectedConcepto]
  )

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

  const loadMovimientos = useCallback(async () => {
    try {
      setLoadingMovimientos(true)
      setMessage('')
      const data = await bmPost<BmMovimientoRow[], unknown>(
        bienesMunicipalesEndpoints.movimientos.byBien,
        { codigoBien: Number(codigoBien) || 0 },
        []
      )
      setMovimientos(data.map((item, index) => ({ ...item, id: Number(item.codigoMovBien ?? index + 1) || index + 1 })))
    } catch (error) {
      setMovimientos([])
      setMessage(error instanceof Error ? error.message : 'No se pudo consultar movimientos')
    } finally {
      setLoadingMovimientos(false)
    }
  }, [codigoBien])

  const loadSolicitudes = useCallback(async () => {
    try {
      setLoadingSolicitudes(true)
      setMessage('')
      const data = await bmPost<BmSolicitudMovimientoRow[], unknown>(
        bienesMunicipalesEndpoints.movimientos.solicitudes,
        {
          aprobado: Number(aprobado),
          searchText,
          tipoMovimiento,
          fechaDesde: fechaDesde || null,
          fechaHasta: fechaHasta || null,
          codigoDirBien: Number(codigoDirBien) || 0,
          page: 1,
          pageSize: 100
        },
        []
      )
      setSolicitudes(
        data.map((item, index) => ({ ...item, id: Number(item.codigoSolMovBien ?? index + 1) || index + 1 }))
      )
    } catch (error) {
      setSolicitudes([])
      setMessage(error instanceof Error ? error.message : 'No se pudo consultar solicitudes de movimiento')
    } finally {
      setLoadingSolicitudes(false)
    }
  }, [aprobado, searchText, tipoMovimiento, fechaDesde, fechaHasta, codigoDirBien])

  const handleCreateSolicitud = async () => {
    if (!solicitudForm.codigoBien || !solicitudForm.tipoMovimiento || !solicitudForm.fechaMovimiento) {
      setMessage('Debe indicar bien, tipo y fecha del movimiento.')

      return
    }

    if (!solicitudForm.codigoDirBien || !solicitudForm.conceptoMovId) {
      setMessage('Debe indicar ubicacion y concepto del movimiento.')

      return
    }

    try {
      setSavingSolicitud(true)
      setMessage('')
      const data = await bmPost<BmSolicitudMovimientoRow[], unknown>(
        bienesMunicipalesEndpoints.movimientos.solicitudesCreate,
        {
          codigoBien: solicitudForm.codigoBien,
          tipoMovimiento: solicitudForm.tipoMovimiento,
          fechaMovimiento: solicitudForm.fechaMovimiento,
          codigoDirBien: solicitudForm.codigoDirBien,
          conceptoMovId: solicitudForm.conceptoMovId,
          numeroSolicitud: '',
          usuarioSolicita: 0,
          fechaIncidencia: solicitudForm.fechaMovimiento,
          notaIncidencia: solicitudForm.notaIncidencia,
          extra1: '',
          extra2: '',
          extra3: ''
        },
        []
      )
      setSolicitudes(data.map((item, index) => ({ ...item, id: Number(item.codigoSolMovBien ?? index + 1) || index + 1 })))
      setCreateOpen(false)
      setSolicitudForm(solicitudInitialForm)
      setMessage('Solicitud de movimiento registrada.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo registrar la solicitud de movimiento')
    } finally {
      setSavingSolicitud(false)
    }
  }

  const handleCreateMovimiento = async () => {
    if (!movimientoForm.codigoBien || !movimientoForm.tipoMovimiento || !movimientoForm.fechaMovimiento) {
      setMessage('Debe indicar bien, tipo y fecha del movimiento.')

      return
    }

    if (!movimientoForm.codigoDirBien || !movimientoForm.conceptoMovId) {
      setMessage('Debe indicar ubicacion y concepto del movimiento.')

      return
    }

    try {
      setSavingMovimiento(true)
      setMessage('')
      const data = await bmPost<BmMovimientoRow[], unknown>(
        bienesMunicipalesEndpoints.movimientos.create,
        {
          codigoBien: movimientoForm.codigoBien,
          tipoMovimiento: movimientoForm.tipoMovimiento,
          fechaMovimiento: movimientoForm.fechaMovimiento,
          codigoDirBien: movimientoForm.codigoDirBien,
          conceptoMovId: movimientoForm.conceptoMovId,
          codigoSolMovBien: 0,
          extra1: movimientoForm.observacion,
          extra2: '',
          extra3: ''
        },
        []
      )
      setMovimientos(data.map((item, index) => ({ ...item, id: Number(item.codigoMovBien ?? index + 1) || index + 1 })))
      setCodigoBien(String(movimientoForm.codigoBien))
      setDirectOpen(false)
      setMovimientoForm(movimientoInitialForm)
      setMessage('Movimiento registrado.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo registrar el movimiento')
    } finally {
      setSavingMovimiento(false)
    }
  }

  const handleApproveSolicitud = async () => {
    if (!selectedSolicitud?.codigoSolMovBien) return

    try {
      setApprovingSolicitud(true)
      setMessage('')
      const data = await bmPost<BmSolicitudMovimientoRow[], unknown>(
        bienesMunicipalesEndpoints.movimientos.solicitudesAprobar,
        { codigoSolMovBien: selectedSolicitud.codigoSolMovBien },
        []
      )
      const approved = data[0]
      if (approved) {
        setSolicitudes(current =>
          current.map(item =>
            Number(item.codigoSolMovBien ?? 0) === approved.codigoSolMovBien
              ? { ...item, ...approved, id: Number(approved.codigoSolMovBien) }
              : item
          )
        )
      }
      setApproveOpen(false)
      setSelectedSolicitud(null)
      setMessage('Solicitud aprobada y movimiento generado.')
      if (approved?.codigoBien) {
        setCodigoBien(String(approved.codigoBien))
        setSelectedBien({
          codigoBien: approved.codigoBien,
          numeroPlaca: approved.numeroPlaca,
          articulo: approved.articulo
        })
        const movimientosData = await bmPost<BmMovimientoRow[], unknown>(
          bienesMunicipalesEndpoints.movimientos.byBien,
          { codigoBien: approved.codigoBien },
          []
        )
        setMovimientos(
          movimientosData.map((item, index) => ({
            ...item,
            id: Number(item.codigoMovBien ?? index + 1) || index + 1
          }))
        )
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo aprobar la solicitud de movimiento')
    } finally {
      setApprovingSolicitud(false)
    }
  }

  const solicitudesGridColumns: GridColumns<RowWithId<BmSolicitudMovimientoRow>> = [
    ...solicitudesColumns,
    {
      field: 'acciones',
      headerName: '',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <Button
          size='small'
          variant='outlined'
          disabled={Boolean(params.row.aprobado)}
          startIcon={<CheckCircleOutlineOutlinedIcon />}
          onClick={() => {
            setSelectedSolicitud(params.row)
            setApproveOpen(true)
          }}
        >
          Aprobar
        </Button>
      )
    }
  ]

  useEffect(() => {
    loadSolicitudes()
  }, [loadSolicitudes])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      searchBienes(bienSearch)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [bienSearch, searchBienes])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      searchUbicaciones(ubicacionSearch)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [searchUbicaciones, ubicacionSearch])

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
          <CardHeader title='Movimientos de bienes' />
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Autocomplete
                fullWidth
                size='small'
                options={bienOptions}
                value={findBienValue(Number(codigoBien) || 0)}
                loading={loadingBienes}
                getOptionLabel={getBienOptionLabel}
                isOptionEqualToValue={(option, value) => option.codigoBien === value.codigoBien}
                onInputChange={(_, value) => setBienSearch(value)}
                onChange={(_, value) => {
                  setSelectedBien(value)
                  setCodigoBien(value?.codigoBien ? String(value.codigoBien) : '')
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Buscar bien'
                    placeholder='Placa, codigo, articulo o lote'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingBienes ? <CircularProgress color='inherit' size={18} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
              <Button variant='contained' startIcon={<SearchOutlinedIcon />} onClick={loadMovimientos}>
                Consultar
              </Button>
              <Button
                variant='outlined'
                startIcon={<AddOutlinedIcon />}
                onClick={() => {
                  setMovimientoForm(current => ({
                    ...current,
                    codigoBien: Number(codigoBien) || current.codigoBien
                  }))
                  setDirectOpen(true)
                }}
              >
                Movimiento
              </Button>
              <BmScreenHelpButton title='Movimientos de Bienes' docPath='/bm-docs/movimientos-bienes.md' />
            </Stack>
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
          <CardHeader title='Historico del bien' />
          <CardContent>
            <Box sx={{ height: 420, width: '100%' }}>
              <DataGrid
                rows={movimientos}
                columns={movimientosColumns}
                loading={loadingMovimientos}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Solicitudes de movimiento' />
          <CardContent>
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Estado'
                  value={aprobado}
                  onChange={event => setAprobado(event.target.value)}
                >
                  <MenuItem value='-1'>Todas</MenuItem>
                  <MenuItem value='0'>Pendientes</MenuItem>
                  <MenuItem value='1'>Aprobadas</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Tipo'
                  value={tipoMovimiento}
                  onChange={event => setTipoMovimiento(event.target.value)}
                >
                  <MenuItem value=''>Todos</MenuItem>
                  <MenuItem value='T'>Traslado</MenuItem>
                  <MenuItem value='D'>Desincorporacion</MenuItem>
                  <MenuItem value='R'>Reincorporacion</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size='small'
                  label='Buscar solicitud, placa o articulo'
                  value={searchText}
                  onChange={event => setSearchText(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size='small'
                  label='Codigo ubicacion'
                  value={codigoDirBien}
                  onChange={event => setCodigoDirBien(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size='small'
                  type='date'
                  label='Desde'
                  value={fechaDesde}
                  InputLabelProps={{ shrink: true }}
                  onChange={event => setFechaDesde(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size='small'
                  type='date'
                  label='Hasta'
                  value={fechaHasta}
                  InputLabelProps={{ shrink: true }}
                  onChange={event => setFechaHasta(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button fullWidth variant='contained' startIcon={<SearchOutlinedIcon />} onClick={loadSolicitudes}>
                  Consultar
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant='outlined'
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => {
                    setSolicitudForm(current => ({
                      ...current,
                      codigoBien: Number(codigoBien) || current.codigoBien
                    }))
                    setCreateOpen(true)
                  }}
                >
                  Nueva
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ height: 460, width: '100%' }}>
              <DataGrid
                rows={solicitudes}
                columns={solicitudesGridColumns}
                loading={loadingSolicitudes}
                pageSize={25}
                rowsPerPageOptions={[25, 50, 100]}
                disableSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth='md'>
        <DialogTitle>Nueva solicitud de movimiento</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={4} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                size='small'
                options={bienOptions}
                value={findBienValue(solicitudForm.codigoBien)}
                loading={loadingBienes}
                getOptionLabel={getBienOptionLabel}
                isOptionEqualToValue={(option, value) => option.codigoBien === value.codigoBien}
                onInputChange={(_, value) => setBienSearch(value)}
                onChange={(_, value) => {
                  setSelectedBien(value)
                  setSolicitudForm(current => ({ ...current, codigoBien: value?.codigoBien ?? 0 }))
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    label='Buscar bien'
                    placeholder='Placa, codigo, articulo o lote'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingBienes ? <CircularProgress color='inherit' size={18} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                size='small'
                label='Tipo'
                value={solicitudForm.tipoMovimiento}
                onChange={event => setSolicitudForm(current => ({ ...current, tipoMovimiento: event.target.value }))}
              >
                <MenuItem value='T'>Traslado</MenuItem>
                <MenuItem value='D'>Desincorporacion</MenuItem>
                <MenuItem value='R'>Reincorporacion</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                size='small'
                type='date'
                label='Fecha movimiento'
                value={solicitudForm.fechaMovimiento}
                InputLabelProps={{ shrink: true }}
                onChange={event => setSolicitudForm(current => ({ ...current, fechaMovimiento: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                size='small'
                options={ubicacionOptions}
                value={findUbicacionValue(solicitudForm.codigoDirBien)}
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
                  setSelectedUbicacion(value)
                  setSolicitudForm(current => ({ ...current, codigoDirBien: value?.codigoDirBien ?? 0 }))
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    label='Ubicacion'
                    placeholder='Codigo, ICP, unidad o direccion'
                    helperText={
                      findUbicacionValue(solicitudForm.codigoDirBien)
                        ? getUbicacionOptionLabel(findUbicacionValue(solicitudForm.codigoDirBien) as BmUbicacionRow)
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
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                size='small'
                options={conceptoOptions}
                value={findConceptoValue(solicitudForm.conceptoMovId)}
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
                  setSolicitudForm(current => ({ ...current, conceptoMovId: value?.id ?? 0 }))
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    label='Concepto movimiento'
                    placeholder='Codigo o descripcion'
                    helperText={
                      findConceptoValue(solicitudForm.conceptoMovId)
                        ? getConceptoOptionLabel(findConceptoValue(solicitudForm.conceptoMovId) as BmDescriptivaRow)
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                size='small'
                label='Nota incidencia'
                value={solicitudForm.notaIncidencia}
                onChange={event => setSolicitudForm(current => ({ ...current, notaIncidencia: event.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setCreateOpen(false)} disabled={savingSolicitud}>
            Cancelar
          </Button>
          <Button variant='contained' startIcon={<AddOutlinedIcon />} onClick={handleCreateSolicitud} disabled={savingSolicitud}>
            {savingSolicitud ? 'Guardando' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={directOpen} onClose={() => setDirectOpen(false)} fullWidth maxWidth='md'>
        <DialogTitle>Registrar movimiento</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={4} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <Alert severity='info'>
                Este registro actualiza el historial real del bien. Para procesos con aprobacion use solicitudes.
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                size='small'
                options={bienOptions}
                value={findBienValue(movimientoForm.codigoBien)}
                loading={loadingBienes}
                getOptionLabel={getBienOptionLabel}
                isOptionEqualToValue={(option, value) => option.codigoBien === value.codigoBien}
                onInputChange={(_, value) => setBienSearch(value)}
                onChange={(_, value) => {
                  setSelectedBien(value)
                  setMovimientoForm(current => ({ ...current, codigoBien: value?.codigoBien ?? 0 }))
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    label='Buscar bien'
                    placeholder='Placa, codigo, articulo o lote'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingBienes ? <CircularProgress color='inherit' size={18} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                size='small'
                label='Tipo'
                value={movimientoForm.tipoMovimiento}
                onChange={event => setMovimientoForm(current => ({ ...current, tipoMovimiento: event.target.value }))}
              >
                <MenuItem value='T'>Traslado</MenuItem>
                <MenuItem value='D'>Desincorporacion</MenuItem>
                <MenuItem value='R'>Reincorporacion</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                size='small'
                type='date'
                label='Fecha movimiento'
                value={movimientoForm.fechaMovimiento}
                InputLabelProps={{ shrink: true }}
                onChange={event => setMovimientoForm(current => ({ ...current, fechaMovimiento: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                size='small'
                options={ubicacionOptions}
                value={findUbicacionValue(movimientoForm.codigoDirBien)}
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
                  setSelectedUbicacion(value)
                  setMovimientoForm(current => ({ ...current, codigoDirBien: value?.codigoDirBien ?? 0 }))
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    label='Ubicacion'
                    placeholder='Codigo, ICP, unidad o direccion'
                    helperText={
                      findUbicacionValue(movimientoForm.codigoDirBien)
                        ? getUbicacionOptionLabel(findUbicacionValue(movimientoForm.codigoDirBien) as BmUbicacionRow)
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
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                size='small'
                options={conceptoOptions}
                value={findConceptoValue(movimientoForm.conceptoMovId)}
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
                  setMovimientoForm(current => ({ ...current, conceptoMovId: value?.id ?? 0 }))
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    label='Concepto movimiento'
                    placeholder='Codigo o descripcion'
                    helperText={
                      findConceptoValue(movimientoForm.conceptoMovId)
                        ? getConceptoOptionLabel(findConceptoValue(movimientoForm.conceptoMovId) as BmDescriptivaRow)
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                size='small'
                label='Observacion'
                value={movimientoForm.observacion}
                onChange={event => setMovimientoForm(current => ({ ...current, observacion: event.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setDirectOpen(false)} disabled={savingMovimiento}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            startIcon={<AddOutlinedIcon />}
            onClick={handleCreateMovimiento}
            disabled={savingMovimiento}
          >
            {savingMovimiento ? 'Guardando' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={approveOpen} onClose={() => setApproveOpen(false)} fullWidth maxWidth='xs'>
        <DialogTitle>Aprobar solicitud</DialogTitle>
        <DialogContent dividers>
          <Alert severity='info'>
            Al aprobar se generara el movimiento real del bien {selectedSolicitud?.numeroPlaca ?? ''}.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setApproveOpen(false)} disabled={approvingSolicitud}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            startIcon={<CheckCircleOutlineOutlinedIcon />}
            onClick={handleApproveSolicitud}
            disabled={approvingSolicitud}
          >
            {approvingSolicitud ? 'Aprobando' : 'Aprobar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default MovimientosList
