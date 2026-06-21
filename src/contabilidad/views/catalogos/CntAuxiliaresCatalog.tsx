import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCatalogPermissions } from '../../hooks/useCntCatalogPermissions'
import { CntAuxiliarAdminDto } from '../../interfaces/CntDtos'
import { readCntExcelRows } from '../../utils/cntExcelExport'
import {
  CNT_AUXILIARES_ADMIN_QUERY_KEY,
  CNT_MAYORES_ADMIN_QUERY_KEY,
  deleteCntAuxiliar,
  fetchCntAuxiliarUsedBy,
  fetchCntAuxiliaresAdmin,
  fetchCntMayoresAdmin,
  saveCntAuxiliar
} from '../../services/cntService'

interface AuxiliarCell {
  row: CntAuxiliarAdminDto
}

interface AuxiliarImportRow {
  id: number
  codigoMayor: number
  segmento1: string
  segmento2: string
  segmento3: string
  segmento4: string
  segmento5: string
  segmento6: string
  segmento7: string
  segmento8: string
  segmento9: string
  segmento10: string
  denominacion: string
  descripcion: string
  fechaFinVigencia: string
  codigoProveedor?: number
  extra1: string
  extra2: string
  extra3: string
  error: string
}

const emptyAuxiliar = {
  codigoAuxiliar: 0,
  codigoMayor: 0,
  segmento1: '',
  segmento2: '',
  segmento3: '',
  segmento4: '',
  segmento5: '',
  segmento6: '',
  segmento7: '',
  segmento8: '',
  segmento9: '',
  segmento10: '',
  denominacion: '',
  descripcion: '',
  extra1: '',
  extra2: '',
  extra3: '',
  fechaFinVigencia: '',
  codigoProveedor: undefined as number | undefined
}

const segmentFields = ['segmento1', 'segmento2', 'segmento3', 'segmento4', 'segmento5', 'segmento6', 'segmento7', 'segmento8', 'segmento9', 'segmento10'] as const
const ENABLE_CNT_EXCEL_IMPORT = false
const getImportValue = (row: Record<string, unknown>, key: string) =>
  row[key] ?? row[key.toLowerCase()] ?? row[key.toUpperCase()] ?? row[key.replace(/_/g, '')] ?? ''
const toImportNumber = (value: unknown) => Number(String(value ?? '').replace(',', '.')) || 0
const toImportText = (value: unknown) => String(value ?? '').trim()

const CntAuxiliaresCatalog = () => {
  const router = useRouter()
  const { currentUserId, canView, canAdmin, isLoading: permissionLoading } = useCntCatalogPermissions()
  const [searchText, setSearchText] = useState('')
  const [codigoMayorFilter, setCodigoMayorFilter] = useState<number | ''>('')
  const [soloVigentes, setSoloVigentes] = useState(false)
  const [form, setForm] = useState(emptyAuxiliar)
  const [importRows, setImportRows] = useState<AuxiliarImportRow[]>([])
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [usedByInfo, setUsedByInfo] = useState<{ title: string; count: number } | null>(null)

  const mayoresQuery = useQuery({
    queryKey: [CNT_MAYORES_ADMIN_QUERY_KEY, currentUserId, 'auxiliares-select'],
    queryFn: () => fetchCntMayoresAdmin(currentUserId, undefined, ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const auxiliaresQuery = useQuery({
    queryKey: [CNT_AUXILIARES_ADMIN_QUERY_KEY, currentUserId, codigoMayorFilter, soloVigentes, searchText],
    queryFn: () => fetchCntAuxiliaresAdmin(currentUserId, codigoMayorFilter === '' ? undefined : Number(codigoMayorFilter), soloVigentes, searchText),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const saveMutation = useMutation({
    mutationFn: () =>
      saveCntAuxiliar({
        ...form,
        codigoAuxiliar: form.codigoAuxiliar || undefined,
        usuarioId: currentUserId,
        fechaFinVigencia: form.fechaFinVigencia || null
      }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Auxiliar guardado')
      setForm(emptyAuxiliar)
      auxiliaresQuery.refetch()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (codigoAuxiliar: number) => deleteCntAuxiliar(currentUserId, codigoAuxiliar),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Auxiliar eliminado')
      auxiliaresQuery.refetch()
    }
  })

  const importMutation = useMutation({
    mutationFn: async (rows: AuxiliarImportRow[]) => {
      let success = 0

      for (const row of rows) {
        const response = await saveCntAuxiliar({
          usuarioId: currentUserId,
          codigoMayor: row.codigoMayor,
          segmento1: row.segmento1,
          segmento2: row.segmento2,
          segmento3: row.segmento3,
          segmento4: row.segmento4,
          segmento5: row.segmento5,
          segmento6: row.segmento6,
          segmento7: row.segmento7,
          segmento8: row.segmento8,
          segmento9: row.segmento9,
          segmento10: row.segmento10,
          denominacion: row.denominacion,
          descripcion: row.descripcion,
          fechaFinVigencia: row.fechaFinVigencia || null,
          codigoProveedor: row.codigoProveedor,
          extra1: row.extra1,
          extra2: row.extra2,
          extra3: row.extra3
        })

        if (response.isValid === false) {
          throw new Error(`Fila ${row.id}: ${response.message}`)
        }

        success += 1
      }

      return success
    },
    onSuccess: count => {
      toast.success(`${count} auxiliares cargados`)
      setImportRows([])
      setIsImportOpen(false)
      auxiliaresQuery.refetch()
    },
    onError: error => toast.error((error as Error).message)
  })

  const showUsedBy = async (row: CntAuxiliarAdminDto) => {
    try {
      const response = await fetchCntAuxiliarUsedBy(currentUserId, row.codigoAuxiliar)

      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      setUsedByInfo({ title: `${row.segmento1} - ${row.denominacion}`, count: response.data ?? 0 })
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const columns: GridColumns<CntAuxiliarAdminDto> = [
    { flex: 0.12, minWidth: 110, field: 'segmento1', headerName: 'Segmento 1' },
    { flex: 0.25, minWidth: 220, field: 'denominacion', headerName: 'Denominacion' },
    { flex: 0.22, minWidth: 190, field: 'mayor', headerName: 'Mayor' },
    { flex: 0.1, minWidth: 90, field: 'vigente', headerName: 'Vigente', type: 'boolean' },
    {
      flex: 0.1,
      minWidth: 132,
      field: 'actions',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: AuxiliarCell) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canAdmin && (
            <Tooltip title='Editar'>
              <IconButton
                size='small'
                color='primary'
                onClick={() =>
                  setForm({
                    ...row,
                    codigoProveedor: row.codigoProveedor || undefined,
                    fechaFinVigencia: row.fechaFinVigencia ? row.fechaFinVigencia.substring(0, 10) : ''
                  })
                }
              >
                <Icon icon='mdi:pencil-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title='Ver movimientos'>
            <IconButton
              size='small'
              color='primary'
              onClick={() =>
                router.push({
                  pathname: '/apps/cnt/reportes/movimiento-auxiliar',
                  query: {
                    codigoAuxiliar: row.codigoAuxiliar,
                    codigoMayor: row.codigoMayor,
                    segmento1: row.segmento1,
                    segmento2: row.segmento2,
                    denominacion: row.denominacion
                  }
                })
              }
            >
              <Icon icon='mdi:chart-line' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Usado por'>
            <IconButton size='small' color='info' onClick={() => showUsedBy(row)}>
              <Icon icon='mdi:information-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          {canAdmin && (
            <Tooltip title='Eliminar'>
              <IconButton
                size='small'
                color='error'
                onClick={() => {
                  if (window.confirm('Eliminar auxiliar CNT?')) deleteMutation.mutate(row.codigoAuxiliar)
                }}
              >
                <Icon icon='mdi:delete-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]

  const canSave = canAdmin && currentUserId > 0 && form.codigoMayor > 0 && form.denominacion.trim().length > 0 && !saveMutation.isPending
  const validImportRows = importRows.filter(row => !row.error)

  const importColumns: GridColumns<AuxiliarImportRow> = [
    { flex: 0.08, minWidth: 80, field: 'id', headerName: 'Fila' },
    { flex: 0.12, minWidth: 120, field: 'codigoMayor', headerName: 'Mayor' },
    { flex: 0.12, minWidth: 120, field: 'segmento1', headerName: 'Seg. 1' },
    { flex: 0.22, minWidth: 220, field: 'denominacion', headerName: 'Denominacion' },
    { flex: 0.16, minWidth: 160, field: 'fechaFinVigencia', headerName: 'Fin vigencia' },
    { flex: 0.28, minWidth: 260, field: 'error', headerName: 'Validacion' }
  ]

  const parseImportRows = (rows: Record<string, unknown>[]) =>
    rows.map((row, index) => {
      const codigoMayor = toImportNumber(getImportValue(row, 'CODIGO_MAYOR'))
      const denominacion = toImportText(getImportValue(row, 'DENOMINACION'))
      const codigoProveedor = toImportNumber(getImportValue(row, 'CODIGO_PROVEEDOR')) || undefined
      const errors = [
        codigoMayor > 0 ? '' : 'CODIGO_MAYOR requerido',
        denominacion ? '' : 'DENOMINACION requerida'
      ].filter(Boolean)

      return {
        id: index + 2,
        codigoMayor,
        segmento1: toImportText(getImportValue(row, 'SEGMENTO1')),
        segmento2: toImportText(getImportValue(row, 'SEGMENTO2')),
        segmento3: toImportText(getImportValue(row, 'SEGMENTO3')),
        segmento4: toImportText(getImportValue(row, 'SEGMENTO4')),
        segmento5: toImportText(getImportValue(row, 'SEGMENTO5')),
        segmento6: toImportText(getImportValue(row, 'SEGMENTO6')),
        segmento7: toImportText(getImportValue(row, 'SEGMENTO7')),
        segmento8: toImportText(getImportValue(row, 'SEGMENTO8')),
        segmento9: toImportText(getImportValue(row, 'SEGMENTO9')),
        segmento10: toImportText(getImportValue(row, 'SEGMENTO10')),
        denominacion,
        descripcion: toImportText(getImportValue(row, 'DESCRIPCION')),
        fechaFinVigencia: toImportText(getImportValue(row, 'FECHA_FIN_VIGENCIA')),
        codigoProveedor,
        extra1: toImportText(getImportValue(row, 'EXTRA1')),
        extra2: toImportText(getImportValue(row, 'EXTRA2')),
        extra3: toImportText(getImportValue(row, 'EXTRA3')),
        error: errors.join(', ')
      }
    })

  const handleImportFile = async (file?: File) => {
    if (!canAdmin) return
    if (!file) return

    try {
      const rows = await readCntExcelRows<Record<string, unknown>>(file)
      const parsedRows = parseImportRows(rows)

      setImportRows(parsedRows)
      setIsImportOpen(true)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  if (permissionLoading) return <Spinner />

  if (!canView) {
    return <Typography color='error'>El usuario no tiene el permiso requerido: contabilidad.catalogos.ver.</Typography>
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title='Refrescar'>
                <IconButton color='primary' onClick={() => auxiliaresQuery.refetch()}>
                  <Icon icon='mdi:refresh' />
                </IconButton>
              </Tooltip>
              {canAdmin && (
                <>
                  <Tooltip title='Nuevo'>
                    <IconButton color='primary' onClick={() => setForm(emptyAuxiliar)}>
                      <Icon icon='mdi:plus' />
                    </IconButton>
                  </Tooltip>
                  {ENABLE_CNT_EXCEL_IMPORT && (
                    <Tooltip title='Importar Excel'>
                      <IconButton color='primary' component='label'>
                        <Icon icon='mdi:file-upload-outline' />
                        <input
                          hidden
                          type='file'
                          accept='.xlsx,.xls'
                          onChange={event => {
                            handleImportFile(event.target.files?.[0])
                            event.target.value = ''
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                select
                size='small'
                label='Mayor'
                value={codigoMayorFilter}
                onChange={event => setCodigoMayorFilter(event.target.value === '' ? '' : Number(event.target.value))}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value=''>Todos</MenuItem>
                {(mayoresQuery.data ?? []).map(mayor => (
                  <MenuItem key={mayor.codigoMayor} value={mayor.codigoMayor}>
                    {mayor.numeroMayor} - {mayor.denominacion}
                  </MenuItem>
                ))}
              </TextField>
              <FormControlLabel control={<Checkbox checked={soloVigentes} onChange={event => setSoloVigentes(event.target.checked)} />} label='Vigentes' />
              <TextField size='small' label='Buscar' value={searchText} onChange={event => setSearchText(event.target.value)} sx={{ minWidth: 240 }} />
            </Box>
          </CardActions>
          <CardContent sx={{ pt: 0 }}>
            {auxiliaresQuery.isLoading ? (
              <Spinner />
            ) : (
              <DataGrid autoHeight rows={auxiliaresQuery.data ?? []} columns={columns} getRowId={row => row.codigoAuxiliar} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick />
            )}
          </CardContent>
        </Card>
      </Grid>

      {canAdmin && (
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              {form.codigoAuxiliar ? 'Editar auxiliar' : 'Nuevo auxiliar'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField select label='Mayor' value={form.codigoMayor || ''} onChange={event => setForm(current => ({ ...current, codigoMayor: Number(event.target.value) }))}>
                <MenuItem value=''>Seleccionar</MenuItem>
                {(mayoresQuery.data ?? []).map(mayor => (
                  <MenuItem key={mayor.codigoMayor} value={mayor.codigoMayor}>
                    {mayor.numeroMayor} - {mayor.denominacion}
                  </MenuItem>
                ))}
              </TextField>
              <Grid container spacing={2}>
                {segmentFields.map((field, index) => (
                  <Grid item xs={6} key={field}>
                    <TextField fullWidth label={`Seg. ${index + 1}`} value={form[field]} inputProps={{ maxLength: 20 }} onChange={event => setForm(current => ({ ...current, [field]: event.target.value }))} />
                  </Grid>
                ))}
              </Grid>
              <TextField label='Denominacion' value={form.denominacion} inputProps={{ maxLength: 100 }} onChange={event => setForm(current => ({ ...current, denominacion: event.target.value }))} />
              <TextField label='Descripcion' value={form.descripcion} multiline minRows={3} inputProps={{ maxLength: 1000 }} onChange={event => setForm(current => ({ ...current, descripcion: event.target.value }))} />
              <TextField label='Fecha fin vigencia' type='date' InputLabelProps={{ shrink: true }} value={form.fechaFinVigencia} onChange={event => setForm(current => ({ ...current, fechaFinVigencia: event.target.value }))} />
              <TextField label='Proveedor ID' type='number' value={form.codigoProveedor || ''} onChange={event => setForm(current => ({ ...current, codigoProveedor: event.target.value ? Number(event.target.value) : undefined }))} />
              <TextField label='Extra 1' value={form.extra1} onChange={event => setForm(current => ({ ...current, extra1: event.target.value }))} />
              <TextField label='Extra 2' value={form.extra2} onChange={event => setForm(current => ({ ...current, extra2: event.target.value }))} />
              <TextField label='Extra 3' value={form.extra3} onChange={event => setForm(current => ({ ...current, extra3: event.target.value }))} />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 5, pb: 5 }}>
            <Button variant='outlined' color='secondary' onClick={() => setForm(emptyAuxiliar)}>
              Limpiar
            </Button>
            <Button variant='contained' disabled={!canSave} onClick={() => saveMutation.mutate()}>
              Guardar
            </Button>
          </CardActions>
        </Card>
      </Grid>
      )}

      <Dialog open={isImportOpen} onClose={() => setIsImportOpen(false)} fullWidth maxWidth='lg'>
        <DialogTitle>Preview importacion de auxiliares</DialogTitle>
        <DialogContent>
          <Typography variant='body2' sx={{ mb: 3 }}>
            Filas validas: {validImportRows.length} de {importRows.length}
          </Typography>
          <DataGrid
            autoHeight
            rows={importRows}
            columns={importColumns}
            getRowId={row => row.id}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
          />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={() => setIsImportOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            disabled={!canAdmin || validImportRows.length === 0 || validImportRows.length !== importRows.length || importMutation.isPending}
            onClick={() => importMutation.mutate(validImportRows)}
          >
            Cargar auxiliares
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(usedByInfo)} onClose={() => setUsedByInfo(null)} fullWidth maxWidth='xs'>
        <DialogTitle>Usado por</DialogTitle>
        <DialogContent>
          <Typography variant='body2' sx={{ mb: 2 }}>
            {usedByInfo?.title}
          </Typography>
          <Typography variant='h6'>{usedByInfo?.count ?? 0} referencia(s)</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => setUsedByInfo(null)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CntAuxiliaresCatalog
