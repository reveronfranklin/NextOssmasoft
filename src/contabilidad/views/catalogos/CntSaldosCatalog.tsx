import { useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCatalogPermissions } from '../../hooks/useCntCatalogPermissions'
import { CntAuxiliarDto, CntMayorDto, CntSaldoDto } from '../../interfaces/CntDtos'
import { readCntExcelRows } from '../../utils/cntExcelExport'
import {
  CNT_AUXILIARES_QUERY_KEY,
  CNT_MAYORES_QUERY_KEY,
  CNT_PERIODOS_QUERY_KEY,
  CNT_SALDOS_QUERY_KEY,
  deleteCntSaldo,
  fetchCntPeriodos,
  fetchCntSaldos,
  saveCntSaldo,
  searchCntAuxiliares,
  searchCntMayores
} from '../../services/cntService'

interface SaldoCell {
  row: CntSaldoDto
}

interface SaldoImportRow {
  id: number
  codigoPeriodo: number
  codigoMayor: number
  codigoAuxiliar: number
  debitos: number
  creditos: number
  extra1: string
  extra2: string
  extra3: string
  error: string
}

const emptySaldo = {
  codigoSaldo: 0,
  codigoPeriodo: 0,
  codigoMayor: 0,
  codigoAuxiliar: 0,
  debitos: 0,
  creditos: 0,
  extra1: '',
  extra2: '',
  extra3: ''
}

const formatMayor = (mayor: CntMayorDto) => `${mayor.numeroMayor} - ${mayor.denominacion}`
const formatAuxiliar = (auxiliar: CntAuxiliarDto) => `${auxiliar.segmento1} ${auxiliar.segmento2} - ${auxiliar.denominacion}`
const getImportValue = (row: Record<string, unknown>, key: string) =>
  row[key] ?? row[key.toLowerCase()] ?? row[key.toUpperCase()] ?? row[key.replace(/_/g, '')] ?? ''
const ENABLE_CNT_EXCEL_IMPORT = false
const toImportNumber = (value: unknown) => Number(String(value ?? '').replace(',', '.')) || 0
const toImportText = (value: unknown) => String(value ?? '').trim()

const CntSaldosCatalog = () => {
  const { currentUserId, canView, canAdmin, isLoading: permissionLoading } = useCntCatalogPermissions()
  const [searchText, setSearchText] = useState('')
  const [codigoPeriodoFilter, setCodigoPeriodoFilter] = useState<number | ''>('')
  const [form, setForm] = useState(emptySaldo)
  const [mayorSearch, setMayorSearch] = useState('')
  const [auxiliarSearch, setAuxiliarSearch] = useState('')
  const [importRows, setImportRows] = useState<SaldoImportRow[]>([])
  const [isImportOpen, setIsImportOpen] = useState(false)

  const periodosQuery = useQuery({
    queryKey: [CNT_PERIODOS_QUERY_KEY, 'saldos'],
    queryFn: () => fetchCntPeriodos(false),
    retry: 1
  })

  const mayoresQuery = useQuery({
    queryKey: [CNT_MAYORES_QUERY_KEY, mayorSearch],
    queryFn: () => searchCntMayores(mayorSearch),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const auxiliaresQuery = useQuery({
    queryKey: [CNT_AUXILIARES_QUERY_KEY, auxiliarSearch, form.codigoMayor],
    queryFn: () => searchCntAuxiliares(auxiliarSearch, form.codigoMayor || undefined),
    enabled: currentUserId > 0 && canView && form.codigoMayor > 0,
    retry: 1
  })

  const saldosQuery = useQuery({
    queryKey: [CNT_SALDOS_QUERY_KEY, currentUserId, codigoPeriodoFilter, searchText],
    queryFn: () => fetchCntSaldos(currentUserId, codigoPeriodoFilter === '' ? undefined : Number(codigoPeriodoFilter), undefined, undefined, searchText),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const selectedMayor = (mayoresQuery.data ?? []).find(item => item.codigoMayor === form.codigoMayor) ?? null
  const selectedAuxiliar = (auxiliaresQuery.data ?? []).find(item => item.codigoAuxiliar === form.codigoAuxiliar) ?? null
  const monto = Number(form.debitos || 0) - Number(form.creditos || 0)

  const saveMutation = useMutation({
    mutationFn: () =>
      saveCntSaldo({
        ...form,
        codigoSaldo: form.codigoSaldo || undefined,
        usuarioId: currentUserId,
        debitos: Number(form.debitos || 0),
        creditos: Number(form.creditos || 0)
      }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Saldo guardado')
      setForm(emptySaldo)
      saldosQuery.refetch()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (codigoSaldo: number) => deleteCntSaldo(currentUserId, codigoSaldo),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Saldo eliminado')
      saldosQuery.refetch()
    }
  })

  const importMutation = useMutation({
    mutationFn: async (rows: SaldoImportRow[]) => {
      let success = 0

      for (const row of rows) {
        const response = await saveCntSaldo({
          usuarioId: currentUserId,
          codigoPeriodo: row.codigoPeriodo,
          codigoMayor: row.codigoMayor,
          codigoAuxiliar: row.codigoAuxiliar,
          debitos: row.debitos,
          creditos: row.creditos,
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
      toast.success(`${count} saldos cargados`)
      setImportRows([])
      setIsImportOpen(false)
      saldosQuery.refetch()
    },
    onError: error => toast.error((error as Error).message)
  })

  const columns: GridColumns<CntSaldoDto> = [
    { flex: 0.18, minWidth: 170, field: 'periodo', headerName: 'Periodo' },
    { flex: 0.22, minWidth: 220, field: 'mayor', headerName: 'Mayor' },
    { flex: 0.25, minWidth: 240, field: 'auxiliar', headerName: 'Auxiliar' },
    { flex: 0.12, minWidth: 120, field: 'debitos', headerName: 'Debitos', type: 'number' },
    { flex: 0.12, minWidth: 120, field: 'creditos', headerName: 'Creditos', type: 'number' },
    { flex: 0.12, minWidth: 120, field: 'monto', headerName: 'Monto', type: 'number' },
    {
      flex: 0.1,
      minWidth: 96,
      field: 'actions',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: SaldoCell) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canAdmin && (
            <>
              <Tooltip title='Editar'>
                <IconButton
                  size='small'
                  color='primary'
                  onClick={() => {
                    setMayorSearch(row.mayor)
                    setAuxiliarSearch(row.auxiliar)
                    setForm({
                      codigoSaldo: row.codigoSaldo,
                      codigoPeriodo: row.codigoPeriodo,
                      codigoMayor: row.codigoMayor,
                      codigoAuxiliar: row.codigoAuxiliar,
                      debitos: row.debitos,
                      creditos: row.creditos,
                      extra1: row.extra1 || '',
                      extra2: row.extra2 || '',
                      extra3: row.extra3 || ''
                    })
                  }}
                >
                  <Icon icon='mdi:pencil-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Eliminar'>
                <IconButton
                  size='small'
                  color='error'
                  onClick={() => {
                    if (window.confirm('Eliminar saldo inicial?')) deleteMutation.mutate(row.codigoSaldo)
                  }}
                >
                  <Icon icon='mdi:delete-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      )
    }
  ]

  const canSave = canAdmin && currentUserId > 0 && form.codigoPeriodo > 0 && form.codigoMayor > 0 && form.codigoAuxiliar > 0 && !saveMutation.isPending
  const validImportRows = importRows.filter(row => !row.error)

  const importColumns: GridColumns<SaldoImportRow> = [
    { flex: 0.1, minWidth: 90, field: 'id', headerName: 'Fila' },
    { flex: 0.16, minWidth: 130, field: 'codigoPeriodo', headerName: 'Periodo' },
    { flex: 0.16, minWidth: 130, field: 'codigoMayor', headerName: 'Mayor' },
    { flex: 0.16, minWidth: 130, field: 'codigoAuxiliar', headerName: 'Auxiliar' },
    { flex: 0.14, minWidth: 120, field: 'debitos', headerName: 'Debitos', type: 'number' },
    { flex: 0.14, minWidth: 120, field: 'creditos', headerName: 'Creditos', type: 'number' },
    { flex: 0.24, minWidth: 220, field: 'error', headerName: 'Validacion' }
  ]

  const parseImportRows = (rows: Record<string, unknown>[]) =>
    rows.map((row, index) => {
      const codigoPeriodo = toImportNumber(getImportValue(row, 'CODIGO_PERIODO'))
      const codigoMayor = toImportNumber(getImportValue(row, 'CODIGO_MAYOR'))
      const codigoAuxiliar = toImportNumber(getImportValue(row, 'CODIGO_AUXILIAR'))
      const debitos = toImportNumber(getImportValue(row, 'DEBITOS'))
      const creditos = toImportNumber(getImportValue(row, 'CREDITOS'))
      const errors = [
        codigoPeriodo > 0 ? '' : 'CODIGO_PERIODO requerido',
        codigoMayor > 0 ? '' : 'CODIGO_MAYOR requerido',
        codigoAuxiliar > 0 ? '' : 'CODIGO_AUXILIAR requerido'
      ].filter(Boolean)

      return {
        id: index + 2,
        codigoPeriodo,
        codigoMayor,
        codigoAuxiliar,
        debitos,
        creditos,
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
                <IconButton color='primary' onClick={() => saldosQuery.refetch()}>
                  <Icon icon='mdi:refresh' />
                </IconButton>
              </Tooltip>
              {canAdmin && (
                <>
                  <Tooltip title='Nuevo'>
                    <IconButton color='primary' onClick={() => setForm(emptySaldo)}>
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
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField select size='small' label='Periodo' value={codigoPeriodoFilter} onChange={event => setCodigoPeriodoFilter(event.target.value === '' ? '' : Number(event.target.value))} sx={{ minWidth: 220 }}>
                <MenuItem value=''>Todos</MenuItem>
                {(periodosQuery.data ?? []).map(periodo => (
                  <MenuItem key={periodo.codigoPeriodo} value={periodo.codigoPeriodo}>
                    {periodo.nombrePeriodo}
                  </MenuItem>
                ))}
              </TextField>
              <TextField size='small' label='Buscar' value={searchText} onChange={event => setSearchText(event.target.value)} sx={{ minWidth: 240 }} />
            </Box>
          </CardActions>
          <CardContent sx={{ pt: 0 }}>
            {saldosQuery.isLoading ? (
              <Spinner />
            ) : (
              <DataGrid autoHeight rows={saldosQuery.data ?? []} columns={columns} getRowId={row => row.codigoSaldo} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick />
            )}
          </CardContent>
        </Card>
      </Grid>

      {canAdmin && (
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              {form.codigoSaldo ? 'Editar saldo' : 'Nuevo saldo'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField select label='Periodo' value={form.codigoPeriodo || ''} onChange={event => setForm(current => ({ ...current, codigoPeriodo: Number(event.target.value) }))}>
                <MenuItem value=''>Seleccionar</MenuItem>
                {(periodosQuery.data ?? []).map(periodo => (
                  <MenuItem key={periodo.codigoPeriodo} value={periodo.codigoPeriodo}>
                    {periodo.nombrePeriodo}
                  </MenuItem>
                ))}
              </TextField>
              <Autocomplete
                options={mayoresQuery.data ?? []}
                loading={mayoresQuery.isLoading}
                value={selectedMayor}
                getOptionLabel={option => formatMayor(option)}
                isOptionEqualToValue={(option, value) => option.codigoMayor === value.codigoMayor}
                onInputChange={(_, value) => setMayorSearch(value)}
                onChange={(_, value) => setForm(current => ({ ...current, codigoMayor: value?.codigoMayor ?? 0, codigoAuxiliar: 0 }))}
                renderInput={params => <TextField {...params} label='Mayor' />}
              />
              <Autocomplete
                options={auxiliaresQuery.data ?? []}
                loading={auxiliaresQuery.isLoading}
                value={selectedAuxiliar}
                getOptionLabel={option => formatAuxiliar(option)}
                isOptionEqualToValue={(option, value) => option.codigoAuxiliar === value.codigoAuxiliar}
                onInputChange={(_, value) => setAuxiliarSearch(value)}
                onChange={(_, value) => setForm(current => ({ ...current, codigoAuxiliar: value?.codigoAuxiliar ?? 0 }))}
                renderInput={params => <TextField {...params} label='Auxiliar' />}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth label='Debitos' type='number' value={form.debitos} onChange={event => setForm(current => ({ ...current, debitos: Number(event.target.value) }))} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label='Creditos' type='number' value={form.creditos} onChange={event => setForm(current => ({ ...current, creditos: Number(event.target.value) }))} />
                </Grid>
              </Grid>
              <TextField label='Monto' value={monto.toFixed(2)} InputProps={{ readOnly: true }} />
              <TextField label='Extra 1' value={form.extra1} onChange={event => setForm(current => ({ ...current, extra1: event.target.value }))} />
              <TextField label='Extra 2' value={form.extra2} onChange={event => setForm(current => ({ ...current, extra2: event.target.value }))} />
              <TextField label='Extra 3' value={form.extra3} onChange={event => setForm(current => ({ ...current, extra3: event.target.value }))} />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 5, pb: 5 }}>
            <Button variant='outlined' color='secondary' onClick={() => setForm(emptySaldo)}>
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
        <DialogTitle>Preview importacion de saldos</DialogTitle>
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
            Cargar saldos
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CntSaldosCatalog
