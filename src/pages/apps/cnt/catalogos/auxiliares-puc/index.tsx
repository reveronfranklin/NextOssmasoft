import CntAuxiliaresPucCatalog from 'src/contabilidad/views/catalogos/CntAuxiliaresPucCatalog'

const CntAuxiliaresPucPage = () => <CntAuxiliaresPucCatalog />

CntAuxiliaresPucPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntAuxiliaresPucPage
