import { useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
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
import { CntAuxiliarAdminDto, CntAuxiliarPucDto } from '../../interfaces/CntDtos'
import {
  CNT_AUXILIARES_ADMIN_QUERY_KEY,
  CNT_AUXILIARES_PUC_QUERY_KEY,
  deleteCntAuxiliarPuc,
  fetchCntAuxiliaresAdmin,
  fetchCntAuxiliaresPuc,
  saveCntAuxiliarPuc
} from '../../services/cntService'

interface AuxiliarPucCell {
  row: CntAuxiliarPucDto
}

const emptyForm = {
  codigoAuxiliarPuc: 0,
  codigoAuxiliar: 0,
  codigoPuc: '',
  tipoDocumentoId: ''
}

const formatAuxiliar = (auxiliar: CntAuxiliarAdminDto) => `${auxiliar.segmento1} ${auxiliar.segmento2} - ${auxiliar.denominacion}`

const CntAuxiliaresPucCatalog = () => {
  const { currentUserId, canView, canAdmin, isLoading: permissionLoading } = useCntCatalogPermissions()
  const [searchText, setSearchText] = useState('')
  const [form, setForm] = useState(emptyForm)

  const auxiliaresQuery = useQuery({
    queryKey: [CNT_AUXILIARES_ADMIN_QUERY_KEY, currentUserId, 'auxiliares-puc-select'],
    queryFn: () => fetchCntAuxiliaresAdmin(currentUserId, undefined, true, ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const relacionesQuery = useQuery({
    queryKey: [CNT_AUXILIARES_PUC_QUERY_KEY, currentUserId, searchText],
    queryFn: () => fetchCntAuxiliaresPuc(currentUserId, undefined, undefined, searchText),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const selectedAuxiliar = (auxiliaresQuery.data ?? []).find(item => item.codigoAuxiliar === form.codigoAuxiliar) ?? null

  const saveMutation = useMutation({
    mutationFn: () =>
      saveCntAuxiliarPuc({
        usuarioId: currentUserId,
        codigoAuxiliarPuc: form.codigoAuxiliarPuc || undefined,
        codigoAuxiliar: form.codigoAuxiliar,
        codigoPuc: Number(form.codigoPuc),
        tipoDocumentoId: form.tipoDocumentoId || undefined
      }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Relacion auxiliar PUC guardada')
      setForm(emptyForm)
      relacionesQuery.refetch()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (codigoAuxiliarPuc: number) => deleteCntAuxiliarPuc(currentUserId, codigoAuxiliarPuc),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      toast.success('Relacion eliminada')
      relacionesQuery.refetch()
    }
  })

  const columns: GridColumns<CntAuxiliarPucDto> = [
    { flex: 0.28, minWidth: 240, field: 'auxiliar', headerName: 'Auxiliar' },
    { flex: 0.24, minWidth: 220, field: 'mayor', headerName: 'Mayor' },
    { flex: 0.12, minWidth: 120, field: 'codigoPuc', headerName: 'PUC' },
    { flex: 0.12, minWidth: 120, field: 'tipoDocumentoId', headerName: 'Tipo doc.' },
    {
      flex: 0.1,
      minWidth: 96,
      field: 'actions',
      headerName: '',
      sortable: false,
      renderCell: ({ row }: AuxiliarPucCell) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canAdmin && (
            <>
              <Tooltip title='Editar'>
                <IconButton
                  size='small'
                  color='primary'
                  onClick={() =>
                    setForm({
                      codigoAuxiliarPuc: row.codigoAuxiliarPuc,
                      codigoAuxiliar: row.codigoAuxiliar,
                      codigoPuc: String(row.codigoPuc),
                      tipoDocumentoId: row.tipoDocumentoId || ''
                    })
                  }
                >
                  <Icon icon='mdi:pencil-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Eliminar'>
                <IconButton
                  size='small'
                  color='error'
                  onClick={() => {
                    if (window.confirm('Eliminar relacion auxiliar PUC?')) deleteMutation.mutate(row.codigoAuxiliarPuc)
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

  const canSave = canAdmin && currentUserId > 0 && form.codigoAuxiliar > 0 && Number(form.codigoPuc) > 0 && !saveMutation.isPending

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
                  <IconButton color='primary' onClick={() => setForm(emptyForm)}>
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
              <DataGrid autoHeight rows={relacionesQuery.data ?? []} columns={columns} getRowId={row => row.codigoAuxiliarPuc} pageSize={10} rowsPerPageOptions={[10, 25, 50]} disableSelectionOnClick />
            )}
          </CardContent>
        </Card>
      </Grid>

      {canAdmin && (
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              {form.codigoAuxiliarPuc ? 'Editar relacion' : 'Nueva relacion'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Autocomplete
                options={auxiliaresQuery.data ?? []}
                loading={auxiliaresQuery.isLoading}
                value={selectedAuxiliar}
                getOptionLabel={option => formatAuxiliar(option)}
                isOptionEqualToValue={(option, value) => option.codigoAuxiliar === value.codigoAuxiliar}
                onChange={(_, value) => setForm(current => ({ ...current, codigoAuxiliar: value?.codigoAuxiliar ?? 0 }))}
                renderOption={(props, option) => (
                  <li {...props} key={option.codigoAuxiliar}>
                    {formatAuxiliar(option)}
                  </li>
                )}
                renderInput={params => <TextField {...params} label='Auxiliar' />}
              />
              <TextField label='Codigo PUC' type='number' value={form.codigoPuc} onChange={event => setForm(current => ({ ...current, codigoPuc: event.target.value }))} />
              <TextField label='Tipo documento' value={form.tipoDocumentoId} inputProps={{ maxLength: 2 }} onChange={event => setForm(current => ({ ...current, tipoDocumentoId: event.target.value.toUpperCase() }))} />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 5, pb: 5 }}>
            <Button variant='outlined' color='secondary' onClick={() => setForm(emptyForm)}>
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

export default CntAuxiliaresPucCatalog
