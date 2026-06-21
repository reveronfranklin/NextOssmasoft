import { useMemo, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Chip, Grid, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useSupportCurrentUserId } from '../hooks/useSupportCurrentUserId'
import { SupportTicketDto } from '../interfaces/SupportDtos'
import {
  fetchSupportCatalog,
  fetchSupportPermissions,
  fetchSupportTickets,
  SUPPORT_CATALOGS_QUERY_KEY,
  SUPPORT_PERMISSIONS_QUERY_KEY,
  SUPPORT_TICKETS_QUERY_KEY,
  SupportTicketGetAllResult
} from '../services/supportService'

interface CellType {
  row: SupportTicketDto
}

const TicketList = () => {
  const router = useRouter()
  const currentUserId = useSupportCurrentUserId()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [estadoId, setEstadoId] = useState(0)
  const [prioridadId, setPrioridadId] = useState(0)
  const [tipoSolicitudId, setTipoSolicitudId] = useState(0)
  const [moduloId, setModuloId] = useState(0)
  const [responsableId, setResponsableId] = useState('')
  const [solicitanteId, setSolicitanteId] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const queryPayload = useMemo(
    () => ({
      usuarioId: currentUserId,
      pageSize,
      pageNumber: page + 1,
      searchText,
      estadoId: estadoId || undefined,
      prioridadId: prioridadId || undefined,
      tipoSolicitudId: tipoSolicitudId || undefined,
      moduloId: moduloId || undefined,
      responsableId: responsableId ? Number(responsableId) : undefined,
      solicitanteId: solicitanteId ? Number(solicitanteId) : undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined
    }),
    [currentUserId, estadoId, fechaDesde, fechaHasta, moduloId, page, pageSize, prioridadId, responsableId, searchText, solicitanteId, tipoSolicitudId]
  )

  const query = useQuery<SupportTicketGetAllResult>({
    queryKey: [SUPPORT_TICKETS_QUERY_KEY, queryPayload],
    queryFn: () => fetchSupportTickets(queryPayload),
    enabled: currentUserId > 0,
    retry: 1
  })
  const permissionsQuery = useQuery({
    queryKey: [SUPPORT_PERMISSIONS_QUERY_KEY, currentUserId],
    queryFn: () => fetchSupportPermissions(currentUserId),
    enabled: currentUserId > 0,
    retry: 1
  })
  const permissions = permissionsQuery.data?.permissions ?? []
  const canCreate = permissions.includes('soporte.tickets.crear')
  const typesQuery = useQuery({ queryKey: [SUPPORT_CATALOGS_QUERY_KEY, 'types'], queryFn: () => fetchSupportCatalog('types'), retry: 1 })
  const prioritiesQuery = useQuery({ queryKey: [SUPPORT_CATALOGS_QUERY_KEY, 'priorities'], queryFn: () => fetchSupportCatalog('priorities'), retry: 1 })
  const statusesQuery = useQuery({ queryKey: [SUPPORT_CATALOGS_QUERY_KEY, 'statuses'], queryFn: () => fetchSupportCatalog('statuses'), retry: 1 })
  const modulesQuery = useQuery({ queryKey: [SUPPORT_CATALOGS_QUERY_KEY, 'modules'], queryFn: () => fetchSupportCatalog('modules'), retry: 1 })

  const resetFilters = () => {
    setPage(0)
    setSearchText('')
    setEstadoId(0)
    setPrioridadId(0)
    setTipoSolicitudId(0)
    setModuloId(0)
    setResponsableId('')
    setSolicitanteId('')
    setFechaDesde('')
    setFechaHasta('')
  }

  const columns = [
    { flex: 0.12, field: 'ticketNumero', minWidth: 120, headerName: 'Ticket' },
    { flex: 0.24, field: 'asunto', minWidth: 220, headerName: 'Asunto' },
    {
      flex: 0.14,
      field: 'estado',
      minWidth: 130,
      headerName: 'Estado',
      renderCell: ({ row }: CellType) => <Chip size='small' label={row.estado} color={row.estado === 'Cerrado' ? 'success' : 'primary'} />
    },
    {
      flex: 0.12,
      field: 'prioridad',
      minWidth: 120,
      headerName: 'Prioridad',
      renderCell: ({ row }: CellType) => <Chip size='small' label={row.prioridad} color={row.prioridad === 'Critica' ? 'error' : 'default'} />
    },
    { flex: 0.16, field: 'modulo', minWidth: 140, headerName: 'Modulo' },
    { flex: 0.18, field: 'usuarioResponsable', minWidth: 180, headerName: 'Responsable' },
    {
      flex: 0.1,
      field: 'actions',
      minWidth: 80,
      headerName: 'Acciones',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Tooltip title='Ver'>
          <IconButton color='primary' size='small' onClick={() => router.push(`/apps/soporte/tickets/${row.ticketId}`)}>
            <Icon icon='mdi:eye-outline' fontSize={20} />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  return (
    <Grid item xs={12}>
      <Card>
        <CardActions sx={{ justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {canCreate && (
              <Tooltip title='Nuevo ticket'>
                <IconButton color='primary' size='small' onClick={() => router.push('/apps/soporte/tickets/nuevo')}>
                  <Icon icon='mdi:plus' fontSize={20} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title='Recargar'>
              <IconButton color='primary' size='small' onClick={() => query.refetch()}>
                <Icon icon='mdi:refresh' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            size='small'
            value={searchText}
            label='Buscar'
            sx={{ minWidth: { xs: '100%', sm: 320 } }}
            onChange={event => {
              setPage(0)
              setSearchText(event.target.value)
            }}
          />
        </CardActions>
        {query.isLoading ? (
          <Spinner sx={{ height: 450 }} />
        ) : (
          <>
            <CardContent sx={{ pt: 0 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField fullWidth select size='small' label='Estado' value={estadoId} onChange={event => { setPage(0); setEstadoId(Number(event.target.value)) }}>
                    <MenuItem value={0}>Todos</MenuItem>
                    {(statusesQuery.data ?? []).map(item => <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField fullWidth select size='small' label='Prioridad' value={prioridadId} onChange={event => { setPage(0); setPrioridadId(Number(event.target.value)) }}>
                    <MenuItem value={0}>Todas</MenuItem>
                    {(prioritiesQuery.data ?? []).map(item => <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField fullWidth select size='small' label='Tipo' value={tipoSolicitudId} onChange={event => { setPage(0); setTipoSolicitudId(Number(event.target.value)) }}>
                    <MenuItem value={0}>Todos</MenuItem>
                    {(typesQuery.data ?? []).map(item => <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField fullWidth select size='small' label='Modulo' value={moduloId} onChange={event => { setPage(0); setModuloId(Number(event.target.value)) }}>
                    <MenuItem value={0}>Todos</MenuItem>
                    {(modulesQuery.data ?? []).map(item => <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField fullWidth size='small' type='number' label='Responsable ID' value={responsableId} onChange={event => { setPage(0); setResponsableId(event.target.value) }} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField fullWidth size='small' type='number' label='Solicitante ID' value={solicitanteId} onChange={event => { setPage(0); setSolicitanteId(event.target.value) }} />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField fullWidth size='small' type='date' label='Desde' InputLabelProps={{ shrink: true }} value={fechaDesde} onChange={event => { setPage(0); setFechaDesde(event.target.value) }} />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField fullWidth size='small' type='date' label='Hasta' InputLabelProps={{ shrink: true }} value={fechaHasta} onChange={event => { setPage(0); setFechaHasta(event.target.value) }} />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Button fullWidth variant='outlined' onClick={resetFilters}>Limpiar</Button>
                </Grid>
              </Grid>
            </CardContent>
            <Box sx={{ height: 540 }}>
              <DataGrid
                getRowId={row => row.ticketId}
                columns={columns}
                rows={query.data?.data ?? []}
                rowCount={query.data?.cantidadRegistros ?? 0}
                page={page}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 25, 50]}
                pagination
                paginationMode='server'
                onPageChange={newPage => setPage(newPage)}
                onPageSizeChange={newPageSize => {
                  setPageSize(newPageSize)
                  setPage(0)
                }}
              />
            </Box>
          </>
        )}
        {query.isError && (
          <Typography sx={{ color: 'error.main', px: 4, pb: 4 }} variant='body2'>
            {(query.error as Error).message}
          </Typography>
        )}
      </Card>
    </Grid>
  )
}

export default TicketList
