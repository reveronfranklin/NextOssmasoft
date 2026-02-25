import Grid from '@mui/material/Grid'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import ViewLeft from 'src/adm/proveedor/view/ViewLeft'
import ViewRight from 'src/adm/proveedor/view/ViewRight'

type Props = {
  tab: string
  invoiceData: InvoiceType[]
}

const ProveedorView = ({ tab, invoiceData }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <ViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <ViewRight tab={tab} invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default ProveedorView
