import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCatalogPermissions } from '../hooks/useCntCatalogPermissions'
import { CntDescriptivaDto, CntTituloDto } from '../interfaces/CntDtos'
import { exportCntRowsToExcel } from '../utils/cntExcelExport'
import {
  CNT_DESCRIPTIVAS_QUERY_KEY,
  CNT_TITULOS_QUERY_KEY,
  cloneCntDescriptivas,
  deleteCntDescriptiva,
  deleteCntTitulo,
  fetchCntDescriptivaUsedBy,
  fetchCntDescriptivas,
  fetchCntTitulos,
  saveCntDescriptiva,
  saveCntTitulo
} from '../services/cntService'

interface TituloCell {
  row: CntTituloDto
}

interface DescriptivaCell {
  row: CntDescriptivaDto
}

const emptyTitulo = {
  tituloId: 0,
  tituloFkId: undefined as number | undefined,
  titulo: '',
  codigo: '',
  extra1: '',
  extra2: '',
  extra3: ''
}

const emptyDescriptiva = {
  descripcionId: 0,
  descripcionFkId: undefined as number | undefined,
  tituloId: 0,
  descripcion: '',
  codigo: '',
  extra1: '',
  extra2: '',
  extra3: ''
}

const CntDescriptivasCatalog = () => {
  const { currentUserId, canView, canAdmin, isLoading: permissionLoading } = useCntCatalogPermissions()
  const [tituloSearch, setTituloSearch] = useState('')
  const [desSearch, setDesSearch] = useState('')
  const [selectedTituloId, setSelectedTituloId] = useState(0)
  const [tituloForm, setTituloForm] = useState(emptyTitulo)
  const [desForm, setDesForm] = useState(emptyDescriptiva)
  const [usedByInfo, setUsedByInfo] = useState<{ title: string; count: number } | null>(null)
  const [isCloneOpen, setIsCloneOpen] = useState(false)
  const [cloneEmpresaOrigen, setCloneEmpresaOrigen] = useState('')

  const titulosQuery = useQuery({
    queryKey: [CNT_TITULOS_QUERY_KEY, currentUserId, tituloSearch],
    queryFn: () => fetchCntTitulos(currentUserId, tituloSearch),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const descriptivasQuery = useQuery({
    queryKey: [CNT_DESCRIPTIVAS_QUERY_KEY, currentUserId, selectedTituloId, desSearch],
    queryFn: () => fetchCntDescriptivas(currentUserId, selectedTituloId || undefined, desSearch),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const selectedTitulo = useMemo(
    () => (titulosQuery.data ?? []).find(item => item.tituloId === selectedTituloId),
    [selectedTituloId, titulosQuery.data]
  )

  useEffect(() => {
    if (!selectedTituloId && (titulosQuery.data ?? []).length > 0) {
      setSelectedTituloId(titulosQuery.data![0].tituloId)
    }
  }, [selectedTituloId, titulosQuery.data])

  useEffect(() => {
    setDesForm(current => ({ ...current, tituloId: selectedTituloId }))
  }, [selectedTituloId])

  const saveTituloMutation = useMutation({
    mutationFn: () => saveCntTitulo({ ...tituloForm, tituloId: tituloForm.tituloId || undefined, usuarioId: currentUserId }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Titulo guardado')
      setTituloForm(emptyTitulo)
      titulosQuery.refetch()
    }
  })

  const deleteTituloMutation = useMutation({
    mutationFn: (tituloId: number) => deleteCntTitulo(currentUserId, tituloId),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Titulo eliminado')
      setSelectedTituloId(0)
      titulosQuery.refetch()
      descriptivasQuery.refetch()
    }
  })

  const saveDesMutation = useMutation({
    mutationFn: () => saveCntDescriptiva({ ...desForm, descripcionId: desForm.descripcionId || undefined, usuarioId: currentUserId }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Descriptiva guardada')
      setDesForm({ ...emptyDescriptiva, tituloId: selectedTituloId })
      descriptivasQuery.refetch()
    }
  })

  const deleteDesMutation = useMutation({
    mutationFn: (descripcionId: number) => deleteCntDescriptiva(currentUserId, descripcionId),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Descriptiva eliminada')
      descriptivasQuery.refetch()
    }
  })

  const cloneMutation = useMutation({
    mutationFn: () => cloneCntDescriptivas({ usuarioId: currentUserId, empresaOrigen: Number(cloneEmpresaOrigen) }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success(`Clonacion completada: ${response.data?.titulos ?? 0} titulos, ${response.data?.descriptivas ?? 0} descriptivas`)
      setIsCloneOpen(false)
      setCloneEmpresaOrigen('')
      titulosQuery.refetch()
      descriptivasQuery.refetch()
    },
    onError: error => toast.error((error as Error).message)
  })

  const showDesUsedBy = async (row: CntDescriptivaDto) => {
    try {
      const response = await fetchCntDescriptivaUsedBy(currentUserId, row.descripcionId)

      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      setUsedByInfo({ title: row.descripcion, count: response.data ?? 0 })
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const tituloColumns: GridColumns<CntTituloDto> = [
    { flex: 0.18, minWidth: 90, field: 'codigo', headerName: 'Codigo' },
    { flex: 0.42, minWidth: 180, field: 'titulo', headerName: 'Titulo' },
    {
      flex: 0.12,
      minWidth: 132,
      field: 'actions',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: TituloCell) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canAdmin && (
            <>
              <Tooltip title='Editar'>
                <IconButton size='small' color='primary' onClick={() => setTituloForm({ ...row, tituloFkId: row.tituloFkId || undefined })}>
                  <Icon icon='mdi:pencil-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Eliminar'>
                <IconButton
                  size='small'
                  color='error'
                  onClick={() => {
                    if (window.confirm('Eliminar titulo CNT?')) deleteTituloMutation.mutate(row.tituloId)
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

  const desColumns: GridColumns<CntDescriptivaDto> = [
    { flex: 0.14, minWidth: 100, field: 'codigo', headerName: 'Codigo' },
    { flex: 0.34, minWidth: 220, field: 'descripcion', headerName: 'Descripcion' },
    { flex: 0.16, minWidth: 120, field: 'extra1', headerName: 'Extra 1' },
    { flex: 0.16, minWidth: 120, field: 'extra2', headerName: 'Extra 2' },
    {
      flex: 0.1,
      minWidth: 96,
      field: 'actions',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: DescriptivaCell) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canAdmin && (
            <Tooltip title='Editar'>
              <IconButton size='small' color='primary' onClick={() => setDesForm({ ...row, descripcionFkId: row.descripcionFkId || undefined })}>
                <Icon icon='mdi:pencil-outline' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title='Usado por'>
            <IconButton size='small' color='info' onClick={() => showDesUsedBy(row)}>
              <Icon icon='mdi:information-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          {canAdmin && (
            <Tooltip title='Eliminar'>
              <IconButton
                size='small'
                color='error'
                onClick={() => {
                  if (window.confirm('Eliminar descriptiva CNT?')) deleteDesMutation.mutate(row.descripcionId)
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

  const canSaveTitulo = canAdmin && currentUserId > 0 && tituloForm.titulo.trim().length > 0 && !saveTituloMutation.isPending
  const canSaveDes = canAdmin && currentUserId > 0 && desForm.tituloId > 0 && desForm.descripcion.trim().length > 0 && !saveDesMutation.isPending

  const exportTitulos = () => {
    const rows = (titulosQuery.data ?? []).map(row => ({
      TituloId: row.tituloId,
      Codigo: row.codigo,
      Titulo: row.titulo,
      Extra1: row.extra1,
      Extra2: row.extra2,
      Extra3: row.extra3
    }))

    exportCntRowsToExcel(rows, 'Titulos', 'CNT-Titulos')
  }

  const exportDescriptivas = () => {
    const rows = (descriptivasQuery.data ?? []).map(row => ({
      DescripcionId: row.descripcionId,
      TituloId: row.tituloId,
      Titulo: row.titulo,
      Codigo: row.codigo,
      Descripcion: row.descripcion,
      Extra1: row.extra1,
      Extra2: row.extra2,
      Extra3: row.extra3
    }))

    exportCntRowsToExcel(rows, 'Descriptivas', 'CNT-Descriptivas')
  }

  if (permissionLoading) return <Spinner />

  if (!canView) {
    return <Typography color='error'>El usuario no tiene el permiso requerido: contabilidad.catalogos.ver.</Typography>
  }

  return (
    <>
      <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant='h6'>Titulos</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {canAdmin && (
                <Tooltip title='Nuevo titulo'>
                  <IconButton color='primary' size='small' onClick={() => setTituloForm(emptyTitulo)}>
                    <Icon icon='mdi:plus' fontSize={20} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title='Recargar'>
                <IconButton color='primary' size='small' onClick={() => titulosQuery.refetch()}>
                  <Icon icon='mdi:refresh' fontSize={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Exportar Excel'>
                <span>
                  <IconButton color='primary' size='small' disabled={(titulosQuery.data ?? []).length === 0} onClick={exportTitulos}>
                    <Icon icon='mdi:file-excel-outline' fontSize={20} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </CardActions>
          <CardContent sx={{ pt: 0 }}>
            <TextField fullWidth size='small' label='Buscar titulo' value={tituloSearch} onChange={event => setTituloSearch(event.target.value)} />
            <Box sx={{ mt: 3, height: 360 }}>
              {titulosQuery.isLoading ? (
                <Spinner sx={{ height: 360 }} />
              ) : (
                <DataGrid
                  rows={titulosQuery.data ?? []}
                  columns={tituloColumns}
                  getRowId={row => row.tituloId}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25]}
                  onRowClick={params => setSelectedTituloId(Number(params.id))}
                  selectionModel={selectedTituloId ? [selectedTituloId] : []}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {canAdmin && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant='subtitle1' sx={{ mb: 3 }}>
              {tituloForm.tituloId ? 'Editar titulo' : 'Nuevo titulo'}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size='small' label='Codigo' value={tituloForm.codigo} onChange={event => setTituloForm(current => ({ ...current, codigo: event.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth size='small' label='Titulo' value={tituloForm.titulo} onChange={event => setTituloForm(current => ({ ...current, titulo: event.target.value }))} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Extra 1' value={tituloForm.extra1} onChange={event => setTituloForm(current => ({ ...current, extra1: event.target.value }))} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button size='small' variant='outlined' startIcon={<Icon icon='mdi:eraser' />} onClick={() => setTituloForm(emptyTitulo)}>
                    Limpiar
                  </Button>
                  <Button size='small' variant='contained' startIcon={<Icon icon='mdi:content-save-outline' />} disabled={!canSaveTitulo} onClick={() => saveTituloMutation.mutate()}>
                    Guardar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        )}
      </Grid>

      <Grid item xs={12} md={7}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant='h6'>Descriptivas {selectedTitulo ? `- ${selectedTitulo.titulo}` : ''}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {canAdmin && (
                <Tooltip title='Nueva descriptiva'>
                  <span>
                    <IconButton color='primary' size='small' disabled={!selectedTituloId} onClick={() => setDesForm({ ...emptyDescriptiva, tituloId: selectedTituloId })}>
                      <Icon icon='mdi:plus' fontSize={20} />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              <Tooltip title='Recargar'>
                <IconButton color='primary' size='small' onClick={() => descriptivasQuery.refetch()}>
                  <Icon icon='mdi:refresh' fontSize={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Exportar Excel'>
                <span>
                  <IconButton color='primary' size='small' disabled={(descriptivasQuery.data ?? []).length === 0} onClick={exportDescriptivas}>
                    <Icon icon='mdi:file-excel-outline' fontSize={20} />
                  </IconButton>
                </span>
              </Tooltip>
              {canAdmin && (
                <Tooltip title='Clonar desde empresa'>
                  <IconButton color='primary' size='small' onClick={() => setIsCloneOpen(true)}>
                    <Icon icon='mdi:content-copy' fontSize={20} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </CardActions>
          <CardContent sx={{ pt: 0 }}>
            <TextField fullWidth size='small' label='Buscar descriptiva' value={desSearch} onChange={event => setDesSearch(event.target.value)} />
            <Box sx={{ mt: 3, height: 430 }}>
              {descriptivasQuery.isLoading ? (
                <Spinner sx={{ height: 430 }} />
              ) : (
                <DataGrid rows={descriptivasQuery.data ?? []} columns={desColumns} getRowId={row => row.descripcionId} pageSize={10} rowsPerPageOptions={[10, 25, 50]} />
              )}
            </Box>
          </CardContent>
        </Card>

        {canAdmin && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant='subtitle1' sx={{ mb: 3 }}>
              {desForm.descripcionId ? 'Editar descriptiva' : 'Nueva descriptiva'}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size='small' label='Codigo' value={desForm.codigo} onChange={event => setDesForm(current => ({ ...current, codigo: event.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth size='small' label='Descripcion' value={desForm.descripcion} onChange={event => setDesForm(current => ({ ...current, descripcion: event.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size='small' label='Extra 1' value={desForm.extra1} onChange={event => setDesForm(current => ({ ...current, extra1: event.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size='small' label='Extra 2' value={desForm.extra2} onChange={event => setDesForm(current => ({ ...current, extra2: event.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size='small' label='Extra 3' value={desForm.extra3} onChange={event => setDesForm(current => ({ ...current, extra3: event.target.value }))} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button size='small' variant='outlined' startIcon={<Icon icon='mdi:eraser' />} onClick={() => setDesForm({ ...emptyDescriptiva, tituloId: selectedTituloId })}>
                    Limpiar
                  </Button>
                  <Button size='small' variant='contained' startIcon={<Icon icon='mdi:content-save-outline' />} disabled={!canSaveDes} onClick={() => saveDesMutation.mutate()}>
                    Guardar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        )}
      </Grid>
      </Grid>

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

      <Dialog open={isCloneOpen} onClose={() => setIsCloneOpen(false)} fullWidth maxWidth='xs'>
        <DialogTitle>Clonar descriptivas</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            type='number'
            label='Empresa origen'
            value={cloneEmpresaOrigen}
            onChange={event => setCloneEmpresaOrigen(event.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={() => setIsCloneOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            disabled={!canAdmin || Number(cloneEmpresaOrigen) <= 0 || cloneMutation.isPending}
            onClick={() => {
              if (window.confirm('Clonar titulos y descriptivas desde la empresa indicada?')) cloneMutation.mutate()
            }}
          >
            Clonar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CntDescriptivasCatalog
