import CntRelacionDocumentosCatalog from 'src/contabilidad/views/catalogos/CntRelacionDocumentosCatalog'

const CntRelacionDocumentosPage = () => <CntRelacionDocumentosCatalog />

CntRelacionDocumentosPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntRelacionDocumentosPage
