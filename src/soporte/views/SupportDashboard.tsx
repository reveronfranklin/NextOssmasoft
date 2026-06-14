import { useState } from 'react'
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'src/@core/components/spinner'
import { useSupportCurrentUserId } from '../hooks/useSupportCurrentUserId'
import { fetchSupportDashboard, SUPPORT_DASHBOARD_QUERY_KEY } from '../services/supportService'

const SupportDashboard = () => {
  const currentUserId = useSupportCurrentUserId()
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const query = useQuery({
    queryKey: [SUPPORT_DASHBOARD_QUERY_KEY, currentUserId, fechaDesde, fechaHasta],
    queryFn: () => fetchSupportDashboard(currentUserId, fechaDesde, fechaHasta),
    enabled: currentUserId > 0,
    retry: false,
    staleTime: 60000,
    refetchOnWindowFocus: false
  })

  if (query.isLoading) {
    return <Spinner sx={{ height: 300 }} />
  }

  const data = query.data
  const items = [
    ['Total', data?.totalTickets ?? 0],
    ['Abiertos', data?.ticketsAbiertos ?? 0],
    ['Cerrados', data?.ticketsCerrados ?? 0],
    ['Criticos', data?.ticketsCriticos ?? 0],
    ['Vencidos', data?.ticketsVencidos ?? 0],
    ['Sin asignar', data?.ticketsSinAsignar ?? 0]
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid container spacing={4} alignItems='center'>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              type='date'
              label='Desde'
              value={fechaDesde}
              InputLabelProps={{ shrink: true }}
              onChange={event => setFechaDesde(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              type='date'
              label='Hasta'
              value={fechaHasta}
              InputLabelProps={{ shrink: true }}
              onChange={event => setFechaHasta(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => {
                setFechaDesde('')
                setFechaHasta('')
              }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {items.map(item => (
        <Grid item xs={12} sm={6} md={4} key={item[0]}>
          <Card>
            <CardContent>
              <Typography variant='body2'>{item[0]}</Typography>
              <Typography variant='h4'>{item[1]}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default SupportDashboard
