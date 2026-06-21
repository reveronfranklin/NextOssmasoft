import CntLibroBancoList from 'src/contabilidad/views/conciliacion/CntLibroBancoList'

const CntLibroBancoPage = () => <CntLibroBancoList />

CntLibroBancoPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntLibroBancoPage
