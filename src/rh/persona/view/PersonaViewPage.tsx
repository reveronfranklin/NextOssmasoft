// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import PersonaViewLeft from 'src/rh/persona/view/PersonaViewLeft'
import PersonaViewRight from 'src/rh/persona/view/PersonaViewRight'

type Props = {
  tab: string
  invoiceData: InvoiceType[]
}

const PersonaView = ({ tab, invoiceData }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>

        <PersonaViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <PersonaViewRight tab={tab} invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default PersonaView
