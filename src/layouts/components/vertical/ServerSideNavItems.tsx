// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
//import axios from 'axios'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import authConfig from 'src/configs/auth'
import navigation from 'src/navigation/vertical'

const supportMenu = {
  title: 'Soporte',
  children: [
    {
      title: 'Tickets',
      path: '/apps/soporte/tickets'
    },
    {
      title: 'Dashboard',
      path: '/apps/soporte/dashboard'
    },
    {
      title: 'Notificaciones',
      path: '/apps/soporte/notificaciones'
    },
    {
      title: 'Configuracion',
      path: '/apps/soporte/configuracion'
    }
  ]
}

const cntMenu = {
  title: 'Contabilidad',
  icon: 'mdi:calculator-variant-outline',
  children: [
    {
      title: 'Comprobantes',
      path: '/apps/cnt/comprobantes'
    },
    {
      title: 'Proceso Automatico',
      path: '/apps/cnt/proceso-automatico'
    },
    {
      title: 'Procesos',
      children: [
        {
          title: 'Cierre contable',
          path: '/apps/cnt/procesos/cierre-contable'
        }
      ]
    },
    {
      title: 'Conciliacion',
      children: [
        {
          title: 'Conciliaciones',
          path: '/apps/cnt/conciliacion'
        },
        {
          title: 'Importar estados de cuenta',
          path: '/apps/cnt/conciliacion/carga-banco'
        },
        {
          title: 'Estados de cuenta',
          path: '/apps/cnt/conciliacion/estados-cuenta'
        },
        {
          title: 'Libro banco',
          path: '/apps/cnt/conciliacion/libro-banco'
        },
        {
          title: 'Configuracion',
          path: '/apps/cnt/conciliacion/configuracion'
        },
        {
          title: 'Formatos banco',
          path: '/apps/cnt/conciliacion/formatos-banco'
        }
      ]
    },
    {
      title: 'Reportes',
      children: [
        {
          title: 'Mayor Analitico',
          path: '/apps/cnt/reportes/mayor-analitico'
        },
        {
          title: 'Movimiento Auxiliar',
          path: '/apps/cnt/reportes/movimiento-auxiliar'
        }
      ]
    },
    {
      title: 'Catalogos',
      children: [
        {
          title: 'Plan de cuentas',
          path: '/apps/cnt/catalogos/plan-cuentas'
        },
        {
          title: 'Descriptivas',
          path: '/apps/cnt/catalogos/descriptivas'
        },
        {
          title: 'Rubros',
          path: '/apps/cnt/catalogos/rubros'
        },
        {
          title: 'Balances',
          path: '/apps/cnt/catalogos/balances'
        },
        {
          title: 'Mayores',
          path: '/apps/cnt/catalogos/mayores'
        },
        {
          title: 'Auxiliares',
          path: '/apps/cnt/catalogos/auxiliares'
        },
        {
          title: 'Auxiliares PUC',
          path: '/apps/cnt/catalogos/auxiliares-puc'
        },
        {
          title: 'Periodos',
          path: '/apps/cnt/catalogos/periodos'
        },
        {
          title: 'Relacion documentos',
          path: '/apps/cnt/catalogos/relacion-documentos'
        },
        {
          title: 'Saldos',
          path: '/apps/cnt/catalogos/saldos'
        }
      ]
    },
    {
      title: 'Configuracion',
      path: '/apps/cnt/configuracion'
    }
  ]
}

const securityMenu = {
  title: 'Seguridad',
  path: '/apps/sis/seguridad'
}

const sisUsersMenu = {
  title: 'Usuarios',
  path: '/apps/sis/usuarios'
}

const userRolesMenu = {
  title: 'Roles Usuario',
  path: '/apps/sis/usuario-rol'
}

const cloneMenu = (items: any[]) => JSON.parse(JSON.stringify(items))

const normalizeServerMenuItem = (item: any): any => {
  if (!item || typeof item !== 'object') {
    return item
  }

  const { children, ...rest } = item
  delete rest.action
  delete rest.subject

  return {
    ...rest,
    ...(Array.isArray(children) ? { children: children.map(normalizeServerMenuItem) } : {})
  }
}

const normalizeServerMenu = (items: any[]) => items.map(normalizeServerMenuItem)

const getStoredUserData = () => {
  try {
    const userData = localStorage.getItem('userData')

    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

const isAdminUser = () => {
  const userData = getStoredUserData()
  const role = String(userData?.role || '').toLowerCase()
  const roles = Array.isArray(userData?.roles) ? userData.roles : []
  const isSuperuser = userData?.isSuperuser === true || userData?.IsSuperuser === true || Number(userData?.IS_SUPERUSER ?? 0) === 1

  return isSuperuser || role === 'admin' || roles.some((item: any) => String(item?.role || item).toLowerCase() === 'admin')
}

const ensureAdminMenus = (items: any[]) => {
  if (!isAdminUser()) {
    return items
  }

  const hasSecurity = JSON.stringify(items).includes('/apps/sis/seguridad')
  const hasSupport = JSON.stringify(items).includes('/apps/soporte')
  const hasCnt = JSON.stringify(items).includes('/apps/cnt')
  const hasSisUsers = JSON.stringify(items).includes('/apps/sis/usuarios')
  const hasUserRoles = JSON.stringify(items).includes('/apps/sis/usuario-rol')
  let sistema = items.find(item => item?.title === 'Sistema')

  if (!hasCnt) {
    items.push(cntMenu)
  }

  if (!sistema) {
    sistema = {
      title: 'Sistema',
      icon: 'mdi:shield-account-outline',
      children: []
    }
    items.push(sistema)
  }

  if (!Array.isArray(sistema.children)) {
    sistema.children = []
  }

  if (!hasUserRoles) {
    sistema.children.push(userRolesMenu)
  }

  if (!hasSisUsers) {
    sistema.children.push(sisUsersMenu)
  }

  if (!hasSecurity) {
    sistema.children.push(securityMenu)
  }

  if (!hasSupport) {
    sistema.children.push(supportMenu)
  }

  return items
}

const ensureSecurityMenu = (items: any[]) => {
  const adminItems = ensureAdminMenus(items)
  const hasSecurity = JSON.stringify(items).includes('/apps/sis/seguridad')

  if (hasSecurity) {
    return adminItems
  }

  const sistema = adminItems.find(item => item?.title === 'Sistema')
  const soporte = sistema?.children?.find((item: any) => item?.title === 'Soporte')

  if (soporte?.children && Array.isArray(soporte.children)) {
    soporte.children.push(securityMenu)
  }

  return adminItems
}

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])

  useEffect(() => {
    const getStoredUserLogin = () => {
      try {
        const userData = localStorage.getItem('userData')
        const parsedUserData = userData ? JSON.parse(userData) : null

        return parsedUserData?.username || parsedUserData?.login || parsedUserData?.email || ''
      } catch {
        return ''
      }
    }

    const normalizeMenuResponse = (data: any[]) => {
      let menuArray: any[] = []

      data.forEach(function(item: any) {
        try {
          const parsedMenu = typeof item.menu === 'string' ? JSON.parse(item.menu) : item.menu

          if (Array.isArray(parsedMenu)) {
            menuArray = menuArray.concat(parsedMenu)
          }
        } catch (error) {
          console.warn('Menu invalido omitido', item, error)
        }
      })

      return ensureSecurityMenu(normalizeServerMenu(menuArray))
    }

    const loadMenu = async () => {
      const login = getStoredUserLogin()
      const refreshToken = localStorage.getItem(authConfig.onTokenExpiration) || ''

      try {
        if (!login || !refreshToken) {
          throw new Error('Usuario o refresh token no disponible.')
        }

        const response = await ossmmasofApi.post<any>(
          '/SisUsuarios/GetMenuByUsuario',
          { login },
          {
            headers: {
              'X-Refresh-Token': refreshToken
            }
          }
        )

        setMenuItems(normalizeMenuResponse(response.data))
      } catch (error) {
        console.warn('No se pudo cargar menu por usuario.', error)
        setMenuItems(ensureSecurityMenu(cloneMenu(navigation())))
      }
    }

    loadMenu()

  }, [])

  return { menuItems }
}

export default ServerSideNavItems
