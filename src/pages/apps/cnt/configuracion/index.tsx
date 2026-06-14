import CntConfiguracion from 'src/contabilidad/views/configuracion/CntConfiguracion'

const CntConfiguracionPage = () => <CntConfiguracion />

CntConfiguracionPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntConfiguracionPage
