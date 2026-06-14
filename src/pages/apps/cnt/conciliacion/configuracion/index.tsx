import CntConciliacionPlaceholder from 'src/contabilidad/views/conciliacion/CntConciliacionPlaceholder'

const CntConciliacionConfiguracionPage = () => (
  <CntConciliacionPlaceholder title='Configuracion conciliacion' message='La parametrizacion bancaria queda preparada para la siguiente fase del modulo.' />
)

CntConciliacionConfiguracionPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntConciliacionConfiguracionPage
