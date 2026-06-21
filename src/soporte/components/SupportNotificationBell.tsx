import { Fragment, MouseEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { useSupportCurrentUserId } from '../hooks/useSupportCurrentUserId'
import { SupportNotificationDto } from '../interfaces/SupportDtos'
import {
  fetchSupportNotifications,
  markSupportNotificationRead,
  SUPPORT_NOTIFICATIONS_QUERY_KEY
} from '../services/supportService'

const formatNotificationDate = (value: string) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const SupportNotificationBell = () => {
  const router = useRouter()
  const theme = useTheme()
  const currentUserId = useSupportCurrentUserId()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const query = useQuery<SupportNotificationDto[]>({
    queryKey: [SUPPORT_NOTIFICATIONS_QUERY_KEY, currentUserId, 'bell'],
    queryFn: () => fetchSupportNotifications(currentUserId),
    enabled: currentUserId > 0,
    retry: false,
    staleTime: 60000,
    refetchInterval: 300000,
    refetchOnWindowFocus: false
  })

  const unreadNotifications = useMemo(
    () => (query.data ?? []).filter(notification => !notification.leida),
    [query.data]
  )

  const visibleNotifications = unreadNotifications.slice(0, 8)

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    query.refetch()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenNotifications = () => {
    handleClose()
    router.push('/apps/soporte/notificaciones')
  }

  const handleNotificationClick = async (notification: SupportNotificationDto) => {
    const ticketId = notification.ticketId

    handleClose()

    if (!notification.leida) {
      await markSupportNotificationRead(notification.notifId, currentUserId)
      query.refetch()
    }

    if (ticketId > 0) {
      router.push(`/apps/soporte/tickets/${ticketId}`)
    } else {
      router.push('/apps/soporte/notificaciones')
    }
  }

  return (
    <Fragment>
      <Tooltip title='Notificaciones de soporte'>
        <IconButton color='inherit' aria-haspopup='true' onClick={handleOpen} aria-controls='support-notifications-menu'>
          <Badge
            color='error'
            badgeContent={unreadNotifications.length}
            invisible={unreadNotifications.length === 0}
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                top: 3,
                right: 3,
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
              }
            }}
          >
            <Icon icon='mdi:bell-outline' />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        id='support-notifications-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: { xs: 320, sm: 380 }, mt: 2, overflow: 'hidden' } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ px: 4, py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 600 }}>Notificaciones</Typography>
          <Typography variant='caption' sx={{ color: 'text.secondary' }}>
            {unreadNotifications.length} pendientes
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
          {query.isLoading ? (
            <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : visibleNotifications.length > 0 ? (
            visibleNotifications.map(notification => (
              <MenuItem
                key={notification.notifId}
                onClick={() => handleNotificationClick(notification)}
                sx={{ alignItems: 'flex-start', gap: 3, py: 3 }}
              >
                <ListItemIcon sx={{ minWidth: 0, mt: 0.5, color: 'primary.main' }}>
                  <Icon icon='mdi:ticket-confirmation-outline' fontSize={22} />
                </ListItemIcon>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }} noWrap>
                    {notification.titulo}
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary' }} noWrap>
                    {notification.mensaje}
                  </Typography>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {notification.ticketId > 0 ? `Ticket #${notification.ticketId}` : 'Soporte'} -{' '}
                    {formatNotificationDate(notification.fechaCreacion)}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <Box sx={{ px: 4, py: 6, textAlign: 'center' }}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                No tienes notificaciones pendientes
              </Typography>
            </Box>
          )}
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>
          <Button fullWidth size='small' variant='contained' onClick={handleOpenNotifications}>
            Ver todas
          </Button>
        </Box>
      </Menu>
    </Fragment>
  )
}

export default SupportNotificationBell
