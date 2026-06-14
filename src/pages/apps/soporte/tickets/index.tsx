import { Grid } from '@mui/material'
import TicketList from 'src/soporte/views/TicketList'

const SupportTicketsPage = () => {
  return (
    <Grid container spacing={6}>
      <TicketList />
    </Grid>
  )
}

export default SupportTicketsPage
