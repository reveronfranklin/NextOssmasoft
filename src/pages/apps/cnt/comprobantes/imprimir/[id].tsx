import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import CntComprobantePrint from 'src/contabilidad/views/CntComprobantePrint'

const CntComprobantePrintPage = () => {
  const router = useRouter()
  const id = Number(router.query.id ?? 0)

  return (
    <Grid container spacing={6}>
      {id > 0 && <CntComprobantePrint codigoComprobante={id} />}
    </Grid>
  )
}

export default CntComprobantePrintPage
