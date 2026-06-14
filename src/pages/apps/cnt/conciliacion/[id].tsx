import { useRouter } from 'next/router'
import CntConciliacionDetail from 'src/contabilidad/views/conciliacion/CntConciliacionDetail'

const CntConciliacionDetailPage = () => {
  const router = useRouter()
  const id = Number(router.query.id || 0)

  return <CntConciliacionDetail codigoConciliacion={id} />
}

CntConciliacionDetailPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntConciliacionDetailPage
