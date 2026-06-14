import CntCierreContable from 'src/contabilidad/views/procesos/CntCierreContable'

const CntCierreContablePage = () => <CntCierreContable />

CntCierreContablePage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntCierreContablePage
