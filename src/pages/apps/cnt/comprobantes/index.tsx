import { Grid } from '@mui/material'
import CntComprobanteList from 'src/contabilidad/views/CntComprobanteList'

const CntComprobantesPage = () => {
  return (
    <Grid container spacing={6}>
      <CntComprobanteList />
    </Grid>
  )
}

export default CntComprobantesPage
