import CntSaldosCatalog from 'src/contabilidad/views/catalogos/CntSaldosCatalog'

const CntSaldosPage = () => <CntSaldosCatalog />

CntSaldosPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntSaldosPage
