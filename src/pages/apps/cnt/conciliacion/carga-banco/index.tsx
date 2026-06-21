import CntBancoArchivoList from 'src/contabilidad/views/conciliacion/CntBancoArchivoList'

const CntConciliacionCargaBancoPage = () => <CntBancoArchivoList />

CntConciliacionCargaBancoPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntConciliacionCargaBancoPage
