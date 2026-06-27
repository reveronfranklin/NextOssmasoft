import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import {
  BmBienRow,
  BmDetalleArticuloRow,
  BmDetalleBienRow,
  BmDescriptivaRow,
  BmFotoRow,
  BmMovimientoRow,
  BmRow,
  BmUbicacionRow
} from 'src/interfaces/Bm/bienes-municipales'
import { bienesMunicipalesEndpoints, bmPost } from 'src/Bm/services/bienesMunicipales.service'
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import { ResultDto } from 'src/interfaces/Bm/result-dto'
import BmScreenHelpButton from 'src/Bm/shared/components/BmScreenHelpButton'

type RowWithId<T> = T & { id: number }

type BmArticuloOption = BmRow & {
  codigoArticulo?: number
  codigo?: string
  denominacion?: string
  clasificacion?: string
}

type CreateBienForm = {
  codigoArticulo: number
  codigoDirBien: number
  cantidad: number
  valorInicial: number
  valorActual: number
  numeroOrdenCompra: string
  fechaCompra: string
  numeroFactura: string
  fechaFactura: string
}

type DetalleBienForm = {
  codigoDetalleBien: number
  tipoEspecificacionId: number
  especificacionId: number
  especificacion: string
}

const createBienInitialForm: CreateBienForm = {
  codigoArticulo: 0,
  codigoDirBien: 0,
  cantidad: 1,
  valorInicial: 0,
  valorActual: 0,
  numeroOrdenCompra: '',
  fechaCompra: '',
  numeroFactura: '',
  fechaFactura: ''
}

const detalleBienInitialForm: DetalleBienForm = {
  codigoDetalleBien: 0,
  tipoEspecificacionId: 0,
  especificacionId: 0,
  especificacion: ''
}

const minFotosEsperadas = 3

const bienesColumns: GridColumns<RowWithId<BmBienRow>> = [
  { field: 'codigoBien', headerName: 'Id', width: 80 },
  { field: 'numeroPlaca', headerName: 'Placa', minWidth: 130 },
  { field: 'articulo', headerName: 'Articulo', minWidth: 190, flex: 1 },
  { field: 'especificacion', headerName: 'Especificacion', minWidth: 220, flex: 1.2 },
  { field: 'responsableBien', headerName: 'Responsable', minWidth: 190 },
  { field: 'unidadTrabajo', headerName: 'Unidad', minWidth: 200 },
  {
    field: 'valorActual',
    headerName: 'Valor Actual',
    width: 130,
    type: 'number',
    valueFormatter: params => Number(params.value ?? 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })
  }
]

const fotosColumns: GridColumns<RowWithId<BmFotoRow>> = [
  { field: 'codigoBienFoto', headerName: 'Id', width: 80 },
  { field: 'titulo', headerName: 'Titulo', minWidth: 180, flex: 1 },
  { field: 'foto', headerName: 'Foto', minWidth: 320, flex: 1.5 }
]

const detallesColumns: GridColumns<RowWithId<BmDetalleBienRow>> = [
  { field: 'codigoDetalleBien', headerName: 'Id', width: 80 },
  { field: 'tipoEspecificacion', headerName: 'Tipo', minWidth: 180, flex: 0.8 },
  { field: 'especificacionIdDescripcion', headerName: 'Valor', minWidth: 160, flex: 0.7 },
  { field: 'especificacion', headerName: 'Especificacion', minWidth: 220, flex: 1 }
]

const movimientosColumns: GridColumns<RowWithId<BmMovimientoRow>> = [
  { field: 'codigoMovBien', headerName: 'Id', width: 80 },
  { field: 'tipoMovimiento', headerName: 'Tipo', width: 90 },
  { field: 'tipoMovimientoDescripcion', headerName: 'Movimiento', minWidth: 170 },
  { field: 'fechaMovimientoString', headerName: 'Fecha', width: 120 },
  { field: 'unidadEjecutora', headerName: 'Unidad', minWidth: 220, flex: 1 },
  { field: 'conceptoMovimiento', headerName: 'Concepto', minWidth: 220, flex: 1 },
  { field: 'esMovimientoFinal', headerName: 'Final', width: 90, type: 'boolean' }
]

const withIds = <T extends object>(items: T[], key: keyof T): RowWithId<T>[] =>
  items.map((item, index) => ({ ...item, id: Number(item[key] ?? index + 1) || index + 1 }))

const getBackendOrigin = () => {
  const baseUrl = ossmmasofApiVertical.defaults.baseURL ?? ''

  try {
    const url = new URL(baseUrl)

    return `${url.protocol}//${url.host}`
  } catch {
    return ''
  }
}

const resolveFotoUrl = (foto?: BmFotoRow | null) => {
  const value = `${foto?.patch || foto?.foto || ''}`.trim()

  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value

  const backendOrigin = getBackendOrigin()
  const normalized = value.startsWith('/') ? value : `/BmFiles/${value}`

  return backendOrigin ? `${backendOrigin}${normalized}` : normalized
}

const getFotoFileName = (foto?: BmFotoRow | null) => {
  const value = `${foto?.foto || foto?.patch || 'foto-bien.jpg'}`.trim()
  const cleanValue = value.split('?')[0].split('#')[0]
  const fileName = cleanValue.substring(cleanValue.lastIndexOf('/') + 1)

  return fileName || 'foto-bien.jpg'
}

const downloadByLink = (url: string, fileName: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.target = '_blank'
  link.rel = 'noreferrer'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

const BienesList = () => {
  const [searchText, setSearchText] = useState('')
  const [bienes, setBienes] = useState<RowWithId<BmBienRow>[]>([])
  const [fotos, setFotos] = useState<RowWithId<BmFotoRow>[]>([])
  const [detalles, setDetalles] = useState<RowWithId<BmDetalleBienRow>[]>([])
  const [detalleTipos, setDetalleTipos] = useState<BmDetalleArticuloRow[]>([])
  const [detalleValores, setDetalleValores] = useState<BmDescriptivaRow[]>([])
  const [loadingDetalleValores, setLoadingDetalleValores] = useState(false)
  const [movimientos, setMovimientos] = useState<RowWithId<BmMovimientoRow>[]>([])
  const [selectedBien, setSelectedBien] = useState<BmBienRow | null>(null)
  const [selectedFoto, setSelectedFoto] = useState<RowWithId<BmFotoRow> | null>(null)
  const [selectedDetalle, setSelectedDetalle] = useState<RowWithId<BmDetalleBienRow> | null>(null)
  const [fotoError, setFotoError] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [detalleOpen, setDetalleOpen] = useState(false)
  const [savingDetalle, setSavingDetalle] = useState(false)
  const [detalleForm, setDetalleForm] = useState<DetalleBienForm>(detalleBienInitialForm)
  const [downloadingFoto, setDownloadingFoto] = useState(false)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [uploadFotoTitle, setUploadFotoTitle] = useState('')
  const [uploadFotoFiles, setUploadFotoFiles] = useState<File[]>([])
  const [uploadInputKey, setUploadInputKey] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [creatingBien, setCreatingBien] = useState(false)
  const [loadingCreateCatalogs, setLoadingCreateCatalogs] = useState(false)
  const [articulos, setArticulos] = useState<BmArticuloOption[]>([])
  const [ubicaciones, setUbicaciones] = useState<BmUbicacionRow[]>([])
  const [createForm, setCreateForm] = useState<CreateBienForm>(createBienInitialForm)
  const [loading, setLoading] = useState(false)
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [message, setMessage] = useState('')

  const selectedTitle = useMemo(() => {
    if (!selectedBien) return 'Seleccione un bien'

    return `${selectedBien.numeroPlaca ?? ''} ${selectedBien.articulo ?? ''}`.trim()
  }, [selectedBien])

  const selectedFotoUrl = useMemo(() => resolveFotoUrl(selectedFoto), [selectedFoto])
  const selectedFotoFileName = useMemo(() => getFotoFileName(selectedFoto), [selectedFoto])
  const selectedArticulo = useMemo(
    () => articulos.find(item => Number(item.codigoArticulo ?? 0) === createForm.codigoArticulo) ?? null,
    [articulos, createForm.codigoArticulo]
  )
  const selectedUbicacion = useMemo(
    () => ubicaciones.find(item => Number(item.codigoDirBien ?? 0) === createForm.codigoDirBien) ?? null,
    [ubicaciones, createForm.codigoDirBien]
  )
  const selectedDetalleTipo = useMemo(
    () => detalleTipos.find(item => Number(item.tipoEspecificacionId ?? 0) === detalleForm.tipoEspecificacionId) ?? null,
    [detalleTipos, detalleForm.tipoEspecificacionId]
  )
  const selectedDetalleValor = useMemo(
    () => detalleValores.find(item => Number(item.id ?? item.descripcionId ?? 0) === detalleForm.especificacionId) ?? null,
    [detalleValores, detalleForm.especificacionId]
  )
  const currentMovimiento = useMemo(() => movimientos[0] ?? null, [movimientos])
  const currentMovimientoLabel = useMemo(() => {
    if (!currentMovimiento) return 'Sin movimiento'

    return currentMovimiento.tipoMovimientoDescripcion || currentMovimiento.tipoMovimiento || 'Movimiento registrado'
  }, [currentMovimiento])
  const usedDetalleTipoIds = useMemo(
    () =>
      new Set(
        detalles
          .filter(item => Number(item.codigoDetalleBien ?? 0) !== detalleForm.codigoDetalleBien)
          .map(item => Number(item.tipoEspecificacionId ?? 0))
          .filter(Boolean)
      ),
    [detalles, detalleForm.codigoDetalleBien]
  )
  const availableDetalleTipos = useMemo(
    () => detalleTipos.filter(item => !usedDetalleTipoIds.has(Number(item.tipoEspecificacionId ?? 0))),
    [detalleTipos, usedDetalleTipoIds]
  )

  const loadCreateCatalogs = useCallback(async () => {
    try {
      setLoadingCreateCatalogs(true)
      setMessage('')
      const [articulosData, ubicacionesData] = await Promise.all([
        bmPost<BmArticuloOption[], unknown>(
          bienesMunicipalesEndpoints.catalogos.articulos,
          { searchText: '', page: 1, pageSize: 200 },
          []
        ),
        bmPost<BmUbicacionRow[], unknown>(
          bienesMunicipalesEndpoints.ubicaciones.getAll,
          { searchText: '', page: 1, pageSize: 200 },
          []
        )
      ])
      setArticulos(articulosData)
      setUbicaciones(ubicacionesData)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudieron cargar los catalogos de incorporacion')
    } finally {
      setLoadingCreateCatalogs(false)
    }
  }, [])

  const handleOpenCreate = () => {
    setCreateOpen(true)
    setCreateForm(createBienInitialForm)
    if (articulos.length === 0 || ubicaciones.length === 0) {
      loadCreateCatalogs()
    }
  }

  const handleCloseCreate = () => {
    if (!creatingBien) {
      setCreateOpen(false)
    }
  }

  const handleCreateFormChange = (field: keyof CreateBienForm, value: string | number) => {
    setCreateForm(current => ({
      ...current,
      [field]: value
    }))
  }

  const handleCreateBien = async () => {
    if (!createForm.codigoArticulo || !createForm.codigoDirBien) {
      setMessage('Debe seleccionar articulo y ubicacion inicial.')

      return
    }

    if (createForm.cantidad <= 0) {
      setMessage('La cantidad debe ser mayor que cero.')

      return
    }

    try {
      setCreatingBien(true)
      setMessage('')

      const created = await bmPost<BmBienRow[], unknown>(
        bienesMunicipalesEndpoints.bienes.create,
        {
          codigoBien: 0,
          codigoArticulo: createForm.codigoArticulo,
          codigoDirBien: createForm.codigoDirBien,
          cantidad: createForm.cantidad,
          codigoProveedor: 0,
          codigoOrdenCompra: 0,
          origenId: 0,
          fechaFabricacion: null,
          numeroOrdenCompra: createForm.numeroOrdenCompra,
          fechaCompra: createForm.fechaCompra || null,
          numeroPlaca: '',
          numeroLote: '',
          valorInicial: createForm.valorInicial,
          valorActual: createForm.valorActual,
          numeroFactura: createForm.numeroFactura,
          fechaFactura: createForm.fechaFactura || null,
          tipoImpuestoId: 0
        },
        []
      )

      const createdWithIds = withIds(created, 'codigoBien')
      setBienes(current => {
        const existingIds = new Set(createdWithIds.map(item => item.codigoBien))

        return [...createdWithIds, ...current.filter(item => !existingIds.has(item.codigoBien))]
      })

      const firstCreated = createdWithIds[0] ?? null
      setSelectedBien(firstCreated)
      setCreateOpen(false)
      setCreateForm(createBienInitialForm)
      setSelectedFoto(null)
      setFotoError(false)
      setDetalles([])
      setDetalleTipos([])
      setSelectedDetalle(null)
      setPreviewOpen(false)
      if (firstCreated) {
        loadRelated(firstCreated)
      }
      setMessage(created.length > 1 ? `Se incorporaron ${created.length} bienes.` : 'Bien incorporado correctamente.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo incorporar el bien')
    } finally {
      setCreatingBien(false)
    }
  }

  const handleDownloadFoto = async () => {
    if (!selectedFotoUrl) return

    try {
      setDownloadingFoto(true)
      const response = await fetch(selectedFotoUrl)

      if (!response.ok) {
        throw new Error('No se pudo descargar la foto')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      downloadByLink(url, selectedFotoFileName)
      URL.revokeObjectURL(url)
    } catch {
      downloadByLink(selectedFotoUrl, selectedFotoFileName)
    } finally {
      setDownloadingFoto(false)
    }
  }

  const handleSelectFotoFiles = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadFotoFiles(Array.from(event.target.files ?? []))
  }

  const clearUploadFotoForm = () => {
    setUploadFotoFiles([])
    setUploadFotoTitle('')
    setUploadInputKey(value => value + 1)
  }

  const handleUploadFoto = async () => {
    if (!selectedBien?.codigoBien || !selectedBien?.numeroPlaca || uploadFotoFiles.length === 0) {
      setMessage('Seleccione un bien y una imagen para agregar la foto.')

      return
    }

    if (!uploadFotoTitle.trim()) {
      setMessage('Debe indicar el titulo de la foto.')

      return
    }

    try {
      setUploadingFoto(true)
      setMessage('')

      const formData = new FormData()
      uploadFotoFiles.forEach(file => formData.append('files', file))
      formData.append('numeroPlaca', selectedBien.numeroPlaca)
      formData.append('titulo', uploadFotoTitle.trim())

      const response = await ossmmasofApiVertical.post<ResultDto<BmFotoRow[]>>(
        bienesMunicipalesEndpoints.fotos.addImage(selectedBien.codigoBien),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (!response.data?.isValid) {
        throw new Error(response.data?.message || 'No se pudo agregar la foto del bien')
      }

      const fotosWithIds = withIds(response.data.data ?? [], 'codigoBienFoto')
      const latestFoto =
        fotosWithIds.reduce<RowWithId<BmFotoRow> | null>((current, item) => {
          if (!current) return item

          return Number(item.codigoBienFoto ?? 0) > Number(current.codigoBienFoto ?? 0) ? item : current
        }, null) ?? fotosWithIds[0] ?? null

      setFotos(fotosWithIds)
      setSelectedFoto(latestFoto)
      setFotoError(false)
      clearUploadFotoForm()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo agregar la foto del bien')
    } finally {
      setUploadingFoto(false)
    }
  }

  const loadDetalleValores = async (tipoEspecificacionId: number) => {
    if (!tipoEspecificacionId) {
      setDetalleValores([])

      return
    }

    try {
      setLoadingDetalleValores(true)
      const data = await bmPost<BmDescriptivaRow[], unknown>(
        bienesMunicipalesEndpoints.catalogos.descriptivasByFk,
        { descripcionFkId: tipoEspecificacionId },
        []
      )
      setDetalleValores(data)
    } catch (error) {
      setDetalleValores([])
      setMessage(error instanceof Error ? error.message : 'No se pudieron cargar los valores de especificacion')
    } finally {
      setLoadingDetalleValores(false)
    }
  }

  const handleOpenDetalle = (detalle?: RowWithId<BmDetalleBienRow>) => {
    if (!selectedBien) {
      setMessage('Seleccione un bien para registrar especificaciones.')

      return
    }

    setSelectedDetalle(detalle ?? null)
    setDetalleForm(
      detalle
        ? {
            codigoDetalleBien: Number(detalle.codigoDetalleBien ?? 0),
            tipoEspecificacionId: Number(detalle.tipoEspecificacionId ?? 0),
            especificacionId: Number(detalle.especificacionId ?? 0),
            especificacion: detalle.especificacion ?? ''
          }
        : detalleBienInitialForm
    )
    loadDetalleValores(Number(detalle?.tipoEspecificacionId ?? 0))
    setDetalleOpen(true)
  }

  const handleCloseDetalle = () => {
    if (!savingDetalle) {
      setDetalleOpen(false)
      setSelectedDetalle(null)
      setDetalleForm(detalleBienInitialForm)
      setDetalleValores([])
    }
  }

  const handleSaveDetalle = async () => {
    if (!selectedBien?.codigoBien) {
      setMessage('Seleccione un bien para registrar especificaciones.')

      return
    }

    if (!detalleForm.tipoEspecificacionId) {
      setMessage('Debe seleccionar el tipo de especificacion.')

      return
    }

    if (usedDetalleTipoIds.has(detalleForm.tipoEspecificacionId)) {
      setMessage('Ya existe un detalle para este tipo de especificacion.')

      return
    }

    try {
      setSavingDetalle(true)
      setMessage('')
      const endpoint = detalleForm.codigoDetalleBien
        ? bienesMunicipalesEndpoints.detallesBien.update
        : bienesMunicipalesEndpoints.detallesBien.create
      const data = await bmPost<BmDetalleBienRow[], unknown>(
        endpoint,
        {
          codigoDetalleBien: detalleForm.codigoDetalleBien,
          codigoBien: selectedBien.codigoBien,
          tipoEspecificacionId: detalleForm.tipoEspecificacionId,
          especificacionId: detalleForm.especificacionId,
          especificacion: detalleForm.especificacion,
          usuarioId: 0
        },
        []
      )

      setDetalles(withIds(data, 'codigoDetalleBien'))
      await refreshSelectedBien(selectedBien.codigoBien)
      setDetalleOpen(false)
      setSelectedDetalle(null)
      setDetalleForm(detalleBienInitialForm)
      setDetalleValores([])
      setMessage('Especificacion del bien actualizada.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar la especificacion del bien')
    } finally {
      setSavingDetalle(false)
    }
  }

  const loadBienes = useCallback(async () => {
    try {
      setLoading(true)
      setMessage('')
      const data = await bmPost<BmBienRow[], unknown>(
        bienesMunicipalesEndpoints.bienes.getAll,
        { searchText, page: 1, pageSize: 100 },
        []
      )
      setBienes(withIds(data, 'codigoBien'))
    } catch (error) {
      setBienes([])
      setMessage(error instanceof Error ? error.message : 'No se pudo consultar la ficha de bienes')
    } finally {
      setLoading(false)
    }
  }, [searchText])

  const refreshSelectedBien = async (codigoBien: number) => {
    const data = await bmPost<BmBienRow[], unknown>(
      bienesMunicipalesEndpoints.bienes.getById,
      { codigoBien },
      []
    )
    const refreshed = data[0]

    if (!refreshed) return

    const refreshedWithId = { ...refreshed, id: Number(refreshed.codigoBien ?? codigoBien) }
    setSelectedBien(refreshedWithId)
    setBienes(current =>
      current.map(item => (Number(item.codigoBien ?? 0) === codigoBien ? { ...item, ...refreshedWithId } : item))
    )
  }

  const loadRelated = useCallback(async (bien: BmBienRow) => {
    try {
      setLoadingRelated(true)
      setMessage('')
      const [fotosData, detallesData, detalleTiposData, movimientosData] = await Promise.all([
        bmPost<BmFotoRow[], unknown>(
          bienesMunicipalesEndpoints.fotos.getByNumeroPlaca,
          { numeroPlaca: bien.numeroPlaca ?? '' },
          []
        ),
        bmPost<BmDetalleBienRow[], unknown>(
          bienesMunicipalesEndpoints.detallesBien.getByBien,
          { codigoBien: bien.codigoBien ?? 0 },
          []
        ),
        bmPost<BmDetalleArticuloRow[], unknown>(
          bienesMunicipalesEndpoints.catalogos.detalleArticulosByArticulo,
          { codigoArticulo: bien.codigoArticulo ?? 0 },
          []
        ),
        bmPost<BmMovimientoRow[], unknown>(
          bienesMunicipalesEndpoints.movimientos.byBien,
          { codigoBien: bien.codigoBien ?? 0 },
          []
        )
      ])
      const fotosWithIds = withIds(fotosData, 'codigoBienFoto')
      setFotos(fotosWithIds)
      setSelectedFoto(fotosWithIds[0] ?? null)
      setFotoError(false)
      setDetalles(withIds(detallesData, 'codigoDetalleBien'))
      setDetalleTipos(detalleTiposData)
      setMovimientos(withIds(movimientosData, 'codigoMovBien'))
    } catch (error) {
      setFotos([])
      setSelectedFoto(null)
      setFotoError(false)
      setDetalles([])
      setDetalleTipos([])
      setMovimientos([])
      setMessage(error instanceof Error ? error.message : 'No se pudo cargar el detalle del bien')
    } finally {
      setLoadingRelated(false)
    }
  }, [])

  useEffect(() => {
    loadBienes()
  }, [loadBienes])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Ficha de bienes' />
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                size='small'
                label='Buscar'
                value={searchText}
                onChange={event => setSearchText(event.target.value)}
              />
              <Button variant='contained' startIcon={<SearchOutlinedIcon />} onClick={loadBienes}>
                Consultar
              </Button>
              <Button variant='outlined' startIcon={<RefreshOutlinedIcon />} onClick={loadBienes}>
                Refrescar
              </Button>
              <Button variant='contained' startIcon={<AddOutlinedIcon />} onClick={handleOpenCreate}>
                Incorporar
              </Button>
              <BmScreenHelpButton title='Ficha de Bienes' docPath='/bm-docs/ficha-bienes.md' />
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
          <CardHeader title='Bienes registrados' />
          <CardContent>
            <Box sx={{ height: 520, width: '100%' }}>
              <DataGrid
                rows={bienes}
                columns={bienesColumns}
                loading={loading}
                pageSize={25}
                rowsPerPageOptions={[25, 50, 100]}
                disableSelectionOnClick
                onRowClick={params => {
                  setSelectedBien(params.row)
                  setSelectedFoto(null)
                  setFotoError(false)
                  setDetalles([])
                  setDetalleTipos([])
                  setSelectedDetalle(null)
                  setPreviewOpen(false)
                  clearUploadFotoForm()
                  loadRelated(params.row)
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title={`Detalle: ${selectedTitle}`} />
          <CardContent>
            <Typography variant='body2' sx={{ mb: 4, color: 'text.secondary' }}>
              La baja o desincorporacion no elimina fisicamente el bien; se consulta por movimientos finales.
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }} alignItems={{ xs: 'stretch', md: 'center' }}>
              <Chip
                color={currentMovimiento?.esMovimientoFinal ? 'warning' : 'success'}
                label={`Estado actual: ${currentMovimientoLabel}`}
                sx={{ justifyContent: 'flex-start' }}
              />
              <Chip
                variant='outlined'
                label={`Ubicacion actual: ${currentMovimiento?.unidadEjecutora || selectedBien?.unidadTrabajo || 'Sin ubicacion'}`}
                sx={{ justifyContent: 'flex-start' }}
              />
              <Chip
                variant='outlined'
                label={`Fecha: ${currentMovimiento?.fechaMovimientoString || selectedBien?.fechaCompraString || 'Sin fecha'}`}
                sx={{ justifyContent: 'flex-start' }}
              />
            </Stack>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent='space-between'
              sx={{ mb: 3 }}
            >
              <Typography variant='subtitle1'>Especificaciones del bien</Typography>
              <Button
                variant='outlined'
                startIcon={<AddOutlinedIcon />}
                disabled={!selectedBien}
                onClick={() => handleOpenDetalle()}
              >
                Agregar especificacion
              </Button>
            </Stack>
            <Box sx={{ height: 280, width: '100%', mb: 5 }}>
              <DataGrid
                rows={detalles}
                columns={[
                  ...detallesColumns,
                  {
                    field: 'acciones',
                    headerName: '',
                    width: 80,
                    sortable: false,
                    filterable: false,
                    renderCell: params => (
                      <IconButton size='small' onClick={() => handleOpenDetalle(params.row)}>
                        <EditOutlinedIcon fontSize='small' />
                      </IconButton>
                    )
                  }
                ]}
                loading={loadingRelated}
                pageSize={10}
                rowsPerPageOptions={[10, 25]}
                disableSelectionOnClick
              />
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ mb: 3 }}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                  <TextField
                    fullWidth
                    size='small'
                    label='Titulo de foto'
                    value={uploadFotoTitle}
                    required
                    disabled={!selectedBien || uploadingFoto}
                    onChange={event => setUploadFotoTitle(event.target.value)}
                  />
                  <Button
                    component='label'
                    variant='outlined'
                    disabled={!selectedBien || uploadingFoto}
                    startIcon={<AddPhotoAlternateOutlinedIcon />}
                    sx={{ minWidth: 150 }}
                  >
                    Seleccionar
                    <input
                      key={uploadInputKey}
                      hidden
                      multiple
                      accept='image/*'
                      type='file'
                      onChange={handleSelectFotoFiles}
                    />
                  </Button>
                  <Button
                    variant='contained'
                    disabled={!selectedBien || uploadingFoto || uploadFotoFiles.length === 0 || !uploadFotoTitle.trim()}
                    startIcon={<AddPhotoAlternateOutlinedIcon />}
                    onClick={handleUploadFoto}
                    sx={{ minWidth: 130 }}
                  >
                    {uploadingFoto ? 'Agregando' : 'Agregar foto'}
                  </Button>
                </Stack>
                {uploadFotoFiles.length > 0 ? (
                  <Typography variant='caption' sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
                    {uploadFotoFiles.map(file => file.name).join(', ')}
                  </Typography>
                ) : null}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  justifyContent='space-between'
                  sx={{ mb: 2 }}
                >
                  <Typography variant='subtitle2'>Fotos del bien</Typography>
                  <Chip
                    size='small'
                    color={fotos.length >= minFotosEsperadas ? 'success' : 'warning'}
                    label={`${fotos.length}/${minFotosEsperadas} fotos`}
                  />
                </Stack>
                {selectedBien && fotos.length < minFotosEsperadas ? (
                  <Alert severity='info' sx={{ mb: 2 }}>
                    La ficha requiere al menos {minFotosEsperadas} fotos para considerarse completa.
                  </Alert>
                ) : null}
                <Box sx={{ height: 260, width: '100%' }}>
                  <DataGrid
                    rows={fotos}
                    columns={fotosColumns}
                    loading={loadingRelated}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25]}
                    disableSelectionOnClick
                    onRowClick={params => {
                      setSelectedFoto(params.row)
                      setFotoError(false)
                    }}
                    sx={{
                      '& .MuiDataGrid-row': {
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    mt: 4,
                    minHeight: 320,
                    border: theme => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: 'background.default'
                  }}
                >
                  <Box
                    sx={{
                      px: 4,
                      py: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: theme => `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Typography variant='subtitle2'>
                      {selectedFoto?.titulo || selectedFoto?.foto || 'Preview de foto'}
                    </Typography>
                    <Stack direction='row' spacing={1}>
                      <Button
                        size='small'
                        variant='text'
                        disabled={!selectedFotoUrl || fotoError}
                        startIcon={<OpenInNewOutlinedIcon />}
                        onClick={() => setPreviewOpen(true)}
                      >
                        Ver grande
                      </Button>
                      {selectedFotoUrl && !fotoError ? (
                        <Button
                          size='small'
                          variant='text'
                          disabled={downloadingFoto}
                          startIcon={<FileDownloadOutlinedIcon />}
                          onClick={handleDownloadFoto}
                        >
                          Descargar
                        </Button>
                      ) : null}
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      height: 266,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3
                    }}
                  >
                    {selectedFotoUrl && !fotoError ? (
                      <Box
                        component='img'
                        src={selectedFotoUrl}
                        alt={selectedFoto?.titulo || selectedFoto?.foto || 'Foto del bien'}
                        onError={() => setFotoError(true)}
                        onClick={() => setPreviewOpen(true)}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: 1,
                          cursor: 'zoom-in'
                        }}
                      />
                    ) : (
                      <Stack alignItems='center' spacing={2} sx={{ color: 'text.secondary', textAlign: 'center' }}>
                        <ImageOutlinedIcon fontSize='large' />
                        <Typography variant='body2'>
                          {selectedFoto ? 'No se pudo mostrar la foto seleccionada.' : 'Seleccione una foto de la lista.'}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <Box sx={{ height: 584, width: '100%' }}>
                  <DataGrid
                    rows={movimientos}
                    columns={movimientosColumns}
                    loading={loadingRelated}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25]}
                    disableSelectionOnClick
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth='lg'>
        <DialogTitle sx={{ pr: 10 }}>
          {selectedFoto?.titulo || selectedFoto?.foto || 'Foto del bien'}
          <IconButton
            aria-label='Cerrar'
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              minHeight: { xs: 360, md: 640 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default'
            }}
          >
            {selectedFotoUrl && !fotoError ? (
              <Box
                component='img'
                src={selectedFotoUrl}
                alt={selectedFoto?.titulo || selectedFoto?.foto || 'Foto del bien'}
                sx={{
                  maxWidth: '100%',
                  maxHeight: { xs: 420, md: 720 },
                  objectFit: 'contain'
                }}
              />
            ) : (
              <Stack alignItems='center' spacing={2} sx={{ color: 'text.secondary', textAlign: 'center' }}>
                <ImageOutlinedIcon fontSize='large' />
                <Typography variant='body2'>No se pudo mostrar la foto seleccionada.</Typography>
              </Stack>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button
            variant='outlined'
            href={selectedFotoUrl}
            target='_blank'
            rel='noreferrer'
            disabled={!selectedFotoUrl || fotoError}
            startIcon={<OpenInNewOutlinedIcon />}
          >
            Abrir original
          </Button>
          <Stack direction='row' spacing={2}>
            <Button variant='outlined' onClick={() => setPreviewOpen(false)}>
              Cerrar
            </Button>
            <Button
              variant='contained'
              disabled={!selectedFotoUrl || fotoError || downloadingFoto}
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={handleDownloadFoto}
            >
              Descargar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
      <Dialog open={detalleOpen} onClose={handleCloseDetalle} fullWidth maxWidth='sm'>
        <DialogTitle>{selectedDetalle ? 'Editar especificacion' : 'Agregar especificacion'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={4} sx={{ pt: 1 }}>
            <Autocomplete
              options={availableDetalleTipos}
              value={selectedDetalleTipo}
              getOptionLabel={option => option.tipoEspecificacion ?? ''}
              isOptionEqualToValue={(option, value) => option.tipoEspecificacionId === value.tipoEspecificacionId}
              onChange={(_, value) => {
                const tipoEspecificacionId = Number(value?.tipoEspecificacionId ?? 0)
                setDetalleForm(current => ({
                  ...current,
                  tipoEspecificacionId,
                  especificacionId: 0
                }))
                loadDetalleValores(tipoEspecificacionId)
              }}
              renderInput={params => <TextField {...params} required label='Tipo de especificacion' size='small' />}
            />
            <Autocomplete
              options={detalleValores}
              value={selectedDetalleValor}
              loading={loadingDetalleValores}
              getOptionLabel={option => option.descripcion ?? ''}
              isOptionEqualToValue={(option, value) =>
                Number(option.id ?? option.descripcionId ?? 0) === Number(value.id ?? value.descripcionId ?? 0)
              }
              onChange={(_, value) =>
                setDetalleForm(current => ({
                  ...current,
                  especificacionId: Number(value?.id ?? value?.descripcionId ?? 0)
                }))
              }
              renderInput={params => <TextField {...params} label='Valor catalogado' size='small' />}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              size='small'
              label='Especificacion'
              value={detalleForm.especificacion}
              onChange={event => setDetalleForm(current => ({ ...current, especificacion: event.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleCloseDetalle} disabled={savingDetalle}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            startIcon={selectedDetalle ? <EditOutlinedIcon /> : <AddOutlinedIcon />}
            disabled={savingDetalle || !detalleForm.tipoEspecificacionId}
            onClick={handleSaveDetalle}
          >
            {savingDetalle ? 'Guardando' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={createOpen} onClose={handleCloseCreate} fullWidth maxWidth='md'>
        <DialogTitle>Incorporar bien</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={4} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={articulos}
                value={selectedArticulo}
                loading={loadingCreateCatalogs}
                getOptionLabel={option =>
                  `${option.codigo ?? option.codigoArticulo ?? ''} ${option.denominacion ?? ''}`.trim()
                }
                isOptionEqualToValue={(option, value) => option.codigoArticulo === value.codigoArticulo}
                onChange={(_, value) => handleCreateFormChange('codigoArticulo', Number(value?.codigoArticulo ?? 0))}
                renderInput={params => <TextField {...params} required label='Articulo' size='small' />}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={ubicaciones}
                value={selectedUbicacion}
                loading={loadingCreateCatalogs}
                getOptionLabel={option =>
                  `${option.codigoDirBien ?? ''} ${option.unidadEjecutora ?? ''} ${option.direccion ?? ''}`.trim()
                }
                isOptionEqualToValue={(option, value) => option.codigoDirBien === value.codigoDirBien}
                onChange={(_, value) => handleCreateFormChange('codigoDirBien', Number(value?.codigoDirBien ?? 0))}
                renderInput={params => <TextField {...params} required label='Ubicacion inicial' size='small' />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                size='small'
                type='number'
                label='Cantidad'
                value={createForm.cantidad}
                inputProps={{ min: 1 }}
                onChange={event => handleCreateFormChange('cantidad', Number(event.target.value || 1))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size='small'
                type='number'
                label='Valor inicial'
                value={createForm.valorInicial}
                onChange={event => {
                  const value = Number(event.target.value || 0)
                  setCreateForm(current => ({ ...current, valorInicial: value, valorActual: value }))
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size='small'
                type='number'
                label='Valor actual'
                value={createForm.valorActual}
                onChange={event => handleCreateFormChange('valorActual', Number(event.target.value || 0))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size='small'
                label='Orden de compra'
                value={createForm.numeroOrdenCompra}
                onChange={event => handleCreateFormChange('numeroOrdenCompra', event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size='small'
                type='date'
                label='Fecha compra'
                value={createForm.fechaCompra}
                InputLabelProps={{ shrink: true }}
                onChange={event => handleCreateFormChange('fechaCompra', event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size='small'
                label='Factura'
                value={createForm.numeroFactura}
                onChange={event => handleCreateFormChange('numeroFactura', event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size='small'
                type='date'
                label='Fecha factura'
                value={createForm.fechaFactura}
                InputLabelProps={{ shrink: true }}
                onChange={event => handleCreateFormChange('fechaFactura', event.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleCloseCreate} disabled={creatingBien}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            startIcon={<AddOutlinedIcon />}
            disabled={
              creatingBien ||
              loadingCreateCatalogs ||
              !createForm.codigoArticulo ||
              !createForm.codigoDirBien ||
              createForm.cantidad <= 0
            }
            onClick={handleCreateBien}
          >
            {creatingBien ? 'Incorporando' : 'Incorporar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default BienesList
