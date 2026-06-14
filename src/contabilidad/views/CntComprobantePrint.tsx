import { Box, Button, Card, CardActions, CardContent, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCurrentUserId } from '../hooks/useCntCurrentUserId'
import { fetchCntComprobantePrint } from '../services/cntService'

interface Props {
  codigoComprobante: number
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value ?? 0)

const formatDate = (value?: string) => (value ? value.slice(0, 10) : '')

const CntComprobantePrint = ({ codigoComprobante }: Props) => {
  const router = useRouter()
  const currentUserId = useCntCurrentUserId()

  const query = useQuery({
    queryKey: ['cnt-comprobante-print', codigoComprobante, currentUserId],
    queryFn: () => fetchCntComprobantePrint(codigoComprobante, currentUserId),
    enabled: codigoComprobante > 0 && currentUserId > 0,
    retry: 1
  })

  if (query.isLoading) {
    return <Spinner sx={{ height: 450 }} />
  }

  if (query.isError) {
    return (
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography color='error.main'>{(query.error as Error).message}</Typography>
          </CardContent>
          <CardActions>
            <Button variant='outlined' onClick={() => router.push('/apps/cnt/comprobantes')}>Volver</Button>
          </CardActions>
        </Card>
      </Grid>
    )
  }

  const encabezado = query.data?.encabezado
  const detalles = query.data?.detalles ?? []

  const totalDebe = detalles.reduce((sum, item) => sum + Number(item.debe || 0), 0)
  const totalHaber = detalles.reduce((sum, item) => sum + Number(item.haber || 0), 0)
  const diferencia = totalDebe - totalHaber

  return (
    <Grid item xs={12}>
      <Card sx={{ '@media print': { boxShadow: 'none' } }}>
        <CardActions className='no-print' sx={{ justifyContent: 'space-between', gap: 2, '@media print': { display: 'none' } }}>
          <Button variant='outlined' startIcon={<Icon icon='mdi:arrow-left' />} onClick={() => router.push('/apps/cnt/comprobantes')}>
            Volver
          </Button>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant='outlined' startIcon={<Icon icon='mdi:file-pdf-box' />} onClick={() => router.push(`/apps/cnt/comprobantes/pdf/${codigoComprobante}`)}>
              Ver PDF
            </Button>
            <Button variant='contained' startIcon={<Icon icon='mdi:printer-outline' />} onClick={() => window.print()}>
              Imprimir
            </Button>
          </Box>
        </CardActions>
        <CardContent sx={{ color: 'text.primary', '@media print': { p: 0 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap', mb: 4 }}>
            <Box>
              <Typography variant='h5'>Comprobante contable</Typography>
              <Typography variant='h6'>{encabezado?.numeroComprobante}</Typography>
            </Box>
            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography>Fecha: {formatDate(encabezado?.fechaComprobante)}</Typography>
              <Typography>Periodo: {encabezado?.periodo}</Typography>
              <Typography>Empresa: {encabezado?.codigoEmpresa}</Typography>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Typography variant='caption'>Tipo</Typography>
              <Typography>{encabezado?.tipoComprobante || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant='caption'>Origen</Typography>
              <Typography>{encabezado?.origen || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant='caption'>Observacion</Typography>
              <Typography>{encabezado?.observacion || '-'}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Mayor</TableCell>
                <TableCell>Auxiliar</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Referencia</TableCell>
                <TableCell align='right'>Debe</TableCell>
                <TableCell align='right'>Haber</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detalles.map(item => (
                <TableRow key={item.codigoDetalleComprobante}>
                  <TableCell>{item.mayor}</TableCell>
                  <TableCell>{item.auxiliar}</TableCell>
                  <TableCell>{item.descripcion}</TableCell>
                  <TableCell>{[item.referencia1, item.referencia2, item.referencia3].filter(Boolean).join(' / ')}</TableCell>
                  <TableCell align='right'>{formatMoney(item.debe)}</TableCell>
                  <TableCell align='right'>{formatMoney(item.haber)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} align='right'>
                  <Typography fontWeight={600}>Totales</Typography>
                </TableCell>
                <TableCell align='right'>
                  <Typography fontWeight={600}>{formatMoney(totalDebe)}</Typography>
                </TableCell>
                <TableCell align='right'>
                  <Typography fontWeight={600}>{formatMoney(totalHaber)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} align='right'>Diferencia</TableCell>
                <TableCell align='right'>{formatMoney(diferencia)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CntComprobantePrint
