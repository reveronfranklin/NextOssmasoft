import { useEffect, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCurrentUserId } from '../hooks/useCntCurrentUserId'
import { createCntComprobantePdfUrl, downloadCntComprobantePdf, getCntComprobantePdfName } from '../utils/cntComprobantePdf'
import { checkCntPermission, CNT_PERMISSION_REPORT_VIEW, CNT_PERMISSIONS_QUERY_KEY, fetchCntComprobantePrint } from '../services/cntService'

interface Props {
  codigoComprobante: number
}

const CntComprobantePdfViewer = ({ codigoComprobante }: Props) => {
  const router = useRouter()
  const currentUserId = useCntCurrentUserId()
  const [pdfUrl, setPdfUrl] = useState('')

  const permissionQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_REPORT_VIEW, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_REPORT_VIEW }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const query = useQuery({
    queryKey: ['cnt-comprobante-pdf', codigoComprobante, currentUserId],
    queryFn: () => fetchCntComprobantePrint(codigoComprobante, currentUserId),
    enabled: codigoComprobante > 0 && currentUserId > 0 && permissionQuery.data?.hasPermission === true,
    retry: 1
  })

  useEffect(() => {
    if (!query.data) {
      return
    }

    const url = createCntComprobantePdfUrl(query.data)
    setPdfUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [query.data])

  const handleDownload = () => {
    if (!query.data) return

    downloadCntComprobantePdf(query.data)
  }

  const handlePrint = () => {
    if (!pdfUrl) return

    window.open(pdfUrl, '_blank', 'noopener,noreferrer')
  }

  if (permissionQuery.isLoading || query.isLoading) {
    return <Spinner sx={{ height: 450 }} />
  }

  if (permissionQuery.isError || permissionQuery.data?.hasPermission === false || query.isError) {
    const message = permissionQuery.isError
      ? (permissionQuery.error as Error).message
      : permissionQuery.data?.hasPermission === false
        ? `El usuario no tiene el permiso requerido: ${CNT_PERMISSION_REPORT_VIEW}.`
        : (query.error as Error).message

    return (
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography color='error.main'>{message}</Typography>
          </CardContent>
          <CardActions>
            <Button variant='outlined' onClick={() => router.push('/apps/cnt/comprobantes')}>Volver</Button>
          </CardActions>
        </Card>
      </Grid>
    )
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant='outlined' startIcon={<Icon icon='mdi:arrow-left' />} onClick={() => router.push('/apps/cnt/comprobantes')}>
              Volver
            </Button>
            <Button variant='outlined' startIcon={<Icon icon='mdi:printer-outline' />} onClick={() => router.push(`/apps/cnt/comprobantes/imprimir/${codigoComprobante}`)}>
              Vista imprimible
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant='outlined' startIcon={<Icon icon='mdi:download-outline' />} disabled={!query.data} onClick={handleDownload}>
              Descargar
            </Button>
            <Button variant='contained' startIcon={<Icon icon='mdi:printer-outline' />} disabled={!pdfUrl} onClick={handlePrint}>
              Imprimir
            </Button>
          </Box>
        </CardActions>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 3 }}>
            {getCntComprobantePdfName(query.data)}
          </Typography>
          {pdfUrl ? (
            <Box
              component='iframe'
              title='Visor PDF de comprobante'
              src={pdfUrl}
              sx={{
                width: '100%',
                minHeight: { xs: 560, md: 760 },
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                bgcolor: 'background.default'
              }}
            />
          ) : (
            <Spinner sx={{ height: 450 }} />
          )}
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CntComprobantePdfViewer
