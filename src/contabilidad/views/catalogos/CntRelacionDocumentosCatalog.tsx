import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
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
import { CntRelacionDocumentoDto } from '../../interfaces/CntDtos'
import {
  CNT_DESCRIPTIVAS_QUERY_KEY,
  CNT_REL_DOCUMENTOS_QUERY_KEY,
  CNT_TITULOS_QUERY_KEY,
  deleteCntRelacionDocumento,
  fetchCntDescriptivas,
  fetchCntRelacionDocumentos,
  fetchCntTitulos,
  saveCntRelacionDocumento
} from '../../services/cntService'

interface RelacionCell {
  row: CntRelacionDocumentoDto
}

const emptyRelacion = {
  codigoRelacionDocumento: 0,
  tipoDocumentoId: 0,
  tipoTransaccionId: 0,
  extra1: '',
  extra2: '',
  extra3: ''
}

const TITULO_TIPO_TRANSACCION_ID = 6
const TITULO_TIPO_DOCUMENTO_ID = 7

const CntRelacionDocumentosCatalog = () => {
  const { currentUserId, canView, canAdmin, isLoading: permissionLoading } = useCntCatalogPermissions()
  const [searchText, setSearchText] = useState('')
  const [tituloDocumentoId, setTituloDocumentoId] = useState<number | ''>(TITULO_TIPO_DOCUMENTO_ID)
  const [tituloTransaccionId, setTituloTransaccionId] = useState<number | ''>(TITULO_TIPO_TRANSACCION_ID)
  const [form, setForm] = useState(emptyRelacion)

  const titulosQuery = useQuery({
    queryKey: [CNT_TITULOS_QUERY_KEY, currentUserId, 'relacion-documentos'],
    queryFn: () => fetchCntTitulos(currentUserId, ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const documentosQuery = useQuery({
    queryKey: [CNT_DESCRIPTIVAS_QUERY_KEY, currentUserId, 'documentos', tituloDocumentoId],
    queryFn: () => fetchCntDescriptivas(currentUserId, tituloDocumentoId === '' ? undefined : Number(tituloDocumentoId), ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const transaccionesQuery = useQuery({
    queryKey: [CNT_DESCRIPTIVAS_QUERY_KEY, currentUserId, 'transacciones', tituloTransaccionId],
    queryFn: () => fetchCntDescriptivas(currentUserId, tituloTransaccionId === '' ? undefined : Number(tituloTransaccionId), ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const relacionesQuery = useQuery({
    queryKey: [CNT_REL_DOCUMENTOS_QUERY_KEY, currentUserId, searchText],
    queryFn: () => fetchCntRelacionDocumentos(currentUserId, undefined, undefined, searchText),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const saveMutation = useMutation({
    mutationFn: () =>
      saveCntRelacionDocumento({
        ...form,
        codigoRelacionDocumento: form.codigoRelacionDocumento || undefined,
        usuarioId: currentUserId
      }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Relacion de documentos guardada')
      setForm(emptyRelacion)
      relacionesQuery.refetch()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (codigoRelacionDocumento: number) => deleteCntRelacionDocumento(currentUserId, codigoRelacionDocumento),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Relacion eliminada')
      relacionesQuery.refetch()
    }
  })

  const columns: GridColumns<CntRelacionDocumentoDto> = [
    { flex: 0.28, minWidth: 230, field: 'tipoDocumento', headerName: 'Tipo documento' },
    { flex: 0.18, minWidth: 150, field: 'tipoDocumentoCodigo', headerName: 'Codigo doc.' },
    { flex: 0.28, minWidth: 230, field: 'tipoTransaccion', headerName: 'Tipo transaccion' },
    { flex: 0.18, minWidth: 150, field: 'tipoTransaccionCodigo', headerName: 'Codigo trans.' },
    {
      flex: 0.1,
      minWidth: 96,
      field: 'actions',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: RelacionCell) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canAdmin && (
            <>
              <Tooltip title='Editar'>
                <IconButton
                  size='small'
                  color='primary'
                  onClick={() => {
                    setTituloDocumentoId(row.tipoDocumentoTituloId)
                    setTituloTransaccionId(row.tipoTransaccionTituloId)
                    setForm({
                      codigoRelacionDocumento: row.codigoRelacionDocumento,
                      tipoDocumentoId: row.tipoDocumentoId,
                      tipoTransaccionId: row.tipoTransaccionId,
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
                    if (window.confirm('Eliminar relacion de documentos?')) deleteMutation.mutate(row.codigoRelacionDocumento)
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

  const canSave = canAdmin && currentUserId > 0 && form.tipoDocumentoId > 0 && form.tipoTransaccionId > 0 && !saveMutation.isPending

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
                <IconButton color='primary' onClick={() => relacionesQuery.refetch()}>
                  <Icon icon='mdi:refresh' />
                </IconButton>
              </Tooltip>
              {canAdmin && (
                <Tooltip title='Nuevo'>
                  <IconButton color='primary' onClick={() => setForm(emptyRelacion)}>
                    <Icon icon='mdi:plus' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <TextField size='small' label='Buscar' value={searchText} onChange={event => setSearchText(event.target.value)} sx={{ minWidth: 280 }} />
          </CardActions>
          <CardContent sx={{ pt: 0 }}>
            {relacionesQuery.isLoading ? (
              <Spinner />
            ) : (
              <DataGrid autoHeight rows={relacionesQuery.data ?? []} columns={columns} getRowId={row => row.codigoRelacionDocumento} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick />
            )}
          </CardContent>
        </Card>
      </Grid>

      {canAdmin && (
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              {form.codigoRelacionDocumento ? 'Editar relacion' : 'Nueva relacion'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                select
                label='Titulo documento'
                value={tituloDocumentoId}
                onChange={event => {
                  setTituloDocumentoId(event.target.value === '' ? '' : Number(event.target.value))
                  setForm(current => ({ ...current, tipoDocumentoId: 0 }))
                }}
              >
                <MenuItem value=''>Todos</MenuItem>
                {(titulosQuery.data ?? []).map(titulo => (
                  <MenuItem key={titulo.tituloId} value={titulo.tituloId}>
                    {titulo.titulo}
                  </MenuItem>
                ))}
              </TextField>
              <TextField select label='Tipo documento' value={form.tipoDocumentoId || ''} onChange={event => setForm(current => ({ ...current, tipoDocumentoId: Number(event.target.value) }))}>
                <MenuItem value=''>Seleccionar</MenuItem>
                {(documentosQuery.data ?? []).map(item => (
                  <MenuItem key={item.descripcionId} value={item.descripcionId}>
                    {item.codigo} - {item.descripcion}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label='Titulo transaccion'
                value={tituloTransaccionId}
                onChange={event => {
                  setTituloTransaccionId(event.target.value === '' ? '' : Number(event.target.value))
                  setForm(current => ({ ...current, tipoTransaccionId: 0 }))
                }}
              >
                <MenuItem value=''>Todos</MenuItem>
                {(titulosQuery.data ?? []).map(titulo => (
                  <MenuItem key={titulo.tituloId} value={titulo.tituloId}>
                    {titulo.titulo}
                  </MenuItem>
                ))}
              </TextField>
              <TextField select label='Tipo transaccion' value={form.tipoTransaccionId || ''} onChange={event => setForm(current => ({ ...current, tipoTransaccionId: Number(event.target.value) }))}>
                <MenuItem value=''>Seleccionar</MenuItem>
                {(transaccionesQuery.data ?? []).map(item => (
                  <MenuItem key={item.descripcionId} value={item.descripcionId}>
                    {item.codigo} - {item.descripcion}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label='Extra 1' value={form.extra1} onChange={event => setForm(current => ({ ...current, extra1: event.target.value }))} />
              <TextField label='Extra 2' value={form.extra2} onChange={event => setForm(current => ({ ...current, extra2: event.target.value }))} />
              <TextField label='Extra 3' value={form.extra3} onChange={event => setForm(current => ({ ...current, extra3: event.target.value }))} />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 5, pb: 5 }}>
            <Button variant='outlined' color='secondary' onClick={() => setForm(emptyRelacion)}>
              Limpiar
            </Button>
            <Button variant='contained' disabled={!canSave} onClick={() => saveMutation.mutate()}>
              Guardar
            </Button>
          </CardActions>
        </Card>
      </Grid>
      )}
    </Grid>
  )
}

export default CntRelacionDocumentosCatalog
