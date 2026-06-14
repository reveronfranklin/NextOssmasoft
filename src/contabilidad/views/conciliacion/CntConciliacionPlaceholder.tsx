import { Alert, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'

interface Props {
  title: string
  message: string
}

const CntConciliacionPlaceholder = ({ title, message }: Props) => {
  const router = useRouter()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardActions>
            <Button variant='outlined' startIcon={<Icon icon='mdi:arrow-left' />} onClick={() => router.push('/apps/cnt/conciliacion')}>
              Volver
            </Button>
          </CardActions>
          <CardContent>
            <Typography variant='h5' sx={{ mb: 4 }}>{title}</Typography>
            <Alert severity='info'>{message}</Alert>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CntConciliacionPlaceholder
