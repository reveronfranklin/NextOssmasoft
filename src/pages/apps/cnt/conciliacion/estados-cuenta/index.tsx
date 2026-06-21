import CntEstadosCuentaList from 'src/contabilidad/views/conciliacion/CntEstadosCuentaList'

const CntEstadosCuentaPage = () => <CntEstadosCuentaList />

CntEstadosCuentaPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntEstadosCuentaPage
