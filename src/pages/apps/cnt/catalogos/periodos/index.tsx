import CntPeriodosCatalog from 'src/contabilidad/views/catalogos/CntPeriodosCatalog'

const CntPeriodosPage = () => <CntPeriodosCatalog />

CntPeriodosPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntPeriodosPage
