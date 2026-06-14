import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import CntComprobantePdfViewer from 'src/contabilidad/views/CntComprobantePdfViewer'

const CntComprobantePdfPage = () => {
  const router = useRouter()
  const id = Number(router.query.id ?? 0)

  return (
    <Grid container spacing={6}>
      {id > 0 && <CntComprobantePdfViewer codigoComprobante={id} />}
    </Grid>
  )
}

export default CntComprobantePdfPage
