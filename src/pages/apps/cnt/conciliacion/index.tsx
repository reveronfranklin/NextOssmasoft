import CntConciliacionList from 'src/contabilidad/views/conciliacion/CntConciliacionList'

const CntConciliacionPage = () => <CntConciliacionList />

CntConciliacionPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntConciliacionPage
