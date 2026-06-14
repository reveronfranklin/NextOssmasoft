import { useMemo, useState } from 'react'
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Grid, IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridCellEditCommitParams, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import CntHelpDialog from '../../components/CntHelpDialog'
import { useCntCurrentUserId } from '../../hooks/useCntCurrentUserId'
import { CntBancoArchivoDetalleLineDto, CntBancoArchivoDto, CntBancoArchivoExtractErrorDto, CntBancoArchivoExtractPageDto } from '../../interfaces/CntDtos'
import { exportCntRowsToExcel } from '../../utils/cntExcelExport'
import {
  CNT_BANCO_ARCHIVO_QUERY_KEY,
  CNT_BANCO_FORMATOS_QUERY_KEY,
  CNT_BANCOS_QUERY_KEY,
  CNT_CUENTAS_BANCO_QUERY_KEY,
  CNT_PERMISSION_CONCILIACION_IMPORT,
  CNT_PERMISSION_CONCILIACION_REPROCESS,
  CNT_PERMISSIONS_QUERY_KEY,
  checkCntPermission,
  confirmCntBancoArchivo,
  createCntBancoArchivoBatch,
  extractCntBancoArchivo,
  fetchCntBancoArchivoPreview,
  fetchCntBancoArchivoTrace,
  fetchCntBancoArchivos,
  fetchCntBancoFormatos,
  fetchCntBancos,
  fetchCntCuentasBanco
} from '../../services/cntService'

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2
  }).format(Number(value || 0))

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('es-VE') : '')

const isValidDateValue = (value?: string) => {
  if (!value) return false

  const date = new Date(value)

  return !Number.isNaN(date.getTime())
}

type BancoArchivoImportFormat = 'CSV_TXT' | 'XLSX' | 'TEXTO_DELIMITADO' | 'TEXTO_LIBRE' | 'PDF_TEXTO' | 'PDF_OCR'
type PreviewFilter = 'TODOS' | 'ERRORES' | 'BAJA_CONFIANZA'

const importFormatOptions: Array<{
  value: BancoArchivoImportFormat
  label: string
  reliability: string
  enabled: boolean
}> = [
  { value: 'CSV_TXT', label: 'CSV/TXT delimitado', reliability: 'Alta confiabilidad', enabled: true },
  { value: 'XLSX', label: 'XLS/XLSX', reliability: 'Alta confiabilidad', enabled: true },
  { value: 'TEXTO_DELIMITADO', label: 'Texto pegado delimitado', reliability: 'Variable, requiere revision', enabled: true },
  { value: 'TEXTO_LIBRE', label: 'Texto libre', reliability: 'Baja, requiere revision', enabled: true },
  { value: 'PDF_TEXTO', label: 'PDF con texto', reliability: 'Media/alta, requiere revision', enabled: true },
  { value: 'PDF_OCR', label: 'PDF/Imagen OCR', reliability: 'Pendiente OCR backend', enabled: false }
]

const parseAmountValue = (value: string) => {
  const cleanValue = value.trim().replace(/\s/g, '')
  if (!cleanValue) {
    return Number.NaN
  }

  if (cleanValue.includes(',')) {
    return Number(cleanValue.replace(/\./g, '').replace(',', '.'))
  }

  return Number(cleanValue)
}

const validatePreviewRow = (row: CntBancoArchivoDetalleLineDto) => {
  const errors: string[] = []

  if (!isValidDateValue(row.fechaTransaccion)) {
    errors.push('Fecha invalida')
  }

  if (!row.numeroTransaccion?.trim()) {
    errors.push('Numero requerido')
  }

  if (!row.tipoTransaccion?.trim()) {
    errors.push('Tipo requerido')
  }

  if (!row.descripcionTransaccion?.trim()) {
    errors.push('Descripcion requerida')
  }

  if (!Number.isFinite(Number(row.montoTransaccion)) || Number(row.montoTransaccion) === 0) {
    errors.push('Monto invalido')
  }

  return errors
}

const getPreviewDuplicateKey = (row: CntBancoArchivoDetalleLineDto) =>
  [
    String(row.fechaTransaccion ?? '').slice(0, 10),
    String(row.numeroTransaccion ?? '').trim().toUpperCase(),
    Number(row.montoTransaccion ?? 0).toFixed(2)
  ].join('|')

const bancoArchivoTemplate = [
  'fecha;numero;tipoId;tipo;descripcion;monto',
  '2026-06-01;TRX-0001;1;DEBITO;Pago proveedor;1500.00',
  '2026-06-02;TRX-0002;2;CREDITO;Deposito;2500.50'
].join('\n')

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el archivo.'))
    reader.readAsDataURL(file)
  })

const dataGridSx = {
  '& .MuiDataGrid-columnHeaders': {
    minHeight: '48px !important',
    maxHeight: '48px !important',
    backgroundColor: 'action.hover'
  },
  '& .MuiDataGrid-columnHeader': {
    minHeight: '48px !important',
    maxHeight: '48px !important',
    alignItems: 'center'
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    color: 'text.primary',
    fontSize: '0.75rem',
    fontWeight: 700,
    lineHeight: 1.4,
    textTransform: 'uppercase'
  }
}

const CntBancoArchivoList = () => {
  const router = useRouter()
  const currentUserId = useCntCurrentUserId()
  const [codigoBanco, setCodigoBanco] = useState<number | ''>('')
  const [codigoCuentaBanco, setCodigoCuentaBanco] = useState<number | ''>('')
  const [searchText, setSearchText] = useState('')
  const [nombreArchivo, setNombreArchivo] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [saldoInicial, setSaldoInicial] = useState('0')
  const [saldoFinal, setSaldoFinal] = useState('0')
  const [parsedRows, setParsedRows] = useState<CntBancoArchivoDetalleLineDto[]>([])
  const [originalRows, setOriginalRows] = useState<CntBancoArchivoDetalleLineDto[]>([])
  const [extractErrors, setExtractErrors] = useState<CntBancoArchivoExtractErrorDto[]>([])
  const [sourceContentBase64, setSourceContentBase64] = useState<string | null>(null)
  const [sourceExtractedText, setSourceExtractedText] = useState<string | null>(null)
  const [sourceExtractedPages, setSourceExtractedPages] = useState<CntBancoArchivoExtractPageDto[]>([])
  const [extractConfidence, setExtractConfidence] = useState<number | null>(null)
  const [formatoCarga, setFormatoCarga] = useState<BancoArchivoImportFormat>('CSV_TXT')
  const [codigoFormato, setCodigoFormato] = useState<number | ''>('')
  const [textoPegado, setTextoPegado] = useState('')
  const [previewFilter, setPreviewFilter] = useState<PreviewFilter>('TODOS')

  const permissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CONCILIACION_IMPORT, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CONCILIACION_IMPORT }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const canImport = permissionQuery.data?.hasPermission === true

  const reprocessPermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CONCILIACION_REPROCESS, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CONCILIACION_REPROCESS }),
    enabled: currentUserId > 0 && canImport,
    retry: 1
  })

  const canReprocessPermission = reprocessPermissionQuery.data?.hasPermission === true

  const bancosQuery = useQuery({
    queryKey: [CNT_BANCOS_QUERY_KEY, currentUserId, 'archivo'],
    queryFn: () => fetchCntBancos(currentUserId),
    enabled: currentUserId > 0 && canImport,
    retry: 1
  })

  const cuentasQuery = useQuery({
    queryKey: [CNT_CUENTAS_BANCO_QUERY_KEY, currentUserId, codigoBanco, 'archivo'],
    queryFn: () => fetchCntCuentasBanco(currentUserId, codigoBanco === '' ? undefined : Number(codigoBanco), true),
    enabled: currentUserId > 0 && canImport,
    retry: 1
  })

  const archivosQuery = useQuery({
    queryKey: [CNT_BANCO_ARCHIVO_QUERY_KEY, currentUserId, codigoBanco, codigoCuentaBanco, searchText],
    queryFn: () =>
      fetchCntBancoArchivos({
        usuarioId: currentUserId,
        codigoBanco: codigoBanco === '' ? null : Number(codigoBanco),
        codigoCuentaBanco: codigoCuentaBanco === '' ? null : Number(codigoCuentaBanco),
        searchText
      }),
    enabled: currentUserId > 0 && canImport,
    retry: 1
  })

  const formatosQuery = useQuery({
    queryKey: [CNT_BANCO_FORMATOS_QUERY_KEY, currentUserId, codigoBanco, codigoCuentaBanco, formatoCarga, 'archivo'],
    queryFn: () =>
      fetchCntBancoFormatos({
        usuarioId: currentUserId,
        codigoBanco: codigoBanco === '' ? null : Number(codigoBanco),
        codigoCuentaBanco: codigoCuentaBanco === '' ? null : Number(codigoCuentaBanco),
        tipoFormato: formatoCarga,
        soloActivos: true
      }),
    enabled: currentUserId > 0 && canImport && codigoBanco !== '',
    retry: 1
  })

  const confirmMutation = useMutation({
    mutationFn: confirmCntBancoArchivo,
    onSuccess: async result => {
      toast.success(`Archivo confirmado: ${result?.cantidad ?? 0} movimientos`)
      await archivosQuery.refetch()
    },
    onError: error => toast.error((error as Error).message)
  })

  const extractMutation = useMutation({
    mutationFn: extractCntBancoArchivo,
    onError: error => toast.error((error as Error).message)
  })

  const detailsMutation = useMutation({
    mutationFn: fetchCntBancoArchivoPreview,
    onError: error => toast.error((error as Error).message)
  })

  const traceMutation = useMutation({
    mutationFn: fetchCntBancoArchivoTrace,
    onError: error => toast.error((error as Error).message)
  })

  const createBatchMutation = useMutation({
    mutationFn: createCntBancoArchivoBatch,
    onSuccess: async result => {
      toast.success(`Carga creada: ${result?.cantidad ?? 0} movimientos`)
      setParsedRows([])
      setOriginalRows([])
      setExtractErrors([])
      setSourceContentBase64(null)
      setSourceExtractedText(null)
      setSourceExtractedPages([])
      setExtractConfidence(null)
      setNombreArchivo('')
      setTextoPegado('')
      await archivosQuery.refetch()
    },
    onError: error => toast.error((error as Error).message)
  })

  const applyExtractResult = (
    rows: CntBancoArchivoDetalleLineDto[],
    sourceName: string,
    errors: CntBancoArchivoExtractErrorDto[] = [],
    confidence: number | null = null,
    extractedText: string | null = null,
    extractedPages: CntBancoArchivoExtractPageDto[] = []
  ) => {
    setNombreArchivo(sourceName)
    setParsedRows(rows)
    setOriginalRows(rows.map(row => ({ ...row, advertencias: row.advertencias ? [...row.advertencias] : [] })))
    setExtractErrors(errors)
    setExtractConfidence(confidence)
    setSourceExtractedText(extractedText)
    setSourceExtractedPages(extractedPages)
    if (!fechaDesde && rows[0]?.fechaTransaccion) {
      setFechaDesde(rows[0].fechaTransaccion.slice(0, 10))
    }
    if (!fechaHasta && rows[rows.length - 1]?.fechaTransaccion) {
      setFechaHasta(rows[rows.length - 1].fechaTransaccion.slice(0, 10))
    }
  }

  const handleFileChange = async (file?: File) => {
    if (!file) {
      return
    }

    if (formatoCarga === 'PDF_OCR') {
      toast.error('Este formato requiere motor de extraccion backend y aun no esta disponible.')

      return
    }

    try {
      const fileContent = await fileToDataUrl(file)
      const result = await extractMutation.mutateAsync({
        usuarioId: currentUserId,
        codigoBanco: codigoBanco === '' ? null : Number(codigoBanco),
        codigoCuentaBanco: codigoCuentaBanco === '' ? null : Number(codigoCuentaBanco),
        codigoFormato: codigoFormato === '' ? null : Number(codigoFormato),
        tipoFormato: formatoCarga,
        nombreArchivo: file.name,
        contenidoBase64: fileContent,
        textoPegado: null
      })

      setSourceContentBase64(fileContent)
      applyExtractResult(result?.lineas ?? [], file.name, result?.errores ?? [], result?.confianzaPromedio ?? null, result?.textoExtraido ?? null, result?.paginasTexto ?? [])
      if (result?.cantidadErrores) {
        toast.error(`Se omitieron ${result.cantidadErrores} lineas con errores.`)
      }
    } catch {
      setParsedRows([])
      setOriginalRows([])
      setExtractErrors([])
      setSourceContentBase64(null)
      setSourceExtractedText(null)
      setSourceExtractedPages([])
      setExtractConfidence(null)
    }
  }

  const handleParseText = async () => {
    try {
      const result = await extractMutation.mutateAsync({
        usuarioId: currentUserId,
        codigoBanco: codigoBanco === '' ? null : Number(codigoBanco),
        codigoCuentaBanco: codigoCuentaBanco === '' ? null : Number(codigoCuentaBanco),
        codigoFormato: codigoFormato === '' ? null : Number(codigoFormato),
        tipoFormato: formatoCarga === 'TEXTO_LIBRE' ? 'TEXTO_LIBRE' : 'TEXTO_DELIMITADO',
        nombreArchivo: nombreArchivo || 'texto-pegado.txt',
        contenidoBase64: null,
        textoPegado
      })

      setSourceContentBase64(null)
      applyExtractResult(result?.lineas ?? [], nombreArchivo || 'texto-pegado.txt', result?.errores ?? [], result?.confianzaPromedio ?? null, textoPegado, [])
      if (result?.cantidadErrores) {
        toast.error(`Se omitieron ${result.cantidadErrores} lineas con errores.`)
      }
    } catch {
      setParsedRows([])
      setOriginalRows([])
      setExtractErrors([])
      setSourceContentBase64(null)
      setSourceExtractedText(null)
      setSourceExtractedPages([])
      setExtractConfidence(null)
    }
  }

  const handleReprocess = async () => {
    if (!canReprocessPermission) {
      toast.error(`El usuario no tiene el permiso requerido: ${CNT_PERMISSION_CONCILIACION_REPROCESS}.`)

      return
    }

    const pastedText = sourceContentBase64 ? null : sourceExtractedText || textoPegado
    if (!sourceContentBase64 && !pastedText) {
      toast.error('No hay archivo o texto origen para reprocesar.')

      return
    }

    try {
      const result = await extractMutation.mutateAsync({
        usuarioId: currentUserId,
        codigoBanco: codigoBanco === '' ? null : Number(codigoBanco),
        codigoCuentaBanco: codigoCuentaBanco === '' ? null : Number(codigoCuentaBanco),
        codigoFormato: codigoFormato === '' ? null : Number(codigoFormato),
        tipoFormato: sourceContentBase64 ? formatoCarga : formatoCarga === 'TEXTO_LIBRE' ? 'TEXTO_LIBRE' : 'TEXTO_DELIMITADO',
        nombreArchivo: nombreArchivo || 'reproceso-banco.txt',
        contenidoBase64: sourceContentBase64,
        textoPegado: pastedText
      })

      applyExtractResult(
        result?.lineas ?? [],
        nombreArchivo || 'reproceso-banco.txt',
        result?.errores ?? [],
        result?.confianzaPromedio ?? null,
        result?.textoExtraido ?? pastedText ?? null,
        result?.paginasTexto ?? []
      )
      if (result?.cantidadErrores) {
        toast.error(`Se omitieron ${result.cantidadErrores} lineas con errores.`)
      }
    } catch {
      // El toast de error lo maneja la mutacion.
    }
  }

  const handleCreateBatch = () => {
    if (codigoBanco === '' || codigoCuentaBanco === '') {
      toast.error('Seleccione banco y cuenta.')

      return
    }

    if (!nombreArchivo || !fechaDesde || !fechaHasta || parsedRows.length === 0) {
      toast.error('Complete archivo, fechas y movimientos.')

      return
    }

    if (invalidPreviewCount > 0) {
      toast.error('Corrija las filas invalidas antes de guardar.')

      return
    }

    if (lowConfidenceCount > 0) {
      toast.error('Revise las filas de baja confianza antes de guardar.')

      return
    }

    if (duplicatePreviewCount > 0) {
      toast.error('Revise las filas duplicadas antes de guardar.')

      return
    }

    const initialBalance = parseAmountValue(saldoInicial)
    const finalBalance = parseAmountValue(saldoFinal)

    if (Number.isNaN(initialBalance) || Number.isNaN(finalBalance)) {
      toast.error('Saldos invalidos.')

      return
    }

    if (balanceDifference !== null && Math.abs(balanceDifference) > 0.01) {
      toast.error('El saldo final no coincide con saldo inicial mas movimientos.')

      return
    }

    createBatchMutation.mutate({
      usuarioId: currentUserId,
      codigoBanco: Number(codigoBanco),
      codigoCuentaBanco: Number(codigoCuentaBanco),
      codigoFormato: codigoFormato === '' ? null : Number(codigoFormato),
      tipoFormato: formatoCarga,
      nombreArchivo,
      fechaDesde,
      fechaHasta,
      saldoInicial: initialBalance,
      saldoFinal: finalBalance,
      confianzaPromedio: extractConfidence,
      contenidoBase64: sourceContentBase64,
      textoOrigen: sourceExtractedText,
      paginasTexto: sourceExtractedPages,
      errores: extractErrors,
      detallesOriginales: originalRows.length > 0 ? originalRows : parsedRows,
      detalles: parsedRows
    })
  }

  const handleLoadPendingPreview = async (row: CntBancoArchivoDto) => {
    try {
      const preview = await detailsMutation.mutateAsync({
        usuarioId: currentUserId,
        codigoBancoArchivoControl: row.codigoBancoArchivoControl
      })

      setCodigoBanco(row.codigoBanco)
      setCodigoCuentaBanco(row.codigoCuentaBanco)
      setCodigoFormato('')
      setNombreArchivo(row.nombreArchivo)
      setFechaDesde(String(row.fechaDesde ?? '').slice(0, 10))
      setFechaHasta(String(row.fechaHasta ?? '').slice(0, 10))
      setSaldoInicial(String(row.saldoInicial ?? 0))
      setSaldoFinal(String(row.saldoFinal ?? 0))
      setParsedRows(preview?.lineas ?? [])
      setOriginalRows(preview?.detallesOriginales ?? preview?.lineas ?? [])
      setExtractErrors(preview?.errores ?? [])
      setSourceContentBase64(null)
      setSourceExtractedText(preview?.textoExtraido ?? null)
      setSourceExtractedPages(preview?.paginasTexto ?? [])
      setExtractConfidence(preview?.confianzaPromedio ?? null)
      setTextoPegado('')
      toast.success(`Preview reabierto: ${preview?.lineas?.length ?? 0} movimientos`)
    } catch {
      // El toast de error lo maneja la mutacion.
    }
  }

  const handleExportPreviewExcel = () => {
    const rows = parsedRows.map(row => ({
      Fecha: formatDate(row.fechaTransaccion),
      Numero: row.numeroTransaccion,
      TipoId: row.tipoTransaccionId,
      Tipo: row.tipoTransaccion,
      Descripcion: row.descripcionTransaccion,
      Monto: row.montoTransaccion
    }))

    exportCntRowsToExcel(rows, 'Preview banco', 'CNT-Carga-Banco-Preview')
  }

  const handleExportErrorsExcel = () => {
    const rows = extractErrors.map(error => ({
      Linea: error.numeroLinea,
      Campo: error.campo,
      Mensaje: error.mensaje,
      TextoOrigen: error.textoOrigen
    }))

    exportCntRowsToExcel(rows, 'Errores de extraccion', 'CNT-Carga-Banco-Errores')
  }

  const handleValidatePreview = () => {
    if (parsedRows.length === 0) {
      toast.error('No hay movimientos para validar.')

      return
    }

    if (invalidPreviewCount > 0) {
      setPreviewFilter('ERRORES')
      toast.error(`Hay ${invalidPreviewCount} fila(s) con errores.`)

      return
    }

    if (lowConfidenceCount > 0) {
      setPreviewFilter('BAJA_CONFIANZA')
      toast.error(`Hay ${lowConfidenceCount} fila(s) con baja confianza.`)

      return
    }

    if (balanceDifference !== null && Math.abs(balanceDifference) > 0.01) {
      toast.error(`Diferencia de saldo: ${formatMoney(balanceDifference)}.`)

      return
    }

    setPreviewFilter('TODOS')
    toast.success('Preview validado sin errores bloqueantes.')
  }

  const handleDownloadTemplate = () => {
    const blob = new Blob([bancoArchivoTemplate], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'plantilla-importar-estados-cuenta.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportArchivosExcel = () => {
    const rows = (archivosQuery.data ?? []).map(row => ({
      Archivo: row.nombreArchivo,
      Banco: row.banco,
      Cuenta: row.noCuenta,
      Desde: formatDate(row.fechaDesde),
      Hasta: formatDate(row.fechaHasta),
      Movimientos: row.cantidadMovimientos,
      Monto: row.montoMovimientos,
      SaldoInicial: row.saldoInicial,
      SaldoFinal: row.saldoFinal,
      Estado: row.confirmado ? 'Confirmado' : 'Preview',
      EstadoCuenta: row.codigoEstadoCuenta ?? ''
    }))

    exportCntRowsToExcel(rows, 'Estados de cuenta importados', 'CNT-Estados-Cuenta-Importados')
  }

  const handleExportTraceExcel = async () => {
    const rows = await traceMutation.mutateAsync({
      usuarioId: currentUserId,
      codigoBanco: codigoBanco === '' ? null : Number(codigoBanco),
      codigoCuentaBanco: codigoCuentaBanco === '' ? null : Number(codigoCuentaBanco),
      soloConErrores: true,
      searchText
    })

    exportCntRowsToExcel(
      rows.map(row => ({
        Archivo: row.nombreArchivo,
        Banco: row.banco,
        Cuenta: row.noCuenta,
        Formato: row.tipoFormato,
        EstadoExtraccion: row.estadoExtraccion,
        Confianza: row.confianzaPromedio,
        Errores: row.cantidadErrores,
        Cambios: row.cantidadCambios,
        Movimientos: row.cantidadMovimientos,
        FechaExtraccion: formatDate(row.fechaExtraccion),
        UsuarioExtrae: row.usuarioExtrae ?? '',
        UsuarioCorrige: row.usuarioCorrige ?? '',
        UsuarioConfirma: row.usuarioConfirma ?? '',
        FechaConfirma: formatDate(row.fechaConfirma ?? undefined),
        Confirmado: row.confirmado ? 'Si' : 'No'
      })),
      'Cargas con errores',
      'CNT-Cargas-Con-Errores'
    )
  }

  const previewRows = useMemo(() => {
    const keyCounts = parsedRows.reduce<Record<string, number>>((acc, row) => {
      const key = getPreviewDuplicateKey(row)
      acc[key] = (acc[key] ?? 0) + 1

      return acc
    }, {})

    return parsedRows.map((row, index) => {
      const errores = validatePreviewRow(row)
      if (keyCounts[getPreviewDuplicateKey(row)] > 1) {
        errores.push('Duplicado en preview')
      }

      return { id: index + 1, errores, ...row }
    })
  }, [parsedRows])
  const invalidPreviewCount = useMemo(() => previewRows.filter(row => row.errores.length > 0).length, [previewRows])
  const duplicatePreviewCount = useMemo(() => previewRows.filter(row => row.errores.includes('Duplicado en preview')).length, [previewRows])
  const lowConfidenceCount = useMemo(() => previewRows.filter(row => Number(row.confianza ?? 1) < 0.75).length, [previewRows])
  const filteredPreviewRows = useMemo(() => {
    if (previewFilter === 'ERRORES') {
      return previewRows.filter(row => row.errores.length > 0)
    }

    if (previewFilter === 'BAJA_CONFIANZA') {
      return previewRows.filter(row => Number(row.confianza ?? 1) < 0.75)
    }

    return previewRows
  }, [previewFilter, previewRows])
  const balanceDifference = useMemo(() => {
    if (parsedRows.length === 0) {
      return null
    }

    const initialBalance = parseAmountValue(saldoInicial)
    const finalBalance = parseAmountValue(saldoFinal)
    if (Number.isNaN(initialBalance) || Number.isNaN(finalBalance)) {
      return null
    }

    if (initialBalance === 0 && finalBalance === 0) {
      return null
    }

    const movementTotal = parsedRows.reduce((sum, row) => sum + Number(row.montoTransaccion || 0), 0)

    return Number((initialBalance + movementTotal - finalBalance).toFixed(2))
  }, [parsedRows, saldoFinal, saldoInicial])
  const canReprocess = Boolean(sourceContentBase64 || sourceExtractedText || textoPegado)

  const handlePreviewCellEditCommit = (params: GridCellEditCommitParams) => {
    const index = Number(params.id) - 1
    const field = params.field as keyof CntBancoArchivoDetalleLineDto
    const value = params.value

    setParsedRows(rows =>
      rows.map((row, rowIndex) => {
        if (rowIndex !== index) {
          return row
        }

        if (field === 'tipoTransaccionId') {
          return { ...row, tipoTransaccionId: Number(value || 1), confianza: 1, advertencias: [] }
        }

        if (field === 'montoTransaccion') {
          const amount = parseAmountValue(String(value ?? ''))

          return { ...row, montoTransaccion: Number.isNaN(amount) ? 0 : amount, confianza: 1, advertencias: [] }
        }

        return { ...row, [field]: String(value ?? ''), confianza: 1, advertencias: [] }
      })
    )
  }

  const previewColumns = useMemo<GridColumns<(CntBancoArchivoDetalleLineDto & { id: number; errores: string[] })>>(
    () => [
      { field: 'fechaTransaccion', headerName: 'Fecha', width: 120, editable: true, valueFormatter: params => String(params.value ?? '').slice(0, 10) },
      { field: 'numeroTransaccion', headerName: 'Numero', width: 130, editable: true },
      { field: 'tipoTransaccionId', headerName: 'Tipo ID', width: 100, editable: true, align: 'right', headerAlign: 'right' },
      { field: 'tipoTransaccion', headerName: 'Tipo', width: 130, editable: true },
      { field: 'descripcionTransaccion', headerName: 'Descripcion', minWidth: 220, flex: 1, editable: true },
      { field: 'montoTransaccion', headerName: 'Monto', width: 150, align: 'right', headerAlign: 'right', editable: true, valueFormatter: params => formatMoney(params.value as number) },
      {
        field: 'confianza',
        headerName: 'Conf.',
        width: 110,
        align: 'right',
        headerAlign: 'right',
        renderCell: ({ row }) => {
          const confidence = Number(row.confianza ?? 0)
          const color = confidence >= 0.9 ? 'success' : confidence >= 0.75 ? 'warning' : 'error'
          const warnings = row.advertencias?.length ? row.advertencias.join(', ') : 'Sin advertencias'

          return (
            <Tooltip title={warnings}>
              <Chip size='small' color={color} variant='outlined' label={`${Math.round(confidence * 100)}%`} />
            </Tooltip>
          )
        }
      },
      {
        field: 'errores',
        headerName: 'Validacion',
        minWidth: 180,
        flex: 0.5,
        sortable: false,
        renderCell: ({ row }) =>
          row.errores.length > 0 ? (
            <Tooltip title={row.errores.join(', ')}>
              <Chip size='small' color='error' variant='outlined' label={`${row.errores.length} error(es)`} />
            </Tooltip>
          ) : (
            <Chip size='small' color='success' variant='outlined' label='OK' />
          )
      }
    ],
    []
  )

  const columns = useMemo<GridColumns<CntBancoArchivoDto>>(
    () => [
      { field: 'nombreArchivo', headerName: 'Archivo', minWidth: 220, flex: 1 },
      { field: 'banco', headerName: 'Banco', minWidth: 170, flex: 0.8 },
      { field: 'noCuenta', headerName: 'Cuenta', minWidth: 160, flex: 0.7 },
      { field: 'fechaDesde', headerName: 'Desde', width: 120, valueFormatter: params => formatDate(params.value as string) },
      { field: 'fechaHasta', headerName: 'Hasta', width: 120, valueFormatter: params => formatDate(params.value as string) },
      { field: 'cantidadMovimientos', headerName: 'Mov.', width: 90, align: 'right', headerAlign: 'right' },
      { field: 'montoMovimientos', headerName: 'Monto', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      { field: 'saldoInicial', headerName: 'Saldo inicial', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      { field: 'saldoFinal', headerName: 'Saldo final', width: 150, align: 'right', headerAlign: 'right', valueFormatter: params => formatMoney(params.value as number) },
      {
        field: 'confirmado',
        headerName: 'Estado',
        width: 130,
        renderCell: ({ row }) => (
          <Chip size='small' label={row.confirmado ? 'Confirmado' : 'Preview'} color={row.confirmado ? 'success' : 'warning'} variant='outlined' />
        )
      },
      {
        field: 'actions',
        headerName: '',
        width: 120,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction='row' spacing={1}>
            <Tooltip title='Reabrir preview'>
              <span>
                <IconButton
                  color='secondary'
                  size='small'
                  disabled={row.confirmado || detailsMutation.isPending}
                  onClick={() => handleLoadPendingPreview(row)}
                >
                  <Icon icon='mdi:file-eye-outline' />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title='Confirmar'>
              <span>
                <IconButton
                  color='primary'
                  size='small'
                  disabled={row.confirmado || confirmMutation.isPending}
                  onClick={() => confirmMutation.mutate({ usuarioId: currentUserId, codigoBancoArchivoControl: row.codigoBancoArchivoControl })}
                >
                  <Icon icon='mdi:check-decagram-outline' />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        )
      }
    ],
    [confirmMutation, currentUserId, detailsMutation.isPending]
  )

  if (currentUserId <= 0 || permissionQuery.isLoading) {
    return <Spinner />
  }

  if (!canImport) {
    return <Alert severity='warning'>El usuario no tiene el permiso requerido: {CNT_PERMISSION_CONCILIACION_IMPORT}.</Alert>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant='h5'>Importar estado de cuenta</Typography>
              <Typography variant='body2' color='text.secondary'>
                Archivo delimitado con movimientos bancarios.
              </Typography>
            </Box>
            <Stack direction='row' spacing={2}>
              <CntHelpDialog context='carga-banco' />
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:tune-variant' />}
                onClick={() => router.push('/apps/cnt/conciliacion/formatos-banco')}
              >
                Formatos
              </Button>
              <Button
                variant='outlined'
                component='label'
                startIcon={<Icon icon='mdi:upload-outline' />}
                disabled={extractMutation.isPending || formatoCarga === 'PDF_OCR'}
              >
                Archivo
                <input
                  hidden
                  type='file'
                  accept={formatoCarga === 'XLSX' ? '.xlsx,.xls' : formatoCarga === 'PDF_TEXTO' ? '.pdf' : '.csv,.txt'}
                  onChange={event => handleFileChange(event.target.files?.[0])}
                />
              </Button>
              <Button variant='outlined' startIcon={<Icon icon='mdi:file-download-outline' />} onClick={handleDownloadTemplate}>
                Plantilla
              </Button>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:refresh' />}
                disabled={extractMutation.isPending || !canReprocess || !canReprocessPermission}
                onClick={handleReprocess}
              >
                Reprocesar
              </Button>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:check-circle-outline' />}
                disabled={parsedRows.length === 0}
                onClick={handleValidatePreview}
              >
                Validar
              </Button>
              <Button
                variant='contained'
                startIcon={<Icon icon='mdi:content-save-outline' />}
                disabled={
                  createBatchMutation.isPending ||
                  extractMutation.isPending ||
                  parsedRows.length === 0 ||
                  invalidPreviewCount > 0 ||
                  lowConfidenceCount > 0 ||
                  duplicatePreviewCount > 0 ||
                  (balanceDifference !== null && Math.abs(balanceDifference) > 0.01)
                }
                onClick={handleCreateBatch}
              >
                Guardar
              </Button>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:file-excel-outline' />}
                disabled={parsedRows.length === 0}
                onClick={handleExportPreviewExcel}
              >
                Excel
              </Button>
              <Button
                variant='outlined'
                color='warning'
                startIcon={<Icon icon='mdi:alert-box-outline' />}
                disabled={extractErrors.length === 0}
                onClick={handleExportErrorsExcel}
              >
                Errores
              </Button>
            </Stack>
          </CardActions>
          <CardContent>
            <Alert severity='info' sx={{ mb: 4 }}>
              <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                Flujo operativo: seleccione un formato de CNT_BANCO_FORMATO, revise el preview y guarde la carga.
              </Typography>
              <Typography variant='body2'>
                El guardado crea el control del archivo y deja la revision en CNT_BANCO_ARCHIVO_EXTRACCION. Mientras el registro este en estado Preview puede reabrirse, corregirse y confirmarse; al confirmar se generan los movimientos bancarios definitivos.
              </Typography>
            </Alert>
            {extractErrors.length > 0 && (
              <Alert severity='warning' sx={{ mb: 4 }}>
                <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                  Lineas omitidas por el extractor: {extractErrors.length}
                </Typography>
                {extractErrors.slice(0, 5).map(error => (
                  <Typography key={`${error.numeroLinea}-${error.mensaje}`} variant='body2'>
                    Linea {error.numeroLinea}: {error.mensaje}
                  </Typography>
                ))}
                {extractErrors.length > 5 && (
                  <Typography variant='body2'>Hay {extractErrors.length - 5} error(es) adicional(es).</Typography>
                )}
              </Alert>
            )}
            {invalidPreviewCount > 0 && (
              <Alert severity='error' sx={{ mb: 4 }}>
                Hay {invalidPreviewCount} fila(s) del preview con datos incompletos o invalidos. Corrija las celdas marcadas antes de guardar.
              </Alert>
            )}
            {lowConfidenceCount > 0 && (
              <Alert severity='warning' sx={{ mb: 4 }}>
                Hay {lowConfidenceCount} fila(s) con baja confianza. Revise o edite esas filas antes de guardar.
              </Alert>
            )}
            {duplicatePreviewCount > 0 && (
              <Alert severity='error' sx={{ mb: 4 }}>
                Hay {duplicatePreviewCount} fila(s) duplicada(s) dentro del preview.
              </Alert>
            )}
            {balanceDifference !== null && Math.abs(balanceDifference) > 0.01 && (
              <Alert severity='error' sx={{ mb: 4 }}>
                El saldo final no coincide con saldo inicial mas movimientos. Diferencia: {formatMoney(balanceDifference)}.
              </Alert>
            )}
            {sourceExtractedText && (
              <TextField
                fullWidth
                multiline
                minRows={3}
                maxRows={8}
                label='Texto origen extraido'
                size='small'
                value={sourceExtractedText}
                InputProps={{ readOnly: true }}
                sx={{ mb: 4 }}
              />
            )}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label='Banco'
                  size='small'
                  value={codigoBanco}
                  onChange={event => {
                    setCodigoBanco(event.target.value === '' ? '' : Number(event.target.value))
                    setCodigoCuentaBanco('')
                    setCodigoFormato('')
                  }}
                >
                  <MenuItem value=''>Seleccione</MenuItem>
                  {(bancosQuery.data ?? []).map(banco => (
                    <MenuItem key={banco.codigoBanco} value={banco.codigoBanco}>
                      {banco.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label='Cuenta'
                  size='small'
                  value={codigoCuentaBanco}
                  onChange={event => {
                    setCodigoCuentaBanco(event.target.value === '' ? '' : Number(event.target.value))
                    setCodigoFormato('')
                  }}
                >
                  <MenuItem value=''>Seleccione</MenuItem>
                  {(cuentasQuery.data ?? []).map(cuenta => (
                    <MenuItem key={cuenta.codigoCuentaBanco} value={cuenta.codigoCuentaBanco}>
                      {cuenta.noCuenta} - {cuenta.banco}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  select
                  label='Formato de entrada'
                  size='small'
                  value={formatoCarga}
                  onChange={event => {
                    setFormatoCarga(event.target.value as BancoArchivoImportFormat)
                    setParsedRows([])
                    setOriginalRows([])
                    setExtractErrors([])
                    setSourceContentBase64(null)
                    setSourceExtractedText(null)
                    setSourceExtractedPages([])
                    setExtractConfidence(null)
                    setCodigoFormato('')
                  }}
                >
                  {importFormatOptions.map(option => (
                    <MenuItem key={option.value} value={option.value} disabled={!option.enabled}>
                      {option.label} - {option.reliability}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label='Configuracion'
                  size='small'
                  value={codigoFormato}
                  onChange={event => setCodigoFormato(event.target.value === '' ? '' : Number(event.target.value))}
                >
                  <MenuItem value=''>Columnas estandar</MenuItem>
                  {(formatosQuery.data ?? []).map(format => (
                    <MenuItem key={format.codigoFormato} value={format.codigoFormato}>
                      {format.nombreFormato} {format.codigoCuentaBanco ? `- ${format.cuenta}` : '- banco'}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label='Archivo' size='small' value={nombreArchivo} onChange={event => setNombreArchivo(event.target.value)} />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth type='date' label='Desde' size='small' InputLabelProps={{ shrink: true }} value={fechaDesde} onChange={event => setFechaDesde(event.target.value)} />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth type='date' label='Hasta' size='small' InputLabelProps={{ shrink: true }} value={fechaHasta} onChange={event => setFechaHasta(event.target.value)} />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth label='Saldo inicial' size='small' value={saldoInicial} onChange={event => setSaldoInicial(event.target.value)} />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth label='Saldo final' size='small' value={saldoFinal} onChange={event => setSaldoFinal(event.target.value)} />
              </Grid>
              <Grid item xs={12} md={1}>
                <Chip label={parsedRows.length} color={parsedRows.length > 0 ? 'primary' : 'default'} sx={{ width: '100%', height: 40 }} />
              </Grid>
              {(formatoCarga === 'TEXTO_DELIMITADO' || formatoCarga === 'TEXTO_LIBRE') && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label='Texto pegado'
                    placeholder={formatoCarga === 'TEXTO_LIBRE' ? '01/06/2026 Pago proveedor 1.500,00' : 'fecha;numero;tipoId;tipo;descripcion;monto'}
                    value={textoPegado}
                    onChange={event => setTextoPegado(event.target.value)}
                  />
                  <Button
                    sx={{ mt: 2 }}
                    variant='outlined'
                    startIcon={<Icon icon='mdi:text-box-search-outline' />}
                    disabled={extractMutation.isPending || !textoPegado.trim()}
                    onClick={handleParseText}
                  >
                    Previsualizar texto
                  </Button>
                </Grid>
              )}
            </Grid>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent='space-between' sx={{ mb: 2 }}>
              <Stack direction='row' spacing={1} flexWrap='wrap'>
                <Chip size='small' variant='outlined' label={`Todos ${previewRows.length}`} />
                <Chip size='small' color='error' variant='outlined' label={`Errores ${invalidPreviewCount}`} />
                <Chip size='small' color='warning' variant='outlined' label={`Baja confianza ${lowConfidenceCount}`} />
              </Stack>
              <TextField
                select
                size='small'
                label='Filtro preview'
                value={previewFilter}
                onChange={event => setPreviewFilter(event.target.value as PreviewFilter)}
                sx={{ width: { xs: '100%', sm: 220 } }}
              >
                <MenuItem value='TODOS'>Todos</MenuItem>
                <MenuItem value='ERRORES'>Con errores</MenuItem>
                <MenuItem value='BAJA_CONFIANZA'>Baja confianza</MenuItem>
              </TextField>
            </Stack>
            <DataGrid
              autoHeight
              rows={filteredPreviewRows}
              columns={previewColumns}
              onCellEditCommit={handlePreviewCellEditCommit}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 25]}
              disableSelectionOnClick
              density='compact'
              headerHeight={48}
              sx={dataGridSx}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant='h5'>Estados de cuenta importados</Typography>
              <Typography variant='body2' color='text.secondary'>
                Revision y confirmacion de archivos bancarios cargados.
              </Typography>
            </Box>
            <Stack direction='row' spacing={2}>
              <Button variant='outlined' startIcon={<Icon icon='mdi:refresh' />} onClick={() => archivosQuery.refetch()}>
                Actualizar
              </Button>
              <Button
                variant='outlined'
                color='warning'
                startIcon={<Icon icon='mdi:clipboard-alert-outline' />}
                disabled={traceMutation.isPending}
                onClick={handleExportTraceExcel}
              >
                Diagnostico
              </Button>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:file-excel-outline' />}
                disabled={(archivosQuery.data ?? []).length === 0}
                onClick={handleExportArchivosExcel}
              >
                Excel
              </Button>
            </Stack>
          </CardActions>
          <CardContent>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={5}>
                <TextField fullWidth label='Buscar archivo' size='small' value={searchText} onChange={event => setSearchText(event.target.value)} />
              </Grid>
            </Grid>

            <DataGrid
              autoHeight
              rows={archivosQuery.data ?? []}
              columns={columns}
              getRowId={row => row.codigoBancoArchivoControl}
              loading={archivosQuery.isLoading}
              disableSelectionOnClick
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              headerHeight={48}
              sx={dataGridSx}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CntBancoArchivoList
