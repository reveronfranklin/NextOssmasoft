import { useRouter } from 'next/router'
import TicketDetail from 'src/soporte/views/TicketDetail'

const SupportTicketDetailPage = () => {
  const router = useRouter()
  const ticketId = Number(router.query.id ?? 0)

  return <TicketDetail ticketId={ticketId} />
}

export default SupportTicketDetailPage
