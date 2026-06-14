import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Switch,
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
import { CntBancoFormatoDto, CntBancoFormatoSaveDto } from '../../interfaces/CntDtos'
import { useCntCurrentUserId } from '../../hooks/useCntCurrentUserId'
import {
  CNT_BANCO_FORMATOS_QUERY_KEY,
  CNT_BANCOS_QUERY_KEY,
  CNT_CUENTAS_BANCO_QUERY_KEY,
  CNT_PERMISSION_CONCILIACION_ADMIN,
  CNT_PERMISSION_CONCILIACION_FORMATS_EDIT,
  CNT_PERMISSION_CONCILIACION_FORMATS_VIEW,
  CNT_PERMISSIONS_QUERY_KEY,
  checkCntPermission,
  deleteCntBancoFormato,
  fetchCntBancoFormatos,
  fetchCntBancos,
  fetchCntCuentasBanco,
  saveCntBancoFormato
} from '../../services/cntService'

const formatTypes = [
  'CSV_TXT',
  'XLSX',
  'TEXTO_DELIMITADO',
  'PDF_TEXTO',
  'PDF_OCR',
  'IMAGEN_OCR',
  'TEXTO_LIBRE'
]

const defaultMapping = JSON.stringify(
  {
    fecha: 0,
    numero: 1,
    tipoId: 2,
    tipo: 3,
    descripcion: 4,
    monto: 5
  },
  null,
  2
)

const emptyForm = (usuarioId: number): CntBancoFormatoSaveDto => ({
  usuarioId,
  codigoFormato: null,
  codigoBanco: 0,
  codigoCuentaBanco: null,
  nombreFormato: '',
  tipoFormato: 'CSV_TXT',
  delimitador: ';',
  tieneEncabezado: true,
  filaInicio: 1,
  hojaExcel: '',
  mapeoJson: defaultMapping,
  reglasJson: '{}',
  activo: true
})

const CntBancoFormatoList = () => {
  const router = useRouter()
  const currentUserId = useCntCurrentUserId()
  const [codigoBanco, setCodigoBanco] = useState<number | ''>('')
  const [codigoCuentaBanco, setCodigoCuentaBanco] = useState<number | ''>('')
  const [tipoFormato, setTipoFormato] = useState('')
  const [searchText, setSearchText] = useState('')
  const [form, setForm] = useState<CntBancoFormatoSaveDto>(emptyForm(currentUserId))

  const adminPermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CONCILIACION_ADMIN, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CONCILIACION_ADMIN }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const viewPermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CONCILIACION_FORMATS_VIEW, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CONCILIACION_FORMATS_VIEW }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const editPermissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CONCILIACION_FORMATS_EDIT, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CONCILIACION_FORMATS_EDIT }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const canAdmin = adminPermissionQuery.data?.hasPermission === true
  const canView = canAdmin || viewPermissionQuery.data?.hasPermission === true || editPermissionQuery.data?.hasPermission === true
  const canEdit = canAdmin || editPermissionQuery.data?.hasPermission === true
  const permissionsLoading = adminPermissionQuery.isLoading || viewPermissionQuery.isLoading || editPermissionQuery.isLoading

  const bancosQuery = useQuery({
    queryKey: [CNT_BANCOS_QUERY_KEY, currentUserId, 'formatos'],
    queryFn: () => fetchCntBancos(currentUserId),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const cuentasQuery = useQuery({
    queryKey: [CNT_CUENTAS_BANCO_QUERY_KEY, currentUserId, form.codigoBanco || codigoBanco, 'formatos'],
    queryFn: () => fetchCntCuentasBanco(currentUserId, form.codigoBanco || (codigoBanco === '' ? undefined : Number(codigoBanco)), true),
    enabled: currentUserId > 0 && canView && (form.codigoBanco > 0 || codigoBanco !== ''),
    retry: 1
  })

  const formatosQuery = useQuery({
    queryKey: [CNT_BANCO_FORMATOS_QUERY_KEY, currentUserId, codigoBanco, codigoCuentaBanco, tipoFormato, searchText],
    queryFn: () =>
      fetchCntBancoFormatos({
        usuarioId: currentUserId,
        codigoBanco: codigoBanco === '' ? null : Number(codigoBanco),
        codigoCuentaBanco: codigoCuentaBanco === '' ? null : Number(codigoCuentaBanco),
        tipoFormato,
        soloActivos: false,
        searchText
      }),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const saveMutation = useMutation({
    mutationFn: saveCntBancoFormato,
    onSuccess: async () => {
      toast.success('Formato guardado.')
      setForm(emptyForm(currentUserId))
      await formatosQuery.refetch()
    },
    onError: error => toast.error((error as Error).message)
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCntBancoFormato,
    onSuccess: async () => {
      toast.success('Formato desactivado.')
      await formatosQuery.refetch()
    },
    onError: error => toast.error((error as Error).message)
  })

  const handleEdit = (row: CntBancoFormatoDto) => {
    setForm({
      usuarioId: currentUserId,
      codigoFormato: row.codigoFormato,
      codigoBanco: row.codigoBanco,
      codigoCuentaBanco: row.codigoCuentaBanco ?? null,
      nombreFormato: row.nombreFormato,
      tipoFormato: row.tipoFormato,
      delimitador: row.delimitador,
      tieneEncabezado: row.tieneEncabezado,
      filaInicio: row.filaInicio,
      hojaExcel: row.hojaExcel,
      mapeoJson: row.mapeoJson || defaultMapping,
      reglasJson: row.reglasJson || '{}',
      activo: row.activo
    })
  }

  const handleSave = () => {
    if (form.codigoBanco <= 0 || !form.nombreFormato.trim()) {
      toast.error('Banco y nombre del formato son requeridos.')

      return
    }

    try {
      JSON.parse(form.mapeoJson || '{}')
      JSON.parse(form.reglasJson || '{}')
    } catch {
      toast.error('Mapeo JSON o reglas JSON no son validos.')

      return
    }

    saveMutation.mutate({ ...form, usuarioId: currentUserId })
  }

  const columns = useMemo<GridColumns<CntBancoFormatoDto>>(
    () => [
      { field: 'nombreFormato', headerName: 'Formato', minWidth: 220, flex: 1 },
      { field: 'banco', headerName: 'Banco', minWidth: 170, flex: 0.8 },
      { field: 'cuenta', headerName: 'Cuenta', minWidth: 160, flex: 0.7 },
      { field: 'tipoFormato', headerName: 'Tipo', width: 150 },
      { field: 'delimitador', headerName: 'Delim.', width: 90 },
      { field: 'filaInicio', headerName: 'Fila', width: 80, align: 'right', headerAlign: 'right' },
      {
        field: 'activo',
        headerName: 'Estado',
        width: 120,
        renderCell: ({ row }) => (
          <Chip size='small' label={row.activo ? 'Activo' : 'Inactivo'} color={row.activo ? 'success' : 'default'} variant='outlined' />
        )
      },
      {
        field: 'actions',
        headerName: '',
        width: 110,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction='row' spacing={1}>
            <Tooltip title='Editar'>
              <IconButton size='small' onClick={() => handleEdit(row)}>
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Desactivar'>
              <span>
                <IconButton
                  size='small'
                  color='error'
                  disabled={!canEdit || !row.activo || deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate({ usuarioId: currentUserId, codigoFormato: row.codigoFormato })}
                >
                  <Icon icon='mdi:delete-outline' />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        )
      }
    ],
    [canEdit, currentUserId, deleteMutation]
  )

  if (currentUserId <= 0 || permissionsLoading) return <Spinner />

  if (!canView) {
    return <Alert severity='warning'>El usuario no tiene el permiso requerido: {CNT_PERMISSION_CONCILIACION_FORMATS_VIEW}.</Alert>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant='h5'>Formatos bancarios</Typography>
              <Typography variant='body2' color='text.secondary'>
                Configuracion por banco, cuenta y tipo de archivo para extraccion multiformato.
              </Typography>
            </Box>
            <Stack direction='row' spacing={2}>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:bank-transfer-in' />}
                onClick={() => router.push('/apps/cnt/conciliacion/carga-banco')}
              >
                Carga banco
              </Button>
              <Button variant='outlined' startIcon={<Icon icon='mdi:refresh' />} onClick={() => formatosQuery.refetch()}>
                Actualizar
              </Button>
              <Button variant='outlined' startIcon={<Icon icon='mdi:plus' />} disabled={!canEdit} onClick={() => setForm(emptyForm(currentUserId))}>
                Nuevo
              </Button>
            </Stack>
          </CardActions>
          <CardContent>
            <Alert severity='info' sx={{ mb: 4 }}>
              <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                Este es el mantenimiento de CNT_BANCO_FORMATO.
              </Typography>
              <Typography variant='body2'>
                Cada formato define como leer un archivo por banco, cuenta y tipo de entrada. La pantalla Carga banco usa esta configuracion para generar el preview y registrar la traza en CNT_BANCO_ARCHIVO_EXTRACCION.
              </Typography>
            </Alert>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  size='small'
                  label='Banco'
                  value={form.codigoBanco || ''}
                  onChange={event => setForm({ ...form, codigoBanco: Number(event.target.value || 0), codigoCuentaBanco: null })}
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
                  size='small'
                  label='Cuenta'
                  value={form.codigoCuentaBanco ?? ''}
                  onChange={event => setForm({ ...form, codigoCuentaBanco: event.target.value === '' ? null : Number(event.target.value) })}
                >
                  <MenuItem value=''>Todas las cuentas del banco</MenuItem>
                  {(cuentasQuery.data ?? []).map(cuenta => (
                    <MenuItem key={cuenta.codigoCuentaBanco} value={cuenta.codigoCuentaBanco}>
                      {cuenta.noCuenta} - {cuenta.banco}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth size='small' label='Nombre' value={form.nombreFormato} onChange={event => setForm({ ...form, nombreFormato: event.target.value })} />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth select size='small' label='Tipo' value={form.tipoFormato} onChange={event => setForm({ ...form, tipoFormato: event.target.value })}>
                  {formatTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth size='small' label='Delimitador' value={form.delimitador ?? ''} onChange={event => setForm({ ...form, delimitador: event.target.value })} />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size='small'
                  type='number'
                  label='Fila inicio'
                  value={form.filaInicio}
                  onChange={event => setForm({ ...form, filaInicio: Number(event.target.value || 1) })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth size='small' label='Hoja Excel' value={form.hojaExcel ?? ''} onChange={event => setForm({ ...form, hojaExcel: event.target.value })} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack direction='row' spacing={2} alignItems='center' sx={{ height: '100%' }}>
                  <Typography variant='body2'>Encabezado</Typography>
                  <Switch checked={form.tieneEncabezado} onChange={event => setForm({ ...form, tieneEncabezado: event.target.checked })} />
                  <Typography variant='body2'>Activo</Typography>
                  <Switch checked={form.activo} onChange={event => setForm({ ...form, activo: event.target.checked })} />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  minRows={8}
                  label='Mapeo JSON'
                  value={form.mapeoJson ?? ''}
                  onChange={event => setForm({ ...form, mapeoJson: event.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  minRows={8}
                  label='Reglas JSON'
                  value={form.reglasJson ?? ''}
                  onChange={event => setForm({ ...form, reglasJson: event.target.value })}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 5, pb: 5 }}>
              <Button variant='contained' startIcon={<Icon icon='mdi:content-save-outline' />} disabled={!canEdit || saveMutation.isPending} onClick={handleSave}>
                Guardar formato
              </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
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
              <Grid item xs={12} md={3}>
                <TextField fullWidth select label='Tipo' size='small' value={tipoFormato} onChange={event => setTipoFormato(event.target.value)}>
                  <MenuItem value=''>Todos</MenuItem>
                  {formatTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth size='small' label='Buscar formato' value={searchText} onChange={event => setSearchText(event.target.value)} />
              </Grid>
            </Grid>
            <DataGrid
              autoHeight
              rows={formatosQuery.data ?? []}
              columns={columns}
              getRowId={row => row.codigoFormato}
              loading={formatosQuery.isLoading}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CntBancoFormatoList
