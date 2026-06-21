import { useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCatalogPermissions } from '../../hooks/useCntCatalogPermissions'
import { CntRubroDto } from '../../interfaces/CntDtos'
import {
  CNT_RUBROS_QUERY_KEY,
  deleteCntRubro,
  fetchCntRubros,
  saveCntRubro
} from '../../services/cntService'

interface RubroCell {
  row: CntRubroDto
}

const emptyRubro = {
  codigoRubro: 0,
  numeroRubro: '',
  denominacion: '',
  descripcion: '',
  extra1: '',
  extra2: '',
  extra3: ''
}

const CntRubrosCatalog = () => {
  const { currentUserId, canView, canAdmin, isLoading: permissionLoading } = useCntCatalogPermissions()
  const [searchText, setSearchText] = useState('')
  const [form, setForm] = useState(emptyRubro)

  const rubrosQuery = useQuery({
    queryKey: [CNT_RUBROS_QUERY_KEY, currentUserId, searchText],
    queryFn: () => fetchCntRubros(currentUserId, searchText),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const saveMutation = useMutation({
    mutationFn: () => saveCntRubro({ ...form, codigoRubro: form.codigoRubro || undefined, usuarioId: currentUserId }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Rubro guardado')
      setForm(emptyRubro)
      rubrosQuery.refetch()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (codigoRubro: number) => deleteCntRubro(currentUserId, codigoRubro),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Rubro eliminado')
      rubrosQuery.refetch()
    }
  })

  const columns: GridColumns<CntRubroDto> = [
    { flex: 0.14, minWidth: 120, field: 'numeroRubro', headerName: 'Numero' },
    { flex: 0.3, minWidth: 220, field: 'denominacion', headerName: 'Denominacion' },
    { flex: 0.34, minWidth: 260, field: 'descripcion', headerName: 'Descripcion' },
    {
      flex: 0.1,
      minWidth: 96,
      field: 'actions',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: RubroCell) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canAdmin && (
            <>
              <Tooltip title='Editar'>
                <IconButton size='small' color='primary' onClick={() => setForm(row)}>
                  <Icon icon='mdi:pencil-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Eliminar'>
                <IconButton
                  size='small'
                  color='error'
                  onClick={() => {
                    if (window.confirm('Eliminar rubro CNT?')) deleteMutation.mutate(row.codigoRubro)
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

  const canSave =
    canAdmin &&
    currentUserId > 0 &&
    form.numeroRubro.trim().length > 0 &&
    form.denominacion.trim().length > 0 &&
    !saveMutation.isPending

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
                <IconButton color='primary' onClick={() => rubrosQuery.refetch()}>
                  <Icon icon='mdi:refresh' />
                </IconButton>
              </Tooltip>
              {canAdmin && (
                <Tooltip title='Nuevo'>
                  <IconButton color='primary' onClick={() => setForm(emptyRubro)}>
                    <Icon icon='mdi:plus' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <TextField size='small' label='Buscar' value={searchText} onChange={event => setSearchText(event.target.value)} sx={{ minWidth: 280 }} />
          </CardActions>
          <CardContent sx={{ pt: 0 }}>
            {rubrosQuery.isLoading ? (
              <Spinner />
            ) : (
              <DataGrid
                autoHeight
                rows={rubrosQuery.data ?? []}
                columns={columns}
                getRowId={row => row.codigoRubro}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      {canAdmin && (
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              {form.codigoRubro ? 'Editar rubro' : 'Nuevo rubro'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label='Numero'
                value={form.numeroRubro}
                inputProps={{ maxLength: 20 }}
                onChange={event => setForm(current => ({ ...current, numeroRubro: event.target.value }))}
              />
              <TextField
                label='Denominacion'
                value={form.denominacion}
                inputProps={{ maxLength: 100 }}
                onChange={event => setForm(current => ({ ...current, denominacion: event.target.value }))}
              />
              <TextField
                label='Descripcion'
                value={form.descripcion}
                multiline
                minRows={4}
                inputProps={{ maxLength: 1000 }}
                onChange={event => setForm(current => ({ ...current, descripcion: event.target.value }))}
              />
              <TextField label='Extra 1' value={form.extra1} onChange={event => setForm(current => ({ ...current, extra1: event.target.value }))} />
              <TextField label='Extra 2' value={form.extra2} onChange={event => setForm(current => ({ ...current, extra2: event.target.value }))} />
              <TextField label='Extra 3' value={form.extra3} onChange={event => setForm(current => ({ ...current, extra3: event.target.value }))} />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 5, pb: 5 }}>
            <Button variant='outlined' color='secondary' onClick={() => setForm(emptyRubro)}>
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

export default CntRubrosCatalog
