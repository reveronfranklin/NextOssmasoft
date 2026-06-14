import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import CntComprobanteForm from 'src/contabilidad/views/CntComprobanteForm'

const CntComprobanteDetallePage = () => {
  const router = useRouter()
  const id = Number(router.query.id ?? 0)

  return (
    <Grid container spacing={6}>
      <CntComprobanteForm codigoComprobante={id} />
    </Grid>
  )
}

export default CntComprobanteDetallePage
