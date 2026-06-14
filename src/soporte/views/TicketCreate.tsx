import { useState } from 'react'
import { Button, Card, CardActions, CardContent, Grid, MenuItem, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useSupportCurrentUserId } from '../hooks/useSupportCurrentUserId'
import { createSupportTicket, fetchSupportCatalog, SUPPORT_CATALOGS_QUERY_KEY } from '../services/supportService'

const TicketCreate = () => {
  const router = useRouter()
  const currentUserId = useSupportCurrentUserId()
  const [form, setForm] = useState({
    tipoSolicitudId: 1,
    moduloId: 1,
    prioridadId: 2,
    asunto: '',
    descripcion: ''
  })

  const typesQuery = useQuery({
    queryKey: [SUPPORT_CATALOGS_QUERY_KEY, 'types'],
    queryFn: () => fetchSupportCatalog('types'),
    retry: 1
  })
  const modulesQuery = useQuery({
    queryKey: [SUPPORT_CATALOGS_QUERY_KEY, 'modules'],
    queryFn: () => fetchSupportCatalog('modules'),
    retry: 1
  })
  const prioritiesQuery = useQuery({
    queryKey: [SUPPORT_CATALOGS_QUERY_KEY, 'priorities'],
    queryFn: () => fetchSupportCatalog('priorities'),
    retry: 1
  })

  const handleSubmit = async () => {
    if (currentUserId <= 0) {
      toast.error('No se pudo identificar el usuario autenticado')

      return
    }

    const result = await createSupportTicket({
      ...form,
      usuarioSolicitanteId: currentUserId,
      createdBy: currentUserId
    })
    if (result.isValid) {
      toast.success('Ticket creado')
      router.push('/apps/soporte/tickets')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField fullWidth label='Asunto' value={form.asunto} onChange={event => setForm({ ...form, asunto: event.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={5}
                label='Descripcion'
                value={form.descripcion}
                onChange={event => setForm({ ...form, descripcion: event.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth select label='Tipo' value={form.tipoSolicitudId} onChange={event => setForm({ ...form, tipoSolicitudId: Number(event.target.value) })}>
                {(typesQuery.data ?? []).map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth select label='Modulo' value={form.moduloId} onChange={event => setForm({ ...form, moduloId: Number(event.target.value) })}>
                {(modulesQuery.data ?? []).map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth select label='Prioridad' value={form.prioridadId} onChange={event => setForm({ ...form, prioridadId: Number(event.target.value) })}>
                {(prioritiesQuery.data ?? []).map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant='contained' onClick={handleSubmit}>
            Guardar
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default TicketCreate
