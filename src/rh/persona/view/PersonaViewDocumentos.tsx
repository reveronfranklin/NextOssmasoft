import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import { CardContent } from '@mui/material'
import DocumentosList from 'src/rh/documentos/views/DocumentosList'

const PersonaViewDocumentos = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Documentos...' />
          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            <Grid item xs={12}>
              <DocumentosList />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PersonaViewDocumentos
