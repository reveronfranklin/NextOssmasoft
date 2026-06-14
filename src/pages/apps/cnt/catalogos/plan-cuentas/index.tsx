import CntPlanCuentasCatalog from 'src/contabilidad/views/catalogos/CntPlanCuentasCatalog'

const CntPlanCuentasPage = () => <CntPlanCuentasCatalog />

CntPlanCuentasPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default CntPlanCuentasPage
