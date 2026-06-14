import { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, Card, CardActions, CardContent, Chip, CircularProgress, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Spinner from 'src/@core/components/spinner'
import { useSupportCurrentUserId } from '../hooks/useSupportCurrentUserId'
import {
  assignSupportTicket,
  changeSupportTicketStatus,
  closeSupportTicket,
  createSupportComment,
  fetchSupportAnalysts,
  fetchSupportAttachments,
  fetchSupportCatalog,
  fetchSupportComments,
  fetchSupportHistory,
  fetchSupportPermissions,
  fetchSupportTicketById,
  SUPPORT_ANALYSTS_QUERY_KEY,
  SUPPORT_CATALOGS_QUERY_KEY,
  SUPPORT_PERMISSIONS_QUERY_KEY,
  SUPPORT_TICKETS_QUERY_KEY,
  uploadSupportAttachment
} from '../services/supportService'
import { SupportUserDto } from '../interfaces/SupportDtos'

interface TicketDetailProps {
  ticketId: number
}

const TicketDetail = ({ ticketId }: TicketDetailProps) => {
  const currentUserId = useSupportCurrentUserId()
  const [comment, setComment] = useState('')
  const [responsable, setResponsable] = useState<SupportUserDto | null>(null)
  const [responsableSearch, setResponsableSearch] = useState('')
  const [estadoId, setEstadoId] = useState(0)
  const [observacion, setObservacion] = useState('')
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)

  const ticketQuery = useQuery({
    queryKey: [SUPPORT_TICKETS_QUERY_KEY, ticketId],
    queryFn: () => fetchSupportTicketById(ticketId, currentUserId),
    enabled: ticketId > 0 && currentUserId > 0,
    retry: 1
  })
  const commentsQuery = useQuery({
    queryKey: [SUPPORT_TICKETS_QUERY_KEY, ticketId, 'comments'],
    queryFn: () => fetchSupportComments(ticketId, currentUserId),
    enabled: ticketId > 0 && currentUserId > 0,
    retry: 1
  })
  const historyQuery = useQuery({
    queryKey: [SUPPORT_TICKETS_QUERY_KEY, ticketId, 'history'],
    queryFn: () => fetchSupportHistory(ticketId, currentUserId),
    enabled: ticketId > 0 && currentUserId > 0,
    retry: 1
  })
  const attachmentsQuery = useQuery({
    queryKey: [SUPPORT_TICKETS_QUERY_KEY, ticketId, 'attachments'],
    queryFn: () => fetchSupportAttachments(ticketId, currentUserId),
    enabled: ticketId > 0 && currentUserId > 0,
    retry: 1
  })
  const statusesQuery = useQuery({
    queryKey: [SUPPORT_CATALOGS_QUERY_KEY, 'statuses'],
    queryFn: () => fetchSupportCatalog('statuses'),
    retry: 1
  })
  const permissionsQuery = useQuery({
    queryKey: [SUPPORT_PERMISSIONS_QUERY_KEY, currentUserId],
    queryFn: () => fetchSupportPermissions(currentUserId),
    enabled: currentUserId > 0,
    retry: 1
  })
  const permissions = permissionsQuery.data?.permissions ?? []
  const canAssign = permissions.includes('soporte.tickets.asignar')
  const canChangeStatus = permissions.includes('soporte.tickets.cambiar_estado')
  const canClose = permissions.includes('soporte.tickets.cerrar')
  const canComment = permissions.includes('soporte.comentarios.crear')
  const canAttach = canComment
  const analystsQuery = useQuery({
    queryKey: [SUPPORT_ANALYSTS_QUERY_KEY, responsableSearch],
    queryFn: () => fetchSupportAnalysts(responsableSearch),
    enabled: canAssign,
    retry: 1
  })

  useEffect(() => {
    const ticket = ticketQuery.data
    if (!ticket?.usuarioResponsableId) {
      setResponsable(null)

      return
    }

    setResponsable(current => current?.codigoUsuario === ticket.usuarioResponsableId
      ? current
      : {
          codigoUsuario: ticket.usuarioResponsableId ?? 0,
          usuario: ticket.usuarioResponsable,
          login: '',
          email: '',
          esAnalistaSoporte: true
        })
  }, [ticketQuery.data?.usuarioResponsableId, ticketQuery.data?.usuarioResponsable])

  const refresh = () => {
    ticketQuery.refetch()
    commentsQuery.refetch()
    historyQuery.refetch()
    attachmentsQuery.refetch()
  }

  const handleComment = async () => {
    const result = await createSupportComment({ ticketId, usuarioId: currentUserId, comentario: comment, esInterno: false })
    if (result.isValid) {
      setComment('')
      toast.success('Comentario registrado')
      refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleAssign = async () => {
    if (!responsable) {
      toast.error('Debe seleccionar un analista responsable')

      return
    }

    const result = await assignSupportTicket({ ticketId, usuarioResponsableId: responsable.codigoUsuario, updatedBy: currentUserId })
    if (result.isValid) {
      toast.success('Ticket asignado')
      refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleStatus = async () => {
    const result = await changeSupportTicketStatus({ ticketId, estadoId, updatedBy: currentUserId })
    if (result.isValid) {
      toast.success('Estado actualizado')
      refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleClose = async () => {
    const result = await closeSupportTicket({ ticketId, updatedBy: currentUserId, observacionResolucion: observacion })
    if (result.isValid) {
      toast.success('Ticket cerrado')
      refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleAttachment = async () => {
    if (!attachmentFile) return

    const result = await uploadSupportAttachment({
      ticketId,
      file: attachmentFile,
      usuarioCargaId: currentUserId
    })

    if (result.isValid) {
      toast.success('Adjunto cargado')
      setAttachmentFile(null)
      refresh()
    } else {
      toast.error(result.message)
    }
  }

  if (ticketQuery.isLoading) {
    return <Spinner sx={{ height: 360 }} />
  }

  const ticket = ticketQuery.data

  if (!ticket) {
    return (
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography>No se encontro el ticket.</Typography>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, mb: 4 }}>
              <Box>
                <Typography variant='h6'>{ticket.ticketNumero}</Typography>
                <Typography variant='body2'>{ticket.asunto}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip size='small' label={ticket.estado} color={ticket.estado === 'Cerrado' ? 'success' : 'primary'} />
                <Chip size='small' label={ticket.prioridad} color={ticket.prioridad === 'Critica' ? 'error' : 'default'} />
              </Box>
            </Box>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{ticket.descripcion}</Typography>
            <Divider sx={{ my: 4 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant='caption'>Solicitante</Typography>
                <Typography>{ticket.usuarioSolicitante}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='caption'>Responsable</Typography>
                <Typography>{ticket.usuarioResponsable || 'Sin asignar'}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='caption'>Modulo</Typography>
                <Typography>{ticket.modulo}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Acciones
            </Typography>
            {canAssign && (
              <>
                <Autocomplete
                  fullWidth
                  size='small'
                  options={analystsQuery.data ?? []}
                  value={responsable}
                  inputValue={responsableSearch}
                  loading={analystsQuery.isLoading}
                  getOptionLabel={option => option.login ? `${option.usuario} - ${option.login}` : option.usuario}
                  isOptionEqualToValue={(option, value) => option.codigoUsuario === value.codigoUsuario}
                  sx={{ mb: 3 }}
                  onChange={(_, value) => setResponsable(value)}
                  onInputChange={(_, value) => setResponsableSearch(value)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Responsable'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {analystsQuery.isLoading ? <CircularProgress color='inherit' size={18} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
                <Button fullWidth variant='outlined' sx={{ mb: 4 }} onClick={handleAssign} disabled={!responsable}>
                  Asignar
                </Button>
              </>
            )}
            {canChangeStatus && (
              <>
                <TextField fullWidth select size='small' label='Estado' value={estadoId} sx={{ mb: 3 }} onChange={event => setEstadoId(Number(event.target.value))}>
                  {(statusesQuery.data ?? []).map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </TextField>
                <Button fullWidth variant='outlined' sx={{ mb: 4 }} onClick={handleStatus} disabled={!estadoId}>
                  Cambiar estado
                </Button>
              </>
            )}
            {canClose && (
              <>
                <TextField fullWidth multiline minRows={3} size='small' label='Observacion cierre' value={observacion} sx={{ mb: 3 }} onChange={event => setObservacion(event.target.value)} />
                <Button fullWidth variant='contained' color='success' onClick={handleClose} disabled={!observacion.trim()}>
                  Cerrar
                </Button>
              </>
            )}
            {!canAssign && !canChangeStatus && !canClose && <Typography variant='body2'>Sin acciones disponibles.</Typography>}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Comentarios
            </Typography>
            {canComment && <TextField fullWidth multiline minRows={3} label='Comentario' value={comment} onChange={event => setComment(event.target.value)} />}
          </CardContent>
          {canComment && (
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button variant='contained' onClick={handleComment} disabled={!comment.trim()}>
                Comentar
              </Button>
            </CardActions>
          )}
          <CardContent>
            {(commentsQuery.data ?? []).map(item => (
              <Box key={item.comentarioId} sx={{ mb: 3 }}>
                <Typography variant='caption'>{item.usuario}</Typography>
                <Typography variant='body2'>{item.comentario}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Adjuntos
            </Typography>
            {canAttach && (
              <>
                <Button variant='outlined' component='label' sx={{ mr: 2, mb: 2 }}>
                  Seleccionar archivo
                  <input
                    hidden
                    type='file'
                    accept='.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt'
                    onChange={event => setAttachmentFile(event.target.files?.[0] ?? null)}
                  />
                </Button>
                <Button variant='contained' sx={{ mb: 2 }} onClick={handleAttachment} disabled={!attachmentFile}>
                  Cargar adjunto
                </Button>
                {attachmentFile && (
                  <Typography variant='body2'>
                    {attachmentFile.name} - {attachmentFile.size} bytes
                  </Typography>
                )}
              </>
            )}
            <Divider sx={{ my: 4 }} />
            {(attachmentsQuery.data ?? []).map(item => (
              <Box key={item.adjuntoId} sx={{ mb: 3 }}>
                <Typography variant='body2'>{item.nombreOriginal}</Typography>
                <Typography variant='caption'>
                  {item.mimeType || 'Sin MIME'} - {item.tamanoBytes} bytes
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Historial
            </Typography>
            {(historyQuery.data ?? []).map(item => (
              <Box key={item.historialId} sx={{ mb: 3 }}>
                <Typography variant='caption'>{item.tipoCambio}</Typography>
                <Typography variant='body2'>{item.comentario || `${item.campo}: ${item.valorAnterior} -> ${item.valorNuevo}`}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default TicketDetail
