import { Box, Card, CardActions, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useSupportCurrentUserId } from '../hooks/useSupportCurrentUserId'
import { SupportNotificationDto } from '../interfaces/SupportDtos'
import {
  fetchSupportNotifications,
  markSupportNotificationRead,
  SUPPORT_NOTIFICATIONS_QUERY_KEY
} from '../services/supportService'

interface CellType {
  row: SupportNotificationDto
}

const SupportNotifications = () => {
  const currentUserId = useSupportCurrentUserId()

  const query = useQuery<SupportNotificationDto[]>({
    queryKey: [SUPPORT_NOTIFICATIONS_QUERY_KEY, currentUserId],
    queryFn: () => fetchSupportNotifications(currentUserId),
    enabled: currentUserId > 0,
    retry: 1
  })

  const handleMarkRead = async (row: SupportNotificationDto) => {
    const result = await markSupportNotificationRead(row.notifId, currentUserId)

    if (result.isValid) {
      toast.success('Notificacion marcada como leida')
      query.refetch()
    } else {
      toast.error(result.message)
    }
  }

  const columns = [
    {
      flex: 0.08,
      field: 'leida',
      minWidth: 110,
      headerName: 'Estado',
      renderCell: ({ row }: CellType) => (
        <Chip size='small' color={row.leida ? 'default' : 'primary'} label={row.leida ? 'Leida' : 'Nueva'} />
      )
    },
    { flex: 0.12, field: 'evento', minWidth: 130, headerName: 'Evento' },
    { flex: 0.18, field: 'titulo', minWidth: 220, headerName: 'Titulo' },
    { flex: 0.3, field: 'mensaje', minWidth: 320, headerName: 'Mensaje' },
    { flex: 0.12, field: 'ticketId', minWidth: 110, headerName: 'Ticket' },
    { flex: 0.14, field: 'fechaCreacion', minWidth: 180, headerName: 'Fecha' },
    {
      flex: 0.08,
      field: 'acciones',
      minWidth: 90,
      sortable: false,
      filterable: false,
      headerName: 'Acciones',
      renderCell: ({ row }: CellType) => (
        <Tooltip title='Marcar como leida'>
          <span>
            <IconButton size='small' disabled={row.leida} onClick={() => handleMarkRead(row)}>
              <Icon icon='mdi:check-circle-outline' fontSize={20} />
            </IconButton>
          </span>
        </Tooltip>
      )
    }
  ]

  return (
    <Card>
      <CardActions sx={{ justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
        <Typography variant='h6'>Notificaciones</Typography>
        <Tooltip title='Recargar'>
          <IconButton color='primary' size='small' onClick={() => query.refetch()}>
            <Icon icon='mdi:refresh' fontSize={20} />
          </IconButton>
        </Tooltip>
      </CardActions>
      {query.isLoading ? (
        <Spinner sx={{ height: 450 }} />
      ) : (
        <Box sx={{ height: 540 }}>
          <DataGrid
            getRowId={row => row.notifId}
            columns={columns}
            rows={query.data ?? []}
            rowsPerPageOptions={[10, 25, 50]}
            pageSize={10}
          />
        </Box>
      )}
      {query.isError && (
        <Typography sx={{ color: 'error.main', px: 4, pb: 4 }} variant='body2'>
          {(query.error as Error).message}
        </Typography>
      )}
    </Card>
  )
}

export default SupportNotifications
